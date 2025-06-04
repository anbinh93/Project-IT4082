import React, { useState, useEffect } from 'react';

interface AddEditRoomPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  editData: any | null;
  tenants: { id: string; tenChuHo: string }[];
}

const AddEditRoomPopup: React.FC<AddEditRoomPopupProps> = ({ isOpen, onClose, onSave, editData, tenants }) => {
  const [soPhong, setSoPhong] = useState('');
  const [tang, setTang] = useState('');
  const [dienTich, setDienTich] = useState(0);
  const [donGia, setDonGia] = useState(0);
  const [hoThue, setHoThue] = useState('');
  const [ngayBatDau, setNgayBatDau] = useState('');
  const [ghiChu, setGhiChu] = useState('');

  useEffect(() => {
    if (editData) {
      setSoPhong(editData.soPhong || '');
      setTang(editData.tang || '');
      setDienTich(editData.dienTich || 0);
      setDonGia(editData.donGia || 0);
      setHoThue(editData.hoThue || '');
      setNgayBatDau(editData.ngayBatDau || '');
      setGhiChu(editData.ghiChu || '');
    } else {
      setSoPhong('');
      setTang('');
      setDienTich(0);
      setDonGia(0);
      setHoThue('');
      setNgayBatDau('');
      setGhiChu('');
    }
  }, [editData]);

  const handleSubmit = () => {
    onSave({ soPhong, tang, dienTich, donGia, hoThue, ngayBatDau, ghiChu });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="max-h-screen overflow-y-auto p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-[800px] shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">{editData ? 'Chỉnh sửa phòng' : 'Thêm mới phòng'}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 font-medium mb-1">Số phòng <span className="text-red-500">*</span></label>
              <input type="text" placeholder="Nhập số phòng" value={soPhong} onChange={e => setSoPhong(e.target.value)} className="border rounded px-3 py-2 w-full" />
            </div>

            <div>
              <label className="block text-sm text-gray-700 font-medium mb-1">Tầng <span className="text-red-500">*</span></label>
              <input type="text" placeholder="Nhập tầng" value={tang} onChange={e => setTang(e.target.value)} className="border rounded px-3 py-2 w-full" />
            </div>

            <div>
              <label className="block text-sm text-gray-700 font-medium mb-1">Diện tích (m²) <span className="text-red-500">*</span></label>
              <input type="number" placeholder="Nhập diện tích" value={dienTich} onChange={e => setDienTich(Number(e.target.value))} className="border rounded px-3 py-2 w-full" />
            </div>

            <div>
              <label className="block text-sm text-gray-700 font-medium mb-1">Đơn giá (VNĐ/m²) <span className="text-red-500">*</span></label>
              <input type="number" placeholder="Nhập đơn giá" value={donGia} onChange={e => setDonGia(Number(e.target.value))} className="border rounded px-3 py-2 w-full" />
            </div>

            <div>
              <label className="block text-sm text-gray-700 font-medium mb-1">Hộ thuê hiện tại</label>
              <select value={hoThue} onChange={e => setHoThue(e.target.value)} className="border rounded px-3 py-2 w-full">
                <option value="">-- Chọn hộ thuê --</option>
                {tenants.map(t => (
                  <option key={t.id} value={t.tenChuHo}>{t.tenChuHo}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 font-medium mb-1">Ngày bắt đầu hợp đồng</label>
              <input type="date" value={ngayBatDau} onChange={e => setNgayBatDau(e.target.value)} className="border rounded px-3 py-2 w-full" />
            </div>

            <div>
              <label className="block text-sm text-gray-700 font-medium mb-1">Ghi chú hợp đồng</label>
              <textarea placeholder="Nhập ghi chú nếu có..." value={ghiChu} onChange={e => setGhiChu(e.target.value)} className="border rounded px-3 py-2 w-full" rows={3} />
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

export default AddEditRoomPopup;
