<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItemOption extends Model
{
    protected $fillable = [
        'order_item_id',
        'option_item_id',
        'price_diff',
    ];

    // 注文明細オプションは注文明細に属する
    public function orderItem(): BelongsTo
    {
        return $this->belongsTo(OrderItem::class);
    }

    // 注文明細オプションはオプション項目に属する
    public function optionItem(): BelongsTo
    {
        return $this->belongsTo(OptionItem::class);
    }
}
