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
            OptionItem::create([
                'option_group_id' => $group->id,
                'name'            => 'あり',
                'price_diff'      => 0,
                'is_default'      => true,
            ]);
            OptionItem::create([
                'option_group_id' => $group->id,
                'name'            => 'なし',
                'price_diff'      => 0,
                'is_default'      => false,
            ]);
        }

        // ソースグループ
        $sauceGroups = OptionGroup::where('name', 'ソース')->get();
        foreach ($sauceGroups as $group) {
            OptionItem::create([
                'option_group_id' => $group->id,
                'name'            => 'マスタード',
                'price_diff'      => 0,
                'is_default'      => true,
            ]);
            OptionItem::create([
                'option_group_id' => $group->id,
                'name'            => 'ケチャップ',
                'price_diff'      => 0,
                'is_default'      => false,
            ]);
            OptionItem::create([
                'option_group_id' => $group->id,
                'name'            => 'バーベキュー',
                'price_diff'      => 50,
                'is_default'      => false,
            ]);
            OptionItem::create([
                'option_group_id' => $group->id,
                'name'            => 'テリヤキ',
                'price_diff'      => 50,
                'is_default'      => false,
            ]);
        }

        // トッピンググループ
        $toppingGroups = OptionGroup::where('name', 'トッピング')->get();
        foreach ($toppingGroups as $group) {
            OptionItem::create([
                'option_group_id' => $group->id,
                'name'            => 'チーズ追加',
                'price_diff'      => 100,
                'is_default'      => false,
            ]);
            OptionItem::create([
                'option_group_id' => $group->id,
                'name'            => 'ベーコン追加',
                'price_diff'      => 150,
                'is_default'      => false,
            ]);
            OptionItem::create([
                'option_group_id' => $group->id,
                'name'            => 'アボカド追加',
                'price_diff'      => 120,
                'is_default'      => false,
            ]);
            OptionItem::create([
                'option_group_id' => $group->id,
                'name'            => 'エッグ追加',
                'price_diff'      => 100,
                'is_default'      => false,
            ]);
        }
    }
}

