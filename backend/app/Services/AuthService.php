<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    // ログイン
    public function login(string $email, string $password): array
    {
        $user = User::where('email', $email)->first();

        if (!$user || !Hash::check($password, $user->password)) {
            throw new \Exception('メールアドレスまたはパスワードが正しくありません');
        }

        // 既存トークンを削除して新しいトークンを発行
        $user->tokens()->delete();
        $token = $user->createToken('auth-token')->plainTextToken;

        return [
            'user'  => $user,
            'token' => $token,
        ];
    }

    // ログアウト
    public function logout(User $user): void
    {
        $user->tokens()->delete();
    }
}
