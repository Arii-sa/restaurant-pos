"use client";

import { PaymentMethod } from "@/types";

type Props = {
  totalAmount: number;
  paymentMethod: PaymentMethod | null;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onConfirm: () => void;
  onBack: () => void;
  isLoading: boolean;
};

const PAYMENT_METHODS: { value: PaymentMethod; label: string; icon: string }[] =
  [
    { value: "cash", label: "現金", icon: "💴" },
    { value: "card", label: "クレジットカード", icon: "💳" },
    { value: "qr", label: "QRコード決済", icon: "📱" },
  ];

export const PaymentModal = ({
  totalAmount,
  paymentMethod,
  onPaymentMethodChange,
  onConfirm,
  onBack,
  isLoading,
}: Props) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">支払い方法</h2>
        </div>

        <div className="p-6 space-y-6">
          {/* 合計金額 */}
          <div className="bg-orange-50 rounded-xl p-6 text-center">
            <p className="text-gray-500 text-sm mb-1">お支払い金額</p>
            <p className="text-4xl font-bold text-orange-500">
              ¥{totalAmount.toLocaleString()}
            </p>
          </div>

          {/* 支払い方法選択 */}
          <div>
            <p className="font-medium text-gray-700 mb-3">支払い方法を選択</p>
            <div className="space-y-3">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.value}
                  onClick={() => onPaymentMethodChange(method.value)}
                  className={`w-full py-4 px-5 rounded-xl border-2 flex items-center gap-4 transition-colors ${
                    paymentMethod === method.value
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="text-2xl">{method.icon}</span>
                  <span
                    className={`font-medium ${
                      paymentMethod === method.value
                        ? "text-orange-600"
                        : "text-gray-700"
                    }`}
                  >
                    {method.label}
                  </span>
                  {paymentMethod === method.value && (
                    <span className="ml-auto text-orange-500">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex gap-3">
          <button
            onClick={onBack}
            disabled={isLoading}
            className="flex-1 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-40"
          >
            戻る
          </button>
          <button
            onClick={onConfirm}
            disabled={!paymentMethod || isLoading}
            className="flex-1 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? "処理中..." : "注文確定"}
          </button>
        </div>
      </div>
    </div>
  );
};
