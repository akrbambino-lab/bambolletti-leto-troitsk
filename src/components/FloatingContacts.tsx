import { useState } from "react";
import { FILIALS } from "../data/content";

const waText = encodeURIComponent(
  "Здравствуйте! Хочу записать ребёнка в летний клуб «Бамболлетти». Подскажите по ближайшим сменам?"
);

export default function FloatingContacts() {
  const [open, setOpen] = useState(false);
  const f = FILIALS[0];

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="animate-pop w-72 rounded-xl2 bg-white p-4 shadow-card">
          <p className="mb-1 text-sm font-extrabold text-ink">Хобби-клуб «Бамболлетти»</p>
          <p className="mb-3 text-xs text-ink/50">{f.address}</p>
          <div className="space-y-2">
            <a
              href={`${f.whatsapp}?text=${waText}`}
              target="_blank"
              className="block rounded-full bg-[#25D366] px-4 py-2.5 text-center text-sm font-extrabold text-white"
            >
              Написать в WhatsApp
            </a>
            {f.telegram && (
              <a
                href={f.telegram}
                target="_blank"
                className="block rounded-full bg-[#2AABEE] px-4 py-2.5 text-center text-sm font-extrabold text-white"
              >
                Telegram
              </a>
            )}
            <a
              href={f.phoneHref}
              className="block rounded-full bg-ink/10 px-4 py-2.5 text-center text-sm font-extrabold text-ink"
            >
              Позвонить {f.phone}
            </a>
            {f.phone2 && (
              <a
                href={f.phone2Href}
                className="block rounded-full bg-ink/10 px-4 py-2.5 text-center text-sm font-extrabold text-ink"
              >
                Позвонить {f.phone2}
              </a>
            )}
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="grid h-16 w-16 place-items-center rounded-full bg-brand text-white shadow-glow transition-transform hover:scale-105 animate-floaty"
        aria-label="Связаться с нами"
      >
        <span className="text-3xl">{open ? "✕" : "💬"}</span>
      </button>
    </div>
  );
}
