import React, { useState, useEffect } from 'react';
import { householdAPI, residentAPI } from '../services/api';

interface TachHoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  selectedResident?: {
    id: number;
    hoTen: string;
    gioiTinh: string;
    ngaySinh: string;
    cccd: string;
    ngheNghiep: string;
  } | null;
}

interface Household {
  id: number;
  soHoKhau: string;
  diaChi: string;
  chuHoInfo?: {
    hoTen: string;
  };
}

const TachHoPopup: React.FC<TachHoPopupProps> = ({ isOpen, onClose, selectedResident }) => {
  const [selectedHousehold, setSelectedHousehold] = useState('');
  const [newHouseholdAddress, setNewHouseholdAddress] = useState('');
  const [isCreatingNewHousehold, setIsCreatingNewHousehold] = useState(false);
  const [reason, setReason] = useState('');
  const [relationshipWithNewHead, setRelationshipWithNewHead] = useState('');
  
  // State for real data
  const [availableHouseholds, setAvailableHouseholds] = useState<Household[]>([]);
  const [householdInfo, setHouseholdInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  // Load available households and household info when popup opens
  useEffect(() => {
    if (isOpen && selectedResident) {
      fetchAvailableHouseholds();
      fetchHouseholdInfo();
    }
  }, [isOpen, selectedResident]);

  const fetchAvailableHouseholds = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await householdAPI.getAvailable();
      
      if (response.success && response.data) {
        setAvailableHouseholds(response.data);
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

  const fetchHouseholdInfo = async () => {
    if (!selectedResident) return;
    
    try {
      setLoading(true);
      const response = await residentAPI.getHouseholdInfo(selectedResident.id);
      
      if (response.success && response.data) {
        setHouseholdInfo(response.data);
      } else {
        setError('Không thể tải thông tin hộ khẩu hiện tại');
      }
    } catch (err: any) {
      console.error('Error fetching household info:', err);
      setError(err.message || 'Có lỗi xảy ra khi tải thông tin hộ khẩu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResident) return;

    // Validate form
    if (!isCreatingNewHousehold && !selectedHousehold) {
      setError('Vui lòng chọn hộ gia đình đích');
      return;
    }
    
    if (!isCreatingNewHousehold && !relationshipWithNewHead) {
      setError('Vui lòng chọn mối quan hệ với chủ hộ mới');
      return;
    }
    
    if (isCreatingNewHousehold && !newHouseholdAddress.trim()) {
      setError('Vui lòng nhập địa chỉ hộ gia đình mới');
      return;
    }
    
    if (!reason.trim()) {
      setError('Vui lòng nhập lý do tách hộ');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      // Format address with hyphens as expected by the backend
      let formattedAddress = newHouseholdAddress;
      if (isCreatingNewHousehold && formattedAddress) {
        // If address doesn't contain hyphens, format it properly
        if (!formattedAddress.includes(' - ')) {
          // Try to split by comma if present
          if (formattedAddress.includes(',')) {
            const parts = formattedAddress.split(',').map(part => part.trim());
            formattedAddress = parts.join(' - ');
          }
        }
      }

      const separationData = {
        residentId: selectedResident.id,
        targetType: isCreatingNewHousehold ? 'new' as const : 'existing' as const,
        targetHouseholdId: isCreatingNewHousehold ? undefined : parseInt(selectedHousehold),
        newHouseholdAddress: isCreatingNewHousehold ? formattedAddress : undefined,
        reason: reason,
        quanHeVoiChuHoMoi: !isCreatingNewHousehold ? relationshipWithNewHead : undefined
      };

      // Call API to handle household separation
      const response = await residentAPI.separateHousehold(separationData);
      
      if (response.success) {
        // Reset form and close popup
        resetForm();
        onClose();
        
        // Optional: Show success message or refresh parent component
        alert('Tách hộ thành công!');
      } else {
        setError(response.message || 'Không thể tách hộ');
      }
    } catch (err: any) {
      console.error('Error separating household:', err);
      
      // Provide more descriptive error messages
      let errorMessage = 'Có lỗi xảy ra khi tách hộ';
      
      if (err.message) {
        if (err.message.includes('address')) {
          errorMessage = 'Lỗi định dạng địa chỉ. Vui lòng kiểm tra lại.';
        } else if (err.message.includes('Không tìm thấy')) {
          errorMessage = err.message;
        } else {
          errorMessage = `Lỗi: ${err.message}`;
        }
      }
      
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedHousehold('');
    setNewHouseholdAddress('');
    setIsCreatingNewHousehold(false);
    setReason('');
    setRelationshipWithNewHead('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Tách hộ - Chuyển nhân khẩu</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Thông tin nhân khẩu được chọn */}
          {selectedResident && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-3">Thông tin nhân khẩu được chuyển:</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Họ tên:</span>
                  <span className="ml-2 text-gray-900">{selectedResident.hoTen}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">CCCD:</span>
                  <span className="ml-2 text-gray-900">{selectedResident.cccd}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Giới tính:</span>
                  <span className="ml-2 text-gray-900">{selectedResident.gioiTinh}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Ngày sinh:</span>
                  <span className="ml-2 text-gray-900">{selectedResident.ngaySinh}</span>
                </div>
                <div className="col-span-2">
                  <span className="font-medium text-gray-700">Nghề nghiệp:</span>
                  <span className="ml-2 text-gray-900">{selectedResident.ngheNghiep}</span>
                </div>
              </div>
            </div>
          )}

          {/* Thông tin hộ khẩu hiện tại */}
          {householdInfo && householdInfo.householdStatus === 'in_household' && householdInfo.currentHousehold && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-3">Hộ khẩu hiện tại:</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Mã hộ khẩu:</span>
                  <span className="ml-2 text-gray-900">HK{householdInfo.currentHousehold.soHoKhau?.toString().padStart(3, '0') || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Chủ hộ:</span>
                  <span className="ml-2 text-gray-900">{householdInfo.currentHousehold.chuHo || 'Chưa xác định'}</span>
                </div>
                <div className="col-span-2">
                  <span className="font-medium text-gray-700">Địa chỉ:</span>
                  <span className="ml-2 text-gray-900">{householdInfo.currentHousehold.diaChi || 'Chưa có địa chỉ'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Vai trò:</span>
                  <span className="ml-2 text-gray-900">
                    {householdInfo.isHeadOfHousehold ? (
                      <span className="text-blue-600 font-semibold">Chủ hộ</span>
                    ) : (
                      <span className="text-green-600">Thành viên ({householdInfo.currentHousehold.quanHeVoiChuHo})</span>
                    )}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Số thành viên khác:</span>
                  <span className="ml-2 text-gray-900">{householdInfo.otherHouseholdMembers?.length || 0} người</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Ngày gia nhập:</span>
                  <span className="ml-2 text-gray-900">
                    {householdInfo.currentHousehold.ngayThemVaoHo ? 
                      new Date(householdInfo.currentHousehold.ngayThemVaoHo).toLocaleDateString('vi-VN') : 
                      'Chưa xác định'
                    }
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Ngày lập hộ:</span>
                  <span className="ml-2 text-gray-900">
                    {householdInfo.currentHousehold.ngayLamHoKhau ? 
                      new Date(householdInfo.currentHousehold.ngayLamHoKhau).toLocaleDateString('vi-VN') : 
                      'Chưa xác định'
                    }
                  </span>
                </div>
              </div>
              
              {/* Hiển thị thành viên khác trong hộ */}
              {householdInfo.otherHouseholdMembers && householdInfo.otherHouseholdMembers.length > 0 && (
                <div className="mt-4 pt-3 border-t border-yellow-300">
                  <h4 className="font-medium text-yellow-800 mb-2">Thành viên khác trong hộ:</h4>
                  <div className="space-y-2">
                    {householdInfo.otherHouseholdMembers.slice(0, 3).map((member: any) => (
                      <div key={member.id} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">{member.hoTen}</span>
                        <span className="text-gray-500">({member.quanHeVoiChuHo})</span>
                      </div>
                    ))}
                    {householdInfo.otherHouseholdMembers.length > 3 && (
                      <div className="text-sm text-gray-500">
                        ... và {householdInfo.otherHouseholdMembers.length - 3} thành viên khác
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Lưu ý về tách hộ */}
              <div className="mt-3 p-3 bg-orange-100 border border-orange-300 rounded-md">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-orange-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-orange-800 font-medium">Lưu ý tách hộ:</span>
                </div>
                <p className="text-orange-700 text-sm mt-1">
                  {householdInfo.separationNotes || 'Cần kiểm tra điều kiện tách hộ.'}
                </p>
              </div>
            </div>
          )}

          {/* Trường hợp không thuộc hộ khẩu nào */}
          {householdInfo && householdInfo.householdStatus === 'no_household' && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 font-medium">Trạng thái hộ khẩu:</span>
              </div>
              <p className="text-gray-600 text-sm mt-1">
                Nhân khẩu này hiện không thuộc hộ khẩu nào. Bạn có thể tạo hộ khẩu mới với nhân khẩu này làm chủ hộ.
              </p>
            </div>
          )}

          {/* Loading thông tin hộ khẩu */}
          {loading && !householdInfo && selectedResident && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                <span className="text-gray-600">Đang tải thông tin hộ khẩu hiện tại...</span>
              </div>
            </div>
          )}

          {/* Không tìm thấy thông tin hộ khẩu */}
          {!loading && !householdInfo && selectedResident && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-red-700 font-medium">Cảnh báo:</span>
              </div>
              <p className="text-red-600 text-sm mt-1">
                Không tìm thấy thông tin hộ khẩu hiện tại của nhân khẩu này. Có thể nhân khẩu chưa được gán vào hộ khẩu nào.
              </p>
            </div>
          )}

          {/* Lựa chọn hộ đích */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Chọn hộ gia đình đích:</h3>
            
            {/* Radio buttons để chọn giữa hộ có sẵn hoặc tạo mới */}
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="householdType"
                  checked={!isCreatingNewHousehold}
                  onChange={() => setIsCreatingNewHousehold(false)}
                  className="text-blue-600"
                />
                <span className="text-gray-700">Chuyển vào hộ gia đình có sẵn</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="householdType"
                  checked={isCreatingNewHousehold}
                  onChange={() => setIsCreatingNewHousehold(true)}
                  className="text-blue-600"
                />
                <span className="text-gray-700">Tạo hộ gia đình mới</span>
              </label>
            </div>

            {/* Dropdown cho hộ có sẵn */}
            {!isCreatingNewHousehold && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn hộ gia đình:
                </label>
                <select
                  value={selectedHousehold}
                  onChange={(e) => setSelectedHousehold(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required={!isCreatingNewHousehold}
                  disabled={loading}
                >
                  <option value="">
                    {loading ? '-- Đang tải...' : '-- Chọn hộ gia đình --'}
                  </option>
                  {availableHouseholds.map((household: Household) => (
                    <option key={household.id} value={household.id}>
                      HK{household.soHoKhau.toString().padStart(3, '0')} - {household.diaChi} - Chủ hộ: {household.chuHoInfo?.hoTen || 'Chưa có'}
                    </option>
                  ))}
                  {availableHouseholds.length === 0 && !loading && (
                    <option value="" disabled>
                      Không có hộ khẩu khả dụng
                    </option>
                  )}
                </select>
                {availableHouseholds.length === 0 && !loading && (
                  <p className="text-sm text-gray-500 mt-1">
                    Hiện tại không có hộ khẩu nào có thể chuyển đến
                  </p>
                )}

                {/* Quan hệ với chủ hộ mới */}
                {selectedHousehold && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quan hệ với chủ hộ mới: <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={relationshipWithNewHead}
                      onChange={(e) => setRelationshipWithNewHead(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">-- Chọn quan hệ --</option>
                      <option value="vợ/chồng">Vợ/Chồng</option>
                      <option value="con">Con</option>
                      <option value="bố/mẹ">Bố/Mẹ</option>
                      <option value="khác">Khác</option>
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Input cho hộ mới */}
            {isCreatingNewHousehold && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ hộ gia đình mới:
                </label>
                <input
                  type="text"
                  value={newHouseholdAddress}
                  onChange={(e) => setNewHouseholdAddress(e.target.value)}
                  placeholder="Ví dụ: Chung cư C, Tầng 10, Căn 1001, Thanh Xuân, Hà Nội"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required={isCreatingNewHousehold}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Lưu ý: Nhân khẩu sẽ trở thành chủ hộ của hộ gia đình mới
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Định dạng địa chỉ: Số nhà/căn hộ, Đường/Tầng, Phường, Quận, Thành phố
                </p>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Lý do tách hộ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lý do tách hộ:
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do tách hộ..."
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang xử lý...
                </div>
              ) : (
                'Xác nhận tách hộ'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TachHoPopup;