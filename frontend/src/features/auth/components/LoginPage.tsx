"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("メールアドレスとパスワードを入力してください");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      await login(email, password);
      router.push("/");
    } catch {
      setError("メールアドレスまたはパスワードが正しくありません");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <p className="text-5xl mb-3">🍔</p>
          <h1 className="text-2xl font-bold text-gray-800">Restaurant POS</h1>
          <p className="text-gray-400 text-sm mt-1">スタッフログイン</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@restaurant.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-40"
          >
            {isLoading ? "ログイン中..." : "ログイン"}
          </button>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-xl text-xs text-gray-400 space-y-1">
          <p className="font-medium text-gray-500">テスト用アカウント</p>
          <p>管理者：admin@restaurant.com</p>
          <p>店員：staff@restaurant.com</p>
          <p>パスワード：password</p>
        </div>
      </div>
    </div>
  );
};
