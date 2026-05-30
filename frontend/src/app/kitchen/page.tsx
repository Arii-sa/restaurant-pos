import { AuthGuard } from "@/features/auth/components/AuthGuard";
import { KitchenPage } from "@/features/kitchen/components/KitchenPage";

export default function Kitchen() {
  return (
    <AuthGuard>
      <KitchenPage />
    </AuthGuard>
  );
}
