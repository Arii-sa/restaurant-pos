"use client";

import { useState } from "react";
import { CartItem, OrderType, PaymentMethod } from "@/types";
import { ReceiptModal } from "./ReceiptModal";

type Props = {
  orderId: number;
  dailyOrderNumber: number;
  orderType: OrderType | null;
  tableNumber: string;
  customerName: string;
  paymentMethod: PaymentMethod | null;
  cart: CartItem[];
  totalAmount: number;
  onClose: () => void;
};

export const CompleteModal = ({
  orderId,
  dailyOrderNumber,
  orderType,
  tableNumber,
  customerName,
  paymentMethod,
  cart,
  totalAmount,
  onClose,
}: Props) => {
  const [showReceipt, setShowReceipt] = useState(false);
  const orderedAt = new Date();

  if (showReceipt) {
    return (
      <ReceiptModal
        orderId={orderId}
        dailyOrderNumber={dailyOrderNumber}
        cart={cart}
        totalAmount={totalAmount}
        orderType={orderType}
        tableNumber={tableNumber}
        customerName={customerName}
        paymentMethod={paymentMethod}
        orderedAt={orderedAt}
        onClose={() => setShowReceipt(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm text-center p-8">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">注文完了！</h2>
        <p className="text-gray-500 mb-2">ありがとうございました</p>
        <p className="text-lg font-bold text-orange-500 mb-4">
          # {dailyOrderNumber}
        </p>

        {orderType === "dine_in" && tableNumber && (
          <div className="bg-orange-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-500">テーブル番号</p>
            <p className="text-2xl font-bold text-orange-500">{tableNumber}</p>
          </div>
        )}

        {orderType === "takeout" && customerName && (
          <div className="bg-orange-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-500">お名前</p>
            <p className="text-2xl font-bold text-orange-500">{customerName}</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => setShowReceipt(true)}
            className="w-full py-3 border-2 border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            🧾 レシートを見る
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors"
          >
            次の注文へ
          </button>
        </div>
      </div>
    </div>
  );
};
