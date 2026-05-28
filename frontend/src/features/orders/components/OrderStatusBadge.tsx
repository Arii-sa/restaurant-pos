import { OrderStatus } from "@/types";

type Props = {
  status: OrderStatus;
};

const STATUS_MAP: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: "受付中", className: "bg-yellow-50 text-yellow-600" },
  cooking: { label: "調理中", className: "bg-blue-50 text-blue-600" },
  served: { label: "提供済み", className: "bg-green-50 text-green-600" },
  completed: { label: "完了", className: "bg-gray-100 text-gray-500" },
  cancelled: { label: "キャンセル", className: "bg-red-50 text-red-500" },
};

export const OrderStatusBadge = ({ status }: Props) => {
  const { label, className } = STATUS_MAP[status] ?? STATUS_MAP.completed;
  return (
    <span
      className={`text-xs font-medium px-2.5 py-1 rounded-full ${className}`}
    >
      {label}
    </span>
  );
};
