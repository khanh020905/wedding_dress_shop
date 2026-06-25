"use client";

import { useEffect, useState } from "react";
import type { Appointment } from "@/types";
import { APPOINTMENT_STATUS_LABEL } from "@/lib/labels";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/admin/appointments");
      const data = await res.json();
      setAppointments(data.items || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/appointments/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchAppointments();
      } else {
        const data = await res.json();
        alert(data.message || "Cập nhật thất bại.");
      }
    } catch (err) {
      alert("Lỗi server.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Danh sách lịch hẹn</h1>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Đang tải...</div>
        ) : (
          <div className="overflow-x-auto">
            {/* Mobile Card View */}
            <div className="md:hidden p-4 space-y-4">
              {appointments.map((appt) => (
                <div key={appt._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-gray-900 text-base">{appt.fullName}</div>
                      <div className="text-gray-500 text-sm mt-1">{appt.phone}</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-600">
                    <div className="font-medium text-gray-900">{appt.appointmentDate} - {appt.appointmentTime}</div>
                    <div className="mt-1">Thử: {appt.experience} ({appt.guests} người)</div>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <div className="text-xs text-gray-400">
                      Gửi: {new Date(appt.createdAt).toLocaleDateString("vi-VN")}
                    </div>
                    <div>
                      <select 
                        value={appt.status} 
                        onChange={(e) => handleStatusChange(appt._id, e.target.value)}
                        className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${
                          appt.status === 'moi' ? 'bg-blue-100 text-blue-800' : ''
                        } ${
                          appt.status === 'da-lien-he' ? 'bg-yellow-100 text-yellow-800' : ''
                        } ${
                          appt.status === 'da-den' ? 'bg-green-100 text-green-800' : ''
                        } ${
                          appt.status === 'huy' ? 'bg-red-100 text-red-800' : ''
                        }`}
                      >
                        {Object.entries(APPOINTMENT_STATUS_LABEL).map(([val, label]) => (
                          <option key={val} value={val}>{label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              {appointments.length === 0 && (
                <div className="text-center py-6 text-gray-500">Chưa có dữ liệu</div>
              )}
            </div>

            {/* Desktop Table View */}
            <table className="hidden md:table min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày gửi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lịch hẹn</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trải nghiệm</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appt) => (
                  <tr key={appt._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(appt.createdAt).toLocaleString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="font-medium">{appt.fullName}</div>
                      <div className="text-gray-500">{appt.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {appt.appointmentDate} <br /> {appt.appointmentTime}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {appt.experience} ({appt.guests} người)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <select 
                        value={appt.status} 
                        onChange={(e) => handleStatusChange(appt._id, e.target.value)}
                        className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${
                          appt.status === 'moi' ? 'bg-blue-100 text-blue-800' : ''
                        } ${
                          appt.status === 'da-lien-he' ? 'bg-yellow-100 text-yellow-800' : ''
                        } ${
                          appt.status === 'da-den' ? 'bg-green-100 text-green-800' : ''
                        } ${
                          appt.status === 'huy' ? 'bg-red-100 text-red-800' : ''
                        }`}
                      >
                        {Object.entries(APPOINTMENT_STATUS_LABEL).map(([val, label]) => (
                          <option key={val} value={val}>{label}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
                {appointments.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">Chưa có dữ liệu</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
