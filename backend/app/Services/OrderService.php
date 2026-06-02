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
                'status'         => 'pending',
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

    public function cancel(Order $order, string $reason): Order
    {
        if ($order->isCancelled()) {
            throw new \Exception('すでにキャンセル済みの注文です');
        }

        $order->update([
            'status'        => 'cancelled',
            'cancel_reason' => $reason,
            'cancelled_at'  => now(),
        ]);

        return $order;
    }

    public function getDailySales(string $date): array
    {
        $orders = Order::whereDate('ordered_at', $date)
            ->whereIn('status', ['served', 'completed'])
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
        $query = Order::whereIn('status', ['served', 'completed']);

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

    // 週次日別売上（offset: 0=今週, -1=先週, -2=先々週...）
    public function getWeeklyChartData(int $weekOffset = 0): array
    {
        $days = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->addWeeks($weekOffset)->subDays($i);
            $orders = Order::whereDate('ordered_at', $date)
                ->whereIn('status', ['served', 'completed'])
                ->get();

            $days[] = [
                'date'  => $date->format('m/d'),
                'total' => $orders->sum('total_amount'),
                'count' => $orders->count(),
            ];
        }
        return $days;
    }

    // 月次週別売上（year・monthで指定）
    public function getMonthlyChartData(int $year, int $month): array
    {
        $startOfMonth = now()->setYear($year)->setMonth($month)->startOfMonth();
        $endOfMonth   = $startOfMonth->copy()->endOfMonth();
        $weeks = [];
        $week = 1;
        $current = $startOfMonth->copy();

        while ($current->lte($endOfMonth)) {
            $startOfWeek = $current->copy();
            $endOfWeek   = $current->copy()->addDays(6)->min($endOfMonth);

            $orders = Order::whereBetween('ordered_at', [
                $startOfWeek->startOfDay(),
                $endOfWeek->endOfDay(),
            ])
                ->whereIn('status', ['served', 'completed'])
                ->get();

            $weeks[] = [
                'date'  => $week . '週目',
                'total' => $orders->sum('total_amount'),
                'count' => $orders->count(),
            ];

            $current->addDays(7);
            $week++;
        }

        return $weeks;
    }
}
