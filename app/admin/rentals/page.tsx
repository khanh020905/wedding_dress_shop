"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import type { Rental, RentalStatus, Customer, Dress } from "@/types";
import { RENTAL_STATUS_LABEL } from "@/lib/labels";
import Modal from "@/components/admin/Modal";

const initialForm = {
  customerId: "",
  dressId: "",
  rentalDate: "",
  returnDate: "",
  deposit: "",
  totalPrice: "",
  status: "dat-coc" as RentalStatus,
  note: "",
};

export default function RentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);

  // Data for dropdowns
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [dresses, setDresses] = useState<Dress[]>([]);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Rental | null>(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchRentals = async () => {
    try {
      const res = await fetch("/api/admin/rentals");
      const data = await res.json();
      setRentals(data.items || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDependencies = useCallback(async () => {
    try {
      const [cusRes, drsRes] = await Promise.all([
        fetch("/api/admin/customers"),
        fetch("/api/admin/dresses")
      ]);
      const cusData = await cusRes.json();
      const drsData = await drsRes.json();
      setCustomers(cusData.items || []);
      setDresses(drsData.items || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchRentals();
    fetchDependencies();
  }, [fetchDependencies]);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xoá đơn thuê này?")) return;
    try {
      const res = await fetch(`/api/admin/rentals/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchRentals();
      } else {
        const data = await res.json();
        alert(data.message || "Xoá thất bại.");
      }
    } catch (err) {
      alert("Lỗi server.");
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/rentals/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchRentals();
      } else {
        const data = await res.json();
        alert(data.message || "Cập nhật thất bại.");
      }
    } catch (err) {
      alert("Lỗi server.");
    }
  };

  const handleOpenAdd = () => {
    setEditing(null);
    setForm(initialForm);
    setError("");
    setModalOpen(true);
  };

  const handleOpenEdit = (rental: Rental) => {
    setEditing(rental);
    setForm({
      customerId: rental.customerId,
      dressId: rental.dressId,
      rentalDate: rental.rentalDate?.slice(0, 10) ?? "",
      returnDate: rental.returnDate?.slice(0, 10) ?? "",
      deposit: rental.deposit.toString(),
      totalPrice: rental.totalPrice.toString(),
      status: rental.status,
      note: rental.note || "",
    });
    setError("");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const method = editing ? "PUT" : "POST";
      const url = editing ? `/api/admin/rentals/${editing._id}` : "/api/admin/rentals";

      const payload = {
        ...form,
        deposit: Number(form.deposit),
        totalPrice: Number(form.totalPrice),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setModalOpen(false);
        fetchRentals();
      } else {
        setError(data.message || "Lưu thất bại.");
      }
    } catch (err) {
      setError("Lỗi server. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn thuê</h1>
        <button 
          onClick={handleOpenAdd}
          className="mt-4 sm:mt-0 w-full sm:w-auto flex justify-center items-center px-4 py-2 bg-stone-900 text-white rounded-md hover:bg-stone-800 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tạo đơn thuê
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Đang tải...</div>
        ) : (
          <div className="overflow-x-auto">
            {/* Mobile Card View */}
            <div className="md:hidden p-4 space-y-4">
              {rentals.map((rental) => (
                <div key={rental._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col gap-3">
                  <div>
                    <div className="font-bold text-gray-900 text-base">{rental.customerName}</div>
                    <div className="text-gray-500 text-sm mt-1">{rental.dressName}</div>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md text-sm text-gray-600">
                    <span>Từ: {rental.rentalDate}</span>
                    <span>Đến: {rental.returnDate}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-xs text-gray-400">Cọc: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rental.deposit)}</div>
                      <div className="text-sm font-semibold text-gray-900 mt-1">Tổng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rental.totalPrice)}</div>
                    </div>
                    <div>
                      <select 
                        value={rental.status} 
                        onChange={(e) => handleStatusChange(rental._id, e.target.value)}
                        className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${
                          rental.status === 'dat-coc' ? 'bg-blue-100 text-blue-800' : ''
                        } ${
                          rental.status === 'dang-thue' ? 'bg-orange-100 text-orange-800' : ''
                        } ${
                          rental.status === 'da-tra' ? 'bg-green-100 text-green-800' : ''
                        } ${
                          rental.status === 'huy' ? 'bg-red-100 text-red-800' : ''
                        }`}
                      >
                        {Object.entries(RENTAL_STATUS_LABEL).map(([val, label]) => (
                          <option key={val} value={val}>{label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-4 mt-2 pt-2 border-t border-gray-100">
                    <button 
                      onClick={() => handleOpenEdit(rental)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(rental._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              {rentals.length === 0 && (
                <div className="text-center py-6 text-gray-500">Chưa có dữ liệu</div>
              )}
            </div>

            {/* Desktop Table View */}
            <table className="hidden md:table min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Váy cưới</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thanh toán</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rentals.map((rental) => (
                  <tr key={rental._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="font-medium">{rental.customerName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {rental.dressName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>Từ: {rental.rentalDate}</div>
                      <div>Đến: {rental.returnDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>Tổng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rental.totalPrice)}</div>
                      <div className="text-xs text-gray-400">Cọc: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rental.deposit)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <select 
                        value={rental.status} 
                        onChange={(e) => handleStatusChange(rental._id, e.target.value)}
                        className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${
                          rental.status === 'dat-coc' ? 'bg-blue-100 text-blue-800' : ''
                        } ${
                          rental.status === 'dang-thue' ? 'bg-orange-100 text-orange-800' : ''
                        } ${
                          rental.status === 'da-tra' ? 'bg-green-100 text-green-800' : ''
                        } ${
                          rental.status === 'huy' ? 'bg-red-100 text-red-800' : ''
                        }`}
                      >
                        {Object.entries(RENTAL_STATUS_LABEL).map(([val, label]) => (
                          <option key={val} value={val}>{label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleOpenEdit(rental)}
                        className="p-2 text-blue-600 hover:text-blue-900 mr-2 rounded-md"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:text-red-900 rounded-md" onClick={() => handleDelete(rental._id)}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {rentals.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">Chưa có dữ liệu</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        title={editing ? "Sửa đơn thuê" : "Tạo đơn thuê"}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSave} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm font-medium">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Khách hàng *</label>
              <select
                name="customerId"
                required
                value={form.customerId}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2.5 text-base sm:py-2 sm:text-sm border border-gray-300 rounded-md shadow-sm focus:ring-stone-500 focus:border-stone-500"
              >
                <option value="" disabled>-- Chọn khách hàng --</option>
                {customers.map((cus) => (
                  <option key={cus._id} value={cus._id}>
                    {cus.fullName} - {cus.phone}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Váy cưới *</label>
              <select
                name="dressId"
                required
                value={form.dressId}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2.5 text-base sm:py-2 sm:text-sm border border-gray-300 rounded-md shadow-sm focus:ring-stone-500 focus:border-stone-500"
              >
                <option value="" disabled>-- Chọn váy --</option>
                {dresses.map((drs) => (
                  <option key={drs._id} value={drs._id}>
                    {drs.code} - {drs.name} ({drs.status === "san-sang" ? "Sẵn sàng" : "Không sẵn sàng"})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Ngày bắt đầu thuê *</label>
              <input
                type="date"
                name="rentalDate"
                required
                value={form.rentalDate}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2.5 text-base sm:py-2 sm:text-sm border border-gray-300 rounded-md shadow-sm focus:ring-stone-500 focus:border-stone-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ngày trả váy *</label>
              <input
                type="date"
                name="returnDate"
                required
                value={form.returnDate}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2.5 text-base sm:py-2 sm:text-sm border border-gray-300 rounded-md shadow-sm focus:ring-stone-500 focus:border-stone-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tiền cọc (VND) *</label>
              <input
                type="number"
                name="deposit"
                required
                min={0}
                value={form.deposit}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2.5 text-base sm:py-2 sm:text-sm border border-gray-300 rounded-md shadow-sm focus:ring-stone-500 focus:border-stone-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tổng tiền (VND) *</label>
              <input
                type="number"
                name="totalPrice"
                required
                min={0}
                value={form.totalPrice}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2.5 text-base sm:py-2 sm:text-sm border border-gray-300 rounded-md shadow-sm focus:ring-stone-500 focus:border-stone-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Trạng thái *</label>
            <select
              name="status"
              required
              value={form.status}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2.5 text-base sm:py-2 sm:text-sm border border-gray-300 rounded-md shadow-sm focus:ring-stone-500 focus:border-stone-500"
            >
              {Object.entries(RENTAL_STATUS_LABEL).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
            <textarea
              name="note"
              rows={3}
              value={form.note}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2.5 text-base sm:py-2 sm:text-sm border border-gray-300 rounded-md shadow-sm focus:ring-stone-500 focus:border-stone-500"
            />
          </div>

          <div className="pt-4 flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="w-full sm:w-auto px-4 py-2.5 sm:py-2 border border-gray-300 shadow-sm text-base sm:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-4 py-2.5 sm:py-2 border border-transparent shadow-sm text-base sm:text-sm font-medium rounded-md text-white bg-stone-900 hover:bg-stone-800 disabled:opacity-70"
            >
              {saving ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
