<?php

return [
    // Domains allowed to submit to this endpoint when the browser makes a cross-origin request.
    'allowed_origins' => [
        'https://desmosauto.ru',
        'https://www.desmosauto.ru',
    ],

    // Relative paths are resolved from the deployed site root.
    'storage_dir' => 'storage',

    // Replace before production upload if you want stable, private IP hashes.
    'salt' => 'replace-with-random-private-salt',

    // Keep true for production: the form returns an error if Telegram is missing or fails.
    // Set false only if you intentionally want to save leads to storage without Telegram.
    'telegram_required' => true,

    // Notifications.
    'mail_to' => '',
    'telegram_bot_token' => '',
    'telegram_chat_ids' => [],
    'telegram_message_thread_id' => '',
];
