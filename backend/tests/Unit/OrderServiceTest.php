<?php

namespace Tests\Unit;

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Services\OrderService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderServiceTest extends TestCase
{
    use RefreshDatabase;

    private OrderService $orderService;
    private User $user;
    private Product $product;

    protected function setUp(): void
    {
        parent::setUp();

        $this->orderService = new OrderService();
        $this->user         = User::factory()->create();
        $category           = Category::factory()->create();
        $this->product      = Product::factory()->create([
            'category_id' => $category->id,
            'price'       => 1000,
        ]);
    }

    public function test_create_order_with_items(): void
    {
        $data = [
            'order_type'     => 'dine_in',
            'table_number'   => 'B-2',
            'payment_method' => 'cash',
            'total_amount'   => 1000,
            'items'          => [
                [
                    'product_id' => $this->product->id,
                    'quantity'   => 1,
                    'unit_price' => 1000,
                    'subtotal'   => 1000,
                    'options'    => [],
                ],
            ],
        ];

        $order = $this->orderService->create($data, $this->user->id);

        $this->assertInstanceOf(Order::class, $order);
        $this->assertEquals('dine_in', $order->order_type);
        $this->assertEquals('B-2', $order->table_number);
        $this->assertEquals(1000, $order->total_amount);
        $this->assertEquals('pending', $order->status);
        $this->assertCount(1, $order->orderItems);
    }

    public function test_cancel_order(): void
    {
        $order = Order::factory()->create([
            'user_id' => $this->user->id,
            'status'  => 'pending',
        ]);

        $cancelled = $this->orderService->cancel($order, 'テスト理由');

        $this->assertEquals('cancelled', $cancelled->status);
        $this->assertEquals('テスト理由', $cancelled->cancel_reason);
        $this->assertNotNull($cancelled->cancelled_at);
    }

    public function test_cannot_cancel_already_cancelled_order(): void
    {
        $order = Order::factory()->create([
            'user_id' => $this->user->id,
            'status'  => 'cancelled',
        ]);

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('すでにキャンセル済みの注文です');

        $this->orderService->cancel($order, '再キャンセル');
    }

    public function test_get_daily_sales(): void
    {
        Order::factory()->count(3)->create([
            'user_id'      => $this->user->id,
            'status'       => 'completed',
            'total_amount' => 1000,
            'ordered_at'   => now(),
        ]);

        Order::factory()->create([
            'user_id'      => $this->user->id,
            'status'       => 'cancelled',
            'total_amount' => 500,
            'ordered_at'   => now(),
        ]);

        $sales = $this->orderService->getDailySales(now()->toDateString());

        $this->assertEquals(3000, $sales['total']);
        $this->assertEquals(3, $sales['count']);
    }

    public function test_update_order_status(): void
    {
        $order = Order::factory()->create([
            'user_id' => $this->user->id,
            'status'  => 'pending',
        ]);

        $updated = $this->orderService->updateStatus($order, 'cooking');

        $this->assertEquals('cooking', $updated->status);
    }
}
