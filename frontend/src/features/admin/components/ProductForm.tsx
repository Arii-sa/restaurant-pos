"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Category, Product } from "@/types";

type Props = {
  categories: Category[];
  product?: Product;
  onSubmit: (params: {
    category_id: number;
    name: string;
    price: number;
    is_customizable: boolean;
    image?: File | null;
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.image_url ?? null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "商品名は必須です";
    if (!price || isNaN(Number(price)) || Number(price) < 0)
      newErrors.price = "正しい価格を入力してください";
    if (!categoryId) newErrors.category = "カテゴリを選択してください";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: "画像サイズは2MB以内にしてください",
      }));
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
        image: imageFile,
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

      {/* 画像アップロード */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          商品画像（任意・2MB以内）
        </label>
        {imagePreview ? (
          <div className="relative">
            <Image
              src={imagePreview}
              alt="プレビュー"
              className="w-full h-40 object-cover rounded-xl border border-gray-200"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors text-sm"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-32 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-orange-400 hover:bg-orange-50 transition-colors"
          >
            <span className="text-2xl">📷</span>
            <span className="text-sm text-gray-400">
              クリックして画像を選択
            </span>
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        {errors.image && (
          <p className="text-red-500 text-xs mt-1">{errors.image}</p>
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
