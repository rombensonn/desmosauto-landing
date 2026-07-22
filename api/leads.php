<?php

declare(strict_types=1);

require_once __DIR__ . DIRECTORY_SEPARATOR . '_common.php';
require_once __DIR__ . DIRECTORY_SEPARATOR . '_promo-codes.php';

da_boot_request_api('Внутренняя ошибка обработчика заявки.');

$config = da_load_config();
da_send_cors_headers($config);

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($method !== 'POST') {
    da_respond_request(['ok' => false, 'message' => 'Метод не поддерживается.'], 405);
}

if (!da_is_request_origin_allowed($config)) {
    da_respond_request(['ok' => false, 'message' => 'Источник запроса не разрешён.'], 403);
}

$data = da_read_request_data($config);
$honeypot = da_clean_text($data['website'] ?? '');

if ($honeypot !== '') {
    da_respond_request([
        'ok' => true,
        'message' => 'Заявка принята. Мы свяжемся с вами.',
    ], 202);
}

$submissionId = da_clean_text($data['submissionId'] ?? ($_SERVER['HTTP_IDEMPOTENCY_KEY'] ?? ''));
$lead = [
    'leadId' => da_new_uuid(),
    'submissionId' => $submissionId,
    'status' => 'new',
    'formMode' => da_lower(da_clean_text($data['formMode'] ?? 'full')),
    'name' => da_clean_text($data['name'] ?? ''),
    'phone' => da_clean_text($data['phone'] ?? ''),
    'businessType' => da_clean_text($data['businessType'] ?? ''),
    'city' => da_clean_text($data['city'] ?? ''),
    'currentSite' => da_clean_text($data['currentSite'] ?? ''),
    'decisionRole' => da_clean_text($data['decisionRole'] ?? ''),
    'projectGoal' => da_clean_text($data['projectGoal'] ?? ''),
    'preferredContact' => da_lower(da_clean_text($data['preferredContact'] ?? '')),
    'preferredContactTime' => da_clean_text($data['preferredContactTime'] ?? ''),
    'portfolioInterest' => da_bool_value($data['portfolioInterest'] ?? false),
    'decisionDate' => da_clean_text($data['decisionDate'] ?? ''),
    'promoCode' => da_clean_text($data['promoCode'] ?? ''),
    'promo' => null,
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
    'ipHash' => da_hash_client_ip($config),
];

$errors = validateLead($lead);

if ($errors !== []) {
    da_respond_request(['ok' => false, 'errors' => $errors], 400);
}

$storageDir = da_get_storage_dir($config);
da_ensure_storage_directory($storageDir);

$rateLimit = da_check_rate_limit($config, $storageDir, $lead['ipHash']);

if (!$rateLimit['allowed']) {
    if (!headers_sent()) {
        header('Retry-After: ' . (int) $rateLimit['retryAfter']);
    }

    if (!empty($rateLimit['unavailable'])) {
        da_respond_request([
            'ok' => false,
            'message' => 'Сервис временно не может безопасно принять заявку. Повторите отправку позже.',
        ], 503);
    }

    da_respond_request([
        'ok' => false,
        'message' => 'Слишком много попыток. Повторите отправку немного позже.',
    ], 429);
}

$promoValidation = da_validate_promo_for_lead($lead['promoCode'], $config, $storageDir);

if ($promoValidation['error'] !== null) {
    da_respond_request([
        'ok' => false,
        'errors' => ['promoCode' => $promoValidation['error']],
    ], 400);
}

$lead['promoCode'] = $promoValidation['code'];
$lead['promo'] = $promoValidation['promo'];
$lead['idempotencyKey'] = da_build_idempotency_key($lead, $config);

$saveResult = saveLead($lead, $config, $storageDir);

if (!$saveResult['ok']) {
    da_respond_request([
        'ok' => false,
        'message' => 'Не удалось безопасно сохранить заявку. Попробуйте позже.',
    ], 500);
}

if ($saveResult['duplicate']) {
    da_respond_request([
        'ok' => true,
        'duplicate' => true,
        'leadId' => $saveResult['leadId'],
        'message' => 'Заявка уже принята. Повторно отправлять её не нужно.',
    ], 200);
}

