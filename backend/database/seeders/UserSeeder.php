<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 管理者
        User::updateOrCreate(
            ['email' => 'admin@restaurant.com'],
            [
                'name'     => '管理者',
                'password' => Hash::make('password'),
                'role'     => 'admin',
            ]
        );

        // 店員
        User::updateOrCreate(
            ['email' => 'staff@restaurant.com'],
            [
                'name'     => '店員A',
                'password' => Hash::make('password'),
                'role'     => 'staff',
            ]
        );
    }
}
