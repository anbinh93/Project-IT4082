import React, { useState, useEffect } from 'react';
import { residentAPI } from '../services/api';

interface EditNhanKhauPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  residentId: number | null;
}

const EditNhanKhauPopup: React.FC<EditNhanKhauPopupProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  residentId 
}) => {
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
    soDienThoai: '',
    ghiChu: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  // Load resident data when popup opens
  useEffect(() => {
    if (isOpen && residentId) {
      fetchResidentData();
    }
  }, [isOpen, residentId]);

  const fetchResidentData = async () => {
    try {
      setLoading(true);
      const response = await residentAPI.getById(residentId!);
      
      if (response.success && response.data) {
        const resident = response.data;
        setFormData({
          hoTen: resident.hoTen || '',
          ngaySinh: resident.ngaySinh ? new Date(resident.ngaySinh).toISOString().split('T')[0] : '',
          gioiTinh: resident.gioiTinh || '',
          danToc: resident.danToc || '',
          tonGiao: resident.tonGiao || '',
          cccd: resident.cccd || '',
          ngayCap: resident.ngayCap ? new Date(resident.ngayCap).toISOString().split('T')[0] : '',
          noiCap: resident.noiCap || '',
          ngheNghiep: resident.ngheNghiep || '',
          soDienThoai: resident.soDienThoai || '',
          ghiChu: resident.ghiChu || ''
        });
      } else {
        setError('Không thể tải thông tin nhân khẩu');
      }
    } catch (err: any) {
      console.error('Error fetching resident data:', err);
      setError(err.message || 'Có lỗi xảy ra khi tải thông tin nhân khẩu');
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

    try {
      setSubmitting(true);
      setError('');
      
      // Normalize form data
      const normalizedFormData = {
        ...formData,
        hoTen: formData.hoTen.trim(),
        cccd: formData.cccd.trim(),
        ngheNghiep: formData.ngheNghiep?.trim() || '',
        soDienThoai: formData.soDienThoai?.trim() || '',
        danToc: formData.danToc?.trim() || 'Kinh',
        tonGiao: formData.tonGiao?.trim() || 'Không',
        noiCap: formData.noiCap?.trim() || '',
        ghiChu: formData.ghiChu?.trim() || ''
      };
      
      const response = await residentAPI.update(residentId!, normalizedFormData);
      
      if (response.success) {
        onSuccess?.();
        onClose();
      } else {
        setError(response.message || 'Có lỗi xảy ra khi cập nhật nhân khẩu');
      }
    } catch (err: any) {
      console.error('Error updating resident:', err);
      setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra khi cập nhật nhân khẩu');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Chỉnh sửa thông tin nhân khẩu</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              disabled={submitting}
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Họ tên <span className="text-red-500">*</span>
                  </label>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Ngày sinh <span className="text-red-500">*</span>
                  </label>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Giới tính <span className="text-red-500">*</span>
                  </label>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Dân tộc</label>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    CCCD <span className="text-red-500">*</span>
                  </label>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Số điện thoại</label>
                  <input 
                    type="tel" 
                    name="soDienThoai"
                    value={formData.soDienThoai}
                    onChange={handleInputChange}
                    className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" 
                    placeholder="Nhập số điện thoại" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Ghi chú</label>
                  <textarea 
                    name="ghiChu"
                    value={formData.ghiChu}
                    onChange={handleInputChange}
                    rows={3}
                    className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none" 
                    placeholder="Nhập ghi chú (nếu có)" 
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang cập nhật...
                    </span>
                  ) : (
                    'Cập nhật'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditNhanKhauPopup;
