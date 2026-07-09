# ДесмосАвто

Многостраничный фронтенд на Next.js App Router со статическим экспортом и отдельным PHP-бэкендом для формы заявки.

## Страницы

- `/` — главная страница лендинга.
- `/projects` — каталог 120 рабочих кейсов с поиском и фильтрами.

## Запуск фронтенда

```bash
pnpm install
pnpm dev
```

Production-сборка:

```bash
pnpm build
```

Проект настроен на статический экспорт в `out/`.

Для публикации на REG.RU Host-0 корневой `.htaccess` должен переписывать чистые URL на `.html` до проверки одноимённых директорий из Next export. Готовый шаблон лежит в `deploy/reg-ru-host0/.htaccess`; без него `/contact`, `/projects`, `/services` и похожие страницы могут редиректить на `/contact/` и отдавать `403 Forbidden`.

## PHP-бэкенд формы

Обработчик лежит в `backend/api/leads.php`. Он валидирует имя, телефон и необязательный промокод, проверяет honeypot, сохраняет заявку в `storage/leads.jsonl` относительно корня загруженного сайта и отправляет уведомления в Telegram.

Локальная проверка:

```bash
php -S 127.0.0.1:8081 -t backend
```

Фронтенд отправляет заявку на `NEXT_PUBLIC_LEAD_ENDPOINT`, по умолчанию `/api/leads.php`.

Для REG.RU Host-0 после `pnpm build` загрузите статический экспорт так, чтобы `index.html`, `_next/`, `api/`, `storage/` и `.htaccess` лежали сразу в корне сайта. Скопируйте PHP runtime из `backend/api/` в `api/`: `leads.php`, `telegram-bot.php`, `_common.php`, `_promo-codes.php` и боевой `leads.config.php`. Папка `storage/` должна быть доступна PHP на запись; обработчики сами создают `storage/leads.jsonl`, `storage/promocodes.json`, `storage/promo-events.jsonl`, `storage/.htaccess` и пустой `storage/index.html`, если прав хватает.

Если на хостинге неудобно задавать переменные окружения, скопируйте `backend/api/leads.config.example.php` в `api/leads.config.php` рядом с обработчиком и заполните `telegram_bot_token` и `telegram_chat_ids`. Этот файл не должен попадать в публичный репозиторий.

По умолчанию Telegram обязателен: если токен, chat id или доступ к Telegram API не работают, заявка сохраняется в `storage/leads.jsonl`, ошибка пишется в `storage/notification-errors.log`, а сайт показывает ошибку вместо ложного сообщения об успешной отправке.

## Промокоды

Форма принимает необязательное поле `promoCode`. Пустое значение валидно; если код указан, backend нормализует его в uppercase и принимает только активные коды из `storage/promocodes.json`. В заявку сохраняется снимок промокода: код, название, выгода и дата окончания.

Управление промокодами идёт через `api/telegram-bot.php`. Webhook защищён заголовком `X-Telegram-Bot-Api-Secret-Token`, а команды доступны только Telegram user id из `telegram_admin_ids`.

Команды:

- `/promo_add CODE | Название | Выгода | YYYY-MM-DD`
- `/promo_add CODE | Название | Выгода | -`
- `/promo_remove CODE`
- `/promo_list`
- `/promo_show CODE`
- `/promo_help`

## ENV

См. `.env.example`.

- `NEXT_PUBLIC_SITE_URL` — канонический адрес сайта.
- `NEXT_PUBLIC_LEAD_ENDPOINT` — путь к PHP endpoint.
- `LEAD_ALLOWED_ORIGINS` — разрешённые домены для CORS.
- `LEAD_STORAGE_DIR` — папка хранения заявок относительно корня сайта, по умолчанию `storage`.
- `LEAD_SALT` — соль для хеша IP.
- `LEAD_MAIL_TO` — необязательная локальная серверная почта.
- `LEAD_TELEGRAM_REQUIRED` — `true` для продакшена: не показывать пользователю успех, если Telegram не отправился.
- `LEAD_TELEGRAM_BOT_TOKEN` — токен бота от BotFather.
- `LEAD_TELEGRAM_CHAT_IDS` — один или несколько chat id через запятую.
- `LEAD_TELEGRAM_MESSAGE_THREAD_ID` — необязательный id темы Telegram-форума.
- `LEAD_TELEGRAM_WEBHOOK_SECRET` — secret token для webhook управления промокодами.
- `LEAD_TELEGRAM_ADMIN_IDS` — Telegram user id администраторов промокодов через запятую.
- `PROMO_CODES_ENABLED` — включает серверную проверку промокодов.
- `PROMO_CODES_FILE` — имя JSON-файла промокодов внутри `storage`.
- `PROMO_EVENTS_FILE` — имя JSONL-журнала действий с промокодами внутри `storage`.

## Данные

- `data/projects.ts` — 120 рабочих проектов, 12 отмечены `featured`.
- `data/faqs.ts` — FAQ для главной и JSON-LD.
- `data/services.ts` — 8 типов сайтов для автомобильного бизнеса.

## Следующий этап

- Динамические страницы кейсов `/projects/[slug]`.
- Детальные страницы по каждому рабочему проекту.
- Подключение внутренней системы учёта заявок.
- Блог и статьи под SEO.
- Страницы услуг и городов.
- Расширенная аналитика.
