<?php

namespace App\Events;

use App\Models\Comment;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CommentUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Comment $comment;

    /**
     * Create a new event instance.
     */
    public function __construct(Comment $comment)
    {
        $this->comment = $comment->load('user'); // eager load to avoid N+1
    }

    /**
     * The name of the channel the event should broadcast on.
     *
     * For better scoping, consider using: comments.{$comment->application_id}
     */
    public function broadcastOn(): Channel
    {
        return new Channel('comment-updated'); // public channel — fine for now
    }

    /**
     * The name of the event, so JS listens to `.comment.created`
     */
    public function broadcastAs(): string
    {
        return 'comment.updated';
    }

    /**
     * The data sent with the event.
     */
    public function broadcastWith(): array
    {
        return [
            'comment' => $this->comment,
        ];
    }
}
