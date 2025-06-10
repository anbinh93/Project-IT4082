import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface EditDotThuPhiPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: { maDot: number; tenDot: string; ngayTao: string; hanThu: string }) => void;
  batch?: any | null;
}

const formatDateForInput = (dateString: string) => {
  // Convert from DD/MM/YYYY to YYYY-MM-DD
  const [day, month, year] = dateString.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

const formatDateForDisplay = (dateString: string) => {
  // Convert from YYYY-MM-DD to DD/MM/YYYY
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

const EditDotThuPhiPopup: React.FC<EditDotThuPhiPopupProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  batch 
}) => {
  const today = new Date().toISOString().slice(0, 10);
  const [maDot, setMaDot] = useState<number>(0);
  const [tenDot, setTenDot] = useState('');
  const [ngayTao, setNgayTao] = useState(today);
  const [hanThu, setHanThu] = useState('');
  const [errors, setErrors] = useState<{ maDot?: string; tenDot?: string; ngayTao?: string; hanThu?: string }>({});
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [showConfirmSave, setShowConfirmSave] = useState(false);
  const [pendingAction, setPendingAction] = useState<'close' | 'save' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Cập nhật form khi có dữ liệu ban đầu
  useEffect(() => {
    if (batch) {
      setMaDot(Number(batch.maDot) || 0);
      setTenDot(batch.tenDot || '');
      setNgayTao(formatDateForInput(batch.ngayTao) || today);
      setHanThu(formatDateForInput(batch.hanCuoi) || '');
    }
  }, [batch, today]);

  if (!isOpen) return null;

  // Kiểm tra form có thay đổi không
  const isDirty = batch && (
    maDot !== Number(batch.maDot) || 
    tenDot !== batch.tenDot || 
    formatDateForDisplay(ngayTao) !== batch.ngayTao || 
    formatDateForDisplay(hanThu) !== batch.hanCuoi
  );

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!maDot) newErrors.maDot = 'Vui lòng nhập mã đợt';
    if (maDot < 0) newErrors.maDot = 'Mã đợt phải là số nguyên dương';
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
    setMaDot(0);
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
  const handleSaveConfirmed = async () => {
    try {
      setIsSubmitting(true);
      setApiError(null);

      const response = await axios.put(`http://localhost:8001/api/accountant/dotthu/${batch.maDot}`, {
        maDot,
        tenDotThu: tenDot,
        ngayTao: new Date(ngayTao).toISOString(),
        thoiHan: new Date(hanThu).toISOString()
      });

      if (response.data) {
        if (onSave) onSave({ 
          maDot, 
          tenDot, 
          ngayTao: formatDateForDisplay(ngayTao), 
          hanThu: formatDateForDisplay(hanThu) 
        });
        handleClose();
      }
    } catch (error: any) {
      setApiError(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật đợt thu');
      console.error('Error updating batch:', error);
    } finally {
      setIsSubmitting(false);
    }
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
              pattern="\d*"
              inputMode="numeric"
              className={`mt-1 block w-full px-3 py-2 border ${errors.maDot ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
              placeholder="Ví dụ: 4"
              value={maDot || ''}
              onChange={e => {
                const value = e.target.value.replace(/\D/g, '');
                setMaDot(value ? parseInt(value) : 0);
              }}
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

          {/* Hiển thị lỗi API nếu có */}
          {apiError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{apiError}</p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              className="flex-1 px-4 py-3 bg-gray-500 text-white text-base font-semibold rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all disabled:opacity-50"
              onClick={handleRequestClose}
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              className="flex-1 px-4 py-3 bg-blue-500 text-white text-base font-semibold rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50"
              onClick={handleSave}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang lưu...' : 'Lưu'}
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