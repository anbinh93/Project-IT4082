import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Room as RoomType } from '../services/roomService';

// Extended room interface with tenant-related information
interface ExtendedRoom extends RoomType {
  hoThue?: string; // Name of the tenant head
}

// Household definition
interface Household {
  soHoKhau: number;
  chuHoInfo?: {
    hoTen: string;
    sdt?: string;
  };
}

// Tenant information for room assignment
interface Tenant {
  id: string;
  tenChuHo: string;
  nguoiThue: string; // Người thuê thực tế (có thể khác chủ hộ)
  soHoKhau: string;
  soPhong: string;
  ngayBatDau: string;
  sdt: string;
}

interface AddEditTenantPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tenant: Tenant) => void;
  availableRooms: ExtendedRoom[];
  households?: Household[];
}

const AddEditTenantPopup: React.FC<AddEditTenantPopupProps> = ({
  isOpen,
  onClose,
  onSave,
  availableRooms,
  households = []
}) => {
  const [formData, setFormData] = useState<Tenant>({
    id: '',
    tenChuHo: '',
    nguoiThue: '',
    soHoKhau: '',
    soPhong: '',
    ngayBatDau: new Date().toISOString().split('T')[0],
    sdt: ''
  });
  
  // Use households directly from props

  useEffect(() => {
    if (isOpen) {
      // Reset form when opening the popup
      setFormData({
        id: '',
        tenChuHo: '',
        nguoiThue: '',
        soHoKhau: '',
        soPhong: '',
        ngayBatDau: new Date().toISOString().split('T')[0],
        sdt: ''
      });
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'soHoKhau') {
      // When household is selected, auto-fill the household head name and phone
      const selectedHousehold = households.find(h => h.soHoKhau.toString() === value);
      if (selectedHousehold?.chuHoInfo) {
        setFormData({
          ...formData,
          [name]: value,
          tenChuHo: selectedHousehold.chuHoInfo.hoTen || '',
          sdt: selectedHousehold.chuHoInfo?.sdt || ''
        });
      } else {
        setFormData({
          ...formData,
          [name]: value
        });
      }
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
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      id: '',
      tenChuHo: '',
      nguoiThue: '',
      soHoKhau: '',
      soPhong: '',
      ngayBatDau: new Date().toISOString().split('T')[0],
      sdt: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose}></div>
      <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Thêm hộ thuê mới</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên chủ hộ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="tenChuHo"
              value={formData.tenChuHo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="VD: Nguyễn Văn A"
              readOnly={Boolean(formData.soHoKhau)}
              required
            />
            {Boolean(formData.soHoKhau) && (
              <p className="text-xs text-gray-500 mt-1">Tự động điền theo hộ khẩu đã chọn</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Người thuê thực tế <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nguoiThue"
              value={formData.nguoiThue}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="VD: Nguyễn Thị B (có thể khác chủ hộ)"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Người thực tế sống trong phòng (có thể khác chủ hộ)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hộ khẩu <span className="text-red-500">*</span>
            </label>
            <select
              name="soHoKhau"
              value={formData.soHoKhau}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Chọn hộ khẩu</option>
              {households.map(household => (
                <option key={household.soHoKhau} value={household.soHoKhau.toString()}>
                  {household.soHoKhau} - {household.chuHoInfo?.hoTen || 'Không có chủ hộ'}
                </option>
              ))}
            </select>
            {households.length === 0 && (
              <p className="text-sm text-red-500 mt-1">Không có hộ khẩu nào</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="sdt"
              value={formData.sdt}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="VD: 0912345678"
              readOnly={Boolean(formData.soHoKhau)}
              required
              pattern="[0-9]{10}"
              title="Vui lòng nhập số điện thoại 10 số"
            />
            {Boolean(formData.soHoKhau) && (
              <p className="text-xs text-gray-500 mt-1">Tự động điền theo hộ khẩu đã chọn</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chọn phòng <span className="text-red-500">*</span>
            </label>
            <select
              name="soPhong"
              value={formData.soPhong}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Chọn phòng</option>
              {availableRooms.map(room => (
                <option key={room.id} value={room.soPhong}>
                  Phòng {room.soPhong} - Tầng {room.tang} ({room.dienTich}m²)
                </option>
              ))}
            </select>
            {availableRooms.length === 0 && (
              <p className="text-sm text-red-500 mt-1">Không có phòng trống</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày bắt đầu <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="ngayBatDau"
              value={formData.ngayBatDau}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
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
                disabled={availableRooms.length === 0}
              >
                Thêm mới
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditTenantPopup;
