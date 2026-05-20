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
        User::create([
            'name'     => '管理者',
            'email'    => 'admin@restaurant.com',
            'password' => Hash::make('password'),
        ]);

        // 店員
        User::create([
            'name'     => '店員A',
            'email'    => 'staff@restaurant.com',
            'password' => Hash::make('password'),
        ]);
    }
}
