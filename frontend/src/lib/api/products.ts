import apiClient from "@/lib/axios";
import { Product } from "@/types";

// 商品一覧取得
export const getProducts = async (): Promise<Product[]> => {
  const { data } = await apiClient.get("/api/products");
  return data;
};

// 商品作成
export const createProduct = async (params: {
  category_id: number;
  name: string;
  price: number;
  is_available?: boolean;
  image_url?: string;
  is_customizable?: boolean;
}): Promise<Product> => {
  const { data } = await apiClient.post("/api/products", params);
  return data;
};

// 商品更新
export const updateProduct = async (
  id: number,
  params: Partial<{
    category_id: number;
    name: string;
    price: number;
    is_available: boolean;
    image_url: string;
    is_customizable: boolean;
  }>,
): Promise<Product> => {
  const { data } = await apiClient.put(`/api/products/${id}`, params);
  return data;
};

// 在庫状態更新
export const updateProductAvailability = async (
  id: number,
  isAvailable: boolean,
): Promise<Product> => {
  const { data } = await apiClient.patch(`/api/products/${id}/availability`, {
    is_available: isAvailable,
  });
  return data;
};

// 商品削除
export const deleteProduct = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/products/${id}`);
};
