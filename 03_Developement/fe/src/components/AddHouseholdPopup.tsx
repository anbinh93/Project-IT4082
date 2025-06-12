import React, { useState, useEffect } from 'react';
import { householdAPI, residentAPI } from '../services/api';

interface AddHouseholdPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface Resident {
  id: number;
  hoTen: string;
  soCCCD: string;
  ngaySinh: string;
  gioiTinh: string;
}

const AddHouseholdPopup: React.FC<AddHouseholdPopupProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    diaChi: '',
    lyDoTao: '',
    chuHoId: '',
    ngayLap: new Date().toISOString().split('T')[0]
  });

  const [availableResidents, setAvailableResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  // Load available residents when popup opens
  useEffect(() => {
    if (isOpen) {
      fetchAvailableResidents();
      // Reset form when opening
      setFormData({
        diaChi: '',
        lyDoTao: '',
        chuHoId: '',
        ngayLap: new Date().toISOString().split('T')[0]
      });
      setError('');
    }
  }, [isOpen]);

  const fetchAvailableResidents = async () => {
    try {
      setLoading(true);
      const response = await residentAPI.getAvailable();
      
      if (response.success && response.data) {
        setAvailableResidents(response.data);
      } else {
        setError('Không thể tải danh sách nhân khẩu');
      }
    } catch (err: any) {
      console.error('Error fetching available residents:', err);
      setError(err.message || 'Có lỗi xảy ra khi tải danh sách nhân khẩu');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.diaChi.trim()) {
      setError('Vui lòng nhập địa chỉ hộ khẩu');
      return;
    }
    if (!formData.chuHoId) {
      setError('Vui lòng chọn chủ hộ');
      return;
    }
    if (!formData.lyDoTao.trim()) {
      setError('Vui lòng nhập lý do tạo hộ khẩu');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      console.log('Creating new household:', formData);
      
      // Call API to create new household
      const response = await householdAPI.create(formData);
      
      if (response.success) {
        console.log('Household created successfully:', response.data);
        // Call success callback if provided
        if (onSuccess) {
          onSuccess();
        }
        // Close popup after successful creation
        onClose();
      } else {
        throw new Error(response.message || 'Không thể tạo hộ khẩu');
      }
    } catch (err: any) {
      console.error('Error creating household:', err);
      setError(err.message || 'Có lỗi xảy ra khi tạo hộ khẩu');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Thêm Hộ khẩu mới</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Địa chỉ */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Địa chỉ hộ khẩu <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="diaChi"
                value={formData.diaChi}
                onChange={handleInputChange}
                className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" 
                placeholder="Nhập địa chỉ hộ khẩu (VD: Phường Bách Khoa, Quận Hai Bà Trưng, Hà Nội)" 
                required 
              />
            </div>

            {/* Chủ hộ */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Chủ hộ <span className="text-red-500">*</span>
              </label>
              <select 
                name="chuHoId"
                value={formData.chuHoId}
                onChange={handleInputChange}
                className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none appearance-none"
                disabled={loading}
                required
              >
                <option value="">
                  {loading ? 'Đang tải...' : 'Chọn chủ hộ'}
                </option>
                {availableResidents.map((resident) => (
                  <option key={resident.id} value={resident.id}>
                    {resident.hoTen} - {resident.soCCCD} - {new Date(resident.ngaySinh).getFullYear()}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Chỉ hiển thị những nhân khẩu chưa thuộc hộ khẩu nào
              </p>
            </div>

            {/* Ngày lập */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Ngày lập hộ khẩu <span className="text-red-500">*</span>
              </label>
              <input 
                type="date" 
                name="ngayLap"
                value={formData.ngayLap}
                onChange={handleInputChange}
                className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" 
                required 
              />
            </div>

            {/* Lý do tạo */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Lý do tạo hộ khẩu <span className="text-red-500">*</span>
              </label>
              <textarea 
                name="lyDoTao"
                value={formData.lyDoTao}
                onChange={handleInputChange}
                rows={3}
                className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none" 
                placeholder="Nhập lý do tạo hộ khẩu (VD: Kết hôn, tách hộ, chuyển về sinh sống lâu dài...)" 
                required 
              />
            </div>
          </div>

          {/* Info Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-blue-800 text-sm">
                <p className="font-semibold mb-1">Lưu ý:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Hộ khẩu sẽ được tạo với chủ hộ đã chọn</li>
                  <li>Có thể thêm thành viên khác vào hộ khẩu sau khi tạo</li>
                  <li>Địa chỉ nên ghi đầy đủ và chính xác</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between gap-4 pt-6 border-t">
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
                  Đang tạo...
                </div>
              ) : (
                'Tạo hộ khẩu'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHouseholdPopup;
