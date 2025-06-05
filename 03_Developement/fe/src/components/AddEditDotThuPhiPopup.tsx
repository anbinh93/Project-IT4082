import React, { useState } from 'react';

interface AddEditDotThuPhiPopupProps {
  isOpen: boolean;
  onClose: () => void;
  // onSave callback sẽ được truyền từ ngoài vào để thêm đợt thu mới
  onSave?: (data: { maDot: string; tenDot: string; ngayTao: string; hanThu: string }) => void;
}

const AddEditDotThuPhiPopup: React.FC<AddEditDotThuPhiPopupProps> = ({ isOpen, onClose, onSave }) => {
  const today = new Date().toISOString().slice(0, 10);
  const [maDot, setMaDot] = useState('');
  const [tenDot, setTenDot] = useState('');
  const [ngayTao, setNgayTao] = useState(today);
  const [hanThu, setHanThu] = useState('');
  const [errors, setErrors] = useState<{ maDot?: string; tenDot?: string; ngayTao?: string; hanThu?: string }>({});
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [showConfirmSave, setShowConfirmSave] = useState(false);
  const [pendingAction, setPendingAction] = useState<'close' | 'save' | null>(null);

  if (!isOpen) return null;

  // Kiểm tra form có thay đổi không
  const isDirty = maDot || tenDot || (ngayTao !== today) || hanThu;

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!maDot.trim()) newErrors.maDot = 'Vui lòng nhập mã đợt';
    if (!tenDot.trim()) newErrors.tenDot = 'Vui lòng nhập tên đợt thu';
    if (!ngayTao) newErrors.ngayTao = 'Vui lòng chọn ngày tạo';
    if (!hanThu) newErrors.hanThu = 'Vui lòng chọn hạn thu';
    if (ngayTao && hanThu && hanThu < ngayTao) newErrors.hanThu = 'Hạn thu phải lớn hơn hoặc bằng ngày tạo';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Đóng popup (có xác nhận nếu dirty)
  const handleRequestClose = () => {
    if (isDirty) {
      setShowConfirmClose(true);
      setPendingAction('close');
    } else {
      handleClose();
    }
  };

  // Đóng thật sự
  const handleClose = () => {
    setErrors({});
    setMaDot('');
    setTenDot('');
    setNgayTao(today);
    setHanThu('');
    setShowConfirmClose(false);
    setShowConfirmSave(false);
    setPendingAction(null);
    onClose();
  };

  // Xác nhận lưu
  const handleSave = () => {
    if (!validate()) return;
    setShowConfirmSave(true);
    setPendingAction('save');
  };

  // Lưu thật sự
  const handleSaveConfirmed = () => {
    if (onSave) onSave({ maDot, tenDot, ngayTao, hanThu });
    handleClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <h2 className="text-2xl font-bold mb-4">Thêm Đợt thu phí</h2>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Mã đợt <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="maDot"
                value={maDot}
                onChange={e => setMaDot(e.target.value)}
                className={`block w-full rounded-xl border ${errors.maDot ? 'border-red-500' : 'border-gray-300'} px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none`}
                required
              />
              {errors.maDot && <p className="text-xs text-red-500 mt-1">{errors.maDot}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tên đợt thu <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="tenDot"
                value={tenDot}
                onChange={e => setTenDot(e.target.value)}
                className={`block w-full rounded-xl border ${errors.tenDot ? 'border-red-500' : 'border-gray-300'} px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none`}
                required
              />
              {errors.tenDot && <p className="text-xs text-red-500 mt-1">{errors.tenDot}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày tạo <span className="text-red-500">*</span></label>
              <input
                type="date"
                name="ngayTao"
                value={ngayTao}
                onChange={e => setNgayTao(e.target.value)}
                className={`block w-full rounded-xl border ${errors.ngayTao ? 'border-red-500' : 'border-gray-300'} px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none`}
                required
              />
              {errors.ngayTao && <p className="text-xs text-red-500 mt-1">{errors.ngayTao}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Hạn thu <span className="text-red-500">*</span></label>
              <input
                type="date"
                name="hanThu"
                value={hanThu}
                onChange={e => setHanThu(e.target.value)}
                className={`block w-full rounded-xl border ${errors.hanThu ? 'border-red-500' : 'border-gray-300'} px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none`}
                required
              />
              {errors.hanThu && <p className="text-xs text-red-500 mt-1">{errors.hanThu}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-8">
            <button type="button" onClick={handleRequestClose} className="px-5 py-2 border border-gray-300 rounded-xl text-gray-700 font-semibold bg-white hover:bg-gray-50 shadow-sm">Hủy</button>
            <button type="submit" className="px-5 py-2 bg-blue-500 text-white rounded-xl font-semibold shadow hover:bg-blue-600 transition">Lưu</button>
          </div>
        </form>
      </div>
      
      {/* Subpopup xác nhận đóng/thêm */}
      {(showConfirmClose || showConfirmSave) && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60]" onClick={() => {
          setShowConfirmClose(false);
          setShowConfirmSave(false);
          setPendingAction(null);
        }}>
          <div className="bg-white rounded-lg shadow-xl px-8 py-7 max-w-sm w-full relative" onClick={e => e.stopPropagation()}>
            <p className="text-base text-gray-800 mb-6 text-center font-medium">
              {showConfirmClose && 'Những thay đổi hiện tại sẽ không được lưu lại. Bạn vẫn muốn thoát?'}
              {showConfirmSave && 'Bạn xác nhận tạo đợt thu phí mới này?'}
            </p>
            <div className="flex gap-4 w-full">
              <button
                className="flex-1 px-4 py-2.5 bg-gray-400 text-white rounded hover:bg-gray-500 font-medium transition-colors"
                onClick={() => {
                  setShowConfirmClose(false);
                  setShowConfirmSave(false);
                  setPendingAction(null);
                }}
              >
                {showConfirmClose ? 'Chỉnh sửa tiếp' : 'Hủy'}
              </button>
              <button
                className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium transition-colors"
                onClick={() => {
                  if (pendingAction === 'close') handleClose();
                  if (pendingAction === 'save') handleSaveConfirmed();
                }}
              >
                {showConfirmClose ? 'Thoát' : 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddEditDotThuPhiPopup; 