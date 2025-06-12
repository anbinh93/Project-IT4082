import React, { useState, useEffect } from 'react';
import { vehicleService } from '../services/vehicleService';
import type { Vehicle, VehicleType } from '../services/vehicleService';
import { X } from 'lucide-react';

interface VehicleFormProps {
  vehicle: Vehicle | null;
  vehicleTypes: VehicleType[];
  onSave: (vehicleData: any) => Promise<void>;
  onClose: () => void;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({
  vehicle,
  vehicleTypes,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState({
    hoKhauId: '',
    loaiXeId: '',
    bienSo: '',
    ngayBatDau: '',
    ngayKetThuc: '',
    trangThai: 'ACTIVE',
    ghiChu: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (vehicle) {
      setFormData({
        hoKhauId: vehicle.hoKhauId.toString(),
        loaiXeId: vehicle.loaiXeId.toString(),
        bienSo: vehicle.bienSo,
        ngayBatDau: vehicle.ngayBatDau ? vehicle.ngayBatDau.split('T')[0] : '',
        ngayKetThuc: vehicle.ngayKetThuc ? vehicle.ngayKetThuc.split('T')[0] : '',
        trangThai: vehicle.trangThai,
        ghiChu: vehicle.ghiChu || ''
      });
    } else {
      setFormData({
        hoKhauId: '',
        loaiXeId: '',
        bienSo: '',
        ngayBatDau: new Date().toISOString().split('T')[0],
        ngayKetThuc: '',
        trangThai: 'ACTIVE',
        ghiChu: ''
      });
    }
  }, [vehicle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = {
        ...formData,
        hoKhauId: parseInt(formData.hoKhauId),
        loaiXeId: parseInt(formData.loaiXeId),
        ngayKetThuc: formData.ngayKetThuc || undefined
      };

      await onSave(data);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-medium text-gray-900">
            {vehicle ? 'Cập nhật xe' : 'Thêm xe mới'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Biển số xe *
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ví dụ: 30A-12345"
              value={formData.bienSo}
              onChange={(e) => setFormData(prev => ({ ...prev, bienSo: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại xe *
            </label>
            <select
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.loaiXeId}
              onChange={(e) => setFormData(prev => ({ ...prev, loaiXeId: e.target.value }))}
            >
              <option value="">Chọn loại xe</option>
              {vehicleTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.tenLoaiXe} - {Number(type.phiThue).toLocaleString()} VNĐ
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số hộ khẩu *
            </label>
            <input
              type="number"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Nhập số hộ khẩu"
              value={formData.hoKhauId}
              onChange={(e) => setFormData(prev => ({ ...prev, hoKhauId: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày bắt đầu *
            </label>
            <input
              type="date"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.ngayBatDau}
              onChange={(e) => setFormData(prev => ({ ...prev, ngayBatDau: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày kết thúc
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.ngayKetThuc}
              onChange={(e) => setFormData(prev => ({ ...prev, ngayKetThuc: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.trangThai}
              onChange={(e) => setFormData(prev => ({ ...prev, trangThai: e.target.value }))}
            >
              <option value="ACTIVE">Đang sử dụng</option>
              <option value="INACTIVE">Ngừng sử dụng</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ghi chú
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              rows={3}
              placeholder="Nhập ghi chú (không bắt buộc)"
              value={formData.ghiChu}
              onChange={(e) => setFormData(prev => ({ ...prev, ghiChu: e.target.value }))}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50"
            >
              {loading ? 'Đang xử lý...' : (vehicle ? 'Cập nhật' : 'Thêm mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface VehicleTypeFormProps {
  vehicleType: VehicleType | null;
  onSave: (typeData: any) => Promise<void>;
  onClose: () => void;
}

export const VehicleTypeForm: React.FC<VehicleTypeFormProps> = ({
  vehicleType,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState({
    tenLoaiXe: '',
    phiThue: '',
    moTa: '',
    trangThai: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (vehicleType) {
      setFormData({
        tenLoaiXe: vehicleType.tenLoaiXe,
        phiThue: vehicleType.phiThue,
        moTa: vehicleType.moTa || '',
        trangThai: vehicleType.trangThai
      });
    } else {
      setFormData({
        tenLoaiXe: '',
        phiThue: '',
        moTa: '',
        trangThai: true
      });
    }
  }, [vehicleType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-medium text-gray-900">
            {vehicleType ? 'Cập nhật loại xe' : 'Thêm loại xe mới'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên loại xe *
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ví dụ: Xe máy, Ô tô"
              value={formData.tenLoaiXe}
              onChange={(e) => setFormData(prev => ({ ...prev, tenLoaiXe: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phí thuê (VNĐ) *
            </label>
            <input
              type="number"
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Nhập phí thuê"
              value={formData.phiThue}
              onChange={(e) => setFormData(prev => ({ ...prev, phiThue: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              rows={3}
              placeholder="Nhập mô tả (không bắt buộc)"
              value={formData.moTa}
              onChange={(e) => setFormData(prev => ({ ...prev, moTa: e.target.value }))}
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                checked={formData.trangThai}
                onChange={(e) => setFormData(prev => ({ ...prev, trangThai: e.target.checked }))}
              />
              <span className="ml-2 text-sm text-gray-700">Hoạt động</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50"
            >
              {loading ? 'Đang xử lý...' : (vehicleType ? 'Cập nhật' : 'Thêm mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
