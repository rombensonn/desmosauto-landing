<?php

declare(strict_types=1);

require_once __DIR__ . DIRECTORY_SEPARATOR . '_common.php';

if (defined('DESMOSAUTO_PROMO_CODES_LOADED')) {
    return;
}

define('DESMOSAUTO_PROMO_CODES_LOADED', true);

function da_promo_codes_enabled($config)
{
    return da_config_bool($config, 'promo_codes_enabled', 'PROMO_CODES_ENABLED', true);
}

function da_normalize_promo_code($value)
{
    return strtoupper(trim((string) $value));
}

function da_validate_promo_code_format($code)
{
    $code = da_normalize_promo_code($code);

    if ($code === '') {
        return null;
    }

    if (strlen($code) < 3 || strlen($code) > 32) {
        return 'Промокод должен содержать 3-32 символа.';
    }

    if (preg_match('/^[A-Z0-9_-]+$/', $code) !== 1) {
        return 'Промокод может содержать только латинские буквы, цифры, _ или -.';
    }

    return null;
}

function da_get_promo_codes_file($config, $storageDir)
{
    $path = da_config_string($config, 'promo_codes_file', 'PROMO_CODES_FILE', 'promocodes.json');

    return da_resolve_storage_file($storageDir, $path, 'promocodes.json');
}

function da_get_promo_events_file($config, $storageDir)
{
    $path = da_config_string($config, 'promo_events_file', 'PROMO_EVENTS_FILE', 'promo-events.jsonl');

    return da_resolve_storage_file($storageDir, $path, 'promo-events.jsonl');
}

function da_empty_promo_store()
{
    return [
        'version' => 1,
        'updatedAt' => null,
        'codes' => [],
    ];
}

function da_load_promo_store($config, $storageDir)
{
    $file = da_get_promo_codes_file($config, $storageDir);

    if (!is_file($file)) {
        return da_empty_promo_store();
    }

    $raw = @file_get_contents($file);
    $decoded = json_decode(is_string($raw) ? $raw : '', true);

    if (!is_array($decoded)) {
        return da_empty_promo_store();
    }

    if (isset($decoded['codes']) && is_array($decoded['codes'])) {
        $codes = [];

        foreach ($decoded['codes'] as $key => $promo) {
            if (!is_array($promo)) {
                continue;
            }

            $code = da_normalize_promo_code($promo['code'] ?? $key);

            if ($code === '') {
                continue;
            }

            $promo['code'] = $code;
            $codes[$code] = $promo;
        }

        $decoded['codes'] = $codes;
        $decoded['version'] = isset($decoded['version']) ? (int) $decoded['version'] : 1;

        return array_replace(da_empty_promo_store(), $decoded);
    }

    $codes = [];

    foreach ($decoded as $promo) {
        if (!is_array($promo)) {
            continue;
        }

        $code = da_normalize_promo_code($promo['code'] ?? '');

        if ($code === '') {
            continue;
        }

        $promo['code'] = $code;
        $codes[$code] = $promo;
    }

    return [
        'version' => 1,
        'updatedAt' => null,
        'codes' => $codes,
    ];
}

function da_write_promo_store($config, $storageDir, $store)
{
    da_ensure_storage_directory($storageDir);

    $file = da_get_promo_codes_file($config, $storageDir);
    $store['version'] = 1;
    $store['updatedAt'] = date(DATE_ATOM);

    return @file_put_contents($file, da_encode_json($store) . PHP_EOL, LOCK_EX) !== false;
}

function da_log_promo_event($config, $storageDir, $action, $promo, $actor)
{
    $line = da_encode_json([
        'createdAt' => date(DATE_ATOM),
        'action' => da_clean_text($action),
        'code' => da_clean_text($promo['code'] ?? ''),
        'promo' => da_promo_public_snapshot($promo),
        'actor' => $actor,
    ]) . PHP_EOL;

    @file_put_contents(da_get_promo_events_file($config, $storageDir), $line, FILE_APPEND | LOCK_EX);
}

