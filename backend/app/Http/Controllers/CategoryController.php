<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Services\CategoryService;
use App\Http\Requests\StoreCategoryRequest;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function __construct(
        private CategoryService $categoryService
    ) {}

    // GET /api/categories
    public function index(): JsonResponse
    {
        $categories = $this->categoryService->getAll();
        return response()->json($categories);
    }

    // POST /api/categories
    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $category = $this->categoryService->create($request->validated());
        return response()->json($category, 201);
    }

    // GET /api/categories/{id}
    public function show(Category $category): JsonResponse
    {
        return response()->json($category);
    }

    // PUT /api/categories/{id}
    public function update(StoreCategoryRequest $request, Category $category): JsonResponse
    {
        $category = $this->categoryService->update($category, $request->validated());
        return response()->json($category);
    }

    // DELETE /api/categories/{id}
    public function destroy(Category $category): JsonResponse
    {
        $this->categoryService->delete($category);
        return response()->json(null, 204);
    }
}
