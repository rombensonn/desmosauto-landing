<?php

declare(strict_types=1);

require_once __DIR__ . DIRECTORY_SEPARATOR . '_common.php';
require_once __DIR__ . DIRECTORY_SEPARATOR . '_promo-codes.php';

da_boot_json_api('Внутренняя ошибка Telegram-бота.');

$config = da_load_config();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method !== 'POST') {
    da_respond(['ok' => false, 'message' => 'Метод не поддерживается.'], 405);
}

$expectedSecret = da_config_string($config, 'telegram_webhook_secret', 'LEAD_TELEGRAM_WEBHOOK_SECRET');
$actualSecret = $_SERVER['HTTP_X_TELEGRAM_BOT_API_SECRET_TOKEN'] ?? '';

if ($expectedSecret === '' || !hash_equals($expectedSecret, (string) $actualSecret)) {
    da_respond(['ok' => false, 'message' => 'Telegram webhook не авторизован.'], 403);
}

$rawBody = @file_get_contents('php://input');
$update = json_decode(is_string($rawBody) ? $rawBody : '', true);

if (!is_array($update)) {
    da_respond(['ok' => false, 'message' => 'Некорректный формат обновления Telegram.'], 400);
}

$message = null;

if (isset($update['message']) && is_array($update['message'])) {
    $message = $update['message'];
} elseif (isset($update['edited_message']) && is_array($update['edited_message'])) {
    $message = $update['edited_message'];
}

if (!is_array($message)) {
    da_respond(['ok' => true, 'message' => 'Нет команды для обработки.']);
}

$chatId = $message['chat']['id'] ?? null;
$from = isset($message['from']) && is_array($message['from']) ? $message['from'] : [];
$fromId = da_clean_text($from['id'] ?? '');
$text = da_clean_text($message['text'] ?? '');

if ($chatId === null || $text === '') {
    da_respond(['ok' => true, 'message' => 'Нет команды для обработки.']);
}

$adminIds = da_config_list($config, 'telegram_admin_ids', 'LEAD_TELEGRAM_ADMIN_IDS');

if ($adminIds === []) {
    $replyError = replyTelegram($config, $chatId, 'Администраторы промокодов не настроены. Добавьте telegram_admin_ids в api/leads.config.php.');
    finishTelegramWebhook($config, $replyError, 'telegram-admin-missing');
}

if ($fromId === '' || !in_array($fromId, $adminIds, true)) {
    $replyError = replyTelegram($config, $chatId, 'Нет доступа к управлению промокодами.');
    finishTelegramWebhook($config, $replyError, 'telegram-admin-denied');
}

$actor = [
    'id' => $fromId,
    'username' => da_clean_text($from['username'] ?? ''),
    'firstName' => da_clean_text($from['first_name'] ?? ''),
    'lastName' => da_clean_text($from['last_name'] ?? ''),
];

$reply = handlePromoCommand($config, $text, $actor);
$replyError = replyTelegram($config, $chatId, $reply);

finishTelegramWebhook($config, $replyError, 'telegram-bot-reply');

function finishTelegramWebhook($config, $replyError, $channel)
{
    if ($replyError !== null) {
        $storageDir = da_get_storage_dir($config);
        da_ensure_storage_directory($storageDir);
        da_log_notification_failure($storageDir, $channel, [$replyError]);

        da_respond([
            'ok' => true,
            'replySent' => false,
            'message' => 'Команда обработана, но Telegram-ответ не отправился.',
        ]);
    }

    da_respond([
        'ok' => true,
        'replySent' => true,
    ]);
}

function replyTelegram($config, $chatId, $message)
{
    $botToken = da_config_string($config, 'telegram_bot_token', 'LEAD_TELEGRAM_BOT_TOKEN');

    return da_send_telegram_text($botToken, (string) $chatId, $message);
}

function handlePromoCommand($config, $text, $actor)
{
    $parsed = parseTelegramCommand($text);
    $command = $parsed['command'];
    $args = $parsed['args'];

    if ($command === 'promo_add') {
        return handlePromoAdd($config, $args, $actor);
    }

    if ($command === 'promo_remove') {
        return handlePromoRemove($config, $args, $actor);
    }

    if ($command === 'promo_list') {
        return handlePromoList($config);
    }

    if ($command === 'promo_show') {
        return handlePromoShow($config, $args);
    }

    if ($command === 'promo_help' || $command === 'start' || $command === 'help') {
        return promoHelpMessage();
    }

    return "Неизвестная команда.\n\n" . promoHelpMessage();
}

