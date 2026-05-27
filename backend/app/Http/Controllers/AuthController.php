<?php

namespace App\Http\Controllers;

use App\Services\AuthService;
use App\Http\Requests\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(
        private AuthService $authService
    ) {}

    // POST /api/auth/login
    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->login(
                $request->email,
                $request->password
            );

            return response()->json([
                'user'  => $result['user'],
                'token' => $result['token'],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 401);
        }
    }

    // POST /api/auth/logout
    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());
        return response()->json(['message' => 'ログアウトしました']);
    }

    // GET /api/auth/me
    public function me(Request $request): JsonResponse
    {
        return response()->json($request->user());
    }
}
