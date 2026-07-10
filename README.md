# Бамболлетти · Лето в Троицке — лендинг заявок

Конверсионный лендинг летнего хобби-клуба «Бамболлетти» (филиалы Троицка).
Стек: **Vite + React + TypeScript + Tailwind CSS** — совместим с Lovable.

**Прод:** https://leto-troitsk.45-10-40-100.sslip.io/ (сервер kz-1, Caddy)

## Что где менять (без программиста)

Вся информация вынесена в один файл — [`src/data/content.ts`](src/data/content.ts):

- **Контакты филиалов** (`FILIALS`) — телефон, WhatsApp, Telegram, адрес. Строки с `// TODO` нужно заменить на реальные.
- **Смены** (`SHIFTS`) — даты, названия, описания и **кол-во оставшихся мест** (`seats`). `seats: 0` → показывается «Мест нет». Июньские смены авто-помечаются «Прошла».
- **Дедлайн скидки** (`EARLY_BIRD_DEADLINE`), цена (`PRICE_FROM`, `EARLY_BIRD_MAX`).
- **Отзывы** (`REVIEWS`) и **FAQ** (`FAQ`).

Фото со смен лежат в `public/img/` (cam1…cam10). Замените на свои — имена те же.

## Куда падают заявки

Форма отправляет `POST /api/lead`. На сервере крутится `api/server.mjs` (systemd `leto-troitsk-api`):
сохраняет заявку в `leads.jsonl` и, если задан токен, шлёт в Telegram.

Чтобы заявки приходили в Telegram мгновенно:
1. Создайте бота у [@BotFather](https://t.me/BotFather) → получите токен.
2. Узнайте свой `chat_id` (напишите боту, затем [@userinfobot](https://t.me/userinfobot)).
3. На сервере впишите в `/etc/systemd/system/leto-troitsk-api.service`:
   `Environment=TG_BOT_TOKEN=...` и `Environment=TG_CHAT_ID=...`,
   затем `systemctl daemon-reload && systemctl restart leto-troitsk-api`.

Если сервер недоступен — форма не теряет заявку, а открывает WhatsApp с готовым текстом.

## Запуск локально

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # сборка в dist/
```

## Подключение к Lovable

Импортируйте этот GitHub-репозиторий в Lovable (New → Import from GitHub) —
дальше можно править визуально прямо там.
