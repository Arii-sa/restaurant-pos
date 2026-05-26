<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\OptionGroup;
use App\Models\OptionItem;
use App\Models\Product;

class DrinkOptionSeeder extends Seeder
{
    public function run(): void
    {
        // ドリンクカテゴリの商品を取得
        $drinks = Product::whereHas('category', fn($q) => $q->where('name', 'ドリンク'))->get();

        foreach ($drinks as $drink) {
            // is_customizableをtrueに更新
            $drink->update(['is_customizable' => true]);

            // 氷の量グループ
            $iceGroup = OptionGroup::create([
                'product_id' => $drink->id,
                'name'       => '氷の量',
                'type'       => 'single',
                'required'   => true,
            ]);

            $iceOptions = [
                ['name' => '普通',   'price_diff' => 0,  'is_default' => true],
                ['name' => '少なめ', 'price_diff' => 0,  'is_default' => false],
                ['name' => '多め',   'price_diff' => 0,  'is_default' => false],
                ['name' => '氷なし', 'price_diff' => 0,  'is_default' => false],
            ];

            foreach ($iceOptions as $option) {
                OptionItem::create([
                    'option_group_id' => $iceGroup->id,
                    ...$option,
                ]);
            }

            // サイズグループ
            $sizeGroup = OptionGroup::create([
                'product_id' => $drink->id,
                'name'       => 'サイズ',
                'type'       => 'single',
                'required'   => true,
            ]);

            $sizeOptions = [
                ['name' => 'S', 'price_diff' => 0,   'is_default' => true],
                ['name' => 'M', 'price_diff' => 50,  'is_default' => false],
                ['name' => 'L', 'price_diff' => 100, 'is_default' => false],
            ];

            foreach ($sizeOptions as $option) {
                OptionItem::create([
                    'option_group_id' => $sizeGroup->id,
                    ...$option,
                ]);
            }
        }
    }
}