function da_validate_promo_for_lead($input, $config, $storageDir)
{
    $code = da_normalize_promo_code($input);

    if ($code === '') {
        return [
            'code' => '',
            'promo' => null,
            'error' => null,
        ];
    }

    $formatError = da_validate_promo_code_format($code);

    if ($formatError !== null) {
        return [
            'code' => $code,
            'promo' => null,
            'error' => $formatError,
        ];
    }

    if (!da_promo_codes_enabled($config)) {
        return [
            'code' => $code,
            'promo' => null,
            'error' => 'Промокоды сейчас недоступны.',
        ];
    }

    da_ensure_storage_directory($storageDir);

    $store = da_load_promo_store($config, $storageDir);
    $promo = $store['codes'][$code] ?? null;

    if (!is_array($promo) || empty($promo['active']) || da_is_promo_expired($promo)) {
        return [
            'code' => $code,
            'promo' => null,
            'error' => 'Промокод не найден или уже не действует.',
        ];
    }

    return [
        'code' => $code,
        'promo' => da_promo_public_snapshot($promo),
        'error' => null,
    ];
}

function da_promo_public_snapshot($promo)
{
    if (!is_array($promo)) {
        return null;
    }

    return [
        'code' => da_clean_text($promo['code'] ?? ''),
        'title' => da_clean_text($promo['title'] ?? ''),
        'benefit' => da_clean_text($promo['benefit'] ?? ''),
        'expiresAt' => da_clean_text($promo['expiresAt'] ?? ''),
    ];
}

function da_is_promo_expired($promo)
{
    $expiresAt = da_clean_text($promo['expiresAt'] ?? '');

    if ($expiresAt === '' || $expiresAt === '-') {
        return false;
    }

    if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $expiresAt) !== 1) {
        return true;
    }

    return $expiresAt < date('Y-m-d');
}

function da_upsert_promo_code($config, $code, $title, $benefit, $expiresAt, $actor)
{
    $storageDir = da_get_storage_dir($config);
    da_ensure_storage_directory($storageDir);

    $store = da_load_promo_store($config, $storageDir);
    $now = date(DATE_ATOM);
    $existing = isset($store['codes'][$code]) && is_array($store['codes'][$code]) ? $store['codes'][$code] : [];
    $actorId = da_clean_text($actor['id'] ?? '');

    $promo = [
        'code' => $code,
        'title' => da_clean_text($title),
        'benefit' => da_clean_text($benefit),
        'active' => true,
        'expiresAt' => da_clean_text($expiresAt),
        'createdAt' => da_clean_text($existing['createdAt'] ?? '') ?: $now,
        'updatedAt' => $now,
        'createdBy' => da_clean_text($existing['createdBy'] ?? '') ?: $actorId,
        'updatedBy' => $actorId,
    ];

    $store['codes'][$code] = $promo;

    if (!da_write_promo_store($config, $storageDir, $store)) {
        return null;
    }

    da_log_promo_event($config, $storageDir, 'upsert', $promo, $actor);

    return $promo;
}

function da_disable_promo_code($config, $code, $actor)
{
    $storageDir = da_get_storage_dir($config);
    da_ensure_storage_directory($storageDir);

    $store = da_load_promo_store($config, $storageDir);

    if (!isset($store['codes'][$code]) || !is_array($store['codes'][$code])) {
        return [
            'ok' => false,
            'promo' => null,
            'error' => 'Промокод не найден.',
        ];
    }

    $promo = $store['codes'][$code];
    $now = date(DATE_ATOM);

    $promo['active'] = false;
    $promo['updatedAt'] = $now;
    $promo['removedAt'] = $now;
    $promo['updatedBy'] = da_clean_text($actor['id'] ?? '');
    $store['codes'][$code] = $promo;

    if (!da_write_promo_store($config, $storageDir, $store)) {
        return [
            'ok' => false,
            'promo' => null,
            'error' => 'Не удалось сохранить промокод.',
        ];
    }

    da_log_promo_event($config, $storageDir, 'remove', $promo, $actor);

    return [
        'ok' => true,
        'promo' => $promo,
        'error' => null,
    ];
}

function da_find_promo_code($config, $code)
{
    $storageDir = da_get_storage_dir($config);
    da_ensure_storage_directory($storageDir);

    $store = da_load_promo_store($config, $storageDir);

    return isset($store['codes'][$code]) && is_array($store['codes'][$code]) ? $store['codes'][$code] : null;
}

function da_active_promo_codes($config)
{
    $storageDir = da_get_storage_dir($config);
    da_ensure_storage_directory($storageDir);

    $store = da_load_promo_store($config, $storageDir);
    $codes = [];

    foreach ($store['codes'] as $promo) {
        if (!is_array($promo) || empty($promo['active']) || da_is_promo_expired($promo)) {
            continue;
        }

        $codes[] = $promo;
    }

    usort($codes, function ($a, $b) {
        return strcmp((string) ($a['code'] ?? ''), (string) ($b['code'] ?? ''));
    });

    return $codes;
}
