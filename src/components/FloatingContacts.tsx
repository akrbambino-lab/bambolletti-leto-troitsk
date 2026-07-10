import { useState } from "react";
import { FILIALS } from "../data/content";

const waText = encodeURIComponent(
  "Здравствуйте! Хочу записать ребёнка в летний клуб «Бамболлетти». Подскажите по ближайшим сменам?"
);

export default function FloatingContacts() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="animate-pop w-72 rounded-xl2 bg-white p-4 shadow-card">
          <p className="mb-2 text-sm font-extrabold text-ink">Выберите филиал в Троицке:</p>
          <div className="space-y-3">
            {FILIALS.map((f) => (
              <div key={f.id} className="rounded-xl bg-ink/5 p-3">
                <p className="text-sm font-bold text-ink">{f.name}</p>
                <div className="mt-2 flex gap-2">
                  <a
                    href={`${f.whatsapp}?text=${waText}`}
                    target="_blank"
                    className="flex-1 rounded-full bg-[#25D366] px-3 py-2 text-center text-xs font-extrabold text-white"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={f.telegram}
                    target="_blank"
                    className="flex-1 rounded-full bg-[#2AABEE] px-3 py-2 text-center text-xs font-extrabold text-white"
                  >
                    Telegram
                  </a>
                  <a
                    href={f.phoneHref}
                    className="grid w-10 place-items-center rounded-full bg-ink/10 text-ink"
                    aria-label="Позвонить"
                  >
                    ✆
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="grid h-16 w-16 place-items-center rounded-full bg-brand text-white shadow-glow transition-transform hover:scale-105 animate-floaty"
        aria-label="Написать нам"
      >
        <span className="text-3xl">{open ? "✕" : "💬"}</span>
      </button>
    </div>
  );
}
