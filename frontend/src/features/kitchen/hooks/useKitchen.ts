import { useState, useEffect, useRef } from "react";
import { Order, OrderStatus } from "@/types";
import { getOrders, updateOrderStatus } from "@/lib/api/orders";

const POLLING_INTERVAL = 5000;

export const useKitchen = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [allTodayOrders, setAllTodayOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(false);

  const fetchOrders = async (showLoading = false) => {
    try {
      if (showLoading) setIsLoading(true);
      const data = await getOrders();

      // 今日の全注文（順番計算用）
      const today = new Date().toDateString();
      const todayOrders = data
        .filter((o) => new Date(o.ordered_at).toDateString() === today)
        .sort(
          (a, b) =>
            new Date(a.ordered_at).getTime() - new Date(b.ordered_at).getTime(),
        );
      setAllTodayOrders(todayOrders);

      // キッチン表示用（pending・cookingのみ）
      const kitchenOrders = data.filter((o) =>
        ["pending", "cooking"].includes(o.status),
      );
      setOrders(kitchenOrders);
      setLastUpdated(new Date());
      setError(null);
    } catch {
      setError("注文データの取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isMounted.current) return;
    isMounted.current = true;

    const init = async () => {
      await fetchOrders(true);
      intervalRef.current = setInterval(() => {
        fetchOrders(false).catch(() => {});
      }, POLLING_INTERVAL);
    };

    init().catch(() => {});

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleUpdateStatus = async (orderId: number, status: OrderStatus) => {
    try {
      const updated = await updateOrderStatus(orderId, status);
      if (status === "served") {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
      } else {
        setOrders((prev) =>
          prev.map((o) => (o.id === updated.id ? updated : o)),
        );
      }
    } catch {
      alert("ステータスの更新に失敗しました");
    }
  };

  return {
    orders,
    allTodayOrders,
    isLoading,
    error,
    lastUpdated,
    handleUpdateStatus,
    refetch: () => {
      fetchOrders(false).catch(() => {});
    },
  };
};
