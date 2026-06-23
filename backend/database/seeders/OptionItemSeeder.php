<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\OptionItem;
use App\Models\OptionGroup;

class OptionItemSeeder extends Seeder
{
    public function run(): void
    {
        // ピクルスグループ
        $pickleGroups = OptionGroup::where('name', 'ピクルス')->get();

        foreach ($pickleGroups as $group) {

            OptionItem::updateOrCreate(
                [
                    'option_group_id' => $group->id,
                    'name'            => 'あり',
                ],
                [
                    'price_diff' => 0,
                    'is_default' => true,
                ]
            );

            OptionItem::updateOrCreate(
                [
                    'option_group_id' => $group->id,
                    'name'            => 'なし',
                ],
                [
                    'price_diff' => 0,
                    'is_default' => false,
                ]
            );
        }

        // ソースグループ
        $sauceGroups = OptionGroup::where('name', 'ソース')->get();

        foreach ($sauceGroups as $group) {

            $sauces = [
                ['name' => 'マスタード', 'price_diff' => 0, 'is_default' => true],
                ['name' => 'ケチャップ', 'price_diff' => 0, 'is_default' => false],
                ['name' => 'バーベキュー', 'price_diff' => 50, 'is_default' => false],
                ['name' => 'テリヤキ', 'price_diff' => 50, 'is_default' => false],
            ];

            foreach ($sauces as $sauce) {
                OptionItem::updateOrCreate(
                    [
                        'option_group_id' => $group->id,
                        'name'            => $sauce['name'],
                    ],
                    [
                        'price_diff' => $sauce['price_diff'],
                        'is_default' => $sauce['is_default'],
                    ]
                );
            }
        }

        // トッピンググループ
        $toppingGroups = OptionGroup::where('name', 'トッピング')->get();

        foreach ($toppingGroups as $group) {

            $toppings = [
                ['name' => 'チーズ追加', 'price_diff' => 100],
                ['name' => 'ベーコン追加', 'price_diff' => 150],
                ['name' => 'アボカド追加', 'price_diff' => 120],
                ['name' => 'エッグ追加', 'price_diff' => 100],
            ];

            foreach ($toppings as $topping) {
                OptionItem::updateOrCreate(
                    [
                        'option_group_id' => $group->id,
                        'name'            => $topping['name'],
                    ],
                    [
                        'price_diff' => $topping['price_diff'],
                        'is_default' => false,
                    ]
                );
            }
        }
    }
}