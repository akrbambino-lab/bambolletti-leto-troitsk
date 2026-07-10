// Мини-сервер: раздаёт собранную статику (../dist) и принимает заявки POST /api/lead.
// Заявки сохраняются в leads.jsonl и (если задан токен) пересылаются в Telegram.
//
// Переменные окружения:
//   PORT            — порт (по умолчанию 8365)
//   TG_BOT_TOKEN    — токен Telegram-бота (от @BotFather)
//   TG_CHAT_ID      — chat_id, куда слать заявки (ваш ID или ID группы)
//
import { createServer } from "node:http";
import { readFile, appendFile } from "node:fs/promises";
import { join, extname, dirname, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "..", "dist");
const LEADS = join(__dirname, "leads.jsonl");
const PORT = process.env.PORT || 8365;
const { TG_BOT_TOKEN, TG_CHAT_ID } = process.env;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".json": "application/json",
};

async function sendTelegram(lead) {
  if (!TG_BOT_TOKEN || !TG_CHAT_ID) return;
  const text =
    `🔔 Новая заявка с сайта!\n\n` +
    `👤 Имя: ${lead.name}\n` +
    `📞 Телефон: ${lead.phone}\n` +
    `🏫 Филиал: ${lead.filial || "—"}\n` +
    `📅 Смена: ${lead.shift || "подобрать"}\n` +
    `📍 Источник: ${lead.source || "—"}`;
  try {
    await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TG_CHAT_ID, text }),
    });
  } catch (e) {
    console.error("TG error", e);
  }
}

const server = createServer(async (req, res) => {
  // --- API: приём заявки ---
  if (req.method === "POST" && req.url === "/api/lead") {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", async () => {
      try {
        const lead = JSON.parse(body || "{}");
        lead.ts = new Date().toISOString();
        lead.ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        await appendFile(LEADS, JSON.stringify(lead) + "\n");
        await sendTelegram(lead);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false }));
      }
    });
    return;
  }

  // --- Статика (SPA) ---
  let path = decodeURIComponent((req.url || "/").split("?")[0]);
  if (path === "/") path = "/index.html";
  let filePath = normalize(join(DIST, path));
  if (!filePath.startsWith(DIST)) filePath = join(DIST, "index.html");
  try {
    const data = await readFile(filePath);
    res.writeHead(200, { "Content-Type": MIME[extname(filePath)] || "application/octet-stream" });
    res.end(data);
  } catch {
    // SPA fallback
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
