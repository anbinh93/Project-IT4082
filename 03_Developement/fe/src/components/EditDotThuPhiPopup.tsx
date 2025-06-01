import React, { useState, useEffect } from 'react';

interface EditDotThuPhiPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: { maDot: string; tenDot: string; ngayTao: string; hanThu: string }) => void;
  batch?: any | null;
}

const EditDotThuPhiPopup: React.FC<EditDotThuPhiPopupProps> = ({ isOpen, onClose, onSave, batch }) => {
  const today = new Date().toISOString().slice(0, 10);
  const [maDot, setMaDot] = useState('');
  const [tenDot, setTenDot] = useState('');
  const [ngayTao, setNgayTao] = useState(today);
  const [hanThu, setHanThu] = useState('');
  const [errors, setErrors] = useState<{ maDot?: string; tenDot?: string; ngayTao?: string; hanThu?: string }>({});
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [showConfirmSave, setShowConfirmSave] = useState(false);
  const [pendingAction, setPendingAction] = useState<'close' | 'save' | null>(null);

  // Hàm chuyển đổi định dạng ngày từ dd/mm/yyyy sang yyyy-mm-dd
  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return '';
    
    // Kiểm tra xem đã đúng định dạng yyyy-mm-dd chưa
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
    
    // Chuyển từ dd/mm/yyyy sang yyyy-mm-dd
    const parts = dateString.split('/');
    if (parts.length !== 3) return '';
    
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  // Hàm chuyển đổi từ yyyy-mm-dd sang dd/mm/yyyy cho khi lưu
  const formatDateForSave = (dateString: string): string => {
    if (!dateString) return '';
    
    // Chuyển từ yyyy-mm-dd sang dd/mm/yyyy
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;
    
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  // Cập nhật form khi có dữ liệu ban đầu
  useEffect(() => {
    if (batch) {
      setMaDot(batch.maDot || '');
      setTenDot(batch.tenDot || '');
      setNgayTao(formatDateForInput(batch.ngayTao) || today);
      setHanThu(formatDateForInput(batch.hanCuoi) || '');
    }
  }, [batch, today]);

  if (!isOpen) return null;

  // Kiểm tra form có thay đổi không
  const isDirty = batch && (
    maDot !== batch.maDot || 
    tenDot !== batch.tenDot || 
    formatDateForSave(ngayTao) !== batch.ngayTao || 
    formatDateForSave(hanThu) !== batch.hanCuoi
  );

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
    if (onSave) onSave({ 
      maDot, 
      tenDot, 
      ngayTao: formatDateForSave(ngayTao), 
      hanThu: formatDateForSave(hanThu) 
    });
    handleClose();
  };

  // Xử lý click ra ngoài popup
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleRequestClose();
    }
  };

  return (
    <>
      {/* Popup chính */}
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={handleOverlayClick}>
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto relative" onClick={e => e.stopPropagation()}>
          {/* Nút X đóng */}
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
            onClick={handleRequestClose}
            aria-label="Đóng"
          >
            ×
          </button>
          <h3 className="text-2xl font-bold text-center mb-6">Chỉnh sửa đợt thu phí</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Mã đợt <span className="text-red-500">*</span></label>
            <input
              type="text"
              className={`mt-1 block w-full px-3 py-2 border ${errors.maDot ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="Ví dụ: D004"
              value={maDot}
              onChange={e => setMaDot(e.target.value)}
            />
            {errors.maDot && <p className="text-xs text-red-500 mt-1">{errors.maDot}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên đợt thu <span className="text-red-500">*</span></label>
            <input
              type="text"
              className={`mt-1 block w-full px-3 py-2 border ${errors.tenDot ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="Ví dụ: Tháng 6/2025"
              value={tenDot}
              onChange={e => setTenDot(e.target.value)}
            />
            {errors.tenDot && <p className="text-xs text-red-500 mt-1">{errors.tenDot}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày tạo <span className="text-red-500">*</span></label>
            <input
              type="date"
              className={`mt-1 block w-full px-3 py-2 border ${errors.ngayTao ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              value={ngayTao}
              onChange={e => setNgayTao(e.target.value)}
            />
            {errors.ngayTao && <p className="text-xs text-red-500 mt-1">{errors.ngayTao}</p>}
          </div>
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-1">Hạn thu <span className="text-red-500">*</span></label>
            <input
              type="date"
              className={`mt-1 block w-full px-3 py-2 border ${errors.hanThu ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              value={hanThu}
              onChange={e => setHanThu(e.target.value)}
            />
            {errors.hanThu && <p className="text-xs text-red-500 mt-1">{errors.hanThu}</p>}
          </div>
          <div className="flex gap-4">
            <button
              className="flex-1 px-4 py-3 bg-gray-500 text-white text-base font-semibold rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
              onClick={handleRequestClose}
            >
              Hủy
            </button>
            <button
              className="flex-1 px-4 py-3 bg-blue-500 text-white text-base font-semibold rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
              onClick={handleSave}
            >
              Lưu
            </button>
          </div>
        </div>
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
              {showConfirmSave && 'Bạn xác nhận lưu các thay đổi cho đợt thu phí này?'}
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
    </>
  );
};

export default EditDotThuPhiPopup; 