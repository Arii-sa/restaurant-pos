<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    private User $staff;
    private Product $product;

    protected function setUp(): void
    {
        parent::setUp();

        $this->staff   = User::factory()->create(['role' => 'staff']);
        $category      = Category::factory()->create();
        $this->product = Product::factory()->create([
            'category_id' => $category->id,
            'price'       => 800,
        ]);
    }

    public function test_can_create_dine_in_order(): void
    {
        $response = $this->actingAs($this->staff)
            ->postJson('/api/orders', [
                'order_type'     => 'dine_in',
                'table_number'   => 'A-1',
                'payment_method' => 'cash',
                'total_amount'   => 800,
                'items'          => [
                    [
                        'product_id' => $this->product->id,
                        'quantity'   => 1,
                        'unit_price' => 800,
                        'subtotal'   => 800,
                        'options'    => [],
                    ],
                ],
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('order.order_type', 'dine_in')
            ->assertJsonPath('order.table_number', 'A-1');

        $this->assertDatabaseHas('orders', [
            'order_type'   => 'dine_in',
            'table_number' => 'A-1',
        ]);
    }

    public function test_can_create_takeout_order(): void
    {
        $response = $this->actingAs($this->staff)
            ->postJson('/api/orders', [
                'order_type'     => 'takeout',
                'customer_name'  => 'テスト太郎',
                'payment_method' => 'card',
                'total_amount'   => 800,
                'items'          => [
                    [
                        'product_id' => $this->product->id,
                        'quantity'   => 1,
                        'unit_price' => 800,
                        'subtotal'   => 800,
                    ],
                ],
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('order.order_type', 'takeout')
            ->assertJsonPath('order.customer_name', 'テスト太郎');
    }

    public function test_dine_in_order_requires_table_number(): void
    {
        $response = $this->actingAs($this->staff)
            ->postJson('/api/orders', [
                'order_type'     => 'dine_in',
                'payment_method' => 'cash',
                'total_amount'   => 800,
                'items'          => [
                    [
                        'product_id' => $this->product->id,
                        'quantity'   => 1,
                        'unit_price' => 800,
                        'subtotal'   => 800,
                    ],
                ],
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['table_number']);
    }

    public function test_can_update_order_status(): void
    {
        $order = Order::factory()->create([
            'user_id' => $this->staff->id,
            'status'  => 'pending',
        ]);

        $response = $this->actingAs($this->staff)
            ->patchJson("/api/orders/{$order->id}/status", [
                'status' => 'cooking',
            ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('orders', [
            'id'     => $order->id,
            'status' => 'cooking',
        ]);
    }

    public function test_can_cancel_order(): void
    {
        $order = Order::factory()->create([
            'user_id' => $this->staff->id,
            'status'  => 'pending',
        ]);

        $response = $this->actingAs($this->staff)
            ->postJson("/api/orders/{$order->id}/cancel", [
                'cancel_reason' => 'お客様都合',
            ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('orders', [
            'id'     => $order->id,
            'status' => 'cancelled',
        ]);
    }

    public function test_cannot_cancel_already_cancelled_order(): void
    {
        $order = Order::factory()->create([
            'user_id' => $this->staff->id,
            'status'  => 'cancelled',
        ]);

        $response = $this->actingAs($this->staff)
            ->postJson("/api/orders/{$order->id}/cancel", [
                'cancel_reason' => '再キャンセル',
            ]);

        $response->assertStatus(400);
    }
}
