<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = [
        'name',
        'sort_order',
    ];

    // カテゴリは複数の商品を持つ
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}