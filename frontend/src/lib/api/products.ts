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
  image?: File | null;
  is_customizable?: boolean;
}): Promise<Product> => {
  const formData = new FormData();
  formData.append("category_id", String(params.category_id));
  formData.append("name", params.name);
  formData.append("price", String(params.price));
  if (params.is_available !== undefined) {
    formData.append("is_available", String(params.is_available));
  }
  if (params.is_customizable !== undefined) {
    formData.append("is_customizable", String(params.is_customizable));
  }
  if (params.image) {
    formData.append("image", params.image);
  }

  const { data } = await apiClient.post("/api/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// 商品更新
export const updateProduct = async (
  id: number,
  params: {
    category_id: number;
    name: string;
    price: number;
    is_available?: boolean;
    image?: File | null;
    is_customizable?: boolean;
  },
): Promise<Product> => {
  const formData = new FormData();
  formData.append("category_id", String(params.category_id));
  formData.append("name", params.name);
  formData.append("price", String(params.price));
  formData.append("_method", "PUT");
  if (params.is_available !== undefined) {
    formData.append("is_available", String(params.is_available));
  }
  if (params.is_customizable !== undefined) {
    formData.append("is_customizable", String(params.is_customizable));
  }
  if (params.image) {
    formData.append("image", params.image);
  }

  const { data } = await apiClient.post(`/api/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
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
