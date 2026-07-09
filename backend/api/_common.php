<?php

declare(strict_types=1);

if (defined('DESMOSAUTO_API_COMMON_LOADED')) {
    return;
}

define('DESMOSAUTO_API_COMMON_LOADED', true);

function da_boot_json_api($safeErrorMessage)
{
    ini_set('display_errors', '0');
    ob_start();

    da_send_json_header();

    set_exception_handler(function ($exception) use ($safeErrorMessage) {
        da_respond([
            'ok' => false,
            'message' => da_clean_text($safeErrorMessage) ?: 'Внутренняя ошибка API.',
        ], 500);
    });

    register_shutdown_function(function () use ($safeErrorMessage) {
        $error = error_get_last();
        $fatalTypes = [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR];

        if ($error === null || !in_array($error['type'], $fatalTypes, true)) {
            return;
        }

        da_clear_output_buffers();
        da_send_json_header();
        http_response_code(500);
        echo da_encode_json([
            'ok' => false,
            'message' => da_clean_text($safeErrorMessage) ?: 'Внутренняя ошибка API.',
        ]);
    });
}

function da_load_config()
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

function da_config_string($config, $key, $envName, $default = '')
{
    $value = null;

    if (array_key_exists($key, $config) && !da_is_blank_config_value($config[$key])) {
        $value = $config[$key];
    } else {
        $envValue = getenv($envName);

        if ($envValue !== false && trim((string) $envValue) !== '') {
            $value = $envValue;
        }
    }

    if (is_array($value)) {
        $value = implode(',', array_map('da_trim_scalar', $value));
    }

    if ($value === null || $value === false) {
        return $default;
    }

    $value = trim((string) $value);

    return $value !== '' ? $value : $default;
}

function da_config_list($config, $key, $envName)
{
    if (array_key_exists($key, $config) && !da_is_blank_config_value($config[$key])) {
        $value = $config[$key];
    } else {
        $value = getenv($envName);
    }

    if (is_array($value)) {
        $items = $value;
    } else {
        $items = explode(',', (string) ($value === false ? '' : $value));
    }

    $items = array_map('da_trim_scalar', $items);

    return array_values(array_filter($items, function ($item) {
        return $item !== '';
    }));
}

function da_config_bool($config, $key, $envName, $default = false)
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

    $normalized = da_lower(trim((string) $value));

    if (in_array($normalized, ['1', 'true', 'yes', 'y', 'on', 'да'], true)) {
        return true;
    }

    if (in_array($normalized, ['0', 'false', 'no', 'n', 'off', 'нет'], true)) {
        return false;
    }

    return $default;
}

function da_is_telegram_required($config)
{
    return da_config_bool($config, 'telegram_required', 'LEAD_TELEGRAM_REQUIRED', true);
}

function da_is_blank_config_value($value)
{
    if ($value === null || $value === false) {
        return true;
    }

    if (is_array($value)) {
        return count($value) === 0;
    }

    return trim((string) $value) === '';
}

function da_trim_scalar($value)
{
    return trim(is_scalar($value) ? (string) $value : '');
}

function da_send_cors_headers($config)
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $normalizedOrigin = da_normalize_origin($origin);
    $allowedOrigins = da_get_allowed_origins($config);

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

function da_get_allowed_origins($config)
{
    $origins = array_merge(da_config_list($config, 'allowed_origins', 'LEAD_ALLOWED_ORIGINS'), da_default_allowed_origins());
    $normalized = [];

    foreach ($origins as $origin) {
        $normalizedOrigin = da_normalize_origin($origin);

        if ($normalizedOrigin !== '') {
            $normalized[] = $normalizedOrigin;
        }
    }

    return array_values(array_unique($normalized));
}

function da_default_allowed_origins()
{
    $origins = [
        'https://desmosauto.ru',
        'https://www.desmosauto.ru',
    ];

    $host = strtolower(trim((string) ($_SERVER['HTTP_HOST'] ?? '')));

    if ($host === '') {
        return $origins;
    }

    $scheme = da_is_https_request() ? 'https' : 'http';
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

function da_normalize_origin($origin)
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

function da_is_https_request()
{
    $https = strtolower((string) ($_SERVER['HTTPS'] ?? ''));
    $forwardedProto = strtolower((string) ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? ''));

    return ($https !== '' && $https !== 'off') || $forwardedProto === 'https';
}

function da_get_storage_dir($config)
{
    $configuredDir = da_config_string($config, 'storage_dir', 'LEAD_STORAGE_DIR', 'storage');

    return da_resolve_storage_path($configuredDir);
}

