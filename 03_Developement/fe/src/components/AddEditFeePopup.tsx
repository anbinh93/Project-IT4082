import React, { useState, useEffect } from 'react';

interface AddEditFeePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: { tenKhoan: string; chiTiet: string; soTien: string; batBuoc: string }) => void;
  initialData?: { tenKhoan: string; chiTiet: string; soTien: string; batBuoc: string } | null;
  title?: string;
}

const AddEditFeePopup: React.FC<AddEditFeePopupProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  initialData,
  title = 'Thêm khoản thu'
}) => {
  const [tenKhoan, setTenKhoan] = useState('');
  const [chiTiet, setChiTiet] = useState('');
  const [soTien, setSoTien] = useState('');
  const [batBuoc, setBatBuoc] = useState('Bắt buộc');
  const [errors, setErrors] = useState<{ tenKhoan?: string; soTien?: string }>({});
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [showConfirmSave, setShowConfirmSave] = useState(false);
  const [pendingAction, setPendingAction] = useState<'close' | 'save' | null>(null);

  // Xác định xem đây là thêm mới hay chỉnh sửa
  const isEditMode = Boolean(initialData);

  // Cập nhật form khi có dữ liệu ban đầu
  useEffect(() => {
    if (initialData) {
      setTenKhoan(initialData.tenKhoan || '');
      setChiTiet(initialData.chiTiet || '');
      setSoTien(initialData.soTien || '');
      setBatBuoc(initialData.batBuoc || 'Bắt buộc');
    } else {
      // Reset form khi mở popup thêm mới
      setTenKhoan('');
      setChiTiet('');
      setSoTien('');
      setBatBuoc('Bắt buộc');
    }
  }, [initialData]);

  if (!isOpen) return null;

  // Kiểm tra form có thay đổi không
  const isDirty = 
    (initialData && (
      tenKhoan !== initialData.tenKhoan || 
      chiTiet !== initialData.chiTiet || 
      soTien !== initialData.soTien || 
      batBuoc !== initialData.batBuoc
    )) || 
    (!initialData && (tenKhoan || chiTiet || soTien || (batBuoc !== 'Bắt buộc')));

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!tenKhoan.trim()) newErrors.tenKhoan = 'Vui lòng nhập tên khoản thu';
    if (!soTien.trim()) newErrors.soTien = 'Vui lòng nhập số tiền';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Định dạng số tiền
  const formatCurrency = (value: string) => {
    // Xóa tất cả ký tự không phải số
    const numericValue = value.replace(/[^\d]/g, '');
    
    // Nếu không có giá trị, trả về chuỗi rỗng
    if (!numericValue) return '';
    
    // Định dạng số với dấu phân cách hàng nghìn
    const formattedValue = new Intl.NumberFormat('vi-VN').format(parseInt(numericValue));
    
    // Thêm đơn vị tiền tệ
    return `${formattedValue} VND`;
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
    setTenKhoan('');
    setChiTiet('');
    setSoTien('');
    setBatBuoc('Bắt buộc');
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
    if (onSave) {
      // Đảm bảo số tiền được định dạng đúng
      const formattedSoTien = soTien.includes('VND') ? soTien : formatCurrency(soTien);
      
      onSave({ 
        tenKhoan, 
        chiTiet, 
        soTien: formattedSoTien, 
        batBuoc 
      });
    }
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
          <h3 className="text-2xl font-bold text-center mb-6">{title}</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên khoản thu <span className="text-red-500">*</span></label>
            <input
              type="text"
              className={`mt-1 block w-full px-3 py-2 border ${errors.tenKhoan ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="Ví dụ: Phí dịch vụ"
              value={tenKhoan}
              onChange={e => setTenKhoan(e.target.value)}
            />
            {errors.tenKhoan && <p className="text-xs text-red-500 mt-1">{errors.tenKhoan}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Chi tiết</label>
            <textarea
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Mô tả chi tiết về khoản thu..."
              rows={3}
              value={chiTiet}
              onChange={e => setChiTiet(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền <span className="text-red-500">*</span></label>
            <input
              type="text"
              className={`mt-1 block w-full px-3 py-2 border ${errors.soTien ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="Ví dụ: 200,000"
              value={soTien}
              onChange={e => setSoTien(formatCurrency(e.target.value))}
            />
            {errors.soTien && <p className="text-xs text-red-500 mt-1">{errors.soTien}</p>}
          </div>
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-1">Loại khoản thu</label>
            <select
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={batBuoc}
              onChange={e => setBatBuoc(e.target.value)}
            >
              <option value="Bắt buộc">Bắt buộc</option>
              <option value="Không bắt buộc">Không bắt buộc</option>
            </select>
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
              {showConfirmSave && isEditMode && 'Bạn xác nhận lưu thay đổi cho khoản thu này?'}
              {showConfirmSave && !isEditMode && 'Bạn xác nhận tạo khoản thu mới này?'}
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

export default AddEditFeePopup; 