import { LayoutDashboard, Users, Sparkles, Calendar, ClipboardList } from "lucide-react";

export const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Váy cưới", href: "/admin/dresses", icon: Sparkles },
  { name: "Khách hàng", href: "/admin/customers", icon: Users },
  { name: "Đơn thuê", href: "/admin/rentals", icon: ClipboardList },
  { name: "Lịch hẹn", href: "/admin/appointments", icon: Calendar },
];
