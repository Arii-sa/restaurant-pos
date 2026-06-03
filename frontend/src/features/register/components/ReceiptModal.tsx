"use client";

import { CartItem, OrderType, PaymentMethod } from "@/types";

type Props = {
  orderId: number;
  dailyOrderNumber: number;
  cart: CartItem[];
  totalAmount: number;
  orderType: OrderType | null;
  tableNumber: string;
  customerName: string;
  paymentMethod: PaymentMethod | null;
  orderedAt: Date;
  onClose: () => void;
};

const PAYMENT_LABELS: Record<string, string> = {
  cash: "現金",
  card: "クレジットカード",
  qr: "QRコード決済",
};

export const ReceiptModal = ({
  dailyOrderNumber,
  cart,
  totalAmount,
  orderType,
  tableNumber,
  customerName,
  paymentMethod,
  orderedAt,
  onClose,
}: Props) => {
  const handlePrint = () => {
    window.print();
  };

  const dateStr = orderedAt.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = orderedAt.toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm">
        <div className="flex justify-end p-4 print:hidden">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="px-6 pb-6">
          <div className="text-center mb-6">
            <p className="text-2xl font-bold text-gray-800">
              🍔 Restaurant POS
            </p>
            <p className="text-sm text-gray-400 mt-1">領収書</p>
          </div>

          <div className="border-t border-dashed border-gray-300 pt-4 mb-4 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">本日の注文番号</span>
              <span className="font-bold text-orange-500">
                # {dailyOrderNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">日時</span>
              <span className="font-medium">
                {dateStr} {timeStr}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">注文タイプ</span>
              <span className="font-medium">
                {orderType === "dine_in" ? "店内" : "テイクアウト"}
              </span>
            </div>
            {orderType === "dine_in" && tableNumber && (
              <div className="flex justify-between">
                <span className="text-gray-500">テーブル</span>
                <span className="font-medium">{tableNumber}</span>
              </div>
            )}
            {orderType === "takeout" && customerName && (
              <div className="flex justify-between">
                <span className="text-gray-500">お名前</span>
                <span className="font-medium">{customerName}</span>
              </div>
            )}
          </div>

          <div className="border-t border-dashed border-gray-300 pt-4 mb-4 space-y-2">
            {cart.map((item) => (
              <div key={item.cartId}>
                <div className="flex justify-between text-sm">
                  <div className="flex-1">
                    <span className="font-medium text-gray-800">
                      {item.product.name}
                    </span>
                    <span className="text-gray-400 ml-1">x{item.quantity}</span>
                  </div>
                  <span className="font-medium text-gray-800">
                    ¥{item.subtotal.toLocaleString()}
                  </span>
                </div>
                {item.options.length > 0 && (
                  <p className="text-xs text-gray-400 ml-2 mt-0.5">
                    {item.options.map((o) => o.option_item_name).join(" / ")}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-dashed border-gray-300 pt-4 mb-4">
            <div className="flex justify-between font-bold text-lg">
              <span>合計</span>
              <span className="text-orange-500">
                ¥{totalAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>お支払い方法</span>
              <span>{PAYMENT_LABELS[paymentMethod ?? ""] ?? ""}</span>
            </div>
          </div>

          <div className="text-center text-xs text-gray-400 border-t border-dashed border-gray-300 pt-4">
            <p>ありがとうございました</p>
            <p className="mt-1">またのご来店をお待ちしております</p>
          </div>
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={handlePrint}
            className="w-full py-3 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-700 transition-colors"
          >
            🖨️ 印刷する
          </button>
        </div>
      </div>
    </div>
  );
};
