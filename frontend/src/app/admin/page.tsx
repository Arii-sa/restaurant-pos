import { AuthGuard } from "@/features/auth/components/AuthGuard";
import { AdminPage } from "@/features/admin/components/AdminPage";

export default function Admin() {
  return (
    <AuthGuard requireAdmin>
      <AdminPage />
    </AuthGuard>
  );
}
