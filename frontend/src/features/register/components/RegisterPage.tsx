"use client";

import { useState } from "react";
import { useCart } from "@/features/register/hooks/useCart";
import { useProducts } from "@/features/register/hooks/useProducts";
import { CategoryFilter } from "./CategoryFilter";
import { ProductCard } from "./ProductCard";
import { CartPanel } from "./CartPanel";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { ErrorMessage } from "@/shared/components/ErrorMessage";
import { Product } from "@/types";

export const RegisterPage = () => {
  const { cart, addToCart, removeFromCart, updateQuantity, totalAmount } =
    useCart();

  const {
    products,
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
    isLoading,
    error,
  } = useProducts();

  const handleProductClick = (product: Product) => {
    // カスタマイズなしの場合はそのままカートに追加
    addToCart(product, []);
  };

  const handleProceed = () => {
    alert("注文確認画面へ（次のステップで実装）");
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 左側：商品選択エリア */}
      <div className="flex-1 flex flex-col overflow-hidden p-4 gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">🍔 レジ</h1>
        </div>

        <CategoryFilter
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelect={setSelectedCategoryId}
        />

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-3 gap-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={handleProductClick}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 右側：カートエリア */}
      <div className="w-80 p-4">
        <CartPanel
          cart={cart}
          totalAmount={totalAmount}
          onRemove={removeFromCart}
          onUpdateQuantity={updateQuantity}
          onProceed={handleProceed}
        />
      </div>
    </div>
  );
};