function parseTelegramCommand($text)
{
    if (preg_match('/^\/([A-Za-z_]+)(?:@[A-Za-z0-9_]+)?(?:\s+(.*))?$/s', trim((string) $text), $matches) !== 1) {
        return [
            'command' => '',
            'args' => '',
        ];
    }

    return [
        'command' => strtolower($matches[1]),
        'args' => trim((string) ($matches[2] ?? '')),
    ];
}

function handlePromoAdd($config, $args, $actor)
{
    $parts = array_map('trim', explode('|', (string) $args));

    if (count($parts) !== 4) {
        return "Формат команды:\n/promo_add CODE | Название | Выгода | YYYY-MM-DD\n\nДля бессрочного промокода используйте - вместо даты.";
    }

    $code = da_normalize_promo_code($parts[0]);
    $title = da_clean_text($parts[1]);
    $benefit = da_clean_text($parts[2]);
    $expiresAt = da_clean_text($parts[3]);
    $formatError = da_validate_promo_code_format($code);

    if ($formatError !== null || $code === '') {
        return $formatError ?: 'Промокод должен содержать 3-32 символа.';
    }

    if ($title === '' || $benefit === '') {
        return 'Укажите название и выгоду промокода.';
    }

    if ($expiresAt === '-') {
        $expiresAt = '';
    } elseif (!isValidPromoDate($expiresAt)) {
        return 'Дата окончания должна быть в формате YYYY-MM-DD или - для бессрочного промокода.';
    }

    $promo = da_upsert_promo_code($config, $code, $title, $benefit, $expiresAt, $actor);

    if ($promo === null) {
        return 'Не удалось сохранить промокод. Проверьте права на папку storage.';
    }

    return "Промокод сохранён:\n" . formatPromoForBot($promo);
}

function handlePromoRemove($config, $args, $actor)
{
    $code = da_normalize_promo_code($args);
    $formatError = da_validate_promo_code_format($code);

    if ($formatError !== null || $code === '') {
        return "Формат команды:\n/promo_remove CODE";
    }

    $result = da_disable_promo_code($config, $code, $actor);

    if (!$result['ok']) {
        return $result['error'] ?: 'Не удалось отключить промокод.';
    }

    return "Промокод отключён:\n" . formatPromoForBot($result['promo']);
}

function handlePromoList($config)
{
    $codes = da_active_promo_codes($config);

    if ($codes === []) {
        return 'Активных промокодов нет.';
    }

    $lines = ['Активные промокоды:'];

    foreach ($codes as $promo) {
        $lines[] = '- ' . formatPromoForBot($promo);
    }

    return implode("\n", $lines);
}

function handlePromoShow($config, $args)
{
    $code = da_normalize_promo_code($args);
    $formatError = da_validate_promo_code_format($code);

    if ($formatError !== null || $code === '') {
        return "Формат команды:\n/promo_show CODE";
    }

    $promo = da_find_promo_code($config, $code);

    if (!is_array($promo)) {
        return 'Промокод не найден.';
    }

    return "Промокод:\n" . formatPromoForBot($promo, true);
}

function formatPromoForBot($promo, $withStatus = false)
{
    $expiresAt = da_clean_text($promo['expiresAt'] ?? '');
    $status = !empty($promo['active']) ? 'активен' : 'отключён';

    if (!empty($promo['active']) && da_is_promo_expired($promo)) {
        $status = 'истёк';
    }

    $parts = [
        da_value_or_dash($promo['code'] ?? ''),
        da_value_or_dash($promo['title'] ?? ''),
        da_value_or_dash($promo['benefit'] ?? ''),
    ];

    if ($expiresAt !== '') {
        $parts[] = 'до ' . $expiresAt;
    }

    if ($withStatus) {
        $parts[] = $status;
    }

    return implode(' — ', $parts);
}

function isValidPromoDate($date)
{
    if (preg_match('/^(\d{4})-(\d{2})-(\d{2})$/', $date, $matches) !== 1) {
        return false;
    }

    return checkdate((int) $matches[2], (int) $matches[3], (int) $matches[1]);
}

function promoHelpMessage()
{
    return implode("\n", [
        'Команды промокодов:',
        '/promo_add CODE | Название | Выгода | YYYY-MM-DD',
        '/promo_add CODE | Название | Выгода | -',
        '/promo_remove CODE',
        '/promo_list',
        '/promo_show CODE',
        '/promo_help',
    ]);
}
