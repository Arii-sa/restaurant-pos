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
        'cancel_reason',
        'cancelled_at',
        'total_amount',
        'ordered_at',
    ];

    protected $casts = [
        'ordered_at'   => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function isCancelled(): bool
    {
        return $this->status === 'cancelled';
    }
}
