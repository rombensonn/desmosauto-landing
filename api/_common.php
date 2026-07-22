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

function da_boot_request_api($safeErrorMessage)
{
    ini_set('display_errors', '0');
    ob_start();

    set_exception_handler(function ($exception) use ($safeErrorMessage) {
        error_log('[DesmosAuto API] ' . get_class($exception) . ': ' . $exception->getMessage());
        da_respond_request([
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

        da_respond_request([
            'ok' => false,
            'message' => da_clean_text($safeErrorMessage) ?: 'Внутренняя ошибка API.',
        ], 500);
    });
}

function da_load_config()
{
    $config = [];
    $externalConfig = trim((string) (getenv('LEAD_CONFIG_FILE') ?: ''));
    $paths = [
        __DIR__ . DIRECTORY_SEPARATOR . 'leads.config.php',
        da_default_storage_dir() . DIRECTORY_SEPARATOR . 'leads.config.php',
    ];

    if ($externalConfig !== '') {
        $paths[] = $externalConfig;
    }

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

function da_config_int($config, $key, $envName, $default, $minimum, $maximum)
{
    if (array_key_exists($key, $config) && !da_is_blank_config_value($config[$key])) {
        $value = $config[$key];
    } else {
        $envValue = getenv($envName);
        $value = $envValue === false || trim((string) $envValue) === '' ? $default : $envValue;
    }

    if (filter_var($value, FILTER_VALIDATE_INT) === false) {
        return (int) $default;
    }

    return max((int) $minimum, min((int) $maximum, (int) $value));
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
    return da_config_bool($config, 'telegram_required', 'LEAD_TELEGRAM_REQUIRED', false);
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
    header('Access-Control-Allow-Headers: Content-Type, X-Requested-With, Idempotency-Key');
    header('Access-Control-Max-Age: 86400');
}

function da_is_request_origin_allowed($config)
{
    $origin = da_normalize_origin($_SERVER['HTTP_ORIGIN'] ?? '');

    if ($origin === '') {
        return true;
    }

    $allowedOrigins = da_get_allowed_origins($config);

    return in_array('*', $allowedOrigins, true) || in_array($origin, $allowedOrigins, true);
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
    return [
        'https://desmosauto.ru',
        'https://www.desmosauto.ru',
    ];
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
    $configuredDir = da_config_string($config, 'storage_dir', 'LEAD_STORAGE_DIR');

    if ($configuredDir === '') {
        return da_default_storage_dir();
    }

    return da_resolve_storage_path($configuredDir);
}

function da_default_storage_dir()
{
    $projectRoot = dirname(__DIR__);

    return dirname($projectRoot) . DIRECTORY_SEPARATOR . basename($projectRoot) . '-private';
}

function da_resolve_storage_path($path)
{
    $path = trim((string) $path);

    if ($path === '') {
        return da_default_storage_dir();
    }

    $normalizedPath = str_replace(['/', '\\'], DIRECTORY_SEPARATOR, $path);

    if (preg_match('/^(?:[A-Za-z]:)?[\/\\\\]/', $path) === 1) {
        return rtrim($normalizedPath, DIRECTORY_SEPARATOR);
    }

    return da_default_storage_dir() . DIRECTORY_SEPARATOR . rtrim($normalizedPath, DIRECTORY_SEPARATOR);
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
    if (!is_dir($storageDir) && !@mkdir($storageDir, 0770, true) && !is_dir($storageDir)) {
        da_respond(['ok' => false, 'message' => 'Не удалось подготовить папку storage для заявок.'], 500);
    }

    if (!is_writable($storageDir)) {
        @chmod($storageDir, 0770);
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

function da_get_privacy_salt($config)
{
    $salt = da_config_string($config, 'salt', 'LEAD_SALT');

    if (strlen($salt) < 32) {
        throw new RuntimeException('LEAD_SALT must contain at least 32 bytes.');
    }

    return $salt;
}

function da_hash_client_ip($config)
{
    $remoteAddress = trim((string) ($_SERVER['REMOTE_ADDR'] ?? ''));

    return hash_hmac('sha256', $remoteAddress, da_get_privacy_salt($config));
}

function da_check_rate_limit($config, $storageDir, $clientKey)
{
    $window = da_config_int($config, 'rate_limit_window_seconds', 'LEAD_RATE_LIMIT_WINDOW_SECONDS', 600, 60, 86400);
    $maximum = da_config_int($config, 'rate_limit_max_requests', 'LEAD_RATE_LIMIT_MAX_REQUESTS', 8, 1, 100);
    $now = time();
    $cutoff = $now - $window;
    $file = rtrim($storageDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'rate-limits.json';
    $handle = @fopen($file, 'c+b');

    if ($handle === false || !@flock($handle, LOCK_EX)) {
        if (is_resource($handle)) {
            @fclose($handle);
        }

        return ['allowed' => false, 'retryAfter' => 60, 'unavailable' => true];
    }

    $raw = stream_get_contents($handle);
    $state = json_decode(is_string($raw) ? $raw : '', true);
    $state = is_array($state) ? $state : [];

    foreach ($state as $key => $timestamps) {
        if (!is_array($timestamps)) {
            unset($state[$key]);
            continue;
        }

        $timestamps = array_values(array_filter(array_map('intval', $timestamps), function ($timestamp) use ($cutoff) {
            return $timestamp > $cutoff;
        }));

        if ($timestamps === []) {
            unset($state[$key]);
        } else {
            $state[$key] = $timestamps;
        }
    }

    $attempts = $state[$clientKey] ?? [];
    $allowed = count($attempts) < $maximum;
    $retryAfter = 0;

    if ($allowed) {
        $attempts[] = $now;
        $state[$clientKey] = $attempts;
    } else {
        $retryAfter = max(1, ((int) min($attempts) + $window) - $now);
    }

    rewind($handle);
    @ftruncate($handle, 0);
    @fwrite($handle, da_encode_json($state));
    @fflush($handle);
    @flock($handle, LOCK_UN);
    @fclose($handle);
    @chmod($file, 0660);

    return ['allowed' => $allowed, 'retryAfter' => $retryAfter, 'unavailable' => false];
}

function da_build_idempotency_key($lead, $config)
{
    $submissionId = da_clean_text($lead['submissionId'] ?? '');

    if ($submissionId !== '') {
        $material = 'submission|' . da_lower($submissionId);
    } else {
        $parts = [
            da_lower($lead['name'] ?? ''),
            preg_replace('/\D+/', '', (string) ($lead['phone'] ?? '')),
            da_lower($lead['businessType'] ?? ''),
            da_lower($lead['city'] ?? ''),
            da_lower($lead['projectGoal'] ?? ''),
            da_lower($lead['source'] ?? ''),
            $lead['ipHash'] ?? '',
        ];
        $material = 'fingerprint|' . implode('|', $parts);
    }

    return hash_hmac('sha256', $material, da_get_privacy_salt($config));
}

function da_save_lead($lead, $config, $storageDir)
{
    $storageFile = rtrim($storageDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'leads.jsonl';
    $lockFile = rtrim($storageDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'leads.lock';
    $lock = @fopen($lockFile, 'c+b');

    if ($lock === false || !@flock($lock, LOCK_EX)) {
        if (is_resource($lock)) {
            @fclose($lock);
        }

        return ['ok' => false, 'duplicate' => false, 'leadId' => null];
    }

    $window = da_clean_text($lead['submissionId'] ?? '') !== ''
        ? da_config_int($config, 'idempotency_window_seconds', 'LEAD_IDEMPOTENCY_WINDOW_SECONDS', 604800, 300, 2592000)
        : da_config_int($config, 'dedup_window_seconds', 'LEAD_DEDUP_WINDOW_SECONDS', 900, 60, 86400);
    $duplicate = da_find_duplicate_lead($storageFile, $lead['idempotencyKey'] ?? '', time() - $window);

    if (is_array($duplicate)) {
        @flock($lock, LOCK_UN);
        @fclose($lock);

        return [
            'ok' => true,
            'duplicate' => true,
            'leadId' => da_clean_text($duplicate['leadId'] ?? ''),
        ];
    }

    $line = da_encode_json($lead) . PHP_EOL;
    $written = @file_put_contents($storageFile, $line, FILE_APPEND | LOCK_EX) !== false;

    @flock($lock, LOCK_UN);
    @fclose($lock);
    @chmod($lockFile, 0660);

    if ($written) {
        @chmod($storageFile, 0660);
    }

    return [
        'ok' => $written,
        'duplicate' => false,
        'leadId' => $written ? da_clean_text($lead['leadId'] ?? '') : null,
    ];
}

function da_find_duplicate_lead($storageFile, $idempotencyKey, $cutoff)
{
    if ($idempotencyKey === '' || !is_file($storageFile) || !is_readable($storageFile)) {
        return null;
    }

    $handle = @fopen($storageFile, 'rb');

    if ($handle === false) {
        return null;
    }

    $match = null;

    while (($line = fgets($handle)) !== false) {
        $storedLead = json_decode($line, true);

        if (!is_array($storedLead) || !hash_equals((string) ($storedLead['idempotencyKey'] ?? ''), (string) $idempotencyKey)) {
            continue;
        }

        $createdAt = strtotime((string) ($storedLead['createdAt'] ?? ''));

        if ($createdAt !== false && $createdAt >= $cutoff) {
            $match = $storedLead;
        }
    }

    @fclose($handle);

    return $match;
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

function da_request_max_bytes($config)
{
    return da_config_int($config, 'request_max_bytes', 'LEAD_REQUEST_MAX_BYTES', 32768, 1024, 1048576);
}

function da_read_request_data($config)
{
    $maximumBytes = da_request_max_bytes($config);
    $contentLength = filter_var($_SERVER['CONTENT_LENGTH'] ?? null, FILTER_VALIDATE_INT);

    if ($contentLength !== false && $contentLength !== null && $contentLength > $maximumBytes) {
        da_respond_request([
            'ok' => false,
            'message' => 'Размер заявки превышает допустимый лимит.',
        ], 413);
    }

    $rawBody = @file_get_contents('php://input', false, null, 0, $maximumBytes + 1);
    $rawBody = is_string($rawBody) ? $rawBody : '';

    if (strlen($rawBody) > $maximumBytes) {
        da_respond_request([
            'ok' => false,
            'message' => 'Размер заявки превышает допустимый лимит.',
        ], 413);
    }

    $contentType = da_lower(trim((string) ($_SERVER['CONTENT_TYPE'] ?? '')));
    $contentType = trim(explode(';', $contentType, 2)[0]);

    if ($contentType === 'application/json') {
        $data = json_decode($rawBody, true);

        if (!is_array($data)) {
            da_respond_request([
                'ok' => false,
                'message' => 'Некорректный JSON в заявке.',
            ], 400);
        }
    } elseif ($contentType === 'application/x-www-form-urlencoded' || ($contentType === '' && $_POST !== [])) {
        $data = [];

        if ($rawBody !== '') {
            parse_str($rawBody, $data);
        } else {
            $data = $_POST;
        }

        if (!is_array($data)) {
            $data = [];
        }
    } else {
        da_respond_request([
            'ok' => false,
            'message' => 'Поддерживаются JSON и обычная HTML-форма.',
        ], 415);
    }

    if (count($data) > 64) {
        da_respond_request([
            'ok' => false,
            'message' => 'В заявке слишком много полей.',
        ], 400);
    }

    return $data;
}

function da_is_uuid($value)
{
    return preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i', (string) $value) === 1;
}

function da_new_uuid()
{
    try {
        $bytes = random_bytes(16);
    } catch (Throwable $exception) {
        $bytes = hash('sha256', uniqid('', true), true);
    }

    $bytes[6] = chr((ord($bytes[6]) & 0x0f) | 0x40);
    $bytes[8] = chr((ord($bytes[8]) & 0x3f) | 0x80);
    $hex = bin2hex(substr($bytes, 0, 16));

    return substr($hex, 0, 8) . '-' . substr($hex, 8, 4) . '-' . substr($hex, 12, 4) . '-' . substr($hex, 16, 4) . '-' . substr($hex, 20, 12);
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
    $chatIds = da_config_list($config, 'telegram_chat_ids', 'LEAD_TELEGRAM_CHAT_IDS');

    if ($chatIds === []) {
        $chatIds = array_values(array_filter([
            trim((string) (getenv('TELEGRAM_CHAT_ID') ?: '')),
        ]));
    }

    return array_values(array_filter($chatIds, function ($chatId) {
        return !da_is_placeholder_config_value($chatId);
    }));
}

function da_send_telegram_to_configured_chats($message, $config)
{
    $botToken = da_config_string($config, 'telegram_bot_token', 'LEAD_TELEGRAM_BOT_TOKEN');

    if ($botToken === '') {
        $botToken = trim((string) (getenv('TELEGRAM_BOT_TOKEN') ?: ''));
    }
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
        return 'Заявка сохранена, но Telegram ещё не подключён на сервере. Настройте TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID.';
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
        header('Cache-Control: no-store');
        header('X-Content-Type-Options: nosniff');
    }
}

function da_wants_json_response()
{
    $contentType = da_lower((string) ($_SERVER['CONTENT_TYPE'] ?? ''));
    $accept = da_lower((string) ($_SERVER['HTTP_ACCEPT'] ?? ''));
    $requestedWith = da_lower((string) ($_SERVER['HTTP_X_REQUESTED_WITH'] ?? ''));

    return strpos($contentType, 'application/json') !== false
        || strpos($accept, 'application/json') !== false
        || $requestedWith === 'xmlhttprequest';
}

function da_respond_request($payload, $status = 200)
{
    if (da_wants_json_response()) {
        da_respond($payload, $status);
    }

    da_clear_output_buffers();
    http_response_code($status);

    if (!headers_sent()) {
        header('Content-Type: text/html; charset=utf-8');
        header('Cache-Control: no-store');
        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: DENY');
        header('Referrer-Policy: no-referrer');
    }

    $ok = !empty($payload['ok']);
    $title = $ok ? 'Заявка принята' : 'Проверьте заявку';
    $message = da_clean_text($payload['message'] ?? '');

    if ($message === '' && isset($payload['errors']) && is_array($payload['errors'])) {
        $message = implode(' ', array_map('da_clean_text', array_values($payload['errors'])));
    }

    if ($message === '') {
        $message = $ok ? 'Спасибо. Заявка принята.' : 'Исправьте ошибки и отправьте форму ещё раз.';
    }

    $titleEscaped = htmlspecialchars($title, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $messageEscaped = htmlspecialchars($message, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $backLink = $ok ? '' : '<p><a href="/">Вернуться на сайт</a></p>';

    echo '<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
        . '<title>' . $titleEscaped . '</title><style>body{margin:0;background:#111827;color:#f9fafb;font:18px/1.5 system-ui,sans-serif}'
        . 'main{max-width:680px;margin:10vh auto;padding:32px}section{background:#1f2937;border:1px solid #374151;border-radius:18px;padding:32px}'
        . 'h1{margin-top:0;font-size:clamp(28px,5vw,44px)}a{color:#fff;text-underline-offset:4px}</style></head>'
        . '<body><main><section><h1>' . $titleEscaped . '</h1><p>' . $messageEscaped . '</p>' . $backLink . '</section></main></body></html>';
    exit;
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
