<?php

declare(strict_types=1);

require_once __DIR__ . DIRECTORY_SEPARATOR . '_common.php';
require_once __DIR__ . DIRECTORY_SEPARATOR . '_promo-codes.php';

da_boot_json_api('Внутренняя ошибка обработчика заявки.');

$config = da_load_config();
da_send_cors_headers($config);

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($method !== 'POST') {
    da_respond(['ok' => false, 'message' => 'Метод не поддерживается.'], 405);
}

$rawBody = @file_get_contents('php://input');
$data = json_decode(is_string($rawBody) ? $rawBody : '', true);

if (!is_array($data)) {
    da_respond(['ok' => false, 'message' => 'Некорректный формат заявки.'], 400);
}

$lead = [
    'name' => da_clean_text($data['name'] ?? ''),
    'phone' => da_clean_text($data['phone'] ?? ''),
    'promoCode' => da_clean_text($data['promoCode'] ?? ''),
    'promo' => null,
    'website' => da_clean_text($data['website'] ?? ''),
    'privacyPolicyAccepted' => da_bool_value($data['privacyPolicyAccepted'] ?? false),
    'personalDataConsent' => da_bool_value($data['personalDataConsent'] ?? false),
    'consentVersion' => '2026-07-06',
    'pageUrl' => da_clean_text($data['pageUrl'] ?? ''),
    'source' => da_clean_text($data['source'] ?? ''),
    'utm_source' => da_clean_text($data['utm_source'] ?? ''),
    'utm_medium' => da_clean_text($data['utm_medium'] ?? ''),
    'utm_campaign' => da_clean_text($data['utm_campaign'] ?? ''),
    'referrer' => da_clean_text($data['referrer'] ?? ''),
    'createdAt' => date(DATE_ATOM),
    'ipHash' => hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . da_config_string($config, 'salt', 'LEAD_SALT', 'desmosauto')),
];

if ($lead['website'] !== '') {
    da_respond(['ok' => true]);
}

$errors = validateLead($lead);

if ($errors !== []) {
    da_respond(['ok' => false, 'errors' => $errors], 400);
}

$storageDir = da_get_storage_dir($config);
$promoValidation = da_validate_promo_for_lead($lead['promoCode'], $config, $storageDir);

if ($promoValidation['error'] !== null) {
    da_respond([
        'ok' => false,
        'errors' => [
            'promoCode' => $promoValidation['error'],
        ],
    ], 400);
}

$lead['promoCode'] = $promoValidation['code'];
$lead['promo'] = $promoValidation['promo'];

da_ensure_storage_directory($storageDir);

$storageFile = $storageDir . DIRECTORY_SEPARATOR . 'leads.jsonl';
$line = da_encode_json($lead) . PHP_EOL;

if (@file_put_contents($storageFile, $line, FILE_APPEND | LOCK_EX) === false) {
    da_respond(['ok' => false, 'message' => 'Не удалось сохранить заявку. Проверьте права на папку storage.'], 500);
}

$mailTo = da_config_string($config, 'mail_to', 'LEAD_MAIL_TO');

if ($mailTo !== '') {
    @mail($mailTo, 'Новая заявка с сайта ДесмосАвто', formatLeadMailMessage($lead), 'Content-Type: text/plain; charset=UTF-8');
}

$telegramErrors = da_send_telegram_to_configured_chats(formatTelegramLeadMessage($lead), $config);

if ($telegramErrors !== []) {
    da_log_notification_failure($storageDir, 'telegram', $telegramErrors);

    if (da_is_telegram_required($config)) {
        da_respond([
            'ok' => false,
            'message' => da_format_notification_user_message($telegramErrors),
        ], 502);
    }
}

da_respond([
    'ok' => true,
    'message' => 'Заявка отправлена. Мы свяжемся с вами и уточним, какой сайт нужен вашему автосервису.',
]);

function validateLead($lead)
{
    $errors = [];
    $phoneDigits = preg_replace('/\D+/', '', $lead['phone']);
    $phoneDigits = is_string($phoneDigits) ? $phoneDigits : '';

    if (da_length($lead['name']) < 2) {
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

function formatLeadMailMessage($lead)
{
    $lines = [
        'Новая заявка с сайта ДесмосАвто:',
        'Имя: ' . $lead['name'],
        'Телефон: ' . $lead['phone'],
    ];

    if (!empty($lead['promo']) && is_array($lead['promo'])) {
        $lines[] = 'Промокод: ' . formatPromoForMessage($lead['promo']);
    }

    return implode("\n", array_merge($lines, [
        'Политика ПД: ' . ($lead['privacyPolicyAccepted'] ? 'принята' : 'нет'),
        'Согласие ПД: ' . ($lead['personalDataConsent'] ? 'получено' : 'нет'),
        'Страница: ' . ($lead['pageUrl'] ?: 'не указана'),
        'Источник: ' . ($lead['source'] ?: 'не указан'),
        'UTM: ' . trim($lead['utm_source'] . ' / ' . $lead['utm_medium'] . ' / ' . $lead['utm_campaign'], ' /'),
        'Referrer: ' . ($lead['referrer'] ?: 'нет'),
        'Дата: ' . $lead['createdAt'],
    ]));
}

function formatTelegramLeadMessage($lead)
{
    $utm = trim(($lead['utm_source'] ?? '') . ' / ' . ($lead['utm_medium'] ?? '') . ' / ' . ($lead['utm_campaign'] ?? ''), ' /');
    $lines = [
        'Новая заявка с сайта ДесмосАвто',
        '',
        'Имя: ' . da_value_or_dash($lead['name'] ?? ''),
        'Телефон: ' . da_value_or_dash($lead['phone'] ?? ''),
    ];

    if (!empty($lead['promo']) && is_array($lead['promo'])) {
        $lines[] = 'Промокод: ' . formatPromoForMessage($lead['promo']);
    }

    return implode("\n", array_merge($lines, [
        'Источник формы: ' . da_value_or_dash($lead['source'] ?? ''),
        'Страница: ' . da_value_or_dash($lead['pageUrl'] ?? ''),
        'UTM: ' . da_value_or_dash($utm),
        'Referrer: ' . da_value_or_dash($lead['referrer'] ?? ''),
        'Политика ПД: ' . (!empty($lead['privacyPolicyAccepted']) ? 'принята' : 'нет'),
        'Согласие ПД: ' . (!empty($lead['personalDataConsent']) ? 'получено' : 'нет'),
        'Дата: ' . da_value_or_dash($lead['createdAt'] ?? ''),
    ]));
}

function formatPromoForMessage($promo)
{
    $parts = [
        da_value_or_dash($promo['code'] ?? ''),
        da_value_or_dash($promo['title'] ?? ''),
        da_value_or_dash($promo['benefit'] ?? ''),
    ];
    $expiresAt = da_clean_text($promo['expiresAt'] ?? '');

    if ($expiresAt !== '') {
        $parts[] = 'до ' . $expiresAt;
    }

    return implode(' — ', $parts);
}
