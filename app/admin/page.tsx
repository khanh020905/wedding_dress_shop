"use client";

import { useEffect, useState } from "react";
import { Sparkles, ShoppingBag, Calendar, DollarSign } from "lucide-react";

type Stats = {
  totalDresses: number;
  rentedDresses: number;
  newAppointments: number;
  rentalsByStatus: Record<string, number>;
  currentMonthRevenue: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => {
        if (!res.ok) throw new Error("Không tải được thống kê.");
        return res.json();
      })
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setStats(null);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-10">Đang tải dữ liệu...</div>;
  }

  if (!stats) {
    return <div className="text-center text-red-500 py-10">Lỗi tải dữ liệu.</div>;
  }

  const statCards = [
    { name: "Tổng váy cưới", value: stats.totalDresses, icon: Sparkles, color: "bg-blue-500" },
    { name: "Váy đang thuê", value: stats.rentedDresses, icon: ShoppingBag, color: "bg-orange-500" },
    { name: "Lịch hẹn mới", value: stats.newAppointments, icon: Calendar, color: "bg-green-500" },
    { 
      name: "Doanh thu tháng này", 
      value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.currentMonthRevenue), 
      icon: DollarSign, 
      color: "bg-purple-500" 
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((item) => (
          <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-3 rounded-md ${item.color} text-white`}>
                    <item.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{item.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Trạng thái đơn thuê</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-sm text-gray-500">Đặt cọc</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.rentalsByStatus['dat-coc'] || 0}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-sm text-gray-500">Đang thuê</p>
            <p className="text-2xl font-semibold text-orange-600">{stats.rentalsByStatus['dang-thue'] || 0}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-sm text-gray-500">Đã trả</p>
            <p className="text-2xl font-semibold text-green-600">{stats.rentalsByStatus['da-tra'] || 0}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-sm text-gray-500">Đã huỷ</p>
            <p className="text-2xl font-semibold text-red-600">{stats.rentalsByStatus['huy'] || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
