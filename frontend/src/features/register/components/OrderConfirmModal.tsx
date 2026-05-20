"use client";

import { CartItem, OrderType } from "@/types";

type Props = {
  cart: CartItem[];
  totalAmount: number;
  orderType: OrderType | null;
  tableNumber: string;
  customerName: string;
  customerPhone: string;
  onOrderTypeChange: (type: OrderType) => void;
  onTableNumberChange: (value: string) => void;
  onCustomerNameChange: (value: string) => void;
  onCustomerPhoneChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
};

export const OrderConfirmModal = ({
  cart,
  totalAmount,
  orderType,
  tableNumber,
  customerName,
  customerPhone,
  onOrderTypeChange,
  onTableNumberChange,
  onCustomerNameChange,
  onCustomerPhoneChange,
  onNext,
  onBack,
}: Props) => {
  const canProceed =
    orderType !== null &&
    (orderType === "takeout" || tableNumber.trim() !== "");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">注文確認</h2>
        </div>

        <div className="p-6 space-y-6">
          {/* 注文タイプ選択 */}
          <div>
            <p className="font-medium text-gray-700 mb-3">注文タイプ</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onOrderTypeChange("dine_in")}
                className={`py-4 rounded-xl border-2 font-medium transition-colors ${
                  orderType === "dine_in"
                    ? "border-orange-500 bg-orange-50 text-orange-600"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                🪑 店内
              </button>
              <button
                onClick={() => onOrderTypeChange("takeout")}
                className={`py-4 rounded-xl border-2 font-medium transition-colors ${
                  orderType === "takeout"
                    ? "border-orange-500 bg-orange-50 text-orange-600"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                🥡 テイクアウト
              </button>
            </div>
          </div>

          {/* テーブル番号（店内の場合必須） */}
          {orderType === "dine_in" && (
            <div>
              <label className="font-medium text-gray-700 block mb-2">
                テーブル番号
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={tableNumber}
                onChange={(e) => onTableNumberChange(e.target.value)}
                placeholder="例：A-1"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400"
              />
            </div>
          )}

          {/* お客様情報（テイクアウトの場合） */}
          {orderType === "takeout" && (
            <div className="space-y-3">
              <p className="font-medium text-gray-700">お客様情報（任意）</p>
              <input
                type="text"
                value={customerName}
                onChange={(e) => onCustomerNameChange(e.target.value)}
                placeholder="お名前"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400"
              />
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => onCustomerPhoneChange(e.target.value)}
                placeholder="電話番号"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400"
              />
            </div>
          )}

          {/* 注文内容 */}
          <div>
            <p className="font-medium text-gray-700 mb-3">注文内容</p>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              {cart.map((item) => (
                <div key={item.cartId} className="flex justify-between text-sm">
                  <div>
                    <span className="text-gray-800">{item.product.name}</span>
                    <span className="text-gray-400 ml-2">×{item.quantity}</span>
                    {item.options.length > 0 && (
                      <p className="text-xs text-gray-400">
                        {item.options
                          .map((o) => o.option_item_name)
                          .join(" / ")}
                      </p>
                    )}
                  </div>
                  <span className="font-medium text-gray-800">
                    ¥{item.subtotal.toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
                <span>合計</span>
                <span className="text-orange-500">
                  ¥{totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            戻る
          </button>
          <button
            onClick={onNext}
            disabled={!canProceed}
            className="flex-1 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            支払いへ
          </button>
        </div>
      </div>
    </div>
  );
};
