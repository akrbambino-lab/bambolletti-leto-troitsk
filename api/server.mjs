// Мини-сервер лендинга: раздаёт статику (../dist) и принимает заявки POST /api/lead.
// Каждая заявка:
//   1) сохраняется в leads.jsonl,
//   2) отправляется в Telegram Кате через бота Эмилии,
//   3) создаётся клиентом в CRM «Мой Класс».
//
// Переменные окружения (см. systemd unit):
//   PORT               порт (по умолчанию 8365)
//   TG_BOT_TOKEN       токен Telegram-бота (Эмилия)
//   TG_CHAT_ID         chat_id получателя заявок
//   MOYKLASS_KEY_FILE  путь к файлу с apiKey «Мой Класс»  (или MOYKLASS_KEY напрямую)
//   MOYKLASS_FILIAL_ID id филиала в «Мой Класс» (Троицк-Октябрьский = 48821)
//
import { createServer } from "node:http";
import { readFile, appendFile } from "node:fs/promises";
import { join, extname, dirname, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "..", "dist");
const LEADS = join(__dirname, "leads.jsonl");
const PORT = process.env.PORT || 8365;
const { TG_BOT_TOKEN, TG_CHAT_ID, MOYKLASS_KEY, MOYKLASS_KEY_FILE } = process.env;
const MOYKLASS_FILIAL_ID = process.env.MOYKLASS_FILIAL_ID
  ? Number(process.env.MOYKLASS_FILIAL_ID)
  : null;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".ico": "image/x-icon",
  ".json": "application/json",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
};

// ------- Telegram -------
async function sendTelegram(lead) {
  if (!TG_BOT_TOKEN || !TG_CHAT_ID) return;
  const text =
    `🔔 <b>Новая заявка с сайта (Лето Троицк)</b>\n\n` +
    `👤 Имя: ${lead.name}\n` +
    `📞 Телефон: ${lead.phone}\n` +
    `📅 Неделя: ${lead.shift || "подобрать"}\n` +
    `🏫 Филиал: ${lead.filial || "—"}\n` +
    `📍 Источник: ${lead.source || "—"}`;
  try {
    await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TG_CHAT_ID, text, parse_mode: "HTML" }),
    });
  } catch (e) {
    console.error("TG error", e.message);
  }
}

// ------- Мой Класс -------
let mkKey = MOYKLASS_KEY || null;
let mkToken = null;
let mkTokenExp = 0;

async function loadMkKey() {
  if (mkKey) return mkKey;
  if (MOYKLASS_KEY_FILE) {
    try {
      mkKey = (await readFile(MOYKLASS_KEY_FILE, "utf8")).trim();
    } catch (e) {
      console.error("MK key read error", e.message);
    }
  }
  return mkKey;
}

async function mkAuth() {
  const now = Date.now();
  if (mkToken && now < mkTokenExp) return mkToken;
  const key = await loadMkKey();
  if (!key) return null;
  const res = await fetch("https://api.moyklass.com/v1/company/auth/getToken", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey: key }),
  });
  const data = await res.json();
  mkToken = data.accessToken;
  mkTokenExp = now + 60 * 60 * 1000; // час
  return mkToken;
}

async function createMoyKlassLead(lead) {
  try {
    const token = await mkAuth();
    if (!token) return;
    const phone = String(lead.phone).replace(/\D/g, ""); // только цифры
    const body = {
      name: lead.name,
      phone,
      comment: `Заявка с сайта. Неделя: ${lead.shift || "подобрать"}. Источник: ${lead.source || "—"}`,
    };
    if (MOYKLASS_FILIAL_ID) body.filials = [MOYKLASS_FILIAL_ID];
    const res = await fetch("https://api.moyklass.com/v1/company/users", {
      method: "POST",
      headers: { "x-access-token": token, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) console.error("MK create error", res.status, await res.text());
  } catch (e) {
    console.error("MK error", e.message);
  }
}

// ------- Антиспам: rate-limit по IP -------
const hits = new Map(); // ip -> [timestamps]
const RL_WINDOW = 10 * 60 * 1000; // 10 минут
const RL_MAX = 6; // не больше 6 заявок с одного IP за окно
function rateLimited(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < RL_WINDOW);
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) hits.clear(); // защита от разрастания
  return arr.length > RL_MAX;
}

const server = createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/api/lead") {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", async () => {
      try {
        const lead = JSON.parse(body || "{}");
        const ip = String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").split(",")[0].trim();
        lead.ts = new Date().toISOString();
        lead.ip = ip;

        // --- фильтр ботов: отвечаем ok, но заявку не пересылаем ---
        const isBot =
          (lead.hp && String(lead.hp).trim() !== "") || // honeypot заполнен
          (typeof lead.elapsed === "number" && lead.elapsed < 1500) || // отправлено < 1.5 с
          !lead.name || String(lead.phone || "").replace(/\D/g, "").length < 11 ||
          rateLimited(ip);

        if (isBot) {
          await appendFile(LEADS, JSON.stringify({ ...lead, spam: true }) + "\n");
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: true }));
          return;
        }

        await appendFile(LEADS, JSON.stringify(lead) + "\n");
        // не блокируем ответ клиенту доставкой в CRM/TG
        Promise.allSettled([sendTelegram(lead), createMoyKlassLead(lead)]);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false }));
      }
    });
    return;
  }

  let path = decodeURIComponent((req.url || "/").split("?")[0]);
  if (path === "/") path = "/index.html";
  let filePath = normalize(join(DIST, path));
  if (!filePath.startsWith(DIST)) filePath = join(DIST, "index.html");
  try {
    const data = await readFile(filePath);
    res.writeHead(200, { "Content-Type": MIME[extname(filePath)] || "application/octet-stream" });
    res.end(data);
  } catch {
    try {
      const data = await readFile(join(DIST, "index.html"));
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  }
});

server.listen(PORT, () => console.log(`Bambolletti Leto server on :${PORT}`));
