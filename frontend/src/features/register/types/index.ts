import { CartItem, OrderType, PaymentMethod } from "@/types";

// レジの画面ステップ
export type RegisterStep = "order" | "confirm" | "payment" | "complete";

// レジの状態
export type RegisterState = {
  step: RegisterStep;
  orderType: OrderType | null;
  tableNumber: string;
  customerName: string;
  customerPhone: string;
  paymentMethod: PaymentMethod | null;
  cart: CartItem[];
};
