<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\OptionGroup;
use App\Models\Product;

class OptionGroupSeeder extends Seeder
{
    public function run(): void
    {
        // カスタマイズ可能な商品（バーガー類）全てに同じオプショングループを追加
        $burgers = Product::where('is_customizable', true)->get();

        foreach ($burgers as $burger) {

            // ピクルス
            OptionGroup::updateOrCreate(
                [
                    'product_id' => $burger->id,
                    'name'       => 'ピクルス',
                ],
                [
                    'type'       => 'single',
                    'required'   => false,
                ]
            );

            // ソース
            OptionGroup::updateOrCreate(
                [
                    'product_id' => $burger->id,
                    'name'       => 'ソース',
                ],
                [
                    'type'       => 'single',
                    'required'   => true,
                ]
            );

            // トッピング
            OptionGroup::updateOrCreate(
                [
                    'product_id' => $burger->id,
                    'name'       => 'トッピング',
                ],
                [
                    'type'       => 'multi',
                    'required'   => false,
                ]
            );
        }
    }
}
