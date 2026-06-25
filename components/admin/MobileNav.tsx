"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { navItems } from "@/lib/nav";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Close when pathname changes (navigation)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll and handle Esc
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/admin/logout", { method: "POST" });
      if (res.ok) {
        setIsOpen(false);
        router.push("/admin/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-md md:hidden"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <span className="text-xl font-bold text-gray-900 tracking-tight">D&amp;D <span className="text-sm font-normal text-gray-500 ml-1">CMS</span></span>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 -mr-2 text-gray-400 hover:bg-gray-100 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-3 rounded-lg text-base font-medium transition-colors ${
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
            className="flex items-center w-full px-3 py-3 text-base font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Đăng xuất
          </button>
        </div>
      </div>
    </>
  );
}
