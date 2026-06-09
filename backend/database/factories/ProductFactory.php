<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        return [
            'category_id'     => Category::factory(),
            'name'            => $this->faker->word() . 'バーガー',
            'price'           => $this->faker->numberBetween(500, 2000),
            'is_available'    => true,
            'image_url'       => null,
            'is_customizable' => false,
        ];
    }
}

