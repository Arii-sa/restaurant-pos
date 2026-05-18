<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'バーガー',     'sort_order' => 1],
            ['name' => 'サイドメニュー', 'sort_order' => 2],
            ['name' => 'ドリンク',     'sort_order' => 3],
            ['name' => 'デザート',     'sort_order' => 4],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
