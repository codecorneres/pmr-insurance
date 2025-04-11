<?php

namespace App\Policies;

use App\Models\Application;
use App\Models\User;

class ApplicationPolicy
{
    public function update(User $user, Application $application): bool
    {
        return (
            ($user->isUser() && $application->status === 'Needs Update' && $application->user_id === $user->id)
            || $user->isAdmin()
            || ($user->isReviewer() && $application->status === 'Under Review')
        );
    }

    public function comment(User $user): bool
    {
        return $user->isReviewer() || $user->isAdmin();
    }
}
