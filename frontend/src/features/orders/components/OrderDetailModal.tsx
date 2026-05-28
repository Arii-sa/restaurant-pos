"use client";

import { Order } from "@/types";
import { OrderStatusBadge } from "./OrderStatusBadge";

type Props = {
  order: Order;
  onClose: () => void;
  onCancel: (order: Order) => void;
};

const PAYMENT_LABELS: Record<string, string> = {
  cash: "💴 現金",
  card: "💳 クレジットカード",
  qr: "📱 QRコード決済",
};

export const OrderDetailModal = ({ order, onClose, onCancel }: Props) => {
  const orderedAt = new Date(order.ordered_at).toLocaleString("ja-JP");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-gray-800">
                注文 #{order.id}
              </h2>
              <OrderStatusBadge status={order.status} />
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-1">{orderedAt}</p>
        </div>

        <div className="p-6 space-y-4">
          {/* キャンセル情報 */}
          {order.status === "cancelled" && (
            <div className="bg-red-50 rounded-xl p-4 text-sm">
              <p className="font-medium text-red-600">キャンセル済み</p>
              <p className="text-red-500 mt-1">理由：{order.cancel_reason}</p>
              {order.cancelled_at && (
                <p className="text-red-400 text-xs mt-1">
                  {new Date(order.cancelled_at).toLocaleString("ja-JP")}
                </p>
              )}
            </div>
          )}

          {/* 注文情報 */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">注文タイプ</span>
              <span className="font-medium">
                {order.order_type === "dine_in" ? "🪑 店内" : "🥡 テイクアウト"}
              </span>
            </div>
            {order.table_number && (
              <div className="flex justify-between">
                <span className="text-gray-500">テーブル番号</span>
                <span className="font-medium">{order.table_number}</span>
              </div>
            )}
            {order.customer_name && (
              <div className="flex justify-between">
                <span className="text-gray-500">お客様名</span>
                <span className="font-medium">{order.customer_name}</span>
              </div>
            )}
            {order.customer_phone && (
              <div className="flex justify-between">
                <span className="text-gray-500">電話番号</span>
                <span className="font-medium">{order.customer_phone}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">支払い方法</span>
              <span className="font-medium">
                {PAYMENT_LABELS[order.payment_method]}
              </span>
            </div>
          </div>

          {/* 注文明細 */}
          <div>
            <p className="font-medium text-gray-700 mb-3">注文内容</p>
            <div className="space-y-2">
              {order.order_items?.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-start text-sm py-2 border-b border-gray-50"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {item.product?.name}
                      <span className="text-gray-400 ml-1">
                        ×{item.quantity}
                      </span>
                    </p>
                    {item.order_item_options?.length > 0 && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {item.order_item_options
                          .map((o) => o.option_item?.name)
                          .join(" / ")}
                      </p>
                    )}
                  </div>
                  <span className="font-medium text-gray-800">
                    ¥{item.subtotal.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 合計 */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <span className="font-bold text-gray-800">合計</span>
            <span
              className={`text-xl font-bold ${
                order.status === "cancelled"
                  ? "text-gray-400 line-through"
                  : "text-orange-500"
              }`}
            >
              ¥{order.total_amount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* キャンセルボタン（完了済みのみ表示） */}
        {order.status !== "cancelled" && (
          <div className="p-6 border-t border-gray-100">
            <button
              onClick={() => onCancel(order)}
              className="w-full py-3 border-2 border-red-400 text-red-500 font-medium rounded-xl hover:bg-red-50 transition-colors"
            >
              この注文をキャンセルする
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
