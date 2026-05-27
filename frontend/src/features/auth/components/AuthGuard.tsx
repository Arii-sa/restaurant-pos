"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";

type Props = {
  children: React.ReactNode;
  requireAdmin?: boolean;
};

export const AuthGuard = ({ children, requireAdmin = false }: Props) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (isLoading || hasRedirected.current) return;

    if (!isAuthenticated) {
      hasRedirected.current = true;
      router.push("/login");
      return;
    }

    if (requireAdmin && !isAdmin) {
      hasRedirected.current = true;
      router.push("/");
    }
  }, [isLoading, isAuthenticated, isAdmin, requireAdmin, router]);

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return null;
  if (requireAdmin && !isAdmin) return null;

  return <>{children}</>;
};
