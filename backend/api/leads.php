<?php

declare(strict_types=1);

ini_set('display_errors', '0');
ob_start();

sendJsonHeader();

set_exception_handler(function ($exception) {
    respond([
        'ok' => false,
        'message' => 'Внутренняя ошибка обработчика заявки.',
    ], 500);
});

register_shutdown_function(function () {
    $error = error_get_last();
    $fatalTypes = [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR];

    if ($error === null || !in_array($error['type'], $fatalTypes, true)) {
        return;
    }

    clearOutputBuffers();
    sendJsonHeader();
    http_response_code(500);
    echo encodeJson([
        'ok' => false,
        'message' => 'Внутренняя ошибка обработчика заявки.',
    ]);
});

$config = loadLeadConfig();
sendCorsHeaders($config);

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($method !== 'POST') {
    respond(['ok' => false, 'message' => 'Метод не поддерживается.'], 405);
}

$rawBody = @file_get_contents('php://input');
$data = json_decode(is_string($rawBody) ? $rawBody : '', true);

if (!is_array($data)) {
    respond(['ok' => false, 'message' => 'Некорректный формат заявки.'], 400);
}

$lead = [
    'name' => cleanText($data['name'] ?? ''),
    'phone' => cleanText($data['phone'] ?? ''),
    'website' => cleanText($data['website'] ?? ''),
    'privacyPolicyAccepted' => boolValue($data['privacyPolicyAccepted'] ?? false),
    'personalDataConsent' => boolValue($data['personalDataConsent'] ?? false),
    'consentVersion' => '2026-07-06',
    'pageUrl' => cleanText($data['pageUrl'] ?? ''),
    'source' => cleanText($data['source'] ?? ''),
    'utm_source' => cleanText($data['utm_source'] ?? ''),
    'utm_medium' => cleanText($data['utm_medium'] ?? ''),
    'utm_campaign' => cleanText($data['utm_campaign'] ?? ''),
    'referrer' => cleanText($data['referrer'] ?? ''),
    'createdAt' => date(DATE_ATOM),
    'ipHash' => hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . configString($config, 'salt', 'LEAD_SALT', 'desmosauto')),
];

if ($lead['website'] !== '') {
    respond(['ok' => true]);
}

$errors = validateLead($lead);

if ($errors !== []) {
    respond(['ok' => false, 'errors' => $errors], 400);
}

$storageDir = getStorageDir($config);
$storageFile = $storageDir . DIRECTORY_SEPARATOR . 'leads.jsonl';

ensureStorageDirectory($storageDir);

$line = encodeJson($lead) . PHP_EOL;

if (@file_put_contents($storageFile, $line, FILE_APPEND | LOCK_EX) === false) {
    respond(['ok' => false, 'message' => 'Не удалось сохранить заявку. Проверьте права на папку storage.'], 500);
}

$mailTo = configString($config, 'mail_to', 'LEAD_MAIL_TO');

if ($mailTo !== '') {
    $subject = 'Новая заявка с сайта ДесмосАвто';
    $message = implode("\n", [
        'Новая заявка с сайта ДесмосАвто:',
        'Имя: ' . $lead['name'],
        'Телефон: ' . $lead['phone'],
        'Политика ПД: ' . ($lead['privacyPolicyAccepted'] ? 'принята' : 'нет'),
        'Согласие ПД: ' . ($lead['personalDataConsent'] ? 'получено' : 'нет'),
        'Страница: ' . ($lead['pageUrl'] ?: 'не указана'),
        'Источник: ' . ($lead['source'] ?: 'не указан'),
        'UTM: ' . trim($lead['utm_source'] . ' / ' . $lead['utm_medium'] . ' / ' . $lead['utm_campaign'], ' /'),
        'Referrer: ' . ($lead['referrer'] ?: 'нет'),
        'Дата: ' . $lead['createdAt'],
    ]);

    @mail($mailTo, $subject, $message, 'Content-Type: text/plain; charset=UTF-8');
}

$telegramErrors = sendTelegramLead($lead, $config);

if ($telegramErrors !== []) {
    logNotificationFailure($storageDir, 'telegram', $telegramErrors);

    if (isTelegramRequired($config)) {
        respond([
            'ok' => false,
            'message' => formatNotificationUserMessage($telegramErrors),
        ], 502);
    }
}

respond([
    'ok' => true,
    'message' => 'Заявка отправлена. Мы свяжемся с вами и уточним, какой сайт нужен вашему автосервису.'
]);

