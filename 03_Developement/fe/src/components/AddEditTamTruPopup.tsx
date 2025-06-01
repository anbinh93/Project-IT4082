import React, { useEffect, useState } from 'react';

interface TamTruData {
  id: string;
  hoTen: string;
  trangThai: 'Tạm trú' | 'Tạm vắng';
  diaChi: string;
  tuNgay: string;
  denNgay: string;
  noiDungDeNghi: string;
}

interface AddEditTamTruPopupProps {
  isOpen: boolean;
  onClose: () => void;
  editData: TamTruData | null;
  onSave: (data: Omit<TamTruData, 'id'>) => void;
}

const AddEditTamTruPopup: React.FC<AddEditTamTruPopupProps> = ({
  isOpen, onClose, editData, onSave
}) => {
  const [selectedNhanKhau, setSelectedNhanKhau] = useState('');
  const [selectedTrangThai, setSelectedTrangThai] = useState('');
  const [diaChi, setDiaChi] = useState('');
  const [tuNgay, setTuNgay] = useState('');
  const [denNgay, setDenNgay] = useState('');
  const [noiDungDeNghi, setNoiDungDeNghi] = useState('');

  const nhanKhauList = [
    'Nguyễn Văn An',
    'Trần Thị Bình',
    'Lê Minh Công',
    'Phạm Thị Dung',
    'Hoàng Văn Em'
  ];

  const trangThaiOptions = ['Tạm trú', 'Tạm vắng'];

  useEffect(() => {
    if (editData) {
      setSelectedNhanKhau(editData.hoTen);
      setSelectedTrangThai(editData.trangThai);
      setDiaChi(editData.diaChi);
      setTuNgay(editData.tuNgay);
      setDenNgay(editData.denNgay);
      setNoiDungDeNghi(editData.noiDungDeNghi);
    } else {
      handleReset();
    }
  }, [editData]);

  const handleReset = () => {
    setSelectedNhanKhau('');
    setSelectedTrangThai('');
    setDiaChi('');
    setTuNgay('');
    setDenNgay('');
    setNoiDungDeNghi('');
  };

  const handleSave = () => {
    if (!selectedNhanKhau || !selectedTrangThai || !diaChi || !tuNgay || !denNgay) {
      alert("Vui lòng nhập đầy đủ thông tin bắt buộc!");
      return;
    }

    onSave({
      hoTen: selectedNhanKhau,
      trangThai: selectedTrangThai as 'Tạm trú' | 'Tạm vắng',
      diaChi,
      tuNgay,
      denNgay,
      noiDungDeNghi
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-md bg-white/30">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              {editData ? 'Cập nhật tạm trú/tạm vắng' : 'Thêm mới tạm trú/tạm vắng'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            {/* Nhân khẩu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nhân khẩu <span className="text-red-500">*</span></label>
              <select
                value={selectedNhanKhau}
                onChange={(e) => setSelectedNhanKhau(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">-- Chọn nhân khẩu --</option>
                {nhanKhauList.map(nk => (
                  <option key={nk} value={nk}>{nk}</option>
                ))}
              </select>
            </div>

            {/* Trạng thái */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái <span className="text-red-500">*</span></label>
              <select
                value={selectedTrangThai}
                onChange={(e) => setSelectedTrangThai(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">-- Chọn trạng thái --</option>
                {trangThaiOptions.map(tt => (
                  <option key={tt} value={tt}>{tt}</option>
                ))}
              </select>
            </div>

            {/* Địa chỉ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ <span className="text-red-500">*</span></label>
              <input
                value={diaChi}
                onChange={(e) => setDiaChi(e.target.value)}
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Nhập địa chỉ tạm trú/tạm vắng"
              />
            </div>

            {/* Thời gian */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày <span className="text-red-500">*</span></label>
                <input
                  value={tuNgay}
                  onChange={(e) => setTuNgay(e.target.value)}
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày <span className="text-red-500">*</span></label>
                <input
                  value={denNgay}
                  onChange={(e) => setDenNgay(e.target.value)}
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            {/* Nội dung đề nghị */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung đề nghị</label>
              <textarea
                value={noiDungDeNghi}
                onChange={(e) => setNoiDungDeNghi(e.target.value)}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md resize-none"
                placeholder="Nhập nội dung đề nghị..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
            <button
              onClick={() => { handleReset(); onClose(); }}
              className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
            >
              {editData ? 'Cập nhật' : 'Lưu'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditTamTruPopup;