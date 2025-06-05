import React, { useState } from 'react';

interface Resident {
  id: string;
  name: string;
  cccd: string;
  ngaySinh: string;
  gioiTinh: string;
  ngheNghiep: string;
}

interface AddHoKhauPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
  residents: Resident[];
}

const AddHoKhauPopup: React.FC<AddHoKhauPopupProps> = ({ isOpen, onClose, onAdd, residents }) => {
  const [formData, setFormData] = useState({
    soHoKhau: '',
    chuHo: '',
    chuHoId: '',
    soNha: '',
    duong: '',
    phuong: '',
    quan: '',
    thanhPho: '',
    ngayLamHoKhau: '',
    danhSachThanhVien: []
  });
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredResidents = residents.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.cccd.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectChuHo = (resident: Resident) => {
    setFormData(prev => ({
      ...prev,
      chuHo: resident.name,
      chuHoId: resident.id
    }));
    setSearch(resident.name + ' - ' + resident.cccd);
    setShowDropdown(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <h2 className="text-2xl font-bold mb-4">Thêm Hộ khẩu mới</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Số hộ khẩu <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="soHoKhau"
                value={formData.soHoKhau}
                onChange={handleInputChange}
                className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Chủ hộ <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  name="chuHo"
                  value={search}
                  onChange={e => {
                    setSearch(e.target.value);
                    setShowDropdown(true);
                    setFormData(prev => ({ ...prev, chuHo: '', chuHoId: '' }));
                  }}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                  autoComplete="off"
                  placeholder="Nhập tên hoặc CCCD"
                  className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  required
                />
                {showDropdown && search && (
                  <div className="absolute z-10 left-0 right-0 bg-white border border-gray-200 rounded-md shadow max-h-56 overflow-y-auto">
                    {filteredResidents.length === 0 && (
                      <div className="p-2 text-gray-500">Không tìm thấy nhân khẩu</div>
                    )}
                    {filteredResidents.slice(0, 5).map(r => (
                      <div
                        key={r.id}
                        className="p-2 cursor-pointer hover:bg-blue-100"
                        onClick={() => handleSelectChuHo(r)}
                      >
                        <span className="font-medium">{r.name}</span>
                        <span className="ml-2 text-gray-500 text-xs">({r.cccd})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Số nhà <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="soNha"
                value={formData.soNha}
                onChange={handleInputChange}
                className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Đường <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="duong"
                value={formData.duong}
                onChange={handleInputChange}
                className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phường <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="phuong"
                value={formData.phuong}
                onChange={handleInputChange}
                className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Quận <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="quan"
                value={formData.quan}
                onChange={handleInputChange}
                className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Thành phố <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="thanhPho"
                value={formData.thanhPho}
                onChange={handleInputChange}
                className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày làm hộ khẩu <span className="text-red-500">*</span></label>
              <input
                type="date"
                name="ngayLamHoKhau"
                value={formData.ngayLamHoKhau}
                onChange={handleInputChange}
                className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                required
              />
            </div>
          </div>
          {/* Footer */}
          <div className="flex justify-end gap-4 mt-8">
            <button type="button" onClick={onClose} className="px-5 py-2 border border-gray-300 rounded-xl text-gray-700 font-semibold bg-white hover:bg-gray-50 shadow-sm">Hủy</button>
            <button type="submit" className="px-5 py-2 bg-blue-500 text-white rounded-xl font-semibold shadow hover:bg-blue-600 transition">Thêm</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHoKhauPopup;
