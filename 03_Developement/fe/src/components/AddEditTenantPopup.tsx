import React, { useState, useEffect } from 'react';

interface AddEditTenantPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  availableRooms: { id: string; soPhong: string }[];
}

const AddEditTenantPopup: React.FC<AddEditTenantPopupProps> = ({ isOpen, onClose, onSave, availableRooms }) => {
  const [tenChuHo, setTenChuHo] = useState('');
  const [soHoKhau, setSoHoKhau] = useState('');
  const [sdt, setSdt] = useState('');
  const [ngayBatDau, setNgayBatDau] = useState('');
  const [ghiChu, setGhiChu] = useState('');
  const [soPhong, setSoPhong] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setTenChuHo('');
      setSoHoKhau('');
      setSdt('');
      setNgayBatDau('');
      setGhiChu('');
      setSoPhong('');
      setErrors([]);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    const newErrors: string[] = [];
    if (!tenChuHo.trim()) newErrors.push('Tên chủ hộ là bắt buộc');
    if (!soHoKhau.trim()) newErrors.push('Số hộ khẩu là bắt buộc');
    if (!sdt.trim()) newErrors.push('Số điện thoại là bắt buộc');
    if (!ngayBatDau.trim()) newErrors.push('Ngày bắt đầu là bắt buộc');
    if (!soPhong.trim()) newErrors.push('Phòng thuê là bắt buộc');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({ tenChuHo, soHoKhau, sdt, ngayBatDau, ghiChu, soPhong });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="max-h-screen overflow-y-auto p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-xl shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Thêm hộ thuê mới</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
          </div>

          {errors.length > 0 && (
            <div className="mb-4 text-red-600 text-sm">
              {errors.map((err, i) => <div key={i}>• {err}</div>)}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên chủ hộ <span className="text-red-500">*</span></label>
              <input type="text" value={tenChuHo} onChange={e => setTenChuHo(e.target.value)} className="border rounded px-3 py-2 w-full" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số hộ khẩu <span className="text-red-500">*</span></label>
              <input type="text" value={soHoKhau} onChange={e => setSoHoKhau(e.target.value)} className="border rounded px-3 py-2 w-full" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
              <input type="text" value={sdt} onChange={e => setSdt(e.target.value)} className="border rounded px-3 py-2 w-full" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu <span className="text-red-500">*</span></label>
              <input type="date" value={ngayBatDau} onChange={e => setNgayBatDau(e.target.value)} className="border rounded px-3 py-2 w-full" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú (tuỳ chọn)</label>
              <textarea value={ghiChu} onChange={e => setGhiChu(e.target.value)} className="border rounded px-3 py-2 w-full" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phòng thuê hiện tại <span className="text-red-500">*</span></label>
              <select value={soPhong} onChange={e => setSoPhong(e.target.value)} className="border rounded px-3 py-2 w-full">
                <option value="">-- Chọn phòng trống --</option>
                {availableRooms.map(r => (
                  <option key={r.id} value={r.soPhong}>{r.soPhong}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded border bg-gray-100 hover:bg-gray-200">Hủy</button>
            <button onClick={handleSubmit} className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600">Lưu</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditTenantPopup;