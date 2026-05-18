<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'order_type',
        'table_number',
        'customer_name',
        'customer_phone',
        'payment_method',
        'status',
        'total_amount',
        'ordered_at',
    ];

    protected $casts = [
        'ordered_at' => 'datetime',
    ];

    // 注文はユーザー（店員）に属する
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // 注文は複数の注文明細を持つ
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}