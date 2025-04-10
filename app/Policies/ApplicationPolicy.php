<?php

namespace App\Policies;

use App\Models\Application;
use App\Models\User;

class ApplicationPolicy
{
    public function update(User $user, Application $application): bool
    {
        return $user->isUser() && $application->status !== 'Approved';
    }

    public function comment(User $user): bool
    {
        return $user->isReviewer() || $user->isAdmin();
    }

    public function approve(User $user): bool
    {
        return $user->isAdmin();
    }
}
