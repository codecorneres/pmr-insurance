<?php

use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\QuestionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('applications', ApplicationController::class);
    Route::post('/applications/{application}/comments', [CommentController::class, 'store'])->name('comments.store');
    //Only admin can access
    Route::middleware(['admin'])->group(function () {
        Route::resource('questions', QuestionController::class);
        Route::resource('users', RegisteredUserController::class);
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
