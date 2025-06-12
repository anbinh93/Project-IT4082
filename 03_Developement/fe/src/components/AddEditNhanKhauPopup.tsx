import React, { useState, useEffect } from 'react';
import { householdAPI, residentAPI } from '../services/api';

interface AddEditNhanKhauPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // Add callback for successful creation
}

interface Household {
  id: number;
  soHoKhau: string;
  diaChi: string;
  chuHoInfo?: {
    hoTen: string;
  };
}

const AddEditNhanKhauPopup: React.FC<AddEditNhanKhauPopupProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    hoTen: '',
    ngaySinh: '',
    gioiTinh: '',
    danToc: '',
    tonGiao: '',
    cccd: '',
    ngayCap: '',
    noiCap: '',
    ngheNghiep: '',
    selectedHouseholdId: '',
    quanHeVoiChuHo: ''
  });
  
  const [households, setHouseholds] = useState<Household[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  // Load households when popup opens
  useEffect(() => {
    if (isOpen) {
      fetchHouseholds();
      // Reset form when opening
      setFormData({
        hoTen: '',
        ngaySinh: '',
        gioiTinh: '',
        danToc: '',
        tonGiao: '',
        cccd: '',
        ngayCap: '',
        noiCap: '',
        ngheNghiep: '',
        selectedHouseholdId: '',
        quanHeVoiChuHo: ''
      });
      setError('');
    }
  }, [isOpen]);

  const fetchHouseholds = async () => {
    try {
      setLoading(true);
      const response = await householdAPI.getAll();
      
      if (response.success && response.data) {
        setHouseholds(response.data.households || []);
      } else {
        setError('Không thể tải danh sách hộ khẩu');
      }
    } catch (err: any) {
      console.error('Error fetching households:', err);
      setError(err.message || 'Có lỗi xảy ra khi tải danh sách hộ khẩu');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Reset relationship when changing household
    if (name === 'selectedHouseholdId') {
      setFormData(prev => ({
        ...prev,
        selectedHouseholdId: value,
        quanHeVoiChuHo: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.hoTen.trim()) {
      setError('Vui lòng nhập họ tên');
      return;
    }
    if (!formData.ngaySinh) {
      setError('Vui lòng chọn ngày sinh');
      return;
    }
    if (!formData.gioiTinh) {
      setError('Vui lòng chọn giới tính');
      return;
    }
    if (!formData.cccd.trim()) {
      setError('Vui lòng nhập số CCCD');
      return;
    }
    if (formData.selectedHouseholdId && !formData.quanHeVoiChuHo) {
      setError('Vui lòng chọn quan hệ với chủ hộ');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      console.log('Creating new resident:', formData);
      
      // Call API to create new resident
      const response = await residentAPI.create(formData);
      
      if (response.success) {
        console.log('Resident created successfully:', response.data);
        // Call success callback if provided
        if (onSuccess) {
          onSuccess();
        }
        // Close popup after successful creation
        onClose();
      } else {
        throw new Error(response.message || 'Không thể tạo nhân khẩu');
      }
    } catch (err: any) {
      console.error('Error creating resident:', err);
      setError(err.message || 'Có lỗi xảy ra khi tạo nhân khẩu');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="mb-8 pb-4 border-b border-gray-300">
          <h2 className="text-2xl font-bold text-gray-900 text-left">Thêm Nhân khẩu </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Họ tên <span className="text-red-500">*</span> </label>
              <input 
                type="text" 
                name="hoTen"
                value={formData.hoTen}
                onChange={handleInputChange}
                className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" 
                placeholder="Nhập họ tên" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày sinh <span className="text-red-500">*</span> </label>
              <input 
                type="date" 
                name="ngaySinh"
                value={formData.ngaySinh}
                onChange={handleInputChange}
                className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Giới tính <span className="text-red-500">*</span> </label>
              <select 
                name="gioiTinh"
                value={formData.gioiTinh}
                onChange={handleInputChange}
                className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none appearance-none" 
                required
              >
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Dân tộc </label>
              <input 
                type="text" 
                name="danToc"
                value={formData.danToc}
                onChange={handleInputChange}
                className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" 
                placeholder="Nhập dân tộc" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tôn giáo</label>
              <input 
                type="text" 
                name="tonGiao"
                value={formData.tonGiao}
                onChange={handleInputChange}
                className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" 
                placeholder="Nhập tôn giáo" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">CCCD <span className="text-red-500">*</span> </label>
              <input 
                type="text" 
                name="cccd"
                value={formData.cccd}
                onChange={handleInputChange}
                className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" 
                placeholder="Nhập số CCCD" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày cấp</label>
              <input 
                type="date" 
                name="ngayCap"
                value={formData.ngayCap}
                onChange={handleInputChange}
                className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nơi cấp</label>
              <input 
                type="text" 
                name="noiCap"
                value={formData.noiCap}
                onChange={handleInputChange}
                className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" 
                placeholder="Nhập nơi cấp" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nghề nghiệp</label>
              <input 
                type="text" 
                name="ngheNghiep"
                value={formData.ngheNghiep}
                onChange={handleInputChange}
                className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" 
                placeholder="Nhập nghề nghiệp" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Hộ khẩu (tùy chọn)</label>
              <select 
                name="selectedHouseholdId"
                value={formData.selectedHouseholdId}
                onChange={handleInputChange}
                className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none appearance-none"
                disabled={loading}
              >
                <option value="">
                  {loading ? 'Đang tải...' : 'Chọn hộ khẩu (để trống nếu tạo hộ mới)'}
                </option>
                {households.map((household) => (
                  <option key={household.id} value={household.id}>
                    HK{household.soHoKhau.toString().padStart(3, '0')} - {household.diaChi}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Conditional relationship field */}
            {formData.selectedHouseholdId && (
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Quan hệ với chủ hộ <span className="text-red-500">*</span> </label>
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
                <p className="text-sm text-gray-500 mt-1">
                  Nhân khẩu sẽ được thêm vào hộ khẩu đã chọn
                </p>
              </div>
            )}
            
            {!formData.selectedHouseholdId && (
              <div className="md:col-span-2">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-blue-800 text-sm">
                    <strong>Lưu ý:</strong> Nếu không chọn hộ khẩu, nhân khẩu sẽ được tạo riêng lẻ và có thể tạo hộ khẩu mới sau.
                  </p>
                </div>
              </div>
            )}
          </div>
          {/* Footer */}
          <div className="flex justify-between gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-8 py-2 border border-gray-300 rounded-xl text-gray-700 font-bold bg-gray-100 hover:bg-gray-200 shadow-sm text-lg disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting || loading}
              className="px-8 py-2 bg-blue-500 text-white rounded-xl font-bold shadow hover:bg-blue-600 transition text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang lưu...
                </div>
              ) : (
                'Lưu'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditNhanKhauPopup; 