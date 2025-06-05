import React, { useState } from 'react';

interface AddMemberPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (member: {
    tenNhanKhau: string;
    cccd: string;
    ngaySinh: string;
    gioiTinh: string;
    ngheNghiep: string;
    quanHeVoiChuHo: string;
    ngayThem: string;
  }) => void;
  residents?: { 
    id: string; 
    name: string; 
    cccd: string;
    ngaySinh: string;
    gioiTinh: string;
    ngheNghiep: string;
  }[];
}

const AddMemberPopup: React.FC<AddMemberPopupProps> = ({
  isOpen,
  onClose,
  onAdd,
  residents = [
    { id: 'TV009', name: 'Nguyễn Văn Bình', cccd: '001234567893', ngaySinh: '1990-01-01', gioiTinh: 'Nam', ngheNghiep: 'Kỹ sư' },
    { id: 'TV010', name: 'Phạm Thị Hoa', cccd: '001234567894', ngaySinh: '1992-02-02', gioiTinh: 'Nữ', ngheNghiep: 'Giáo viên' },
    { id: 'TV011', name: 'Lê Văn Dũng', cccd: '001234567895', ngaySinh: '1985-03-03', gioiTinh: 'Nam', ngheNghiep: 'Bác sĩ' },
  ]
}) => {
  // Lấy ngày hiện tại và format thành YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState({
    tenNhanKhau: '',
    cccd: '',
    ngaySinh: '',
    gioiTinh: '',
    ngheNghiep: '',
    quanHeVoiChuHo: '',
    ngayThem: today
  });
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredResidents = residents.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    (r.cccd && r.cccd.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSelectResident = (resident: { id: string; name: string; cccd: string; ngaySinh: string; gioiTinh: string; ngheNghiep: string }) => {
    setFormData(prev => ({
      ...prev,
      tenNhanKhau: resident.name,
      cccd: resident.cccd,
      ngaySinh: resident.ngaySinh,
      gioiTinh: resident.gioiTinh,
      ngheNghiep: resident.ngheNghiep
    }));
    setSearch(resident.name + ` - ${resident.cccd}`);
    setShowDropdown(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === 'tenNhanKhau') {
      setSearch(value);
      setShowDropdown(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Thêm Nhân khẩu vào Hộ khẩu
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nhân khẩu <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                name="tenNhanKhau"
                value={search}
                onChange={e => {
                  setSearch(e.target.value);
                  setShowDropdown(true);
                  setFormData(prev => ({ ...prev, tenNhanKhau: '', cccd: '', ngaySinh: '', gioiTinh: '', ngheNghiep: '' }));
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
                      onClick={() => handleSelectResident(r)}
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
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Quan hệ với chủ hộ <span className="text-red-500">*</span>
            </label>
            <input
              name="quanHeVoiChuHo"
              value={formData.quanHeVoiChuHo}
              onChange={handleInputChange}
              placeholder="Nhập quan hệ với chủ hộ"
              className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Ngày thêm <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="ngayThem"
              value={formData.ngayThem}
              onChange={handleInputChange}
              className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              required
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border border-gray-300 rounded-xl text-gray-700 font-semibold bg-white hover:bg-gray-50 shadow-sm"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-500 text-white rounded-xl font-semibold shadow hover:bg-blue-600 transition"
            >
              Thêm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberPopup;
