"use client";

import { useState } from "react";
import { Order } from "@/types";

type Props = {
  order: Order;
  onConfirm: (reason: string) => Promise<void>;
  onClose: () => void;
};

const CANCEL_REASONS = [
  "お客様のご都合によるキャンセル",
  "商品の在庫切れ",
  "注文ミス",
  "その他",
];

export const CancelModal = ({ order, onConfirm, onClose }: Props) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const finalReason =
    selectedReason === "その他" ? customReason : selectedReason;

  const canConfirm =
    selectedReason !== "" &&
    (selectedReason !== "その他" || customReason.trim() !== "");

  const handleConfirm = async () => {
    if (!canConfirm) return;
    setIsLoading(true);
    try {
      await onConfirm(finalReason);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">注文をキャンセル</h2>
          <p className="text-sm text-gray-400 mt-1">
            注文 #{order.id} ・ ¥{order.total_amount.toLocaleString()}
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <p className="font-medium text-gray-700 mb-3">
              キャンセル理由を選択
              <span className="text-red-500 ml-1">*</span>
            </p>
            <div className="space-y-2">
              {CANCEL_REASONS.map((reason) => (
                <button
                  key={reason}
                  onClick={() => setSelectedReason(reason)}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-colors ${
                    selectedReason === reason
                      ? "border-red-400 bg-red-50 text-red-600"
                      : "border-gray-200 text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>

          {selectedReason === "その他" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                理由を入力 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="キャンセル理由を入力してください"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-red-400"
              />
            </div>
          )}

          <div className="bg-red-50 rounded-xl p-4 text-sm text-red-600">
            ⚠️ キャンセルすると売上から除外されます。この操作は取り消せません。
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-40"
          >
            戻る
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm || isLoading}
            className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? "処理中..." : "キャンセル確定"}
          </button>
        </div>
      </div>
    </div>
  );
};