function loadLeadConfig()
{
    $config = [];
    $paths = [
        __DIR__ . DIRECTORY_SEPARATOR . 'leads.config.php',
        dirname(__DIR__) . DIRECTORY_SEPARATOR . 'storage' . DIRECTORY_SEPARATOR . 'leads.config.php',
    ];

    foreach ($paths as $path) {
        if (!is_file($path) || !is_readable($path)) {
            continue;
        }

        $loadedConfig = @include $path;

        if (is_array($loadedConfig)) {
            $config = array_replace_recursive($config, $loadedConfig);
        }
    }

    return $config;
}

function configString($config, $key, $envName, $default = '')
{
    $value = null;

    if (array_key_exists($key, $config) && !isBlankConfigValue($config[$key])) {
        $value = $config[$key];
    } else {
        $envValue = getenv($envName);

        if ($envValue !== false && trim((string) $envValue) !== '') {
            $value = $envValue;
        }
    }

    if (is_array($value)) {
        $value = implode(',', array_map('trimScalar', $value));
    }

    if ($value === null || $value === false) {
        return $default;
    }

    $value = trim((string) $value);

    return $value !== '' ? $value : $default;
}

function configList($config, $key, $envName)
{
    if (array_key_exists($key, $config) && !isBlankConfigValue($config[$key])) {
        $value = $config[$key];
    } else {
        $value = getenv($envName);
    }

    if (is_array($value)) {
        $items = $value;
    } else {
        $items = explode(',', (string) ($value === false ? '' : $value));
    }

    $items = array_map('trimScalar', $items);

    return array_values(array_filter($items, function ($item) {
        return $item !== '';
    }));
}

function configBool($config, $key, $envName, $default = false)
{
    if (array_key_exists($key, $config)) {
        $value = $config[$key];
    } else {
        $envValue = getenv($envName);

        if ($envValue === false || trim((string) $envValue) === '') {
            return $default;
        }

        $value = $envValue;
    }

    if (is_bool($value)) {
        return $value;
    }

    if ($value === null) {
        return $default;
    }

    if (is_int($value) || is_float($value)) {
        return (int) $value !== 0;
    }

    $normalized = leadLower(trim((string) $value));

    if (in_array($normalized, ['1', 'true', 'yes', 'y', 'on', 'да'], true)) {
        return true;
    }

    if (in_array($normalized, ['0', 'false', 'no', 'n', 'off', 'нет'], true)) {
        return false;
    }

    return $default;
}

function isTelegramRequired($config)
{
    return configBool($config, 'telegram_required', 'LEAD_TELEGRAM_REQUIRED', true);
}

function isBlankConfigValue($value)
{
    if ($value === null || $value === false) {
        return true;
    }

    if (is_array($value)) {
        return count($value) === 0;
    }

    return trim((string) $value) === '';
}

function trimScalar($value)
{
    return trim(is_scalar($value) ? (string) $value : '');
}

function sendCorsHeaders($config)
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $normalizedOrigin = normalizeOrigin($origin);
    $allowedOrigins = getAllowedOrigins($config);

    if ($normalizedOrigin !== '') {
        if (in_array('*', $allowedOrigins, true)) {
            header('Access-Control-Allow-Origin: *');
        } elseif (in_array($normalizedOrigin, $allowedOrigins, true)) {
            header('Access-Control-Allow-Origin: ' . $normalizedOrigin);
            header('Vary: Origin');
        }
    }

    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
    header('Access-Control-Max-Age: 86400');
}

function getAllowedOrigins($config)
{
    $origins = array_merge(configList($config, 'allowed_origins', 'LEAD_ALLOWED_ORIGINS'), defaultAllowedOrigins());
    $normalized = [];

    foreach ($origins as $origin) {
        $normalizedOrigin = normalizeOrigin($origin);

        if ($normalizedOrigin !== '') {
            $normalized[] = $normalizedOrigin;
        }
    }

    return array_values(array_unique($normalized));
}

function defaultAllowedOrigins()
{
    $origins = [
        'https://desmosauto.ru',
        'https://www.desmosauto.ru',
    ];

    $host = strtolower(trim((string) ($_SERVER['HTTP_HOST'] ?? '')));

    if ($host === '') {
        return $origins;
    }

    $scheme = isHttpsRequest() ? 'https' : 'http';
    $origins[] = $scheme . '://' . $host;

    $hostWithoutPort = preg_replace('/:\d+$/', '', $host);
    $port = substr($host, strlen($hostWithoutPort));

    if (strpos($hostWithoutPort, 'www.') === 0) {
        $origins[] = $scheme . '://' . substr($hostWithoutPort, 4) . $port;
    } else {
        $origins[] = $scheme . '://www.' . $hostWithoutPort . $port;
    }

    return $origins;
}

