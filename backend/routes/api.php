<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;

// 認証不要
Route::post('auth/login', [AuthController::class, 'login']);

// 認証必要
Route::middleware('auth:sanctum')->group(function () {
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/me', [AuthController::class, 'me']);

    // カテゴリ
    Route::apiResource('categories', CategoryController::class);

    // 商品
    Route::apiResource('products', ProductController::class);
    Route::patch('products/{product}/availability', [ProductController::class, 'updateAvailability']);

    // 注文
    Route::apiResource('orders', OrderController::class);
    Route::patch('orders/{order}/status', [OrderController::class, 'updateStatus']);

    // 売上
    Route::get('sales/daily', [OrderController::class, 'dailySales']);
    Route::get('sales/summary', [OrderController::class, 'salesSummary']);
});
