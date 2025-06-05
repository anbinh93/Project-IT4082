import React, { useState } from 'react';
import NopPhiPopup from './NopPhiPopup';

interface HoKhauItem {
  maHo: string;
  chuHo: string;
  trangThai: string;
  ngayNop?: string;
  soTien?: number;
  nguoiNop?: string;
}

interface FeeItem {
  id: string;
  tenKhoan: string;
  ghiChu?: string;
  hoKhauList: HoKhauItem[];
}

interface DetailFeePopupProps {
  isOpen: boolean;
  onClose: () => void;
  fee: FeeItem | null;
}

const formatCurrency = (value: number | undefined): string => {
  if (!value) return '0';
  return new Intl.NumberFormat('vi-VN').format(value);
};

const DetailFeePopup: React.FC<DetailFeePopupProps> = ({ isOpen, onClose, fee }) => {
  const [hoKhauFilterOption, setHoKhauFilterOption] = useState('Tất cả');
  const [isNopPhiPopupOpen, setIsNopPhiPopupOpen] = useState(false);
  const [selectedHoKhau, setSelectedHoKhau] = useState<any | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  if (!isOpen || !fee) return null;

  // Lọc danh sách hộ khẩu trong một khoản thu theo bộ lọc cụ thể của khoản đó
  const filterHoKhauList = (hoKhauList: any[], filterOption: string) => {
    return hoKhauList.filter(ho => 
      filterOption === 'Tất cả' ? true :
      filterOption === 'Đã nộp' ? ho.trangThai === 'Đã nộp' :
      filterOption === 'Chưa nộp' ? ho.trangThai === 'Chưa nộp' : 
      true
    );
  };

  // Xử lý mở popup nhập thông tin nộp phí
  const handleOpenPopup = (hoKhau?: any, isEdit: boolean = false) => {
    setSelectedHoKhau(hoKhau || null);
    setIsEditMode(isEdit);
    setIsNopPhiPopupOpen(true);
  };
  // Đóng popup
  const handleClosePopup = () => {
    setIsNopPhiPopupOpen(false);
    setIsEditMode(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-5xl max-w-[90vw] max-h-[90vh] overflow-y-auto relative" onClick={e => e.stopPropagation()}>
        <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none" onClick={onClose} aria-label="Đóng">×</button>
        <h3 className="text-2xl font-bold text-center mb-6">Chi tiết khoản thu: {fee.tenKhoan}</h3>
        {fee.ghiChu && <div className="mb-4 text-gray-700"><b>Ghi chú:</b> {fee.ghiChu}</div>}
        <div className="flex justify-between items-center mb-3 pb-2 border-b border-blue-200">
          <div className="flex items-center gap-3">
            <h3 className="text-md font-semibold text-gray-800">Danh sách hộ nộp phí - {fee.tenKhoan}</h3>
            {/* Bộ lọc trạng thái hộ khẩu */}
            <div className="border border-gray-300 rounded-md shadow-sm overflow-hidden bg-white">
              <select
                className="p-1 text-sm bg-white outline-none"
                value={hoKhauFilterOption}
                onChange={e => setHoKhauFilterOption(e.target.value)}
              >
                <option value="Tất cả">Tất cả</option>
                <option value="Đã nộp">Đã nộp</option>
                <option value="Chưa nộp">Chưa nộp</option>
              </select>
            </div>
          </div>
          <button 
            className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 flex items-center gap-1"
            onClick={() => handleOpenPopup()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Thêm hộ nộp
          </button>
        </div>
        <div className="border border-gray-200 rounded-lg max-h-80 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Mã hộ</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Chủ hộ</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Trạng thái</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Ngày nộp</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Số tiền (VND)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Người nộp</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filterHoKhauList(fee.hoKhauList, hoKhauFilterOption).map((hoKhau: any) => (
                <tr key={hoKhau.maHo} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{hoKhau.maHo}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{hoKhau.chuHo}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${hoKhau.trangThai === 'Đã nộp' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{hoKhau.trangThai}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{hoKhau.ngayNop || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(hoKhau.soTien)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{hoKhau.nguoiNop || '-'}</td>
                  <td className="px-4 py-3 text-sm text-center">
                    <div className="flex justify-center space-x-3">
                      {hoKhau.trangThai === 'Chưa nộp' ? (
                        <button 
                          onClick={() => handleOpenPopup(hoKhau)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Nhập thông tin nộp phí"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleOpenPopup(hoKhau, true)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Chỉnh sửa thông tin"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end mt-6">
          <button className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold shadow hover:bg-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400" onClick={onClose}>Đóng</button>
        </div>
        {/* Popup nhập/chỉnh sửa thông tin nộp phí */}
        <NopPhiPopup
          isOpen={isNopPhiPopupOpen}
          onClose={handleClosePopup}
          selectedFee={isEditMode ? fee : undefined}
          selectedHoKhau={selectedHoKhau}
          onSave={() => {}}
          isEditMode={isEditMode}
        />
      </div>
    </div>
  );
};

export default DetailFeePopup; 