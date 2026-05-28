import { useState, useEffect, useRef } from "react";
import { Order } from "@/types";
import { getOrders } from "@/lib/api/orders";

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const load = async () => {
      try {
        setIsLoading(true);
        const data = await getOrders();
        setOrders(data);
      } catch {
        setError("注文履歴の取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  return { orders, setOrders, isLoading, error };
};
