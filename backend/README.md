# PHP-бэкенд формы

Файл `api/leads.php` принимает POST-заявки с сайта, валидирует имя и телефон, проверяет honeypot и сохраняет заявку в `storage/leads.jsonl` относительно корня загруженного сайта.

При необходимости можно включить отправку через локальную почтовую службу сервера переменной `LEAD_MAIL_TO`.

Telegram-уведомления отправляются через Bot API после сохранения заявки. Если Telegram временно недоступен или на хостинге нет `curl`, заявка всё равно остаётся в `storage/leads.jsonl`, а ошибка пишется в `storage/notification-errors.log`.

Для REG.RU Host-0 скопируйте `backend/api/leads.php` в `api/leads.php` в корне сайта. Создайте рядом с сайтом папку `storage` с правом записи для PHP и положите в неё `.htaccess`:

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
    'telegram_bot_token' => '',
    'telegram_chat_ids' => [],
    'telegram_message_thread_id' => '',
];
```

Переменные окружения:

- `LEAD_ALLOWED_ORIGINS` — список разрешённых доменов через запятую для CORS.
- `LEAD_STORAGE_DIR` — папка хранения заявок относительно корня сайта, по умолчанию `storage`.
- `LEAD_SALT` — соль для хеша IP.
- `LEAD_MAIL_TO` — необязательный адрес для локальной серверной почты.
- `LEAD_TELEGRAM_BOT_TOKEN` — токен бота от BotFather.
- `LEAD_TELEGRAM_CHAT_IDS` — один или несколько chat id через запятую.
- `LEAD_TELEGRAM_MESSAGE_THREAD_ID` — необязательный id темы, если заявки нужно отправлять в тему Telegram-форума.

На продакшене endpoint должен быть доступен как `/api/leads.php`, либо укажите путь в `NEXT_PUBLIC_LEAD_ENDPOINT`.
