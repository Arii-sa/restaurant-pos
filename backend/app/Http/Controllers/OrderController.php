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

    // GET /api/orders
    public function index(): JsonResponse
    {
        $orders = $this->orderService->getAll();
        return response()->json($orders);
    }

    // POST /api/orders
    public function store(StoreOrderRequest $request): JsonResponse
    {
        $order = $this->orderService->create(
            $request->validated(),
            // 認証実装までは仮のユーザーID=1を使用
            1
        );
        return response()->json($order, 201);
    }

    // GET /api/orders/{id}
    public function show(Order $order): JsonResponse
    {
        return response()->json(
            $order->load(['orderItems.product', 'orderItems.orderItemOptions.optionItem'])
        );
    }

    // PATCH /api/orders/{id}/status
    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $request->validate([
            'status' => ['required', 'in:pending,cooking,served,completed'],
        ]);
        $order = $this->orderService->updateStatus($order, $request->input('status'));
        return response()->json($order);
    }

    // GET /api/sales/daily
    public function dailySales(Request $request): JsonResponse
    {
        $date = $request->input('date', now()->toDateString());
        return response()->json($this->orderService->getDailySales($date));
    }

    // GET /api/sales/summary
    public function salesSummary(Request $request): JsonResponse
    {
        $period = $request->input('period', 'month');
        return response()->json($this->orderService->getSalesSummary($period));
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