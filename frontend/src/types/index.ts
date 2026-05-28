// カテゴリ
export type Category = {
  id: number;
  name: string;
  sort_order: number;
};

// オプション項目
export type OptionItem = {
  id: number;
  option_group_id: number;
  name: string;
  price_diff: number;
  is_default: boolean;
};

// オプショングループ
export type OptionGroup = {
  id: number;
  product_id: number;
  name: string;
  type: "single" | "multi";
  required: boolean;
  option_items: OptionItem[];
};

// 商品
export type Product = {
  id: number;
  category_id: number;
  name: string;
  price: number;
  is_available: boolean;
  image_url: string | null;
  is_customizable: boolean;
  category: Category;
  option_groups: OptionGroup[];
};

// カートのオプション
export type CartItemOption = {
  option_item_id: number;
  option_item_name: string;
  price_diff: number;
};

// カートアイテム
export type CartItem = {
  cartId: string;
  product: Product;
  quantity: number;
  unit_price: number;
  subtotal: number;
  options: CartItemOption[];
};

// 注文タイプ
export type OrderType = "dine_in" | "takeout";

// 支払い方法
export type PaymentMethod = "cash" | "card" | "qr";

// 注文ステータス
export type OrderStatus =
  | "pending"
  | "cooking"
  | "served"
  | "completed"
  | "cancelled";

// 注文
export type Order = {
  id: number;
  user_id: number;
  order_type: OrderType;
  table_number: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  payment_method: PaymentMethod;
  status: OrderStatus;
  cancel_reason: string | null;
  cancelled_at: string | null;
  total_amount: number;
  ordered_at: string;
  order_items: OrderItem[];
};

// 注文明細
export type OrderItem = {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
  product: Product;
  order_item_options: OrderItemOption[];
};

// 注文明細オプション
export type OrderItemOption = {
  id: number;
  order_item_id: number;
  option_item_id: number;
  price_diff: number;
  option_item: OptionItem;
};

// 売上サマリー
export type SalesSummary = {
  period: string;
  total: number;
  count: number;
  average: number;
};

// 日別売上
export type DailySales = {
  date: string;
  total: number;
  count: number;
  by_payment: Record<string, number>;
};

// ユーザー
export type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "staff";
};

// 認証レスポンス
export type AuthResponse = {
  user: User;
  token: string;
};
