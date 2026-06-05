import { useState, useEffect, useCallback, useRef } from "react";
import { Product, Category } from "@/types";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductAvailability,
} from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";

type ProductParams = {
  category_id: number;
  name: string;
  price: number;
  is_customizable: boolean;
  image?: File | null;
};

export const useAdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const refetch = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch {
      setError("データの取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    void refetch();
  }, [refetch]);

  const handleCreate = async (params: ProductParams) => {
    await createProduct(params);
    await refetch();
  };

  const handleUpdate = async (id: number, params: ProductParams) => {
    await updateProduct(id, params);
    await refetch();
  };

  const handleDelete = async (id: number) => {
    await deleteProduct(id);
    await refetch();
  };

  const handleToggleAvailability = async (id: number, isAvailable: boolean) => {
    await updateProductAvailability(id, isAvailable);
    await refetch();
  };

  return {
    products,
    categories,
    isLoading,
    error,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleToggleAvailability,
  };
};
