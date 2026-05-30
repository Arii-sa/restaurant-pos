"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const NavBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, isLoading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (pathname === "/login") return null;
  if (pathname === "/kitchen") return null;

  const links = [
    { href: "/", label: "🍔 レジ", adminOnly: false },
    { href: "/orders", label: "📋 注文履歴", adminOnly: false },
    { href: "/kitchen", label: "🍳 キッチン", adminOnly: false },
    { href: "/admin", label: "🛠️ 商品管理", adminOnly: true },
    { href: "/sales", label: "📊 売上管理", adminOnly: true },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        {!isLoading &&
          links
            .filter((link) => !link.adminOnly || isAdmin)
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-orange-500"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {link.label}
              </Link>
            ))}
      </div>

      <div className="flex items-center gap-4">
        {!isLoading && user && (
          <span className="text-sm text-gray-400">
            {user.name}
            <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
              {user.role === "admin" ? "管理者" : "店員"}
            </span>
          </span>
        )}
        {!isLoading && user && (
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-red-500 transition-colors"
          >
            ログアウト
          </button>
        )}
      </div>
    </nav>
  );
};
