import React, { useState } from 'react';

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

const TachHoPopup: React.FC<TachHoPopupProps> = ({ isOpen, onClose, selectedResident }) => {
  const [selectedHousehold, setSelectedHousehold] = useState('');
  const [newHouseholdAddress, setNewHouseholdAddress] = useState('');
  const [isCreatingNewHousehold, setIsCreatingNewHousehold] = useState(false);
  const [reason, setReason] = useState('');

  // Sample data cho danh sách hộ gia đình có sẵn
  const existingHouseholds = [
    { id: 'HO001', address: 'Chung cư A - Tầng 5 - Căn 501', chuHo: 'Nguyễn Văn Minh' },
    { id: 'HO002', address: 'Chung cư A - Tầng 7 - Căn 702', chuHo: 'Trần Thị Lan' },
    { id: 'HO003', address: 'Chung cư B - Tầng 3 - Căn 304', chuHo: 'Lê Văn Đức' },
    { id: 'HO004', address: 'Chung cư B - Tầng 8 - Căn 801', chuHo: 'Phạm Thị Mai' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResident) return;

    const formData = {
      residentInfo: selectedResident,
      targetHousehold: isCreatingNewHousehold ? {
        type: 'new',
        address: newHouseholdAddress
      } : {
        type: 'existing',
        householdId: selectedHousehold
      },
      reason: reason
    };

    console.log('Tách hộ data:', formData);
    // TODO: Xử lý logic tách hộ ở đây
    
    // Reset form và đóng popup
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setSelectedHousehold('');
    setNewHouseholdAddress('');
    setIsCreatingNewHousehold(false);
    setReason('');
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
                >
                  <option value="">-- Chọn hộ gia đình --</option>
                  {existingHouseholds.map((household) => (
                    <option key={household.id} value={household.id}>
                      {household.address} - Chủ hộ: {household.chuHo}
                    </option>
                  ))}
                </select>
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
                  placeholder="Ví dụ: Chung cư C - Tầng 10 - Căn 1001"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required={isCreatingNewHousehold}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Lưu ý: Nhân khẩu sẽ trở thành chủ hộ của hộ gia đình mới
                </p>
              </div>
            )}
          </div>

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
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Xác nhận tách hộ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TachHoPopup;