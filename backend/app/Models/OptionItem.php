<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OptionItem extends Model
{
    protected $fillable = [
        'option_group_id',
        'name',
        'price_diff',
        'is_default',
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];

    // オプション項目はオプショングループに属する
    public function optionGroup(): BelongsTo
    {
        return $this->belongsTo(OptionGroup::class);
    }

    // オプション項目は複数の注文明細オプションを持つ
    public function orderItemOptions(): HasMany
    {
        return $this->hasMany(OrderItemOption::class);
    }
}

