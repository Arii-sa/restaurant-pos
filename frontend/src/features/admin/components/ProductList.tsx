"use client";

import { Product } from "@/types";

type Props = {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  onToggleAvailability: (id: number, isAvailable: boolean) => void;
};

export const ProductList = ({
  products,
  onEdit,
  onDelete,
  onToggleAvailability,
}: Props) => {
  return (
    <div className="space-y-2">
      {products.map((product) => (
        <div
          key={product.id}
          className={`bg-white rounded-xl border p-4 flex items-center gap-4 transition-opacity ${
            product.is_available
              ? "border-gray-200"
              : "border-gray-100 opacity-60"
          }`}
        >
          {/* 商品情報 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-800 truncate">
                {product.name}
              </p>
              {product.is_customizable && (
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                  カスタマイズ可
                </span>
              )}
              {!product.is_available && (
                <span className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full">
                  在庫切れ
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400">{product.category?.name}</p>
            <p className="text-orange-500 font-bold">
              ¥{product.price.toLocaleString()}
            </p>
          </div>

          {/* 操作ボタン */}
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                onToggleAvailability(product.id, !product.is_available)
              }
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                product.is_available
                  ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  : "bg-green-50 text-green-600 hover:bg-green-100"
              }`}
            >
              {product.is_available ? "在庫切れにする" : "在庫を戻す"}
            </button>
            <button
              onClick={() => onEdit(product)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            >
              編集
            </button>
            <button
              onClick={() => {
                if (confirm(`「${product.name}」を削除しますか？`)) {
                  onDelete(product.id);
                }
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
            >
              削除
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
