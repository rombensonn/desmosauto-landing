<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = array_filter(array_map('trim', explode(',', getenv('LEAD_ALLOWED_ORIGINS') ?: '')));

if ($origin !== '' && in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}

header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['ok' => false, 'message' => 'Метод не поддерживается.'], 405);
}

$rawBody = file_get_contents('php://input') ?: '';
$data = json_decode($rawBody, true);

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
    'ipHash' => hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . (getenv('LEAD_SALT') ?: 'desmosauto')),
];

if ($lead['website'] !== '') {
    respond(['ok' => true]);
}

$errors = validateLead($lead);

if ($errors !== []) {
    respond(['ok' => false, 'errors' => $errors], 400);
}

$storageDir = dirname(__DIR__) . '/storage';
$storageFile = $storageDir . '/leads.jsonl';

if (!is_dir($storageDir) && !mkdir($storageDir, 0750, true) && !is_dir($storageDir)) {
    respond(['ok' => false, 'message' => 'Не удалось подготовить хранение заявки.'], 500);
}

$line = json_encode($lead, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . PHP_EOL;

if (file_put_contents($storageFile, $line, FILE_APPEND | LOCK_EX) === false) {
    respond(['ok' => false, 'message' => 'Не удалось сохранить заявку.'], 500);
}

$mailTo = getenv('LEAD_MAIL_TO') ?: '';

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

respond([
    'ok' => true,
    'message' => 'Заявка отправлена. Мы свяжемся с вами и уточним, какой сайт нужен вашему автосервису.'
]);

function cleanText(mixed $value): string
{
    $text = is_scalar($value) ? (string) $value : '';
    $text = trim($text);
    $text = preg_replace('/\s+/u', ' ', $text) ?: '';

    return mb_substr($text, 0, 500);
}

function boolValue(mixed $value): bool
{
    if (is_bool($value)) {
        return $value;
    }

    if (is_string($value)) {
        return in_array(mb_strtolower(trim($value)), ['1', 'true', 'yes', 'on'], true);
    }

    if (is_int($value)) {
        return $value === 1;
    }

    return false;
}

/**
 * @param array<string, mixed> $lead
 * @return array<string, string>
 */
function validateLead(array $lead): array
{
    $errors = [];
    $phoneDigits = preg_replace('/\D+/', '', $lead['phone']) ?: '';

    if (mb_strlen($lead['name']) < 2) {
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

/**
 * @param array<string, mixed> $payload
 */
function respond(array $payload, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
