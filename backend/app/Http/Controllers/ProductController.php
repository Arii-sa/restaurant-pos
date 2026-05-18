<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Services\ProductService;
use App\Http\Requests\StoreProductRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct(
        private ProductService $productService
    ) {}

    // GET /api/products
    public function index(): JsonResponse
    {
        $products = $this->productService->getAll();
        return response()->json($products);
    }

    // POST /api/products
    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = $this->productService->create($request->validated());
        return response()->json($product->load('category'), 201);
    }

    // GET /api/products/{id}
    public function show(Product $product): JsonResponse
    {
        return response()->json(
            $product->load(['category', 'optionGroups.optionItems'])
        );
    }

    // PUT /api/products/{id}
    public function update(StoreProductRequest $request, Product $product): JsonResponse
    {
        $product = $this->productService->update($product, $request->validated());
        return response()->json($product);
    }

    // PATCH /api/products/{id}/availability
    public function updateAvailability(Request $request, Product $product): JsonResponse
    {
        $request->validate(['is_available' => ['required', 'boolean']]);
        $product = $this->productService->updateAvailability(
            $product,
            $request->boolean('is_available')
        );
        return response()->json($product);
    }

    // DELETE /api/products/{id}
    public function destroy(Product $product): JsonResponse
    {
        $this->productService->delete($product);
        return response()->json(null, 204);
    }
}
