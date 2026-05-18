<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $burger     = Category::where('name', 'バーガー')->first();
        $side       = Category::where('name', 'サイドメニュー')->first();
        $drink      = Category::where('name', 'ドリンク')->first();
        $dessert    = Category::where('name', 'デザート')->first();

        $products = [
            // バーガー
            [
                'category_id'     => $burger->id,
                'name'            => 'クラシックバーガー',
                'price'           => 800,
                'is_available'    => true,
                'is_customizable' => true,
            ],
            [
                'category_id'     => $burger->id,
                'name'            => 'チーズバーガー',
                'price'           => 950,
                'is_available'    => true,
                'is_customizable' => true,
            ],
            [
                'category_id'     => $burger->id,
                'name'            => 'ダブルバーガー',
                'price'           => 1200,
                'is_available'    => true,
                'is_customizable' => true,
            ],
            [
                'category_id'     => $burger->id,
                'name'            => 'フィッシュバーガー',
                'price'           => 850,
                'is_available'    => true,
                'is_customizable' => true,
            ],
            [
                'category_id'     => $burger->id,
                'name'            => 'チキンバーガー',
                'price'           => 880,
                'is_available'    => true,
                'is_customizable' => true,
            ],

            // サイドメニュー
            [
                'category_id'     => $side->id,
                'name'            => 'フライドポテト（S）',
                'price'           => 280,
                'is_available'    => true,
                'is_customizable' => false,
            ],
            [
                'category_id'     => $side->id,
                'name'            => 'フライドポテト（M）',
                'price'           => 380,
                'is_available'    => true,
                'is_customizable' => false,
            ],
            [
                'category_id'     => $side->id,
                'name'            => 'フライドポテト（L）',
                'price'           => 480,
                'is_available'    => true,
                'is_customizable' => false,
            ],
            [
                'category_id'     => $side->id,
                'name'            => 'チキンナゲット（5個）',
                'price'           => 350,
                'is_available'    => true,
                'is_customizable' => false,
            ],
            [
                'category_id'     => $side->id,
                'name'            => 'オニオンリング',
                'price'           => 320,
                'is_available'    => true,
                'is_customizable' => false,
            ],

            // ドリンク
            [
                'category_id'     => $drink->id,
                'name'            => 'コーラ（S）',
                'price'           => 200,
                'is_available'    => true,
                'is_customizable' => false,
            ],
            [
                'category_id'     => $drink->id,
                'name'            => 'コーラ（M）',
                'price'           => 250,
                'is_available'    => true,
                'is_customizable' => false,
            ],
            [
                'category_id'     => $drink->id,
                'name'            => 'コーラ（L）',
                'price'           => 300,
                'is_available'    => true,
                'is_customizable' => false,
            ],
            [
                'category_id'     => $drink->id,
                'name'            => 'アイスコーヒー',
                'price'           => 220,
                'is_available'    => true,
                'is_customizable' => false,
            ],
            [
                'category_id'     => $drink->id,
                'name'            => 'オレンジジュース',
                'price'           => 220,
                'is_available'    => true,
                'is_customizable' => false,
            ],

            // デザート
            [
                'category_id'     => $dessert->id,
                'name'            => 'バニラシェイク',
                'price'           => 380,
                'is_available'    => true,
                'is_customizable' => false,
            ],
            [
                'category_id'     => $dessert->id,
                'name'            => 'チョコシェイク',
                'price'           => 380,
                'is_available'    => true,
                'is_customizable' => false,
            ],
            [
                'category_id'     => $dessert->id,
                'name'            => 'アップルパイ',
                'price'           => 250,
                'is_available'    => true,
                'is_customizable' => false,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}