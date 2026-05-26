<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Collection;

class OrderService
{
    public function getAll(): Collection
    {
        return Order::with(['orderItems.product', 'orderItems.orderItemOptions.optionItem'])
            ->orderByDesc('ordered_at')
            ->get();
    }

    public function create(array $data, int $userId): Order
    {
        return DB::transaction(function () use ($data, $userId) {
            $order = Order::create([
                'user_id'        => $userId,
                'order_type'     => $data['order_type'],
                'table_number'   => $data['table_number'] ?? null,
                'customer_name'  => $data['customer_name'] ?? null,
                'customer_phone' => $data['customer_phone'] ?? null,
                'payment_method' => $data['payment_method'],
                'status'         => 'completed',
                'total_amount'   => $data['total_amount'],
            ]);

            foreach ($data['items'] as $item) {
                $orderItem = OrderItem::create([
                    'order_id'   => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity'   => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'subtotal'   => $item['subtotal'],
                ]);

                if (!empty($item['options'])) {
                    foreach ($item['options'] as $option) {
                        $orderItem->orderItemOptions()->create([
                            'option_item_id' => $option['option_item_id'],
                            'price_diff'     => $option['price_diff'],
                        ]);
                    }
                }
            }

            return $order->load([
                'orderItems.product',
                'orderItems.orderItemOptions.optionItem',
            ]);
        });
    }

    public function updateStatus(Order $order, string $status): Order
    {
        $order->update(['status' => $status]);
        return $order;
    }

    public function getDailySales(string $date): array
    {
        $orders = Order::whereDate('ordered_at', $date)
            ->where('status', 'completed')
            ->get();

        return [
            'date'       => $date,
            'total'      => $orders->sum('total_amount'),
            'count'      => $orders->count(),
            'by_payment' => $orders->groupBy('payment_method')
                ->map(fn($group) => $group->sum('total_amount')),
        ];
    }

    public function getSalesSummary(string $period): array
    {
        $query = Order::where('status', 'completed');

        if ($period === 'week') {
            $query->whereBetween('ordered_at', [
                now()->startOfWeek(),
                now()->endOfWeek(),
            ]);
        } elseif ($period === 'month') {
            $query->whereMonth('ordered_at', now()->month)
                ->whereYear('ordered_at', now()->year);
        }

        $orders = $query->get();

        return [
            'period'  => $period,
            'total'   => $orders->sum('total_amount'),
            'count'   => $orders->count(),
            'average' => $orders->count() > 0
                ? round($orders->sum('total_amount') / $orders->count())
                : 0,
        ];
    }
}
