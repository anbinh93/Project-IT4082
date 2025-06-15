import React, { useState, useEffect } from 'react';
import { khoanThuAPI } from '../services/api';

interface EditDotThuPhiPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: { 
    maDot: string; 
    tenDot: string; 
    ngayTao: string; 
    hanThu: string;
    khoanThu?: Array<{
      khoanThuId: number;
      soTien: number;
    }>;
    soTien?: number; // Thêm tổng số tiền
  }) => void;
  batch?: any | null;
}

const EditDotThuPhiPopup: React.FC<EditDotThuPhiPopupProps> = ({ isOpen, onClose, onSave, batch }) => {
  const today = new Date().toISOString().slice(0, 10);
  const [maDot, setMaDot] = useState('');
  const [tenDot, setTenDot] = useState('');
  const [ngayTao, setNgayTao] = useState(today);
  const [hanThu, setHanThu] = useState('');
  const [availableKhoanThu, setAvailableKhoanThu] = useState<any[]>([]);
  const [selectedKhoanThu, setSelectedKhoanThu] = useState<Array<{khoanThuId: number; soTien: number}>>([]);
  const [errors, setErrors] = useState<{ maDot?: string; tenDot?: string; ngayTao?: string; hanThu?: string }>({});
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [showConfirmSave, setShowConfirmSave] = useState(false);
  const [pendingAction, setPendingAction] = useState<'close' | 'save' | null>(null);
  const [loadingKhoanThu, setLoadingKhoanThu] = useState(false);

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
      
      // Load existing khoanThu for this batch
      if (batch.details?.khoanThu) {
        const khoanThuData = batch.details.khoanThu.map((kt: any) => ({
          khoanThuId: kt.id,
          soTien: kt.soTienMacDinh || 0
        }));
        setSelectedKhoanThu(khoanThuData);
      }
    }
  }, [batch, today]);

  // Load available KhoanThu from API
  useEffect(() => {
    const loadKhoanThu = async () => {
      if (!isOpen) return;
      
      try {
        setLoadingKhoanThu(true);
        const response = await khoanThuAPI.getAll();
        if (response.success) {
          setAvailableKhoanThu(response.data);
        }
      } catch (error) {
        console.error('Error loading KhoanThu:', error);
      } finally {
        setLoadingKhoanThu(false);
      }
    };

    loadKhoanThu();
  }, [isOpen]);

  // Xử lý thay đổi khoản thu
  const handleKhoanThuChange = (khoanThuId: number, isChecked: boolean) => {
    if (isChecked) {
      setSelectedKhoanThu(prev => [...prev, { khoanThuId, soTien: 0 }]);
    } else {
      setSelectedKhoanThu(prev => prev.filter(kt => kt.khoanThuId !== khoanThuId));
    }
  };

  // Xử lý thay đổi số tiền khoản thu
  const handleSoTienChange = (khoanThuId: number, soTien: number) => {
    setSelectedKhoanThu(prev => 
      prev.map(kt => 
        kt.khoanThuId === khoanThuId ? { ...kt, soTien } : kt
      )
    );
  };

  if (!isOpen) return null;

  // Kiểm tra form có thay đổi không
  const isDirty = batch && (
    maDot !== batch.maDot || 
    tenDot !== batch.tenDot || 
    formatDateForSave(ngayTao) !== batch.ngayTao || 
    formatDateForSave(hanThu) !== batch.hanCuoi ||
    JSON.stringify(selectedKhoanThu) !== JSON.stringify(batch.details?.khoanThu?.map((kt: any) => ({
      khoanThuId: kt.id,
      soTien: kt.soTienMacDinh || 0
    })) || [])
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
    setSelectedKhoanThu([]);
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
    // Tính tổng số tiền của tất cả khoản thu đã chọn
    const tongSoTien = selectedKhoanThu.reduce((sum, kt) => sum + (kt.soTien || 0), 0);
    if (onSave) onSave({ 
      maDot, 
      tenDot, 
      ngayTao: formatDateForSave(ngayTao), 
      hanThu: formatDateForSave(hanThu),
      khoanThu: selectedKhoanThu,
      soTien: tongSoTien // Thêm tổng số tiền vào data gửi về
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

          {/* Phần chọn khoản thu */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">Chọn khoản thu cho đợt này</label>
            {loadingKhoanThu ? (
              <div className="text-center py-4 text-gray-500">Đang tải khoản thu...</div>
            ) : (
              <div className="space-y-3 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-3">
                {availableKhoanThu.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">Không có khoản thu nào</div>
                ) : (
                  availableKhoanThu.map((khoanThu) => {
                    const isSelected = selectedKhoanThu.some(kt => kt.khoanThuId === khoanThu.id);
                    const selectedItem = selectedKhoanThu.find(kt => kt.khoanThuId === khoanThu.id);
                    
                    return (
                      <div key={khoanThu.id} className="flex items-center space-x-3 p-2 border border-gray-100 rounded">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleKhoanThuChange(khoanThu.id, e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-900">{khoanThu.tenKhoan}</span>
                          {khoanThu.batBuoc && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Bắt buộc
                            </span>
                          )}
                          {khoanThu.ghiChu && (
                            <p className="text-xs text-gray-500 mt-1">{khoanThu.ghiChu}</p>
                          )}
                        </div>
                        {isSelected && (
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">Số tiền:</span>
                            <input
                              type="number"
                              value={selectedItem?.soTien || 0}
                              onChange={(e) => handleSoTienChange(khoanThu.id, parseInt(e.target.value) || 0)}
                              className="w-24 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="0"
                              min="0"
                            />
                            <span className="text-xs text-gray-500">VND</span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
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