<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('registers a new user', function () {
    $this->postJson('/api/auth/register', [
        'name' => 'Faya',
        'email' => 'faya@example.com',
        'password' => 'password-123',
        'password_confirmation' => 'password-123',
    ])->assertCreated();

    expect(User::where('email', 'faya@example.com')->exists())->toBeTrue();
});

it('logs in with the correct password', function () {
    $user = User::factory()->create(['password' => 'password-123']);

    $this->postJson('/api/auth/login', [
        'email' => $user->email,
        'password' => 'password-123',
    ])->assertOk();

    $this->assertAuthenticatedAs($user);
});

it('rejects a wrong password', function () {
    $user = User::factory()->create();

    $this->postJson('/api/auth/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ])->assertUnprocessable();

    $this->assertGuest();
});

it('returns the logged-in user from /me', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->getJson('/api/v1/me')
        ->assertOk()
        ->assertJsonPath('email', $user->email);
});

it('blocks /me for guests', function () {
    $this->getJson('/api/v1/me')->assertUnauthorized();
});

it('logs out', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/auth/logout')
        ->assertNoContent();

    $this->assertGuest('web');
});
