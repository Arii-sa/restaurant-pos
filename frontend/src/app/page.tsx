import { AuthGuard } from "@/features/auth/components/AuthGuard";
import { RegisterPage } from "@/features/register/components/RegisterPage";

export default function Home() {
  return (
    <AuthGuard>
      <RegisterPage />
    </AuthGuard>
  );
}
