# 09. Технологический стек

## Frontend

Стек:

- Next.js App Router;
- React;
- TypeScript;
- Tailwind CSS;
- статический экспорт `output: "export"`;
- `next/image` с `unoptimized`;
- `next/font/google` для страницы проектов;
- Lucide React для иконок.

Проект собирается в `out/`.

## Анимации и визуал

Используемые библиотеки:

- GSAP;
- ScrollTrigger;
- `@gsap/react`;
- Framer Motion;
- `motion/react`;
- React Three Fiber;
- Drei;
- Three.js.

## Backend

Backend формы:

- PHP endpoint `backend/api/leads.php`;
- production путь `api/leads.php`;
- принимает JSON POST;
- сохраняет лиды в `storage/leads.jsonl`;
- отправляет Telegram notification;
- логирует ошибки в `storage/notification-errors.log`.

## Package manager

Используется `pnpm`.

Основные команды:

```bash
pnpm install
pnpm dev
pnpm typecheck
NEXT_PUBLIC_LEAD_ENDPOINT=/api/leads.php pnpm build
```

## ENV

Важные переменные:

- `NEXT_PUBLIC_SITE_URL`;
- `NEXT_PUBLIC_LEAD_ENDPOINT`;
- `LEAD_ALLOWED_ORIGINS`;
- `LEAD_STORAGE_DIR`;
- `LEAD_SALT`;
- `LEAD_MAIL_TO`;
- `LEAD_TELEGRAM_REQUIRED`;
- `LEAD_TELEGRAM_BOT_TOKEN`;
- `LEAD_TELEGRAM_CHAT_IDS`;
- `LEAD_TELEGRAM_MESSAGE_THREAD_ID`.

Для production-архива endpoint должен быть `/api/leads.php`, а не `127.0.0.1`.

## Структура

Важные папки:

- `app/` - страницы и global CSS;
- `components/` - UI и интерактивные компоненты;
- `data/` - проекты, услуги, FAQ;
- `lib/` - SEO, пути, валидация;
- `public/` - изображения и превью;
- `backend/` - PHP backend;
- `deploy/` - файлы деплоя;
- `output/` - готовые архивы/папки сборки.

## Проверки

Перед передачей изменений желательно запускать:

```bash
pnpm typecheck
NEXT_PUBLIC_LEAD_ENDPOINT=/api/leads.php pnpm build
php -l backend/api/leads.php
```

Lint лучше запускать с исключением generated folders:

```bash
pnpm exec eslint . --ignore-pattern 'out/**' --ignore-pattern 'output/**' --ignore-pattern '_next/**' --ignore-pattern '.next/**'
```

