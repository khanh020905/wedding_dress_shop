"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import type { Customer } from "@/types";
import Modal from "@/components/admin/Modal";

const initialForm = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  note: "",
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/admin/customers");
      const data = await res.json();
      setCustomers(data.items || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xoá khách hàng này?")) return;
    try {
      const res = await fetch(`/api/admin/customers/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchCustomers();
      } else {
        const data = await res.json();
        alert(data.message || "Xoá thất bại.");
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

  const handleOpenEdit = (customer: Customer) => {
    setEditing(customer);
    setForm({
      fullName: customer.fullName,
      phone: customer.phone,
      email: customer.email || "",
      address: customer.address || "",
      note: customer.note || "",
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
      const url = editing ? `/api/admin/customers/${editing._id}` : "/api/admin/customers";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setModalOpen(false);
        fetchCustomers();
      } else {
        setError(data.message || "Lưu thất bại.");
      }
    } catch (err) {
      setError("Lỗi server. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý khách hàng</h1>
        <button 
          onClick={handleOpenAdd}
          className="mt-4 sm:mt-0 w-full sm:w-auto flex justify-center items-center px-4 py-2 bg-stone-900 text-white rounded-md hover:bg-stone-800 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm khách hàng
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Đang tải...</div>
        ) : (
          <div className="overflow-x-auto">
            {/* Mobile Card View */}
            <div className="md:hidden p-4 space-y-4">
              {customers.map((customer) => (
                <div key={customer._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-gray-900 text-base">{customer.fullName}</div>
                      <div className="text-gray-500 text-sm mt-1">{customer.phone}</div>
                      {customer.email && <div className="text-gray-500 text-sm">{customer.email}</div>}
                    </div>
                  </div>
                  <div className="flex justify-end gap-4 mt-2 pt-2 border-t border-gray-100">
                    <button 
                      onClick={() => handleOpenEdit(customer)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(customer._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              {customers.length === 0 && (
                <div className="text-center py-6 text-gray-500">Chưa có dữ liệu</div>
              )}
            </div>

            {/* Desktop Table View */}
            <table className="hidden md:table min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ và tên</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số điện thoại</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.map((customer) => (
                  <tr key={customer._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.email || "—"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleOpenEdit(customer)}
                        className="p-2 text-blue-600 hover:text-blue-900 mr-2 rounded-md"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(customer._id)}
                        className="p-2 text-red-600 hover:text-red-900 rounded-md"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {customers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">Chưa có dữ liệu</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        title={editing ? "Sửa khách hàng" : "Thêm khách hàng"}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSave} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm font-medium">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Họ và tên *</label>
            <input
              type="text"
              name="fullName"
              required
              value={form.fullName}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2.5 text-base sm:py-2 sm:text-sm border border-gray-300 rounded-md shadow-sm focus:ring-stone-500 focus:border-stone-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Số điện thoại *</label>
            <input
              type="tel"
              name="phone"
              required
              value={form.phone}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2.5 text-base sm:py-2 sm:text-sm border border-gray-300 rounded-md shadow-sm focus:ring-stone-500 focus:border-stone-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2.5 text-base sm:py-2 sm:text-sm border border-gray-300 rounded-md shadow-sm focus:ring-stone-500 focus:border-stone-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2.5 text-base sm:py-2 sm:text-sm border border-gray-300 rounded-md shadow-sm focus:ring-stone-500 focus:border-stone-500"
            />
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
