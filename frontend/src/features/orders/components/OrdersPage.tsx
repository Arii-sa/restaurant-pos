"use client";

import { useState } from "react";
import { Order } from "@/types";
import { useOrders } from "@/features/orders/hooks/useOrders";
import { OrderCard } from "./OrderCard";
import { OrderDetailModal } from "./OrderDetailModal";
import { CancelModal } from "./CancelModal";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { ErrorMessage } from "@/shared/components/ErrorMessage";
import { cancelOrder } from "@/lib/api/orders";

export const OrdersPage = () => {
  const { orders, setOrders, isLoading, error } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancellingOrder, setCancellingOrder] = useState<Order | null>(null);

  // 注文が何日目の何番目かを計算
  const getDailyNumber = (order: Order) => {
    const orderDate = new Date(order.ordered_at).toDateString();
    const sameDayOrders = orders
      .filter(
        (o) =>
          new Date(o.ordered_at).toDateString() === orderDate &&
          o.status !== "cancelled",
      )
      .sort(
        (a, b) =>
          new Date(a.ordered_at).getTime() - new Date(b.ordered_at).getTime(),
      );
    const index = sameDayOrders.findIndex((o) => o.id === order.id);
    return index + 1;
  };

  const handleCancelClick = (order: Order) => {
    setSelectedOrder(null);
    setCancellingOrder(order);
  };

  const handleCancelConfirm = async (reason: string) => {
    if (!cancellingOrder) return;
    const updated = await cancelOrder(cancellingOrder.id, reason);
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    setCancellingOrder(null);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-xl font-bold text-gray-800 mb-6">📋 注文履歴</h1>

        {orders.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📋</p>
            <p>注文履歴がありません</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onClick={setSelectedOrder}
              />
            ))}
          </div>
        )}
      </div>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          dailyNumber={getDailyNumber(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          onCancel={handleCancelClick}
        />
      )}

      {cancellingOrder && (
        <CancelModal
          order={cancellingOrder}
          onConfirm={handleCancelConfirm}
          onClose={() => setCancellingOrder(null)}
        />
      )}
    </div>
  );
};
