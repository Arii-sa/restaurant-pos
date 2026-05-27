<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email'    => ['required', 'email'],
            'password' => ['required', 'string', 'min:6'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.required'    => 'メールアドレスは必須です',
            'email.email'       => '正しいメールアドレスを入力してください',
            'password.required' => 'パスワードは必須です',
            'password.min'      => 'パスワードは6文字以上で入力してください',
        ];
    }
}

