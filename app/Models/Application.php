<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    protected $fillable = ['name', 'email', 'status', 'user_id', 'assigned_user_id'];

    public function comments()
    {
        return $this->hasMany(Comment::class)->with('user')->latest();
    }

    public function answers()
    {
        return $this->hasMany(ApplicationAnswer::class);
    }
}
