<?php

namespace App\Http\Controllers;

use App\Events\CommentAdded;
use App\Events\CommentUpdated;
use App\Models\Application;
use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request, $applicationId)
    {
        $request->validate([
            'body' => 'required|string|max:1000',
        ], [
            'body.required' => 'The comment field is required.',
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

        broadcast(new CommentAdded($comment))->toOthers();;
        return back()->with('success', 'Comment added.');
    }

    public function update(Request $request, Application $application, Comment $comment)
    {
        $validated = $request->validate([
            'body' => 'required|string|max:2000',
        ]);

        $comment->update(['body' => $validated['body']]);

        broadcast(new CommentUpdated($comment))->toOthers();;

        return back()->with('success', 'Comment updated.');
    }
    public function destroy(Comment $comment)
    {
        $comment->delete();
        return back()->with('success', 'Comment deleted.');
    }
}
