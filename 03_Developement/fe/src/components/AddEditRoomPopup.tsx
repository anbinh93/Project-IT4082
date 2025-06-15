import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Room as RoomType } from '../services/roomService';

// Extended room interface for UI display with tenant information
interface Room extends Omit<RoomType, 'id'> {
  id?: number;
  hoThue?: string; // Name of the tenant head
}

interface Tenant {
  id: string;
  tenChuHo: string;
  soHoKhau: string;
  soPhong: string;
  ngayBatDau: string;
  sdt: string;
}

interface AddEditRoomPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (room: Room) => void;
  editData: Room | null;
  tenants?: Tenant[]; // Optional, not used in this component
}

const AddEditRoomPopup: React.FC<AddEditRoomPopupProps> = ({
  isOpen,
  onClose,
  onSave,
  editData
}) => {
  const [formData, setFormData] = useState<Room>({
    soPhong: '',
    tang: '',
    dienTich: 0,
    trangThai: 'trong', // Default value
    hoThue: '',
    ngayBatDau: '',
    ghiChu: ''
  });

  useEffect(() => {
    if (editData) {
      // Copy all fields from editData
      setFormData({
        ...editData
      });
    } else {
      // Reset form with default values
      setFormData({
        soPhong: '',
        tang: '',
        dienTich: 0,
        trangThai: 'trong',
        hoThue: '',
        ngayBatDau: '',
        ghiChu: ''
      });
    }
  }, [editData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'dienTich') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose}></div>
      <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {editData ? 'Chỉnh sửa phòng' : 'Thêm phòng mới'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số phòng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="soPhong"
                value={formData.soPhong}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="VD: 101"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tầng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="tang"
                value={formData.tang}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="VD: 1"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Diện tích (m²) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="dienTich"
                value={formData.dienTich}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="VD: 30"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                name="trangThai"
                value={formData.trangThai}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="trong">Trống</option>
                <option value="da_thue">Đã thuê</option>
                <option value="bao_tri">Bảo trì</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ghi chú
            </label>
            <textarea
              name="ghiChu"
              value={formData.ghiChu || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập ghi chú về phòng..."
              rows={3}
            />
          </div>

          <div className="border-t border-gray-200 py-4 mt-6">
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-offset-1 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-offset-1 transition-colors"
              >
                {editData ? 'Cập nhật' : 'Thêm mới'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditRoomPopup;
