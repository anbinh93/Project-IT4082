import React, { useState } from 'react';

interface DoiChuHoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  selectedResident?: {
    id: number;
    hoTen: string;
    gioiTinh: string;
    ngaySinh: string;
    cccd: string;
    ngheNghiep: string;
    laChuHo?: boolean;
    maHoGiaDinh?: string;
  } | null;
}

const DoiChuHoPopup: React.FC<DoiChuHoPopupProps> = ({ isOpen, onClose, selectedResident }) => {
  const [selectedNewHead, setSelectedNewHead] = useState('');
  const [reason, setReason] = useState('');
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);

  // Sample data - Danh sách thành viên trong cùng hộ gia đình
  const householdMembers = [
    { 
      id: 2, 
      hoTen: 'Trần Thị Bình', 
      gioiTinh: 'Nữ', 
      ngaySinh: '1987-07-15', 
      cccd: '0173054376', 
      ngheNghiep: 'Nhân viên văn phòng',
      quanHe: 'Vợ',
      tuoi: 37
    },
    { 
      id: 6, 
      hoTen: 'Nguyễn Văn Bình', 
      gioiTinh: 'Nam', 
      ngaySinh: '2010-03-12', 
      cccd: '', 
      ngheNghiep: 'Học sinh',
      quanHe: 'Con trai',
      tuoi: 14
    },
    { 
      id: 7, 
      hoTen: 'Nguyễn Thị Cúc', 
      gioiTinh: 'Nữ', 
      ngaySinh: '2015-08-20', 
      cccd: '', 
      ngheNghiep: 'Học sinh',
      quanHe: 'Con gái',
      tuoi: 9
    },
    { 
      id: 8, 
      hoTen: 'Nguyễn Văn Dũng', 
      gioiTinh: 'Nam', 
      ngaySinh: '1965-01-10', 
      cccd: '0173012345', 
      ngheNghiep: 'Hưu trí',
      quanHe: 'Cha',
      tuoi: 59
    }
  ];

  // Lọc ra những thành viên đủ điều kiện làm chủ hộ (>= 18 tuổi và có CCCD)
  const eligibleMembers = householdMembers.filter(member => 
    member.tuoi >= 18 && member.cccd && member.cccd.trim() !== ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResident || !selectedNewHead) return;

    const selectedNewHeadInfo = householdMembers.find(member => member.id.toString() === selectedNewHead);
    
    const formData = {
      currentHead: selectedResident,
      newHead: selectedNewHeadInfo,
      reason: reason,
      effectiveDate: effectiveDate,
      householdId: selectedResident.maHoGiaDinh || 'HO001'
    };

    console.log('Đổi chủ hộ data:', formData);
    // TODO: Xử lý logic đổi chủ hộ ở đây
    
    // Reset form và đóng popup
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setSelectedNewHead('');
    setReason('');
    setEffectiveDate(new Date().toISOString().split('T')[0]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  // Kiểm tra xem nhân khẩu có phải là chủ hộ không
  const isCurrentHead = selectedResident?.laChuHo || selectedResident?.id === 1; // Giả sử ID 1 là chủ hộ

  if (!isCurrentHead) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Thông báo</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6">
            <div className="flex items-center space-x-3 text-amber-600 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h3 className="font-semibold">Không thể thực hiện</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Chỉ chủ hộ hiện tại mới có thể thực hiện chức năng đổi chủ hộ.
                </p>
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-sm text-gray-700">
                <span className="font-medium">{selectedResident?.hoTen}</span> hiện không phải là chủ hộ.
              </p>
            </div>
          </div>
          <div className="flex justify-end p-6 border-t border-gray-200">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Đổi chủ hộ gia đình</h2>
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
          {/* Thông tin chủ hộ hiện tại */}
          {selectedResident && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Chủ hộ hiện tại:
              </h3>
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
                  <span className="font-medium text-gray-700">Nghề nghiệp:</span>
                  <span className="ml-2 text-gray-900">{selectedResident.ngheNghiep}</span>
                </div>
              </div>
            </div>
          )}

          {/* Chọn chủ hộ mới */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Chọn chủ hộ mới:
            </h3>
            
            {eligibleMembers.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-yellow-800">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="font-medium">Không có thành viên đủ điều kiện</span>
                </div>
                <p className="text-yellow-700 text-sm mt-1">
                  Không có thành viên nào trong hộ gia đình đủ điều kiện làm chủ hộ (≥18 tuổi và có CCCD).
                </p>
              </div>
            ) : (
              <>
                <div className="grid gap-3">
                  {eligibleMembers.map((member) => (
                    <label
                      key={member.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedNewHead === member.id.toString()
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="newHead"
                          value={member.id.toString()}
                          checked={selectedNewHead === member.id.toString()}
                          onChange={(e) => setSelectedNewHead(e.target.value)}
                          className="text-blue-600"
                        />
                        <div className="flex-1">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Họ tên:</span>
                              <div className="text-gray-900">{member.hoTen}</div>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Quan hệ:</span>
                              <div className="text-gray-900">{member.quanHe}</div>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Tuổi:</span>
                              <div className="text-gray-900">{member.tuoi}</div>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">CCCD:</span>
                              <div className="text-gray-900">{member.cccd}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-blue-800 text-sm">
                    <strong>Lưu ý:</strong> Chỉ những thành viên từ 18 tuổi trở lên và có CCCD mới đủ điều kiện làm chủ hộ.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Ngày hiệu lực */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày hiệu lực:
            </label>
            <input
              type="date"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Lý do đổi chủ hộ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lý do đổi chủ hộ: <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do đổi chủ hộ (ví dụ: chủ hộ cũ chuyển đi, chuyển nhượng quyền chủ hộ, v.v.)"
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
              disabled={eligibleMembers.length === 0 || !selectedNewHead}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Xác nhận đổi chủ hộ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoiChuHoPopup;