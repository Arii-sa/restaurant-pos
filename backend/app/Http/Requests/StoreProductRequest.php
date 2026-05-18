<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id'     => ['required', 'exists:categories,id'],
            'name'            => ['required', 'string', 'max:255'],
            'price'           => ['required', 'integer', 'min:0'],
            'is_available'    => ['nullable', 'boolean'],
            'image_url'       => ['nullable', 'url'],
            'is_customizable' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'category_id.required' => 'カテゴリは必須です',
            'category_id.exists'   => '存在しないカテゴリです',
            'name.required'        => '商品名は必須です',
            'price.required'       => '価格は必須です',
            'price.min'            => '価格は0以上で入力してください',
        ];
    }
}