function normalizeOrigin($origin)
{
    $origin = trim((string) $origin);

    if ($origin === '') {
        return '';
    }

    if ($origin === '*') {
        return '*';
    }

    $parts = @parse_url($origin);

    if (!is_array($parts) || empty($parts['scheme']) || empty($parts['host'])) {
        return '';
    }

    $scheme = strtolower((string) $parts['scheme']);

    if ($scheme !== 'http' && $scheme !== 'https') {
        return '';
    }

    $host = strtolower((string) $parts['host']);
    $port = isset($parts['port']) ? ':' . (int) $parts['port'] : '';

    return $scheme . '://' . $host . $port;
}

function isHttpsRequest()
{
    $https = strtolower((string) ($_SERVER['HTTPS'] ?? ''));
    $forwardedProto = strtolower((string) ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? ''));

    return ($https !== '' && $https !== 'off') || $forwardedProto === 'https';
}

function getStorageDir($config)
{
    $configuredDir = configString($config, 'storage_dir', 'LEAD_STORAGE_DIR', 'storage');

    return resolveStoragePath($configuredDir);
}

function resolveStoragePath($path)
{
    $path = trim((string) $path);

    if ($path === '') {
        $path = 'storage';
    }

    $normalizedPath = str_replace(['/', '\\'], DIRECTORY_SEPARATOR, $path);

    if (preg_match('/^(?:[A-Za-z]:)?[\/\\\\]/', $path) === 1) {
        return rtrim($normalizedPath, DIRECTORY_SEPARATOR);
    }

    return dirname(__DIR__) . DIRECTORY_SEPARATOR . rtrim($normalizedPath, DIRECTORY_SEPARATOR);
}

function ensureStorageDirectory($storageDir)
{
    if (!is_dir($storageDir) && !@mkdir($storageDir, 0775, true) && !is_dir($storageDir)) {
        respond(['ok' => false, 'message' => 'Не удалось подготовить папку storage для заявок.'], 500);
    }

    if (!is_writable($storageDir)) {
        @chmod($storageDir, 0775);
    }

    if (!is_writable($storageDir)) {
        respond(['ok' => false, 'message' => 'Папка storage недоступна для записи. Проверьте права на хостинге.'], 500);
    }

    ensureStorageProtection($storageDir);
}

function ensureStorageProtection($storageDir)
{
    $htaccess = $storageDir . DIRECTORY_SEPARATOR . '.htaccess';
    $indexFile = $storageDir . DIRECTORY_SEPARATOR . 'index.html';

    if (!is_file($htaccess)) {
        @file_put_contents($htaccess, "Require all denied\nDeny from all\n", LOCK_EX);
    }

    if (!is_file($indexFile)) {
        @file_put_contents($indexFile, '', LOCK_EX);
    }
}

function cleanText($value)
{
    $text = is_scalar($value) ? (string) $value : '';
    $text = trim(str_replace("\0", '', $text));
    $normalized = @preg_replace('/\s+/u', ' ', $text);

    if (!is_string($normalized)) {
        $normalized = preg_replace('/\s+/', ' ', $text);
    }

    return leadSubstr(trim((string) $normalized), 0, 500);
}

function boolValue($value)
{
    if (is_bool($value)) {
        return $value;
    }

    if (is_string($value)) {
        return in_array(leadLower(trim($value)), ['1', 'true', 'yes', 'on'], true);
    }

    if (is_int($value)) {
        return $value === 1;
    }

    return false;
}

function validateLead($lead)
{
    $errors = [];
    $phoneDigits = preg_replace('/\D+/', '', $lead['phone']);
    $phoneDigits = is_string($phoneDigits) ? $phoneDigits : '';

    if (leadLength($lead['name']) < 2) {
        $errors['name'] = 'Укажите имя не короче 2 символов.';
    }

    if ($lead['phone'] === '') {
        $errors['phone'] = 'Укажите номер телефона.';
    } elseif (strlen($phoneDigits) < 10 || strlen($phoneDigits) > 15) {
        $errors['phone'] = 'Проверьте номер: нужно 10-15 цифр.';
    }

    if (!$lead['privacyPolicyAccepted']) {
        $errors['privacyPolicyAccepted'] = 'Подтвердите ознакомление с политикой обработки персональных данных.';
    }

    if (!$lead['personalDataConsent']) {
        $errors['personalDataConsent'] = 'Подтвердите согласие на обработку персональных данных.';
    }

    return $errors;
}

