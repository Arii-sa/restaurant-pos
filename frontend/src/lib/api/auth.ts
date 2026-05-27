import apiClient from "@/lib/axios";
import { AuthResponse, User } from "@/types";

// ログイン
export const login = async (params: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const { data } = await apiClient.post("/api/auth/login", params);
  return data;
};

// ログアウト
export const logout = async (): Promise<void> => {
  await apiClient.post("/api/auth/logout");
};

// ログイン中のユーザー取得
export const getMe = async (): Promise<User> => {
  const { data } = await apiClient.get("/api/auth/me");
  return data;
};
