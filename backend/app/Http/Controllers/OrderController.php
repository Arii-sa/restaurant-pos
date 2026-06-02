<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\OrderService;
use App\Http\Requests\StoreOrderRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function __construct(
        private OrderService $orderService
    ) {}

    public function index(): JsonResponse
    {
        $orders = $this->orderService->getAll();
        return response()->json($orders);
    }

    public function store(StoreOrderRequest $request): JsonResponse
    {
        $order = $this->orderService->create(
            $request->validated(),
            $request->user()->id
        );
        return response()->json($order, 201);
    }

    public function show(Order $order): JsonResponse
    {
        return response()->json(
            $order->load(['orderItems.product', 'orderItems.orderItemOptions.optionItem'])
        );
    }

    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $request->validate([
            'status' => ['required', 'in:pending,cooking,served,completed'],
        ]);
        $order = $this->orderService->updateStatus($order, $request->input('status'));
        return response()->json($order);
    }

    public function cancel(Request $request, Order $order): JsonResponse
    {
        $request->validate([
            'cancel_reason' => ['required', 'string', 'max:255'],
        ]);

        try {
            $order = $this->orderService->cancel(
                $order,
                $request->input('cancel_reason')
            );
            return response()->json($order);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function dailySales(Request $request): JsonResponse
    {
        $date = $request->input('date', now()->toDateString());
        return response()->json($this->orderService->getDailySales($date));
    }

    public function salesSummary(Request $request): JsonResponse
    {
        $period = $request->input('period', 'month');
        return response()->json($this->orderService->getSalesSummary($period));
    }

    public function chartData(Request $request): JsonResponse
    {
        $period = $request->input('period', 'week');

        if ($period === 'week') {
            $weekOffset = (int) $request->input('week_offset', 0);
            $data = $this->orderService->getWeeklyChartData($weekOffset);
        } else {
            $year  = (int) $request->input('year', now()->year);
            $month = (int) $request->input('month', now()->month);
            $data  = $this->orderService->getMonthlyChartData($year, $month);
        }

        return response()->json($data);
    }

    public function update(): JsonResponse
    {
        return response()->json(['message' => 'Not implemented'], 501);
    }

    public function destroy(): JsonResponse
    {
        return response()->json(['message' => 'Not implemented'], 501);
    }
}

