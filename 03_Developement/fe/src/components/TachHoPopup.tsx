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
  const [householdSearch, setHouseholdSearch] = useState('');
  const [newSoHoKhau, setNewSoHoKhau] = useState('');
  const [newSoNha, setNewSoNha] = useState('');
  const [newDuong, setNewDuong] = useState('');
  const [newPhuong, setNewPhuong] = useState('');
  const [newQuan, setNewQuan] = useState('');
  const [newThanhPho, setNewThanhPho] = useState('');
  const [newNgayLamHoKhau, setNewNgayLamHoKhau] = useState('');

  // Sample data cho danh sách hộ gia đình có sẵn
  const existingHouseholds = [
    { id: 'HO001', address: 'Chung cư A - Tầng 5 - Căn 501', chuHo: 'Nguyễn Văn Minh' },
    { id: 'HO002', address: 'Chung cư A - Tầng 7 - Căn 702', chuHo: 'Trần Thị Lan' },
    { id: 'HO003', address: 'Chung cư B - Tầng 3 - Căn 304', chuHo: 'Lê Văn Đức' },
    { id: 'HO004', address: 'Chung cư B - Tầng 8 - Căn 801', chuHo: 'Phạm Thị Mai' },
  ];

  const filteredHouseholds = existingHouseholds.filter(h =>
    h.address.toLowerCase().includes(householdSearch.toLowerCase()) ||
    h.chuHo.toLowerCase().includes(householdSearch.toLowerCase()) ||
    h.id.toLowerCase().includes(householdSearch.toLowerCase())
  );

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
    setHouseholdSearch('');
    setNewSoHoKhau('');
    setNewSoNha('');
    setNewDuong('');
    setNewPhuong('');
    setNewQuan('');
    setNewThanhPho('');
    setNewNgayLamHoKhau('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <h2 className="text-2xl font-bold mb-4">Tách hộ - Chuyển nhân khẩu</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
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
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="householdType"
                  checked={!isCreatingNewHousehold}
                  onChange={() => setIsCreatingNewHousehold(false)}
                  className="text-blue-600"
                />
                <span className="text-gray-700">Chuyển vào hộ gia đình có sẵn</span>
              </label>
              <label className="flex items-center gap-3">
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
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tìm hộ gia đình:</label>
                <input
                  type="text"
                  value={selectedHousehold
                    ? existingHouseholds.find(h => h.id === selectedHousehold)?.address + ' - Chủ hộ: ' + existingHouseholds.find(h => h.id === selectedHousehold)?.chuHo
                    : householdSearch}
                  onChange={e => {
                    setHouseholdSearch(e.target.value);
                    setSelectedHousehold('');
                  }}
                  placeholder="Nhập địa chỉ, chủ hộ hoặc mã hộ khẩu"
                  className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none mb-2"
                  autoComplete="off"
                  onFocus={() => setSelectedHousehold('')}
                />
                {householdSearch && !selectedHousehold && (
                  <div className="absolute z-10 left-0 right-0 bg-white border border-gray-200 rounded-md shadow max-h-56 overflow-y-auto">
                    {filteredHouseholds.length === 0 && (
                      <div className="p-2 text-gray-500">Không tìm thấy hộ phù hợp</div>
                    )}
                    {filteredHouseholds.slice(0, 5).map(household => (
                      <div
                        key={household.id}
                        className="p-2 cursor-pointer hover:bg-blue-100"
                        onClick={() => {
                          setSelectedHousehold(household.id);
                          setHouseholdSearch('');
                        }}
                      >
                        {household.address} - Chủ hộ: {household.chuHo}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {/* Input cho hộ mới */}
            {isCreatingNewHousehold && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Số hộ khẩu <span className="text-red-500">*</span></label>
                  <input type="text" className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" value={newSoHoKhau} onChange={e => setNewSoHoKhau(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Chủ hộ <span className="text-red-500">*</span></label>
                  <input type="text" className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm bg-gray-100" value={selectedResident?.hoTen || ''} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Số nhà <span className="text-red-500">*</span></label>
                  <input type="text" className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" value={newSoNha} onChange={e => setNewSoNha(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Đường <span className="text-red-500">*</span></label>
                  <input type="text" className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" value={newDuong} onChange={e => setNewDuong(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phường <span className="text-red-500">*</span></label>
                  <input type="text" className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" value={newPhuong} onChange={e => setNewPhuong(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Quận <span className="text-red-500">*</span></label>
                  <input type="text" className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" value={newQuan} onChange={e => setNewQuan(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Thành phố <span className="text-red-500">*</span></label>
                  <input type="text" className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" value={newThanhPho} onChange={e => setNewThanhPho(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày làm hộ khẩu <span className="text-red-500">*</span></label>
                  <input type="date" className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" value={newNgayLamHoKhau} onChange={e => setNewNgayLamHoKhau(e.target.value)} required />
                </div>
              </div>
            )}
          </div>
          {/* Lý do tách hộ */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Lý do tách hộ:</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do tách hộ..."
              rows={3}
              className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              required
            />
          </div>
          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2 border border-gray-300 rounded-xl text-gray-700 font-semibold bg-white hover:bg-gray-50 shadow-sm"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-500 text-white rounded-xl font-semibold shadow hover:bg-blue-600 transition"
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