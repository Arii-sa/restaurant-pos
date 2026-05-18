<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;

class ProductService
{
    // 商品一覧をカテゴリ・オプション込みで取得
    public function getAll(): Collection
    {
        return Product::with(['category', 'optionGroups.optionItems'])
            ->orderBy('category_id')
            ->get();
    }

    // 商品作成
    public function create(array $data): Product
    {
        return Product::create($data);
    }

    // 商品更新
    public function update(Product $product, array $data): Product
    {
        $product->update($data);
        return $product->load(['category', 'optionGroups.optionItems']);
    }

    // 在庫状態の切り替え
    public function updateAvailability(Product $product, bool $isAvailable): Product
    {
        $product->update(['is_available' => $isAvailable]);
        return $product;
    }

    // 商品削除
    public function delete(Product $product): void
    {
        $product->delete();
    }
}
