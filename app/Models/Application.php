<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    protected $fillable = ['name', 'email', 'status', 'user_id'];

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function answers()
    {
        return $this->hasMany(ApplicationAnswer::class);
    }
}
