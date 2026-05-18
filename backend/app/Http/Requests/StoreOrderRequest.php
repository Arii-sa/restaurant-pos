<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'order_type'              => ['required', 'in:dine_in,takeout'],
            'table_number'            => ['required_if:order_type,dine_in', 'nullable', 'string'],
            'customer_name'           => ['nullable', 'string', 'max:255'],
            'customer_phone'          => ['nullable', 'string', 'max:20'],
            'payment_method'          => ['required', 'in:cash,card,qr'],
            'total_amount'            => ['required', 'integer', 'min:0'],
            'items'                   => ['required', 'array', 'min:1'],
            'items.*.product_id'      => ['required', 'exists:products,id'],
            'items.*.quantity'        => ['required', 'integer', 'min:1'],
            'items.*.unit_price'      => ['required', 'integer', 'min:0'],
            'items.*.subtotal'        => ['required', 'integer', 'min:0'],
            'items.*.options'                       => ['nullable', 'array'],
            'items.*.options.*.option_item_id'      => ['required', 'exists:option_items,id'],
            'items.*.options.*.price_diff'          => ['required', 'integer'],
        ];
    }

    public function messages(): array
    {
        return [
            'order_type.required'         => '注文タイプは必須です',
            'table_number.required_if'    => '店内注文の場合テーブル番号は必須です',
            'payment_method.required'     => '支払い方法は必須です',
            'total_amount.required'       => '合計金額は必須です',
            'items.required'              => '注文商品は必須です',
            'items.min'                   => '商品を1つ以上選択してください',
        ];
    }
}
