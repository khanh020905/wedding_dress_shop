"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import type { Dress, DressStatus, DressCategory } from "@/types";
import { DRESS_STATUS_LABEL, DRESS_CATEGORY_LABEL } from "@/lib/labels";
import Modal from "@/components/admin/Modal";

const initialForm = {
  code: "",
  name: "",
  category: "da-hoi" as DressCategory,
  size: "",
  color: "",
  rentalPrice: "",
  salePrice: "",
  status: "san-sang" as DressStatus,
  images: "",
  description: "",
};

export default function DressesPage() {
  const [dresses, setDresses] = useState<Dress[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Dress | null>(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchDresses = async () => {
    try {
      const res = await fetch("/api/admin/dresses");
      const data = await res.json();
      setDresses(data.items || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDresses();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xoá váy này?")) return;
    try {
      const res = await fetch(`/api/admin/dresses/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchDresses();
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

  const handleOpenEdit = (dress: Dress) => {
    setEditing(dress);
    setForm({
      code: dress.code,
      name: dress.name,
      category: dress.category,
      size: dress.size.join(", "),
      color: dress.color || "",
      rentalPrice: dress.rentalPrice.toString(),
      salePrice: dress.salePrice?.toString() || "",
      status: dress.status,
      images: dress.images?.join("\n") || "",
      description: dress.description || "",
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
      const url = editing ? `/api/admin/dresses/${editing._id}` : "/api/admin/dresses";

      const payload = {
        ...form,
        size: form.size.split(",").map((s) => s.trim()).filter(Boolean),
        images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
        rentalPrice: Number(form.rentalPrice),
        salePrice: form.salePrice ? Number(form.salePrice) : undefined,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setModalOpen(false);
        fetchDresses();
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
        <h1 className="text-2xl font-bold text-gray-900">Quản lý váy cưới</h1>
        <button 
          onClick={handleOpenAdd}
          className="mt-4 sm:mt-0 w-full sm:w-auto flex justify-center items-center px-4 py-2 bg-stone-900 text-white rounded-md hover:bg-stone-800 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm váy cưới
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Đang tải...</div>
        ) : (
          <div className="overflow-x-auto">
            {/* Mobile Card View */}
            <div className="md:hidden p-4 space-y-4">
              {dresses.map((dress) => (
                <div key={dress._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-gray-900 text-base">{dress.code} - {dress.name}</div>
                      <div className="text-gray-500 text-sm mt-1">{DRESS_CATEGORY_LABEL[dress.category] || dress.category}</div>
                      <div className="text-gray-900 font-medium text-sm mt-1">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dress.rentalPrice)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${dress.status === 'san-sang' ? 'bg-green-100 text-green-800' : ''}
                      ${dress.status === 'dang-thue' ? 'bg-orange-100 text-orange-800' : ''}
                      ${dress.status === 'bao-tri' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${dress.status === 'ngung' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {DRESS_STATUS_LABEL[dress.status] || dress.status}
                    </span>
                  </div>
                  <div className="flex justify-end gap-4 mt-2 pt-2 border-t border-gray-100">
                    <button 
                      onClick={() => handleOpenEdit(dress)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(dress._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              {dresses.length === 0 && (
                <div className="text-center py-6 text-gray-500">Chưa có dữ liệu</div>
              )}
            </div>

            {/* Desktop Table View */}
            <table className="hidden md:table min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã váy</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên váy</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dòng váy</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá thuê</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dresses.map((dress) => (
                  <tr key={dress._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dress.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dress.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{DRESS_CATEGORY_LABEL[dress.category] || dress.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dress.rentalPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${dress.status === 'san-sang' ? 'bg-green-100 text-green-800' : ''}
                        ${dress.status === 'dang-thue' ? 'bg-orange-100 text-orange-800' : ''}
                        ${dress.status === 'bao-tri' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${dress.status === 'ngung' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {DRESS_STATUS_LABEL[dress.status] || dress.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleOpenEdit(dress)}
                        className="p-2 text-blue-600 hover:text-blue-900 mr-2 rounded-md"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(dress._id)}
                        className="p-2 text-red-600 hover:text-red-900 rounded-md"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {dresses.length === 0 && (
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
        title={editing ? "Sửa váy cưới" : "Thêm váy cưới"}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSave} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm font-medium">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Mã váy *</label>
              <input
                type="text"
                name="code"
                required
                value={form.code}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2.5 text-base sm:py-2 sm:text-sm border border-gray-300 rounded-md shadow-sm focus:ring-stone-500 focus:border-stone-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tên váy *</label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2.5 text-base sm:py-2 sm:text-sm border border-gray-300 rounded-md shadow-sm focus:ring-stone-500 focus:border-stone-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Dòng váy *</label>
              <select
                name="category"
                required
                value={form.category}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2.5 text-base sm:py-2 sm:text-sm border border-gray-300 rounded-md shadow-sm focus:ring-stone-500 focus:border-stone-500"
              >
                {Object.entries(DRESS_CATEGORY_LABEL).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
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
                {Object.entries(DRESS_STATUS_LABEL).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Size (S, M, L) *</label>
              <input
                type="text"
                name="size"
                required
                value={form.size}
                onChange={handleChange}
                placeholder="Ví dụ: S, M, L"
                className="mt-1 block w-full px-3 py-2.5 text-base sm:py-2 sm:text-sm border border-gray-300 rounded-md shadow-sm focus:ring-stone-500 focus:border-stone-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Màu sắc</label>
              <input
                type="text"
                name="color"
                value={form.color}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2.5 text-base sm:py-2 sm:text-sm border border-gray-300 rounded-md shadow-sm focus:ring-stone-500 focus:border-stone-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Giá thuê (VND) *</label>
              <input
                type="number"
                name="rentalPrice"
                required
                min={0}
                value={form.rentalPrice}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2.5 text-base sm:py-2 sm:text-sm border border-gray-300 rounded-md shadow-sm focus:ring-stone-500 focus:border-stone-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Giá bán (VND)</label>
              <input
                type="number"
                name="salePrice"
                min={0}
                value={form.salePrice}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2.5 text-base sm:py-2 sm:text-sm border border-gray-300 rounded-md shadow-sm focus:ring-stone-500 focus:border-stone-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Images (Mỗi URL một dòng)</label>
            <textarea
              name="images"
              rows={3}
              value={form.images}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2.5 text-base sm:py-2 sm:text-sm border border-gray-300 rounded-md shadow-sm focus:ring-stone-500 focus:border-stone-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mô tả</label>
            <textarea
              name="description"
              rows={3}
              value={form.description}
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