deliverLead($lead, $config, $storageDir);

da_respond_request([
    'ok' => true,
    'accepted' => true,
    'leadId' => $lead['leadId'],
    'message' => 'Заявка принята. Мы свяжемся с вами и уточним задачу.',
], 202);

function validateLead($lead)
{
    $errors = [];
    $isCompact = ($lead['formMode'] ?? '') === 'compact';
    $phoneDigits = preg_replace('/\D+/', '', $lead['phone']);
    $phoneDigits = is_string($phoneDigits) ? $phoneDigits : '';

    if (da_length($lead['name']) < 2 || da_length($lead['name']) > 80) {
        $errors['name'] = 'Укажите имя длиной от 2 до 80 символов.';
    }

    if ($lead['phone'] === '') {
        $errors['phone'] = 'Укажите номер телефона.';
    } elseif (strlen($phoneDigits) < 10 || strlen($phoneDigits) > 15) {
        $errors['phone'] = 'Проверьте номер: нужно от 10 до 15 цифр.';
    }

    if (!$isCompact) {
        validateRequiredText($errors, 'businessType', $lead['businessType'], 2, 100, 'Укажите тип бизнеса.');
        validateRequiredText($errors, 'city', $lead['city'], 2, 100, 'Укажите город.');
        validateRequiredText($errors, 'decisionRole', $lead['decisionRole'], 2, 100, 'Укажите вашу роль в принятии решения.');
        validateRequiredText($errors, 'projectGoal', $lead['projectGoal'], 10, 500, 'Опишите задачу минимум в 10 символах.');
    }

    validateOptionalHttpUrl($errors, 'currentSite', $lead['currentSite'], 'Укажите корректный адрес сайта с http:// или https://.');
    validateOptionalHttpUrl($errors, 'pageUrl', $lead['pageUrl'], 'Некорректный адрес страницы отправки.');
    validateOptionalHttpUrl($errors, 'referrer', $lead['referrer'], 'Некорректный адрес страницы-источника.');

    if (da_length($lead['preferredContactTime']) > 100) {
        $errors['preferredContactTime'] = 'Удобное время для связи должно быть не длиннее 100 символов.';
    }

    if (!$isCompact && !in_array($lead['preferredContact'], ['phone', 'whatsapp', 'telegram'], true)) {
        $errors['preferredContact'] = 'Выберите способ связи: телефон, WhatsApp или Telegram.';
    }

    if (!$isCompact && !$lead['portfolioInterest']) {
        $errors['portfolioInterest'] = 'Подтвердите интерес к примерам работ.';
    }

    if ($lead['decisionDate'] !== '' && !isValidDecisionDate($lead['decisionDate'])) {
        $errors['decisionDate'] = 'Укажите корректную дату или дату и время решения.';
    }

    if ($lead['submissionId'] !== '' && !da_is_uuid($lead['submissionId'])) {
        $errors['submissionId'] = 'Некорректный идентификатор отправки.';
    }

    if (!$lead['privacyPolicyAccepted']) {
        $errors['privacyPolicyAccepted'] = 'Подтвердите ознакомление с политикой обработки персональных данных.';
    }

    if (!$lead['personalDataConsent']) {
        $errors['personalDataConsent'] = 'Подтвердите согласие на обработку персональных данных.';
    }

    return $errors;
}

function validateRequiredText(&$errors, $field, $value, $minimum, $maximum, $message)
{
    $length = da_length($value);

    if ($length < $minimum || $length > $maximum) {
        $errors[$field] = $message;
    }
}

function validateOptionalHttpUrl(&$errors, $field, $value, $message)
{
    if ($value === '') {
        return;
    }

    $parts = parse_url((string) $value);
    $scheme = is_array($parts) ? da_lower($parts['scheme'] ?? '') : '';

    if (filter_var($value, FILTER_VALIDATE_URL) === false || !in_array($scheme, ['http', 'https'], true)) {
        $errors[$field] = $message;
    }
}

