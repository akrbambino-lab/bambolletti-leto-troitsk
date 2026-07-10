import { useMemo } from "react";
import { LeadProvider, LeadForm, useLead } from "./lead";
import FloatingContacts from "./components/FloatingContacts";
import {
  FILIALS,
  SHIFTS,
  REVIEWS,
  FAQ,
  PRICE_FROM,
  EARLY_BIRD_MAX,
  EARLY_BIRD_DEADLINE,
} from "./data/content";

const TODAY = new Date();

function useUpcoming() {
  return useMemo(
    () => SHIFTS.filter((s) => new Date(s.end) >= TODAY && s.seats > 0).slice(0, 4),
    []
  );
}

const gallery = ["cam1", "cam2", "cam3", "cam4", "cam5", "cam6", "cam7", "cam8"].map(
  (n) => `/img/${n}.jpg`
);

/* ------------------------------- Header ---------------------------------- */
function Header() {
  const { open } = useLead();
  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-white/90 backdrop-blur">
      <div className="container-p flex h-16 items-center justify-between">
        <a href="#top" className="flex items-center gap-2 font-display text-xl font-extrabold text-ink">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-white">Б</span>
          Бамболлетти <span className="hidden text-brand sm:inline">· Лето в Троицке</span>
        </a>
        <div className="flex items-center gap-3">
          <a href={FILIALS[0].phoneHref} className="hidden font-extrabold text-ink hover:text-brand sm:block">
            {FILIALS[0].phone}
          </a>
          <button onClick={() => open({ source: "header" })} className="btn-primary !px-5 !py-2.5 text-sm">
            Записаться
          </button>
        </div>
      </div>
    </header>
  );
}

