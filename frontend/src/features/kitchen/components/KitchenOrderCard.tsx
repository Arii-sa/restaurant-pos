"use client";

import { Order, OrderStatus } from "@/types";
import { useElapsedTime } from "@/features/kitchen/hooks/useElapsedTime";

type Props = {
  order: Order;
  dailyNumber: number;
  onUpdateStatus: (orderId: number, status: OrderStatus) => void;
};

const ORDER_TYPE_LABELS: Record<string, string> = {
  dine_in: "🪑 店内",
  takeout: "🥡 テイクアウト",
};

export const KitchenOrderCard = ({
  order,
  dailyNumber,
  onUpdateStatus,
}: Props) => {
  const { elapsed, isUrgent } = useElapsedTime(order.ordered_at);

  return (
    <div
      className={`bg-white rounded-xl border-2 p-4 flex flex-col gap-3 transition-all ${
        order.status === "cooking" ? "border-blue-400" : "border-gray-200"
      } ${isUrgent ? "shadow-md" : ""}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-800">
              #{dailyNumber}
            </span>
            <span className="text-sm text-gray-400">
              {ORDER_TYPE_LABELS[order.order_type]}
            </span>
          </div>
          {order.order_type === "dine_in" && order.table_number && (
            <span className="text-sm font-medium text-orange-500">
              テーブル {order.table_number}
            </span>
          )}
          {order.order_type === "takeout" && order.customer_name && (
            <span className="text-sm font-medium text-blue-500">
              {order.customer_name}
            </span>
          )}
        </div>

        <div
          className={`text-right ${isUrgent ? "text-red-500" : "text-gray-400"}`}
        >
          <p className="text-xs">経過時間</p>
          <p className={`text-sm font-bold ${isUrgent ? "animate-pulse" : ""}`}>
            {elapsed}
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        {order.order_items?.map((item) => (
          <div key={item.id} className="flex items-start gap-2">
            <span className="text-orange-500 font-bold text-sm min-w-5">
              x{item.quantity}
            </span>
            <div>
              <p className="text-sm font-medium text-gray-800">
                {item.product?.name}
              </p>
              {item.order_item_options?.length > 0 && (
                <p className="text-xs text-gray-400">
                  {item.order_item_options
                    .map((o) => o.option_item?.name)
                    .join(" / ")}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-gray-100">
        {order.status === "pending" && (
          <button
            onClick={() => onUpdateStatus(order.id, "cooking")}
            className="w-full py-2.5 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition-colors"
          >
            🍳 調理開始
          </button>
        )}
        {order.status === "cooking" && (
          <button
            onClick={() => onUpdateStatus(order.id, "served")}
            className="w-full py-2.5 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors"
          >
            ✅ 提供完了
          </button>
        )}
      </div>
    </div>
  );
};
