import { Order } from "@/types";
import { OrderStatusBadge } from "./OrderStatusBadge";

type Props = {
  order: Order;
  onClick: (order: Order) => void;
};

const PAYMENT_LABELS: Record<string, string> = {
  cash: "💴 現金",
  card: "💳 カード",
  qr: "📱 QR",
};

const ORDER_TYPE_LABELS: Record<string, string> = {
  dine_in: "🪑 店内",
  takeout: "🥡 テイクアウト",
};

export const OrderCard = ({ order, onClick }: Props) => {
  const orderedAt = new Date(order.ordered_at);
  const timeStr = orderedAt.toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateStr = orderedAt.toLocaleDateString("ja-JP", {
    month: "numeric",
    day: "numeric",
  });

  return (
    <button
      onClick={() => onClick(order)}
      className="w-full bg-white rounded-xl border border-gray-200 p-4 text-left hover:border-orange-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-gray-800">#{order.id}</span>
            <OrderStatusBadge status={order.status} />
            <span className="text-xs text-gray-400">
              {ORDER_TYPE_LABELS[order.order_type]}
            </span>
            {order.order_type === "dine_in" && order.table_number && (
              <span className="text-xs bg-orange-50 text-orange-500 px-2 py-0.5 rounded-full">
                {order.table_number}
              </span>
            )}
            {order.order_type === "takeout" && order.customer_name && (
              <span className="text-xs bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full">
                {order.customer_name}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400 mt-1">
            {order.order_items?.map((item) => item.product?.name).join("・")}
          </p>
        </div>

        <div className="text-right shrink-0">
          <p className="font-bold text-orange-500">
            ¥{order.total_amount.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {PAYMENT_LABELS[order.payment_method]}
          </p>
          <p className="text-xs text-gray-400">
            {dateStr} {timeStr}
          </p>
        </div>
      </div>
    </button>
  );
};
