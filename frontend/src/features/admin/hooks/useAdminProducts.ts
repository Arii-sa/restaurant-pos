import { useState, useEffect, useRef } from "react";
import { Product, Category } from "@/types";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductAvailability,
} from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";

export const useAdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const load = async () => {
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
    };

    void load();
  }, []);

  const refetch = async () => {
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
  };

  const handleCreate = async (params: {
    category_id: number;
    name: string;
    price: number;
    is_customizable: boolean;
  }) => {
    await createProduct(params);
    await refetch();
  };

  const handleUpdate = async (
    id: number,
    params: {
      category_id: number;
      name: string;
      price: number;
      is_customizable: boolean;
    },
  ) => {
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
