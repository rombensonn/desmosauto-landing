# Настройка API заявок

`leads.config.php` содержит только безопасные значения по умолчанию. Секреты не должны попадать в каталог сайта или Git.

## Обязательная настройка production

- `LEAD_SALT` — случайная строка не короче 32 байт для HMAC-хешей IP и ключей идемпотентности.
- `LEAD_STORAGE_DIR` — абсолютный путь к доступному для PHP каталогу вне `DocumentRoot`. Без переменной используется соседний каталог `<project>-private` вне публичного проекта.
- `LEAD_ALLOWED_ORIGINS` — разрешённые origins через запятую. По умолчанию разрешены только `https://desmosauto.ru` и `https://www.desmosauto.ru`.

Секреты интеграций:

- `TELEGRAM_BOT_TOKEN` (или `LEAD_TELEGRAM_BOT_TOKEN`);
- `TELEGRAM_CHAT_ID` (или список `LEAD_TELEGRAM_CHAT_IDS` через запятую);
- `TELEGRAM_WEBHOOK_SECRET` (или `LEAD_TELEGRAM_WEBHOOK_SECRET`);
- `TELEGRAM_ADMIN_IDS` (или `LEAD_TELEGRAM_ADMIN_IDS` через запятую);
- `ADMIN_EMAIL` (или `LEAD_MAIL_TO`).

После утечки старые Telegram bot token и webhook secret нужно отозвать/перевыпустить в Telegram, а не просто удалить из файла.

Опционально можно задать `LEAD_CONFIG_FILE` как абсолютный путь к приватному PHP-конфигу. Значения из него перекрывают безопасный конфиг проекта.

## Защита и хранение

- `LEAD_REQUEST_MAX_BYTES` — размер POST заявки, по умолчанию 32768 байт.
- `LEAD_RATE_LIMIT_MAX_REQUESTS` — число попыток с одного IP-хеша, по умолчанию 8.
- `LEAD_RATE_LIMIT_WINDOW_SECONDS` — окно rate limit, по умолчанию 600 секунд.
- `LEAD_DEDUP_WINDOW_SECONDS` — окно дедупликации заявки без `submissionId`, по умолчанию 900 секунд.
- `LEAD_IDEMPOTENCY_WINDOW_SECONDS` — окно идемпотентности UUID `submissionId`, по умолчанию 604800 секунд.

Если файл rate limit нельзя безопасно открыть или заблокировать, API отвечает `503` и не принимает заявку до восстановления хранилища. Это исключает обход ограничения при сбое lock-файла.

Заявки сохраняются в `leads.jsonl`. Сбой Telegram/email фиксируется в `notification-errors.log`, но уже сохранённая заявка остаётся принятой и не получает 502, поэтому повторная отправка не создаёт дубль.

## Форматы запроса

`POST /api/leads.php` принимает `application/json` и `application/x-www-form-urlencoded`. AJAX получает JSON; обычная HTML-форма получает читаемый HTML-ответ. Для повторной отправки передавайте UUID в `submissionId` или заголовке `Idempotency-Key`.

Адреса `currentSite`, `pageUrl` и `referrer`, если переданы, должны быть корректными HTTP(S)-URL. Поле `preferredContactTime` ограничено 100 символами.
