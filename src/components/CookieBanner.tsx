import { useEffect, useState } from "react";

const KEY = "bmb-cookie-consent";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      /* ignore */
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[55] p-3 sm:p-4">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 rounded-xl2 bg-ink/95 p-4 text-white shadow-card backdrop-blur sm:flex-row sm:gap-4 sm:pr-5">
        <p className="flex-1 text-sm text-white/85">
          Мы используем cookie, чтобы сайт работал корректно и удобно. Продолжая пользоваться сайтом,
          вы соглашаетесь с{" "}
          <a href="/privacy.html" target="_blank" className="font-bold text-sun underline">
            политикой конфиденциальности
          </a>
          .
        </p>
        <button onClick={accept} className="btn-primary shrink-0 !px-6 !py-2.5 text-sm">
          Принять
        </button>
      </div>
    </div>
  );
}
