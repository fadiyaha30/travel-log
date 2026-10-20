<?php

use App\Models\User;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;

uses(RefreshDatabase::class);

it('sends a verification email after registering', function () {
    Notification::fake();

    $this->postJson('/api/auth/register', [
        'name' => 'Faya',
        'email' => 'faya@example.com',
        'password' => 'password-123',
        'password_confirmation' => 'password-123',
    ])->assertCreated();

    $user = User::where('email', 'faya@example.com')->first();

    expect($user->hasVerifiedEmail())->toBeFalse();
    Notification::assertSentTo($user, VerifyEmail::class);
});