function da_resolve_storage_path($path)
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

function da_resolve_storage_file($storageDir, $path, $defaultFileName)
{
    $path = trim((string) $path);

    if ($path === '') {
        $path = $defaultFileName;
    }

    $normalizedPath = str_replace(['/', '\\'], DIRECTORY_SEPARATOR, $path);

    if (preg_match('/^(?:[A-Za-z]:)?[\/\\\\]/', $path) === 1) {
        return rtrim($normalizedPath, DIRECTORY_SEPARATOR);
    }

    if (strpos($path, '/') !== false || strpos($path, '\\') !== false) {
        return da_resolve_storage_path($path);
    }

    return rtrim($storageDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $normalizedPath;
}

function da_ensure_storage_directory($storageDir)
{
    if (!is_dir($storageDir) && !@mkdir($storageDir, 0775, true) && !is_dir($storageDir)) {
        da_respond(['ok' => false, 'message' => 'Не удалось подготовить папку storage для заявок.'], 500);
    }

    if (!is_writable($storageDir)) {
        @chmod($storageDir, 0775);
    }

    if (!is_writable($storageDir)) {
        da_respond(['ok' => false, 'message' => 'Папка storage недоступна для записи. Проверьте права на хостинге.'], 500);
    }

    da_ensure_storage_protection($storageDir);
}

function da_ensure_storage_protection($storageDir)
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

function da_clean_text($value)
{
    $text = is_scalar($value) ? (string) $value : '';
    $text = trim(str_replace("\0", '', $text));
    $normalized = @preg_replace('/\s+/u', ' ', $text);

    if (!is_string($normalized)) {
        $normalized = preg_replace('/\s+/', ' ', $text);
    }

    return da_substr(trim((string) $normalized), 0, 500);
}

function da_bool_value($value)
{
    if (is_bool($value)) {
        return $value;
    }

    if (is_string($value)) {
        return in_array(da_lower(trim($value)), ['1', 'true', 'yes', 'on'], true);
    }

    if (is_int($value)) {
        return $value === 1;
    }

    return false;
}

function da_length($text)
{
    if (function_exists('mb_strlen')) {
        return mb_strlen((string) $text, 'UTF-8');
    }

    return strlen((string) $text);
}

function da_substr($text, $start, $length)
{
    if (function_exists('mb_substr')) {
        return mb_substr((string) $text, $start, $length, 'UTF-8');
    }

    return substr((string) $text, $start, $length);
}

function da_lower($text)
{
    if (function_exists('mb_strtolower')) {
        return mb_strtolower((string) $text, 'UTF-8');
    }

    return strtolower((string) $text);
}

function da_get_configured_telegram_chat_ids($config)
{
    return array_values(array_filter(da_config_list($config, 'telegram_chat_ids', 'LEAD_TELEGRAM_CHAT_IDS'), function ($chatId) {
        return !da_is_placeholder_config_value($chatId);
    }));
}

function da_send_telegram_to_configured_chats($message, $config)
{
    $botToken = da_config_string($config, 'telegram_bot_token', 'LEAD_TELEGRAM_BOT_TOKEN');
    $chatIds = da_get_configured_telegram_chat_ids($config);

    if ($botToken === '' && $chatIds === [] && !da_is_telegram_required($config)) {
        return [];
    }

    $configErrors = da_validate_telegram_config($botToken, $chatIds);

    if ($configErrors !== []) {
        return $configErrors;
    }

    $messageThreadId = da_config_string($config, 'telegram_message_thread_id', 'LEAD_TELEGRAM_MESSAGE_THREAD_ID');
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

        $error = da_send_telegram_bot_request($botToken, 'sendMessage', $payload);

        if ($error !== null) {
            $errors[] = 'chat ' . $chatId . ': ' . $error;
        }
    }

    return $errors;
}

function da_send_telegram_text($botToken, $chatId, $message)
{
    $tokenErrors = da_validate_telegram_bot_token($botToken);

    if ($tokenErrors !== []) {
        return implode('; ', $tokenErrors);
    }

    return da_send_telegram_bot_request($botToken, 'sendMessage', [
        'chat_id' => (string) $chatId,
        'text' => $message,
        'disable_web_page_preview' => true,
    ]);
}

function da_validate_telegram_config($botToken, $chatIds)
{
    $errors = da_validate_telegram_bot_token($botToken);

    if ($chatIds === []) {
        $errors[] = 'не задан telegram_chat_ids или LEAD_TELEGRAM_CHAT_IDS';
    }

    return $errors;
}