function isValidDecisionDate($value)
{
    if (preg_match('/^\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}(?::\d{2})?(?:Z|[+-]\d{2}:\d{2})?)?$/', (string) $value) !== 1) {
        return false;
    }

    try {
        new DateTimeImmutable((string) $value);
        $errors = DateTimeImmutable::getLastErrors();

        return $errors === false || ($errors['warning_count'] === 0 && $errors['error_count'] === 0);
    } catch (Throwable $exception) {
        return false;
    }
}

function saveLead($lead, $config, $storageDir)
{
    return da_save_lead($lead, $config, $storageDir);
}

function deliverLead($lead, $config, $storageDir)
{
    $channels = [
        'email' => function () use ($lead, $config) {
            return sendToEmail($lead, $config);
        },
        'telegram' => function () use ($lead, $config) {
            return sendToTelegram($lead, $config);
        },
        'crm' => function () use ($lead, $config) {
            return sendToCrm($lead, $config);
        },
    ];

    foreach ($channels as $channel => $sender) {
        try {
            $channelErrors = $sender();
        } catch (Throwable $exception) {
            $channelErrors = ['Ошибка адаптера: ' . get_class($exception)];
        }

        if ($channelErrors !== []) {
            da_log_notification_failure($storageDir, $channel, $channelErrors);
        }
    }
}

function sendToEmail($lead, $config)
{
    $mailTo = da_config_string($config, 'mail_to', 'LEAD_MAIL_TO');

    if ($mailTo === '') {
        $mailTo = trim((string) (getenv('ADMIN_EMAIL') ?: ''));
    }

    if ($mailTo === '') {
        return [];
    }

    if (filter_var($mailTo, FILTER_VALIDATE_EMAIL) === false) {
        return ['ADMIN_EMAIL имеет неверный формат'];
    }

    $sent = @mail(
        $mailTo,
        'Новая квалифицированная заявка с сайта ДесмосАвто',
        formatLeadMailMessage($lead),
        'Content-Type: text/plain; charset=UTF-8'
    );

    return $sent ? [] : ['mail() не принял сообщение'];
}

function sendToTelegram($lead, $config)
{
    return da_send_telegram_to_configured_chats(formatTelegramLeadMessage($lead), $config);
}

function sendToCrm($lead, $config)
{
    // Extension point: add a project-specific CRM adapter without changing
    // validation, storage or the Telegram/email integrations.
    return [];
}

function formatLeadMailMessage($lead)
{
    return formatLeadMessage($lead);
}

function formatTelegramLeadMessage($lead)
{
    return formatLeadMessage($lead);
}

function formatLeadMessage($lead)
{
    $utm = trim(($lead['utm_source'] ?? '') . ' / ' . ($lead['utm_medium'] ?? '') . ' / ' . ($lead['utm_campaign'] ?? ''), ' /');
    $lines = [
        (($lead['formMode'] ?? '') === 'compact' ? 'Новая заявка' : 'Новая квалифицированная заявка') . ' с сайта ДесмосАвто',
        '',
        'ID заявки: ' . da_value_or_dash($lead['leadId'] ?? ''),
        'Имя: ' . da_value_or_dash($lead['name'] ?? ''),
        'Телефон: ' . da_value_or_dash($lead['phone'] ?? ''),
    ];

    if (($lead['formMode'] ?? '') !== 'compact') {
        $lines = array_merge($lines, [
            'Тип бизнеса: ' . da_value_or_dash($lead['businessType'] ?? ''),
            'Город: ' . da_value_or_dash($lead['city'] ?? ''),
            'Текущий сайт: ' . da_value_or_dash($lead['currentSite'] ?? ''),
            'Роль в решении: ' . da_value_or_dash($lead['decisionRole'] ?? ''),
            'Задача: ' . da_value_or_dash($lead['projectGoal'] ?? ''),
            'Способ связи: ' . da_value_or_dash($lead['preferredContact'] ?? ''),
            'Удобное время: ' . da_value_or_dash($lead['preferredContactTime'] ?? ''),
            'Интерес к примерам: ' . (!empty($lead['portfolioInterest']) ? 'да' : 'нет'),
            'Срок решения: ' . da_value_or_dash($lead['decisionDate'] ?? ''),
        ]);
    }

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
