<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OptionGroup extends Model
{
    protected $fillable = [
        'product_id',
        'name',
        'type',
        'required',
    ];

    protected $casts = [
        'required' => 'boolean',
    ];

    // オプショングループは商品に属する
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    // オプショングループは複数のオプション項目を持つ
    public function optionItems(): HasMany
    {
        return $this->hasMany(OptionItem::class);
    }
}

