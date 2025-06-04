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
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
        <h2 className="text-lg font-semibold mb-4">Chỉnh sửa thông tin xe</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Biển số</label>
            <input
              name="bienSo"
              value={formData.bienSo}
              onChange={handleChange}
              className="w-full border rounded p-2"
              disabled
            />
          </div>
          <div>
            <label className="block mb-1">Loại xe</label>
            <input
              name="loaiXe"
              value={formData.loaiXe}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Thời gian gửi</label>
            <input
              type="date"
              name="thoiGianGui"
              value={formData.thoiGianGui}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Trạng thái</label>
            <select
              name="trangThai"
              value={formData.trangThai}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="Đang gửi">Đang gửi</option>
              <option value="Tạm ngưng">Tạm ngưng</option>
              <option value="Đã rút">Đã rút</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
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