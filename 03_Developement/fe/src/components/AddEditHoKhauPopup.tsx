import React, { useState, useEffect } from 'react';
import { householdAPI, residentAPI } from '../services/api';

interface AddEditHoKhauPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface Resident {
  id: number;
  hoTen: string;
  cccd: string;
  ngaySinh: string;
  gioiTinh: string;
  ngheNghiep: string;
}

const AddEditHoKhauPopup: React.FC<AddEditHoKhauPopupProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    maHoKhau: '',
    soPhong: '',
    soNha: '',
    duong: '',
    phuong: 'Nhân Chính',
    quan: 'Thanh Xuân',
    thanhPho: 'Hà Nội',
    chuHoId: '',
    ngayLap: new Date().toISOString().split('T')[0]
  });

  const [availableResidents, setAvailableResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  
  const [errors, setErrors] = useState({
    maHoKhau: false,
    soPhong: false,
    soNha: false,
    duong: false,
    chuHoId: false
  });

  // Load danh sách tất cả nhân khẩu có thể làm chủ hộ
  useEffect(() => {
    if (isOpen) {
      loadAvailableResidents();
      generateHouseholdCode();
      resetForm();
      setError('');
    }
  }, [isOpen]);

  const resetForm = () => {
    setFormData({
      maHoKhau: '',
      soPhong: '',
      soNha: '',
      duong: '',
      phuong: 'Nhân Chính',
      quan: 'Thanh Xuân',
      thanhPho: 'Hà Nội',
      chuHoId: '',
      ngayLap: new Date().toISOString().split('T')[0]
    });
    setErrors({
      maHoKhau: false,
      soPhong: false,
      soNha: false,
      duong: false,
      chuHoId: false
    });
  };

  const generateHouseholdCode = () => {
    // Tạo mã hộ khẩu tự động dựa trên thời gian
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    
    const code = `HK${year}${month}${day}${hours}${minutes}`;
    setFormData(prev => ({ ...prev, maHoKhau: code }));
  };

  const loadAvailableResidents = async () => {
    setLoading(true);
    try {
      // Lấy tất cả nhân khẩu thay vì chỉ những người chưa có hộ khẩu
      const response = await residentAPI.getAll();
      if (response.success && response.data) {
        // Fix: response.data.residents thay vì response.data
        setAvailableResidents(response.data.residents || []);
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách nhân khẩu:', err);
      setError('Không thể tải danh sách nhân khẩu');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Xóa lỗi khi người dùng nhập liệu
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      maHoKhau: !formData.maHoKhau.trim(),
      soPhong: !formData.soPhong.trim(),
      soNha: !formData.soNha.trim(),
      duong: !formData.duong.trim(),
      chuHoId: false // Chủ hộ có thể để trống
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(err => err);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // Tạo địa chỉ đầy đủ
      const diaChi = `${formData.soNha}, ${formData.duong}, ${formData.phuong}, ${formData.quan}, ${formData.thanhPho}`;
      
      const householdData = {
        chuHoId: formData.chuHoId || null, // Có thể để trống
        diaChi: diaChi,
        ngayLap: formData.ngayLap,
        soPhong: formData.soPhong
      };

      const response = await householdAPI.create(householdData);
      
      if (response.success) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setError(response.message || 'Có lỗi xảy ra khi tạo hộ khẩu');
      }
    } catch (err: any) {
      console.error('Lỗi khi tạo hộ khẩu:', err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tạo hộ khẩu');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Thêm hộ khẩu mới</h2>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin cơ bản</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Mã hộ khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="maHoKhau"
                  value={formData.maHoKhau}
                  onChange={handleChange}
                  className={`block w-full rounded-xl border px-4 py-2 text-[15px] shadow-sm focus:ring-2 focus:ring-blue-200 outline-none ${
                    errors.maHoKhau ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder="Ví dụ: HK2501120830"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Số phòng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="soPhong"
                  value={formData.soPhong}
                  onChange={handleChange}
                  className={`block w-full rounded-xl border px-4 py-2 text-[15px] shadow-sm focus:ring-2 focus:ring-blue-200 outline-none ${
                    errors.soPhong ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder="Ví dụ: 101, 202, A301..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày lập</label>
                <input
                  type="date"
                  name="ngayLap"
                  value={formData.ngayLap}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin địa chỉ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Số nhà <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="soNha"
                  value={formData.soNha}
                  onChange={handleChange}
                  className={`block w-full rounded-xl border px-4 py-2 text-[15px] shadow-sm focus:ring-2 focus:ring-blue-200 outline-none ${
                    errors.soNha ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder="Ví dụ: 123, 45A, số 67..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Đường <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="duong"
                  value={formData.duong}
                  onChange={handleChange}
                  className={`block w-full rounded-xl border px-4 py-2 text-[15px] shadow-sm focus:ring-2 focus:ring-blue-200 outline-none ${
                    errors.duong ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder="Ví dụ: Nguyễn Trãi, Lê Lợi..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phường</label>
                <input
                  type="text"
                  name="phuong"
                  value={formData.phuong}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Quận</label>
                <input
                  type="text"
                  name="quan"
                  value={formData.quan}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Thành phố</label>
                <input
                  type="text"
                  name="thanhPho"
                  value={formData.thanhPho}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Head of Household */}
          <div className="bg-green-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Chủ hộ (tùy chọn)</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Chọn chủ hộ
                </label>
                <select
                  name="chuHoId"
                  value={formData.chuHoId}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none appearance-none"
                  disabled={loading}
                >
                  <option value="">
                    {loading ? 'Đang tải...' : 'Để trống nếu chưa có chủ hộ'}
                  </option>
                  {availableResidents.map((resident) => (
                    <option key={resident.id} value={resident.id}>
                      {resident.hoTen} - {resident.cccd}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  Lưu ý: Có thể để trống nếu căn hộ chưa có chủ hộ xác định
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting || loading}
              className="px-6 py-2 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition disabled:opacity-50"
            >
              {submitting ? 'Đang tạo...' : 'Tạo hộ khẩu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditHoKhauPopup;
