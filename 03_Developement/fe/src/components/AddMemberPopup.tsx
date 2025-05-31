import React, { useState } from 'react';

interface AddMemberPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (member: {
    tenNhanKhau: string;
    quanHeVoiChuHo: string;
    ngayThem: string;
  }) => void;
  residents?: { id: string; name: string }[];
}

const AddMemberPopup: React.FC<AddMemberPopupProps> = ({ isOpen, onClose, onAdd, residents = [] }) => {
  const [formData, setFormData] = useState({
    tenNhanKhau: '',
    quanHeVoiChuHo: '',
    ngayThem: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Thêm Nhân khẩu vào Hộ khẩu</h2>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nhân khẩu</label>
            <select
              name="tenNhanKhau"
              value={formData.tenNhanKhau}
              onChange={handleInputChange}
              className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none appearance-none"
              required
            >
              <option value="">Chọn nhân khẩu</option>
              {residents.map(r => (
                <option key={r.id} value={r.name}>{r.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Quan hệ với chủ hộ</label>
            <select
              name="quanHeVoiChuHo"
              value={formData.quanHeVoiChuHo}
              onChange={handleInputChange}
              className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none appearance-none"
              required
            >
              <option value="">Chọn quan hệ</option>
              <option value="Con">Con</option>
              <option value="Vợ/Chồng">Vợ/Chồng</option>
              <option value="Cha/Mẹ">Cha/Mẹ</option>
              <option value="Anh/Chị/Em">Anh/Chị/Em</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày thêm</label>
            <input
              type="date"
              name="ngayThem"
              value={formData.ngayThem}
              onChange={handleInputChange}
              className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              required
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border border-gray-300 rounded-xl text-gray-700 font-semibold bg-white hover:bg-gray-50 shadow-sm"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-500 text-white rounded-xl font-semibold shadow hover:bg-blue-600 transition"
            >
              Thêm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberPopup;
