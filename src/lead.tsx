import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { FILIALS, SHIFTS } from "./data/content";

const LEAD_ENDPOINT =
  (import.meta.env.VITE_LEAD_ENDPOINT as string) || "/api/lead";

type OpenOpts = { shift?: string; filial?: string; source?: string };

type LeadCtx = { open: (opts?: OpenOpts) => void };
const Ctx = createContext<LeadCtx>({ open: () => {} });
export const useLead = () => useContext(Ctx);

export function LeadProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [prefill, setPrefill] = useState<OpenOpts>({});

  const open = useCallback((opts?: OpenOpts) => {
    setPrefill(opts || {});
    setOpen(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  return (
    <Ctx.Provider value={{ open }}>
      {children}
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="animate-pop relative w-full max-w-md rounded-xl2 bg-white p-6 shadow-card sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Закрыть"
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-ink/5 text-ink/60 hover:bg-ink/10"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
            <h3 className="text-2xl font-extrabold">Записаться на неделю</h3>
            <p className="mt-1 text-ink/60">
              Оставьте контакты — перезвоним в течение 15 минут и подберём неделю.
            </p>
            <LeadForm prefill={prefill} onDone={() => setTimeout(() => setOpen(false), 2500)} />
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}

export function LeadForm({
  prefill = {},
  compact = false,
  onDone,
}: {
  prefill?: OpenOpts;
  compact?: boolean;
  onDone?: () => void;
}) {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [filial, setFilial] = useState(prefill.filial || FILIALS[0].id);
  const [shift, setShift] = useState(prefill.shift || "");
  const [agree, setAgree] = useState(true);
  const [hp, setHp] = useState(""); // honeypot — люди не заполняют
  const renderedAt = useRef(Date.now());

  useEffect(() => {
    if (prefill.filial) setFilial(prefill.filial);
    if (prefill.shift) setShift(prefill.shift);
  }, [prefill.filial, prefill.shift]);

  const waFallback = () => {
    const f = FILIALS.find((x) => x.id === filial) || FILIALS[0];
    const text = encodeURIComponent(
      `Здравствуйте! Хочу записать ребёнка в клуб «Бамболлетти» (${f.name}).` +
        (shift ? ` Неделя: ${shift}.` : "") +
        (name ? ` Меня зовут ${name}.` : "")
    );
    window.open(`${f.whatsapp}?text=${text}`, "_blank");
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || phone.replace(/\D/g, "").length < 11 || !agree) {
      setState("error");
      return;
    }
    setState("sending");
    const payload = {
      name,
      phone,
      filial: FILIALS.find((x) => x.id === filial)?.name || filial,
      shift,
      source: prefill.source || "form",
      page: location.href,
      hp, // honeypot: если заполнено — это бот
      elapsed: Date.now() - renderedAt.current, // мс с момента показа формы
    };
    try {
      const res = await fetch(LEAD_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("bad");
      setState("ok");
      onDone?.();
    } catch {
      // не теряем заявку — уводим в WhatsApp
      setState("ok");
      waFallback();
      onDone?.();
    }
  }

  if (state === "ok") {
    return (
      <div className="mt-5 rounded-xl2 bg-mint/10 p-6 text-center">
        <div className="text-4xl">🎉</div>
        <p className="mt-2 text-lg font-extrabold text-ink">Заявка принята!</p>
        <p className="mt-1 text-ink/60">Перезвоним в течение 15 минут.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={compact ? "mt-4 space-y-3" : "mt-5 space-y-3"}>
      {/* honeypot: скрыт от людей, боты заполняют */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />
      <input
        className="w-full rounded-xl2 border-2 border-ink/10 px-4 py-3 outline-none focus:border-brand"
        placeholder="Ваше имя"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="w-full rounded-xl2 border-2 border-ink/10 px-4 py-3 outline-none focus:border-brand"
        placeholder="Телефон +7"
        inputMode="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      {FILIALS.length > 1 && (
        <select
          className="w-full rounded-xl2 border-2 border-ink/10 bg-white px-4 py-3 outline-none focus:border-brand"
          value={filial}
          onChange={(e) => setFilial(e.target.value)}
        >
          {FILIALS.map((f) => (
            <option key={f.id} value={f.id}>
              Филиал: {f.name}
            </option>
          ))}
        </select>
      )}
      <select
        className="w-full rounded-xl2 border-2 border-ink/10 bg-white px-4 py-3 outline-none focus:border-brand"
        value={shift}
        onChange={(e) => setShift(e.target.value)}
      >
        <option value="">Неделя (подберём вместе)</option>
        {SHIFTS.filter((s) => s.seats > 0).map((s) => (
          <option key={s.n} value={`${s.dates} — ${s.title}`}>
            {s.dates} — {s.title}
          </option>
        ))}
      </select>
      <label className="flex cursor-pointer items-start gap-2 text-sm text-ink/60">
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1" />
        <span>
          Согласен с{" "}
          <a href="/privacy.html" target="_blank" className="underline hover:text-brand">
            обработкой персональных данных
          </a>
        </span>
      </label>
      {state === "error" && (
        <p className="text-sm font-bold text-brand">Проверьте имя, телефон и согласие.</p>
      )}
      <button type="submit" className="btn-primary w-full" disabled={state === "sending"}>
        {state === "sending" ? "Отправляем…" : "Записаться на неделю"}
      </button>
      <p className="text-center text-xs text-ink/40">Перезвоним за 15 минут · без спама</p>
    </form>
  );
}