function leadLength($text)
{
    if (function_exists('mb_strlen')) {
        return mb_strlen((string) $text, 'UTF-8');
    }

    return strlen((string) $text);
}

function leadSubstr($text, $start, $length)
{
    if (function_exists('mb_substr')) {
        return mb_substr((string) $text, $start, $length, 'UTF-8');
    }

    return substr((string) $text, $start, $length);
}

function leadLower($text)
{
    if (function_exists('mb_strtolower')) {
        return mb_strtolower((string) $text, 'UTF-8');
    }

    return strtolower((string) $text);
}

function sendTelegramLead($lead, $config)
{
    $botToken = configString($config, 'telegram_bot_token', 'LEAD_TELEGRAM_BOT_TOKEN');
    $chatIds = array_values(array_filter(configList($config, 'telegram_chat_ids', 'LEAD_TELEGRAM_CHAT_IDS'), function ($chatId) {
        return !isPlaceholderConfigValue($chatId);
    }));

    if ($botToken === '' && $chatIds === [] && !isTelegramRequired($config)) {
        return [];
    }

    $configErrors = validateTelegramConfig($botToken, $chatIds);

    if ($configErrors !== []) {
        return $configErrors;
    }

    $messageThreadId = configString($config, 'telegram_message_thread_id', 'LEAD_TELEGRAM_MESSAGE_THREAD_ID');
    $message = formatTelegramLeadMessage($lead);
    $errors = [];

    foreach ($chatIds as $chatId) {
        $payload = [
            'chat_id' => $chatId,
            'text' => $message,
            'disable_web_page_preview' => true,
        ];

        if ($messageThreadId !== '') {
            $payload['message_thread_id'] = $messageThreadId;
        }

        $error = sendTelegramRequest($botToken, $payload);

        if ($error !== null) {
            $errors[] = 'chat ' . $chatId . ': ' . $error;
        }
    }

    return $errors;
}

function validateTelegramConfig($botToken, $chatIds)
{
    $errors = [];

    if ($botToken === '') {
        $errors[] = 'не задан telegram_bot_token или LEAD_TELEGRAM_BOT_TOKEN';
    } elseif (isPlaceholderConfigValue($botToken) || !isValidTelegramBotToken($botToken)) {
        $errors[] = 'telegram_bot_token имеет неверный формат';
    }

    if ($chatIds === []) {
        $errors[] = 'не задан telegram_chat_ids или LEAD_TELEGRAM_CHAT_IDS';
    }

    return $errors;
}

function isValidTelegramBotToken($botToken)
{
    return preg_match('/^\d+:[A-Za-z0-9_-]{20,}$/', (string) $botToken) === 1;
}

function isPlaceholderConfigValue($value)
{
    $normalized = leadLower(trim((string) $value));

    return in_array($normalized, [
        'bot-token',
        'chat-id',
        'replace-with-chat-id',
        'replace-with-telegram-bot-token',
        'telegram-bot-token',
        'telegram-chat-id',
        'token',
        'your-bot-token',
        'your-chat-id',
    ], true);
}

function formatTelegramLeadMessage($lead)
{
    $utm = trim(($lead['utm_source'] ?? '') . ' / ' . ($lead['utm_medium'] ?? '') . ' / ' . ($lead['utm_campaign'] ?? ''), ' /');

    return implode("\n", [
        'Новая заявка с сайта ДесмосАвто',
        '',
        'Имя: ' . valueOrDash($lead['name'] ?? ''),
        'Телефон: ' . valueOrDash($lead['phone'] ?? ''),
        'Источник формы: ' . valueOrDash($lead['source'] ?? ''),
        'Страница: ' . valueOrDash($lead['pageUrl'] ?? ''),
        'UTM: ' . valueOrDash($utm),
        'Referrer: ' . valueOrDash($lead['referrer'] ?? ''),
        'Политика ПД: ' . (!empty($lead['privacyPolicyAccepted']) ? 'принята' : 'нет'),
        'Согласие ПД: ' . (!empty($lead['personalDataConsent']) ? 'получено' : 'нет'),
        'Дата: ' . valueOrDash($lead['createdAt'] ?? ''),
    ]);
}

