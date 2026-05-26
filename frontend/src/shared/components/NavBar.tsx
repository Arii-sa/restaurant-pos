"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const NavBar = () => {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "🍔 レジ" },
    { href: "/admin", label: "🛠️ 商品管理" },
    { href: "/sales", label: "📊 売上管理" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-6">
      {links.map((link) => (
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
    </nav>
  );
};
