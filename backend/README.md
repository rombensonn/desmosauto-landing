# PHP-бэкенд формы

Файл `api/leads.php` принимает POST-заявки с сайта, валидирует имя, телефон и необязательный промокод, проверяет honeypot и сохраняет заявку в `storage/leads.jsonl` относительно корня загруженного сайта.

При необходимости можно включить дополнительную отправку через локальную почтовую службу сервера переменной `LEAD_MAIL_TO`.

Telegram-уведомления отправляются через Bot API после сохранения заявки. По умолчанию Telegram обязателен: если токен, chat id или доступ к Telegram API не работают, заявка остаётся в `storage/leads.jsonl`, ошибка пишется в `storage/notification-errors.log`, а сайт показывает ошибку вместо ложного сообщения об успешной отправке.

Для REG.RU Host-0 скопируйте PHP runtime из `backend/api/` в `api/` в корне сайта: `leads.php`, `telegram-bot.php`, `_common.php`, `_promo-codes.php` и боевой `leads.config.php`. Создайте рядом с сайтом папку `storage` с правом записи для PHP и положите в неё `.htaccess`:

```apache
Require all denied
Deny from all
```

Обработчик также пытается создать `storage`, `storage/.htaccess` и пустой `storage/index.html` сам, если права хостинга позволяют.

Если переменные окружения на хостинге задавать неудобно, скопируйте `backend/api/leads.config.example.php` в `api/leads.config.php` рядом с обработчиком и заполните нужные значения:

```php
<?php

return [
    'allowed_origins' => ['https://desmosauto.ru', 'https://www.desmosauto.ru'],
    'storage_dir' => 'storage',
    'salt' => 'уникальная-соль',
    'mail_to' => '',
    'telegram_required' => true,
    'telegram_bot_token' => '',
    'telegram_chat_ids' => [],
    'telegram_message_thread_id' => '',
    'telegram_webhook_secret' => '',
    'telegram_admin_ids' => [],
    'promo_codes_enabled' => true,
    'promo_codes_file' => 'promocodes.json',
    'promo_events_file' => 'promo-events.jsonl',
];
```

## Промокоды и Telegram-бот

Промокоды хранятся в `storage/promocodes.json`, а действия администратора пишутся в `storage/promo-events.jsonl`. Пустой промокод в заявке разрешён; указанный код должен быть активным, не истёкшим и состоять из латинских букв, цифр, `_` или `-`.

Webhook управления находится в `api/telegram-bot.php` и принимает только POST-запросы от Telegram с заголовком `X-Telegram-Bot-Api-Secret-Token`. Для включения добавьте в боевой `api/leads.config.php` `telegram_webhook_secret` и список `telegram_admin_ids`.

Команды администратора: `/promo_add`, `/promo_remove`, `/promo_list`, `/promo_show`, `/promo_help`.

Переменные окружения:

- `LEAD_ALLOWED_ORIGINS` — список разрешённых доменов через запятую для CORS.
- `LEAD_STORAGE_DIR` — папка хранения заявок относительно корня сайта, по умолчанию `storage`.
- `LEAD_SALT` — соль для хеша IP.
- `LEAD_MAIL_TO` — необязательный адрес для локальной серверной почты.
- `LEAD_TELEGRAM_REQUIRED` — `true` для продакшена: не показывать пользователю успех, если Telegram не отправился.
- `LEAD_TELEGRAM_BOT_TOKEN` — токен бота от BotFather.
- `LEAD_TELEGRAM_CHAT_IDS` — один или несколько chat id через запятую.
- `LEAD_TELEGRAM_MESSAGE_THREAD_ID` — необязательный id темы, если заявки нужно отправлять в тему Telegram-форума.
- `LEAD_TELEGRAM_WEBHOOK_SECRET` — secret token для webhook управления промокодами.
- `LEAD_TELEGRAM_ADMIN_IDS` — Telegram user id администраторов промокодов через запятую.
- `PROMO_CODES_ENABLED` — включает серверную проверку промокодов.
- `PROMO_CODES_FILE` — имя JSON-файла промокодов внутри `storage`.
- `PROMO_EVENTS_FILE` — имя JSONL-журнала действий с промокодами внутри `storage`.

На продакшене endpoint должен быть доступен как `/api/leads.php`, либо укажите путь в `NEXT_PUBLIC_LEAD_ENDPOINT`.
