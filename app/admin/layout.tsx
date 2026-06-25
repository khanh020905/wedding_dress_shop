"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { navItems } from "@/lib/nav";
import MobileNav from "@/components/admin/MobileNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/admin/logout", { method: "POST" });
      if (res.ok) {
        router.push("/admin/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex fixed inset-y-0 z-10">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <span className="text-xl font-bold text-gray-900 tracking-tight">Dream & Dress <span className="text-sm font-normal text-gray-500 ml-1">CMS</span></span>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-stone-900 text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <item.icon className={`w-5 h-5 mr-3 ${isActive ? "text-white" : "text-gray-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-64">
        {/* Mobile Header (Sticky) */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 sm:px-6 md:hidden sticky top-0 z-30">
          <MobileNav />
          <span className="text-lg font-bold text-gray-900 ml-3">Dream & Dress CMS</span>
        </header>
        
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

