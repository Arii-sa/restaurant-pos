"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { useAdminProducts } from "@/features/admin/hooks/useAdminProducts";
import { ProductForm } from "./ProductForm";
import { ProductList } from "./ProductList";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { ErrorMessage } from "@/shared/components/ErrorMessage";

type ModalMode = "create" | "edit" | null;

export const AdminPage = () => {
  const {
    products,
    categories,
    isLoading,
    error,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleToggleAvailability,
  } = useAdminProducts();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const openCreate = () => {
    setEditingProduct(null);
    setModalMode("create");
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingProduct(null);
  };

  const handleSubmit = async (params: {
    category_id: number;
    name: string;
    price: number;
    is_customizable: boolean;
  }) => {
    if (modalMode === "create") {
      await handleCreate(params);
    } else if (modalMode === "edit" && editingProduct) {
      await handleUpdate(editingProduct.id, params);
    }
    closeModal();
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← レジへ戻る
          </Link>
          <h1 className="text-xl font-bold text-gray-800">🛠️ 商品管理</h1>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition-colors"
        >
          ＋ 商品を追加
        </button>
      </div>

      <div className="max-w-3xl mx-auto p-6">
        {products.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📦</p>
            <p>商品がまだ登録されていません</p>
          </div>
        ) : (
          <ProductList
            products={products}
            onEdit={openEdit}
            onDelete={handleDelete}
            onToggleAvailability={handleToggleAvailability}
          />
        )}
      </div>

      {modalMode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6">
              {modalMode === "create" ? "商品を追加" : "商品を編集"}
            </h2>
            <ProductForm
              categories={categories}
              product={editingProduct ?? undefined}
              onSubmit={handleSubmit}
              onCancel={closeModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};
