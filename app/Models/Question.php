<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = [
        'label',
        'key',
        'type',
        'options',
        'order',
        'is_required'
    ];

    protected $casts = [
        'options' => 'array',
    ];

    public function answers()
    {
        return $this->hasMany(ApplicationAnswer::class);
    }
}