/* -------------------------------- Hero ----------------------------------- */
function Hero() {
  const { open } = useLead();
  return (
    <section id="top" className="relative overflow-hidden bg-gradient-to-b from-brand-soft to-white">
      <div className="container-p grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2">
        <div>
          <span className="eyebrow">Лето 2026 · дети 7–13 лет</span>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] sm:text-5xl">
            Ребёнок всё лето при деле с <span className="text-brand">7:30 до 19:00</span> — а вы спокойно работаете
          </h1>
          <p className="mt-5 text-lg text-ink/70">
            Городской хобби-клуб в Троицке: тематические смены по неделям, творчество, квесты,
            3 часа прогулок в день и гаджеты не больше 40 минут. Всё включено.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button onClick={() => open({ source: "hero" })} className="btn-primary text-lg">
              Записаться на ближайшую смену
            </button>
            <a href="#shifts" className="btn-ghost text-lg">
              Смотреть смены
            </a>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            {[
              ["300+", "детей каждое лето"],
              ["13", "тематических смен"],
              ["90%", "берут больше 1 недели"],
            ].map(([a, b]) => (
              <div key={b}>
                <div className="text-2xl font-extrabold text-brand">{a}</div>
                <div className="text-sm text-ink/60">{b}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <img
            src="/img/cam1.jpg"
            alt="Дети в летнем клубе Бамболлетти"
            className="aspect-[4/3] w-full rounded-xl2 object-cover shadow-card"
          />
          <div className="absolute -bottom-4 -left-2 rounded-xl2 bg-white px-4 py-3 shadow-card sm:-left-6">
            <div className="text-sm font-extrabold text-ink">🔥 Мест на неделю мало</div>
            <div className="text-xs text-ink/60">Смены набираются заранее</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Ближайшие смены ----------------------------- */
function Upcoming() {
  const { open } = useLead();
  const upcoming = useUpcoming();
  if (!upcoming.length) return null;
  return (
    <section className="section bg-ink text-white">
      <div className="container-p">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="eyebrow !bg-white/15 !text-white">Успейте записаться</span>
            <h2 className="h2 mt-3">Ближайшие смены — места заканчиваются</h2>
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {upcoming.map((s) => (
            <div key={s.n} className="flex flex-col rounded-xl2 bg-white/10 p-5">
              <div className="text-sm font-bold text-sun">{s.dates}</div>
              <div className="mt-1 text-lg font-extrabold">{s.title}</div>
              <p className="mt-1 flex-1 text-sm text-white/70">{s.desc}</p>
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-mint">
                <span className="h-2 w-2 rounded-full bg-mint" />
                Осталось {s.seats} мест
              </div>
              <button
                onClick={() => open({ shift: `${s.dates} — ${s.title}`, source: "upcoming" })}
                className="btn-primary mt-3 w-full !py-2.5 text-sm"
              >
                Забронировать место
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Преимущества ------------------------------ */
const BENEFITS = [
  ["🕹️", "Максимум свободы под присмотром", "Ребёнок сам выбирает активности, а рядом всегда внимательный педагог"],
  ["🧠", "Каждый день узнаёт новое", "Лектории, мастер-классы и опыты — интересно, а не «как в школе»"],
  ["🎉", "Еженедельные мероприятия", "По пятницам — концерты, дипломы и призы"],
  ["🎨", "Занимается творчеством", "Рисуют, мастерят, готовят вкусняшки и снимают контент"],
  ["🤝", "Находит новых друзей", "15+ ребят рядом каждый день — общение и командные игры"],
  ["🌳", "Много гуляет", "Минимум 3 часа на свежем воздухе ежедневно"],
];
function Benefits() {
  return (
    <section id="benefits" className="section">
      <div className="container-p">
        <div className="text-center">
          <span className="eyebrow">Почему дети сюда бегут</span>
          <h2 className="h2 mt-3">Пока вы работаете — ребёнку некогда скучать</h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map(([ic, t, d]) => (
            <div key={t} className="rounded-xl2 border-2 border-ink/5 bg-white p-6 shadow-card">
              <div className="text-4xl">{ic}</div>
              <h3 className="mt-3 text-lg font-extrabold">{t}</h3>
              <p className="mt-1 text-ink/60">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Как проходит день ------------------------ */
const DAY = [
  ["7:30–9:00", "Приём детей", "Приводите в удобное время до 9 утра"],
  ["День", "Занятия и игры", "Творчество, квесты, лектории, 15+ друзей рядом"],
  ["Каждый день", "3 часа прогулок", "Активности на свежем воздухе"],
  ["до 19:00", "Забираете ребёнка", "Ежедневный фотоотчёт вам в чат"],
];
function DayFlow() {
  return (
    <section className="section bg-brand-soft">
      <div className="container-p">
        <div className="text-center">
          <span className="eyebrow">Режим дня</span>
          <h2 className="h2 mt-3">Полноценный день с 7:30 до 19:00</h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DAY.map(([time, t, d]) => (
            <div key={t} className="rounded-xl2 bg-white p-6 shadow-card">
              <div className="inline-block rounded-full bg-brand/10 px-3 py-1 text-sm font-extrabold text-brand">
                {time}
              </div>
              <h3 className="mt-3 text-lg font-extrabold">{t}</h3>
              <p className="mt-1 text-sm text-ink/60">{d}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-ink/60">
          📵 Гаджеты не больше 40 минут в день · 📸 ежедневный фотоотчёт родителям
        </p>
      </div>
    </section>
  );
}

/* ------------------------------ Расписание ------------------------------- */
function Schedule() {
  const { open } = useLead();
  return (
    <section id="shifts" className="section">
      <div className="container-p">
        <div className="text-center">
          <span className="eyebrow">Расписание смен · лето 2026</span>
          <h2 className="h2 mt-3">13 тематических недель — выбирайте любые</h2>
          <p className="mx-auto mt-3 max-w-2xl text-ink/60">
            Каждая смена — отдельная тема на всю неделю. Можно взять одну или несколько.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SHIFTS.map((s) => {
            const over = new Date(s.end) < TODAY;
            const soldout = s.seats === 0;
            const dim = over || soldout;
            return (
              <div
                key={s.n}
                className={`flex flex-col rounded-xl2 border-2 p-5 ${
                  dim ? "border-ink/5 bg-ink/[0.03]" : "border-brand/20 bg-white shadow-card"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-brand">{s.dates}</span>
                  {over ? (
                    <span className="rounded-full bg-ink/10 px-2 py-0.5 text-xs font-bold text-ink/50">Прошла</span>
                  ) : soldout ? (
                    <span className="rounded-full bg-ink/10 px-2 py-0.5 text-xs font-bold text-ink/50">Мест нет</span>
                  ) : s.seats <= 4 ? (
                    <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-extrabold text-brand">
                      Осталось {s.seats}
                    </span>
                  ) : (
                    <span className="rounded-full bg-mint/15 px-2 py-0.5 text-xs font-extrabold text-mint">Есть места</span>
                  )}
                </div>
                <h3 className={`mt-2 text-lg font-extrabold ${dim ? "text-ink/50" : ""}`}>{s.title}</h3>
                <p className="mt-1 flex-1 text-sm text-ink/60">{s.desc}</p>
                {!dim && (
                  <button
                    onClick={() => open({ shift: `${s.dates} — ${s.title}`, source: "schedule" })}
                    className="btn-ghost mt-4 !py-2.5 text-sm"
                  >
                    Записаться
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Что включено ----------------------------- */
function Included() {
  const items = [
    ["🏫", "Оборудованные классы", "Лектории и творческие занятия в комфортных помещениях"],
    ["🛋️", "Уголки для отдыха", "Уютные зоны для чтения и тишины"],
    ["🤸", "Комнаты для игр", "Пространство для подвижных активностей"],
    ["🚌", "Экскурсии и выезды", "Музеи, парки, батуты, лазертаг — 3 выхода в неделю"],
  ];
  return (
    <section className="section bg-ink text-white">
      <div className="container-p grid items-center gap-10 lg:grid-cols-2">
        <div>
          <span className="eyebrow !bg-white/15 !text-white">Формат «всё включено»</span>
          <h2 className="h2 mt-3">Одна цена — и больше ни о чём не думаете</h2>
          <div className="mt-8 space-y-4">
            {items.map(([ic, t, d]) => (
              <div key={t} className="flex gap-4">
                <div className="text-3xl">{ic}</div>
                <div>
                  <div className="font-extrabold">{t}</div>
                  <div className="text-sm text-white/60">{d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <img src="/img/cam5.jpg" alt="Активности в клубе" className="aspect-square w-full rounded-xl2 object-cover" />
      </div>
    </section>
  );
}

/* -------------------------------- Цены ----------------------------------- */
function Pricing() {
  const { open } = useLead();
  const perDay = Math.round(PRICE_FROM / 5);
  const deadline = new Date(EARLY_BIRD_DEADLINE).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
  });
  return (
    <section id="price" className="section bg-brand-soft">
      <div className="container-p">
        <div className="text-center">
          <span className="eyebrow">Стоимость</span>
          <h2 className="h2 mt-3">Прозрачная цена, всё включено</h2>
        </div>
        <div className="mx-auto mt-8 max-w-lg rounded-xl2 bg-white p-8 text-center shadow-card">
          <div className="text-ink/60">Неделя (5 дней), формат «всё включено»</div>
          <div className="mt-2 text-5xl font-extrabold text-brand">от {PRICE_FROM.toLocaleString("ru-RU")} ₽</div>
          <div className="mt-1 text-ink/50">это примерно {perDay.toLocaleString("ru-RU")} ₽ в день за 11,5 часов присмотра</div>
          <div className="mt-5 rounded-xl2 bg-sun/20 p-4">
            <div className="font-extrabold text-ink">🎁 Скидка до −{EARLY_BIRD_MAX}% за раннее бронирование</div>
            <div className="text-sm text-ink/60">Успейте до {deadline}. Чем больше недель — тем выше скидка.</div>
          </div>
          <button onClick={() => open({ source: "price" })} className="btn-primary mt-6 w-full text-lg">
            Узнать свою цену со скидкой
          </button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Галерея --------------------------------- */
function Gallery() {
  return (
    <section className="section">
      <div className="container-p">
        <div className="text-center">
          <span className="eyebrow">Как это выглядит</span>
          <h2 className="h2 mt-3">Фотографии с наших смен</h2>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {gallery.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`Смена ${i + 1}`}
              loading="lazy"
              className="aspect-square w-full rounded-xl2 object-cover shadow-card"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Отзывы ---------------------------------- */
function Reviews() {
  return (
    <section className="section bg-brand-soft">
      <div className="container-p">
        <div className="text-center">
          <span className="eyebrow">Отзывы родителей</span>
          <h2 className="h2 mt-3">«Мама, я хочу остаться ещё!»</h2>
        </div>
        <div className="mx-auto mt-8 grid max-w-4xl gap-5 sm:grid-cols-2">
          {REVIEWS.map((r) => (
            <div key={r.name} className="rounded-xl2 bg-white p-6 shadow-card">
              <div className="text-2xl">⭐️⭐️⭐️⭐️⭐️</div>
              <p className="mt-3 text-ink/80">{r.text}</p>
              <div className="mt-4 font-extrabold text-brand">{r.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- FAQ ----------------------------------- */
function Faq() {
  return (
    <section className="section">
      <div className="container-p max-w-3xl">
        <div className="text-center">
          <span className="eyebrow">Частые вопросы</span>
          <h2 className="h2 mt-3">Отвечаем на главное</h2>
        </div>
        <div className="mt-8 space-y-3">
          {FAQ.map((f) => (
            <details key={f.q} className="group rounded-xl2 border-2 border-ink/5 bg-white p-5 shadow-card">
              <summary className="flex cursor-pointer list-none items-center justify-between font-extrabold">
                {f.q}
                <span className="text-brand transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-ink/70">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Филиалы --------------------------------- */
function Filials() {
  return (
    <section id="filials" className="section bg-ink text-white">
      <div className="container-p">
        <div className="text-center">
          <span className="eyebrow !bg-white/15 !text-white">Где мы в Троицке</span>
          <h2 className="h2 mt-3">Два филиала рядом с домом</h2>
        </div>
        <div className="mx-auto mt-8 grid max-w-3xl gap-5 sm:grid-cols-2">
          {FILIALS.map((f) => (
            <div key={f.id} className="rounded-xl2 bg-white/10 p-6">
              <h3 className="text-xl font-extrabold">{f.name}</h3>
              <p className="mt-2 text-white/70">📍 {f.address}</p>
              <a href={f.phoneHref} className="mt-1 block font-extrabold text-sun">
                {f.phone}
              </a>
              <div className="mt-4 flex gap-2">
                <a href={f.whatsapp} target="_blank" className="rounded-full bg-[#25D366] px-4 py-2 text-sm font-extrabold">
                  WhatsApp
                </a>
                <a href={f.telegram} target="_blank" className="rounded-full bg-[#2AABEE] px-4 py-2 text-sm font-extrabold">
                  Telegram
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Финальная форма --------------------------- */
function FinalCta() {
  return (
    <section id="lead" className="section">
      <div className="container-p">
        <div className="mx-auto grid max-w-4xl items-center gap-8 rounded-xl2 bg-gradient-to-br from-brand to-berry p-8 text-white shadow-card sm:p-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
              Запишите ребёнка на смену за 1 минуту
            </h2>
            <p className="mt-3 text-white/80">
              Оставьте контакты — перезвоним в течение 15 минут, ответим на вопросы и подберём
              смену со скидкой. Без спама.
            </p>
            <ul className="mt-5 space-y-2 text-white/90">
              <li>✅ Бесплатная консультация</li>
              <li>✅ Подберём удобные недели</li>
              <li>✅ Рассчитаем цену со скидкой</li>
            </ul>
          </div>
          <div className="rounded-xl2 bg-white p-6 text-ink shadow-card">
            <LeadForm compact prefill={{ source: "final" }} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-ink/5 bg-white py-8">
      <div className="container-p flex flex-col items-center justify-between gap-3 text-sm text-ink/50 sm:flex-row">
        <div>© {TODAY.getFullYear()} Хобби-клуб «Бамболлетти» · Троицк</div>
        <div className="flex gap-4">
          <a href="#shifts" className="hover:text-brand">Смены</a>
          <a href="#price" className="hover:text-brand">Цены</a>
          <a href="#filials" className="hover:text-brand">Филиалы</a>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <LeadProvider>
      <Header />
      <main>
        <Hero />
        <Upcoming />
        <Benefits />
        <DayFlow />
        <Schedule />
        <Included />
        <Pricing />
        <Gallery />
        <Reviews />
        <Faq />
        <Filials />
        <FinalCta />
      </main>
      <Footer />
      <FloatingContacts />
    </LeadProvider>
  );
}
