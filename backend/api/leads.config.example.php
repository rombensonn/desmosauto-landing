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

    // Optional notifications. Leave blank to only save leads to storage/leads.jsonl.
    'mail_to' => '',
    'telegram_bot_token' => '',
    'telegram_chat_ids' => [],
    'telegram_message_thread_id' => '',
];
