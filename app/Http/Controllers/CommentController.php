<?php

namespace App\Http\Controllers;

use App\Models\Application;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request, $applicationId)
    {
        $request->validate([
            'body' => 'required|string|max:1000',
        ]);

        $application = Application::findOrFail($applicationId);
        $user = $request->user();

        if (!in_array($user->role, ['admin', 'reviewer'])) {
            abort(403, 'Unauthorized to comment.');
        }

        $comment = $application->comments()->create([
            'user_id' => $user->id,
            'body' => $request->body,
        ]);

        return back()->with('success', 'Comment added.');
    }
}
