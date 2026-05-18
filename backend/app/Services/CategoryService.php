<?php

namespace App\Services;

use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;

class CategoryService
{
    // カテゴリ一覧をソート順で取得
    public function getAll(): Collection
    {
        return Category::orderBy('sort_order')->get();
    }

    // カテゴリ作成
    public function create(array $data): Category
    {
        return Category::create($data);
    }

    // カテゴリ更新
    public function update(Category $category, array $data): Category
    {
        $category->update($data);
        return $category;
    }

    // カテゴリ削除
    public function delete(Category $category): void
    {
        $category->delete();
    }
}
