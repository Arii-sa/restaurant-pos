import apiClient from "@/lib/axios";
import { Order, OrderStatus, DailySales, SalesSummary } from "@/types";

// 注文一覧取得
export const getOrders = async (): Promise<Order[]> => {
  const { data } = await apiClient.get("/api/orders");
  return data;
};

// 注文作成
export const createOrder = async (params: {
  order_type: string;
  table_number?: string;
  customer_name?: string;
  customer_phone?: string;
  payment_method: string;
  total_amount: number;
  items: {
    product_id: number;
    quantity: number;
    unit_price: number;
    subtotal: number;
    options?: {
      option_item_id: number;
      price_diff: number;
    }[];
  }[];
}): Promise<Order> => {
  const { data } = await apiClient.post("/api/orders", params);
  return data;
};

// 注文ステータス更新
export const updateOrderStatus = async (
  id: number,
  status: OrderStatus,
): Promise<Order> => {
  const { data } = await apiClient.patch(`/api/orders/${id}/status`, {
    status,
  });
  return data;
};

// 日別売上取得
export const getDailySales = async (date: string): Promise<DailySales> => {
  const { data } = await apiClient.get("/api/sales/daily", {
    params: { date },
  });
  return data;
};

// 売上サマリー取得
export const getSalesSummary = async (
  period: "week" | "month",
): Promise<SalesSummary> => {
  const { data } = await apiClient.get("/api/sales/summary", {
    params: { period },
  });
  return data;
};
