<?php

it('reports the API and database as healthy', function () {
    $this->getJson('/api/v1/health')
        ->assertOk()
        ->assertExactJson([
            'status' => 'ok',
            'database' => 'ok',
        ]);
});
