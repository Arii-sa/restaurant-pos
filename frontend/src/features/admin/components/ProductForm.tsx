"use client";

import { useState } from "react";
import { Category, Product } from "@/types";

type Props = {
  categories: Category[];
  product?: Product;
  onSubmit: (params: {
    category_id: number;
    name: string;
    price: number;
    is_customizable: boolean;
  }) => Promise<void>;
  onCancel: () => void;
};

export const ProductForm = ({
  categories,
  product,
  onSubmit,
  onCancel,
}: Props) => {
  const [categoryId, setCategoryId] = useState<number>(
    product?.category_id ?? categories[0]?.id ?? 0,
  );
  const [name, setName] = useState(product?.name ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [isCustomizable, setIsCustomizable] = useState(
    product?.is_customizable ?? false,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "商品名は必須です";
    if (!price || isNaN(Number(price)) || Number(price) < 0)
      newErrors.price = "正しい価格を入力してください";
    if (!categoryId) newErrors.category = "カテゴリを選択してください";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      await onSubmit({
        category_id: categoryId,
        name: name.trim(),
        price: Number(price),
        is_customizable: isCustomizable,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* カテゴリ */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          カテゴリ <span className="text-red-500">*</span>
        </label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(Number(e.target.value))}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-red-500 text-xs mt-1">{errors.category}</p>
        )}
      </div>

      {/* 商品名 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          商品名 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例：クラシックバーガー"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400"
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
        )}
      </div>

      {/* 価格 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          価格（円） <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="例：800"
          min={0}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400"
        />
        {errors.price && (
          <p className="text-red-500 text-xs mt-1">{errors.price}</p>
        )}
      </div>

      {/* カスタマイズ可否 */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="is_customizable"
          checked={isCustomizable}
          onChange={(e) => setIsCustomizable(e.target.checked)}
          className="w-4 h-4 accent-orange-500"
        />
        <label htmlFor="is_customizable" className="text-sm text-gray-700">
          カスタマイズを許可する
        </label>
      </div>

      {/* ボタン */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onCancel}
          className="flex-1 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
        >
          キャンセル
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex-1 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-40"
        >
          {isLoading ? "保存中..." : product ? "更新する" : "追加する"}
        </button>
      </div>
    </div>
  );
};
