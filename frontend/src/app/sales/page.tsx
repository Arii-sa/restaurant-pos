import { AuthGuard } from "@/features/auth/components/AuthGuard";
import { SalesPage } from "@/features/sales/components/SalesPage";

export default function Sales() {
  return (
    <AuthGuard requireAdmin>
      <SalesPage />
    </AuthGuard>
  );
}
