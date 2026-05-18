<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'price',
        'is_available',
        'image_url',
        'is_customizable',
    ];

    protected $casts = [
        'is_available'   => 'boolean',
        'is_customizable' => 'boolean',
    ];

    // 商品はカテゴリに属する
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    // 商品は複数のオプショングループを持つ
    public function optionGroups(): HasMany
    {
        return $this->hasMany(OptionGroup::class);
    }
}