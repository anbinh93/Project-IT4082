import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { householdAPI } from '../services/api';
import type { Vehicle, VehicleType } from '../services/vehicleService';

interface Household {
  soHoKhau: number;
  chuHoInfo?: {
    hoTen: string;
  };
  soNha: string;
  duong: string;
}

interface VehicleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  vehicleTypes: VehicleType[];
  editingVehicle?: Vehicle | null;
}

const VehicleFormModal: React.FC<VehicleFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  vehicleTypes,
  editingVehicle
}) => {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    hoKhauId: '',
    loaiXeId: '',
    bienSo: '',
    ngayBatDau: new Date().toISOString().split('T')[0],
    ngayKetThuc: '',
    trangThai: 'ACTIVE',
    ghiChu: ''
  });

  useEffect(() => {
    if (isOpen) {
      loadHouseholds();
      if (editingVehicle) {
        setFormData({
          hoKhauId: editingVehicle.hoKhauId.toString(),
          loaiXeId: editingVehicle.loaiXeId.toString(),
          bienSo: editingVehicle.bienSo,
          ngayBatDau: editingVehicle.ngayBatDau.split('T')[0],
          ngayKetThuc: editingVehicle.ngayKetThuc ? editingVehicle.ngayKetThuc.split('T')[0] : '',
          trangThai: editingVehicle.trangThai,
          ghiChu: editingVehicle.ghiChu || ''
        });
      } else {
        resetForm();
      }
    }
  }, [isOpen, editingVehicle]);

  const loadHouseholds = async () => {
    try {
      setLoading(true);
      const response = await householdAPI.getAll({ limit: 1000 });
      setHouseholds(response.data?.households || []);
    } catch (error) {
      console.error('Error loading households:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      hoKhauId: '',
      loaiXeId: '',
      bienSo: '',
      ngayBatDau: new Date().toISOString().split('T')[0],
      ngayKetThuc: '',
      trangThai: 'ACTIVE',
      ghiChu: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      hoKhauId: parseInt(formData.hoKhauId),
      loaiXeId: parseInt(formData.loaiXeId),
      bienSo: formData.bienSo.toUpperCase(),
      ngayBatDau: formData.ngayBatDau,
      ngayKetThuc: formData.ngayKetThuc || undefined,
      trangThai: formData.trangThai,
      ghiChu: formData.ghiChu
    };

    onSubmit(submitData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose}></div>
      <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingVehicle ? 'Chỉnh sửa xe' : 'Thêm xe mới'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Household Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hộ khẩu *
            </label>
            <select
              value={formData.hoKhauId}
              onChange={(e) => handleChange('hoKhauId', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading}
            >
              <option value="">
                {loading ? 'Đang tải...' : 'Chọn hộ khẩu'}
              </option>
              {households.map(household => (
                <option key={household.soHoKhau} value={household.soHoKhau}>
                  HK{household.soHoKhau.toString().padStart(3, '0')} - {household.chuHoInfo?.hoTen} - {household.soNha} {household.duong}
                </option>
              ))}
            </select>
          </div>

          {/* Vehicle Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại xe *
            </label>
            <select
              value={formData.loaiXeId}
              onChange={(e) => handleChange('loaiXeId', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Chọn loại xe</option>
              {vehicleTypes.map(type => {
                let price = '';
                if (type.ten === 'Xe đạp' || type.ten === 'Xe máy') {
                  price = '70.000 VNĐ/tháng';
                } else if (type.ten === 'Ô tô') {
                  price = '1.200.000 VNĐ/tháng';
                }
                
                return (
                  <option key={type.id} value={type.id}>
                    {type.ten} - {price}
                  </option>
                );
              })}
            </select>
          </div>

          {/* License Plate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Biển số xe *
            </label>
            <input
              type="text"
              value={formData.bienSo}
              onChange={(e) => handleChange('bienSo', e.target.value.toUpperCase())}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="VD: 30A-12345"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Định dạng: 30A-12345 hoặc HN-1234
            </p>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày bắt đầu *
            </label>
            <input
              type="date"
              value={formData.ngayBatDau}
              onChange={(e) => handleChange('ngayBatDau', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày kết thúc
            </label>
            <input
              type="date"
              value={formData.ngayKetThuc}
              onChange={(e) => handleChange('ngayKetThuc', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min={formData.ngayBatDau}
            />
            <p className="text-xs text-gray-500 mt-1">
              Để trống nếu không có ngày kết thúc
            </p>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              value={formData.trangThai}
              onChange={(e) => handleChange('trangThai', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ACTIVE">Đang hoạt động</option>
              <option value="INACTIVE">Tạm ngưng</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú
            </label>
            <textarea
              value={formData.ghiChu}
              onChange={(e) => handleChange('ghiChu', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Ghi chú về xe..."
            />
          </div>

          {/* Action buttons */}
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
                {editingVehicle ? 'Cập nhật' : 'Lưu'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleFormModal;