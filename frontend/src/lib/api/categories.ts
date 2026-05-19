import apiClient from "@/lib/axios";
import { Category } from "@/types";

// カテゴリ一覧取得
export const getCategories = async (): Promise<Category[]> => {
  const { data } = await apiClient.get("/api/categories");
  return data;
};

// カテゴリ作成
export const createCategory = async (params: {
  name: string;
  sort_order?: number;
}): Promise<Category> => {
  const { data } = await apiClient.post("/api/categories", params);
  return data;
};

// カテゴリ更新
export const updateCategory = async (
  id: number,
  params: { name: string; sort_order?: number },
): Promise<Category> => {
  const { data } = await apiClient.put(`/api/categories/${id}`, params);
  return data;
};

// カテゴリ削除
export const deleteCategory = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/categories/${id}`);
};