function sendTelegramRequest($botToken, $payload)
{
    $url = 'https://api.telegram.org/bot' . $botToken . '/sendMessage';
    $body = http_build_query($payload);

    if (function_exists('curl_init')) {
        $curl = curl_init($url);

        if ($curl === false) {
            return 'curl init failed';
        }

        curl_setopt_array($curl, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
        ]);

        $responseBody = curl_exec($curl);
        $curlError = curl_error($curl);
        $status = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
        curl_close($curl);

        if ($responseBody === false) {
            return $curlError ?: 'request failed';
        }

        return parseTelegramResponse((string) $responseBody, $status);
    }

    if (!function_exists('stream_context_create') || !allowUrlFopenEnabled()) {
        return 'no HTTP client available';
    }

    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => $body,
            'timeout' => 10,
            'ignore_errors' => true,
        ],
    ]);

    $responseBody = @file_get_contents($url, false, $context);
    $status = extractHttpStatus($http_response_header ?? []);

    if ($responseBody === false) {
        return 'request failed';
    }

    return parseTelegramResponse($responseBody, $status);
}

function extractHttpStatus($headers)
{
    foreach ((array) $headers as $header) {
        if (preg_match('/^HTTP\/\S+\s+(\d{3})/', (string) $header, $matches) === 1) {
            return (int) $matches[1];
        }
    }

    return 0;
}

function allowUrlFopenEnabled()
{
    return in_array(strtolower((string) ini_get('allow_url_fopen')), ['1', 'on', 'true', 'yes'], true);
}

function parseTelegramResponse($responseBody, $status)
{
    $response = json_decode((string) $responseBody, true);

    if (is_array($response) && ($response['ok'] ?? false) === true) {
        return null;
    }

    if (is_array($response) && isset($response['description'])) {
        return 'HTTP ' . $status . ': ' . cleanText($response['description']);
    }

    return 'HTTP ' . $status . ': unexpected response';
}

function valueOrDash($value)
{
    $text = cleanText($value);

    return $text !== '' ? $text : '-';
}

function formatNotificationUserMessage($errors)
{
    if (hasTelegramSetupError($errors)) {
        return 'Заявка сохранена, но Telegram ещё не подключён на сервере. Добавьте токен бота и chat id в api/leads.config.php.';
    }

    return 'Заявка сохранена, но Telegram не принял уведомление. Подробности записаны в storage/notification-errors.log.';
}

function hasTelegramSetupError($errors)
{
    foreach ((array) $errors as $error) {
        $normalized = leadLower(cleanText($error));

        if (
            strpos($normalized, 'telegram_bot_token') !== false ||
            strpos($normalized, 'telegram_chat_ids') !== false ||
            strpos($normalized, 'lead_telegram') !== false ||
            strpos($normalized, 'неверный формат') !== false
        ) {
            return true;
        }
    }

    return false;
}

function formatNotificationFailure($errors)
{
    $message = implode('; ', array_map('cleanText', is_array($errors) ? $errors : [$errors]));

    if ($message === '') {
        return 'Проверьте настройки уведомлений на сервере.';
    }

    if (leadLength($message) > 350) {
        return leadSubstr($message, 0, 350) . '...';
    }

    return $message;
}

function logNotificationFailure($storageDir, $channel, $errors)
{
    $logFile = $storageDir . DIRECTORY_SEPARATOR . 'notification-errors.log';
    $line = encodeJson([
        'createdAt' => date(DATE_ATOM),
        'channel' => $channel,
        'errors' => $errors,
    ]) . PHP_EOL;

    @file_put_contents($logFile, $line, FILE_APPEND | LOCK_EX);
}

function jsonFlags()
{
    $flags = JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES;

    if (defined('JSON_INVALID_UTF8_SUBSTITUTE')) {
        $flags |= JSON_INVALID_UTF8_SUBSTITUTE;
    }

    return $flags;
}

function encodeJson($payload)
{
    $json = json_encode($payload, jsonFlags());

    if ($json === false) {
        return '{"ok":false,"message":"Не удалось сформировать JSON-ответ."}';
    }

    return $json;
}

function sendJsonHeader()
{
    if (!headers_sent()) {
        header('Content-Type: application/json; charset=utf-8');
    }
}

function clearOutputBuffers()
{
    while (ob_get_level() > 0) {
        @ob_end_clean();
    }
}

function respond($payload, $status = 200)
{
    clearOutputBuffers();
    sendJsonHeader();
    http_response_code($status);
    echo encodeJson($payload);
    exit;
}
