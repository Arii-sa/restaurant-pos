<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id'        => User::factory(),
            'order_type'     => $this->faker->randomElement(['dine_in', 'takeout']),
            'table_number'   => 'A-' . $this->faker->numberBetween(1, 10),
            'customer_name'  => null,
            'customer_phone' => null,
            'payment_method' => $this->faker->randomElement(['cash', 'card', 'qr']),
            'status'         => 'pending',
            'cancel_reason'  => null,
            'cancelled_at'   => null,
            'total_amount'   => $this->faker->numberBetween(500, 5000),
            'ordered_at'     => now(),
        ];
    }
}
