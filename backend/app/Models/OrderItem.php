<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'product_id',
        'quantity',
        'unit_price',
        'subtotal',
    ];

    // 注文明細は注文に属する
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    // 注文明細は商品に属する
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    // 注文明細は複数のカスタム内容を持つ
    public function orderItemOptions(): HasMany
    {
        return $this->hasMany(OrderItemOption::class);
    }
}