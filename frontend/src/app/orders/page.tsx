import { AuthGuard } from "@/features/auth/components/AuthGuard";
import { OrdersPage } from "@/features/orders/components/OrdersPage";

export default function Orders() {
  return (
    <AuthGuard>
      <OrdersPage />
    </AuthGuard>
  );
}
