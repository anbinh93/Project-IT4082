import React, { useState, useEffect } from 'react';

interface VehicleInfo {
  bienSo: string;
  loaiXe: string;
  thoiGianGui: string;
  trangThai: 'Đang gửi' | 'Tạm ngưng' | 'Đã rút';
}

interface EditVehiclePopupProps {
  vehicle: VehicleInfo;
  onClose: () => void;
  onSave: (newData: VehicleInfo) => void;
}

const EditVehiclePopup: React.FC<EditVehiclePopupProps> = ({ vehicle, onClose, onSave }) => {
  const [formData, setFormData] = useState<VehicleInfo>(vehicle);

  useEffect(() => {
    setFormData(vehicle);
  }, [vehicle]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto relative">
        <h2 className="text-2xl font-bold mb-4">Chỉnh sửa thông tin xe</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Biển số</label>
            <input
              name="bienSo"
              value={formData.bienSo}
              onChange={handleChange}
              className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Loại xe</label>
            <input
              name="loaiXe"
              value={formData.loaiXe}
              onChange={handleChange}
              className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Thời gian gửi</label>
            <input
              type="date"
              name="thoiGianGui"
              value={formData.thoiGianGui}
              onChange={handleChange}
              className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Trạng thái</label>
            <select
              name="trangThai"
              value={formData.trangThai}
              onChange={handleChange}
              className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            >
              <option value="Đang gửi">Đang gửi</option>
              <option value="Tạm ngưng">Tạm ngưng</option>
              <option value="Đã rút">Đã rút</option>
            </select>
          </div>
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
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVehiclePopup;