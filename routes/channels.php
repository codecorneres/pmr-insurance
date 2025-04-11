<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;

Broadcast::channel('application.{applicationId}', function ($user, $applicationId) {
    Log::info('Broadcasting auth attempt', [
        'user_id' => $user->id ?? null,
        'application_id' => $applicationId,
    ]);
    return true;
});
