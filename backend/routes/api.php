<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;

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