function da_validate_telegram_bot_token($botToken)
{
    $errors = [];

    if ($botToken === '') {
        $errors[] = 'не задан telegram_bot_token или LEAD_TELEGRAM_BOT_TOKEN';
    } elseif (da_is_placeholder_config_value($botToken) || !da_is_valid_telegram_bot_token($botToken)) {
        $errors[] = 'telegram_bot_token имеет неверный формат';
    }

    return $errors;
}

function da_is_valid_telegram_bot_token($botToken)
{
    return preg_match('/^\d+:[A-Za-z0-9_-]{20,}$/', (string) $botToken) === 1;
}

function da_is_placeholder_config_value($value)
{
    $normalized = da_lower(trim((string) $value));

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

function da_send_telegram_bot_request($botToken, $method, $payload)
{
    $method = preg_replace('/[^A-Za-z]/', '', (string) $method);

    if (!is_string($method) || $method === '') {
        return 'invalid telegram method';
    }

    $url = 'https://api.telegram.org/bot' . $botToken . '/' . $method;
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

        if ($responseBody === false) {
            return $curlError ?: 'request failed';
        }

        return da_parse_telegram_response((string) $responseBody, $status);
    }

    if (!function_exists('stream_context_create') || !da_allow_url_fopen_enabled()) {
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
    $status = da_extract_http_status($http_response_header ?? []);

    if ($responseBody === false) {
        return 'request failed';
    }

    return da_parse_telegram_response($responseBody, $status);
}

function da_extract_http_status($headers)
{
    foreach ((array) $headers as $header) {
        if (preg_match('/^HTTP\/\S+\s+(\d{3})/', (string) $header, $matches) === 1) {
            return (int) $matches[1];
        }
    }

    return 0;
}

function da_allow_url_fopen_enabled()
{
    return in_array(strtolower((string) ini_get('allow_url_fopen')), ['1', 'on', 'true', 'yes'], true);
}

function da_parse_telegram_response($responseBody, $status)
{
    $response = json_decode((string) $responseBody, true);

    if (is_array($response) && ($response['ok'] ?? false) === true) {
        return null;
    }

    if (is_array($response) && isset($response['description'])) {
        return 'HTTP ' . $status . ': ' . da_clean_text($response['description']);
    }

    return 'HTTP ' . $status . ': unexpected response';
}

function da_value_or_dash($value)
{
    $text = da_clean_text($value);

    return $text !== '' ? $text : '-';
}

function da_format_notification_user_message($errors)
{
    if (da_has_telegram_setup_error($errors)) {
        return 'Заявка сохранена, но Telegram ещё не подключён на сервере. Добавьте токен бота и chat id в api/leads.config.php.';
    }

    return 'Заявка сохранена, но Telegram не принял уведомление. Подробности записаны в storage/notification-errors.log.';
}

function da_has_telegram_setup_error($errors)
{
    foreach ((array) $errors as $error) {
        $normalized = da_lower(da_clean_text($error));

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

function da_format_notification_failure($errors)
{
    $message = implode('; ', array_map('da_clean_text', is_array($errors) ? $errors : [$errors]));

    if ($message === '') {
        return 'Проверьте настройки уведомлений на сервере.';
    }

    if (da_length($message) > 350) {
        return da_substr($message, 0, 350) . '...';
    }

    return $message;
}

function da_log_notification_failure($storageDir, $channel, $errors)
{
    $logFile = $storageDir . DIRECTORY_SEPARATOR . 'notification-errors.log';
    $line = da_encode_json([
        'createdAt' => date(DATE_ATOM),
        'channel' => $channel,
        'errors' => $errors,
    ]) . PHP_EOL;

    @file_put_contents($logFile, $line, FILE_APPEND | LOCK_EX);
}

function da_json_flags()
{
    $flags = JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES;

    if (defined('JSON_INVALID_UTF8_SUBSTITUTE')) {
        $flags |= JSON_INVALID_UTF8_SUBSTITUTE;
    }

    return $flags;
}

function da_encode_json($payload)
{
    $json = json_encode($payload, da_json_flags());

    if ($json === false) {
        return '{"ok":false,"message":"Не удалось сформировать JSON-ответ."}';
    }

    return $json;
}

function da_send_json_header()
{
    if (!headers_sent()) {
        header('Content-Type: application/json; charset=utf-8');
    }
}

function da_clear_output_buffers()
{
    while (ob_get_level() > 0) {
        @ob_end_clean();
    }
}

function da_respond($payload, $status = 200)
{
    da_clear_output_buffers();
    da_send_json_header();
    http_response_code($status);
    echo da_encode_json($payload);
    exit;
}
