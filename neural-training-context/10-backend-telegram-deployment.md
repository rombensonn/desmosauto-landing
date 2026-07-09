# 10. Backend, Telegram и деплой

## PHP lead backend

Файлы:

- `backend/api/leads.php`.
- `backend/api/telegram-bot.php`.
- `backend/api/_common.php`.
- `backend/api/_promo-codes.php`.

Назначение:

- принять заявку с сайта;
- проверить формат;
- валидировать имя, телефон, согласия и необязательный промокод;
- отсеять spam через honeypot `website`;
- сохранить заявку в `storage/leads.jsonl`;
- сохранить снимок примененного промокода в заявке;
- отправить уведомление в Telegram;
- вернуть frontend понятный JSON-ответ.

## Хранение заявок

Заявки сохраняются в формате JSONL:

```text
storage/leads.jsonl
```

Каждая строка - отдельная заявка. Даже если Telegram временно не сработал, валидная заявка должна сохраняться.

## Telegram

Production Telegram обязателен. Это значит:

- если Telegram не настроен;
- если токен неверный;
- если chat id неверный;
- если Telegram API вернул ошибку,

то сайт не должен показывать ложный успех.

Публичный UI должен показывать безопасное сообщение. Детали должны попадать в:

```text
storage/notification-errors.log
```

## Промокоды

Промокоды хранятся в:

```text
storage/promocodes.json
```

Журнал действий администратора:

```text
storage/promo-events.jsonl
```

Пустой промокод в заявке валиден. Указанный промокод должен существовать, быть активным, не истечь и состоять из латинских букв, цифр, `_` или `-`.

Управление идёт через Telegram webhook:

```text
api/telegram-bot.php
```

Webhook должен быть защищён `X-Telegram-Bot-Api-Secret-Token`, а команды доступны только user id из `telegram_admin_ids`.

## Секреты

Полный Telegram bot token нельзя хранить в этой учебной базе, README или публичных инструкциях.

Источник правды:

```text
backend/api/leads.config.php
```

Этот файл игнорируется Git. Он должен копироваться в готовый production-архив как:

```text
api/leads.config.php
```

Production chat id для группы ДесмосАвто:

```text
-1003658178524
```

## REG.RU Host-0

Сайт публикуется как статический экспорт Next.js + PHP endpoint.

В корне хостинга должны лежать:

```text
index.html
.htaccess
_next/
api/leads.php
api/telegram-bot.php
api/_common.php
api/_promo-codes.php
api/leads.config.php
storage/.htaccess
storage/index.html
```

## Важное про `.htaccess`

Файл:

```text
deploy/reg-ru-host0/.htaccess
```

Нужен, чтобы чистые URL вроде `/contact`, `/projects`, `/services`, `/faq` открывали `.html` файлы, а не уходили в одноименные папки static export с `403 Forbidden`.

## Правило сборки архива

Перед packaging:

```bash
NEXT_PUBLIC_LEAD_ENDPOINT=/api/leads.php pnpm build
```

В архив обязательно копировать:

- `out/` как корень сайта;
- `deploy/reg-ru-host0/.htaccess` как `.htaccess`;
- `backend/api/leads.php` как `api/leads.php`;
- `backend/api/telegram-bot.php` как `api/telegram-bot.php`;
- `backend/api/_common.php` как `api/_common.php`;
- `backend/api/_promo-codes.php` как `api/_promo-codes.php`;
- `backend/api/leads.config.php` как `api/leads.config.php`;
- защищенную папку `storage/`.

Не включать:

- локальные `leads.jsonl`;
- локальные `notification-errors.log`;
- локальные `promocodes.json`;
- локальные `promo-events.jsonl`;
- `.next/`;
- исходники проекта;
- node_modules.

## Проверка готового архива

Проверить, что Telegram-конфиг не пустой:

```bash
php -r '$c = include "output/<archive-folder>/api/leads.config.php"; var_export([$c["telegram_required"], $c["telegram_chat_ids"], $c["telegram_bot_token"] !== ""]); echo PHP_EOL;'
```

Проверить, что не зашит локальный endpoint:

```bash
rg -n "127\\.0\\.0\\.1:8081|localhost:8081" output/<archive-folder> --glob '!**/*.map'
```

Ожидание: совпадений нет.
