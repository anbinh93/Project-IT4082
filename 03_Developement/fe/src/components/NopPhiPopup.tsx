import React, { useState, useEffect } from 'react';

// Dữ liệu mẫu
const sampleKhoanThu = [
  { id: 'KT001', tenKhoan: 'Phí dịch vụ', soTien: '200,000 VND', trangThai: 'Đang thu' },
  { id: 'KT002', tenKhoan: 'Phí bảo trì', soTien: '100,000 VND', trangThai: 'Đã thu xong' },
  { id: 'KT003', tenKhoan: 'Phí quản lý', soTien: '150,000 VND', trangThai: 'Đã thu xong' },
  { id: 'KT004', tenKhoan: 'Phí gửi xe', soTien: '120,000 VND', trangThai: 'Đang thu' },
  { id: 'KT005', tenKhoan: 'Bảo hiểm chung cư', soTien: '50,000 VND', trangThai: 'Đang thu' }
];

const sampleHoKhau = [
  { 
    maHo: 'HK001', 
    chuHo: 'Nguyễn Văn A',
    thanhVien: [
      { id: 'TV001', ten: 'Nguyễn Văn A', quanHe: 'Chủ hộ' },
      { id: 'TV002', ten: 'Nguyễn Thị B', quanHe: 'Vợ' },
      { id: 'TV003', ten: 'Nguyễn Văn C', quanHe: 'Con' }
    ]
  },
  { 
    maHo: 'HK002', 
    chuHo: 'Trần Thị B',
    thanhVien: [
      { id: 'TV004', ten: 'Trần Thị B', quanHe: 'Chủ hộ' },
      { id: 'TV005', ten: 'Lý Văn D', quanHe: 'Chồng' }
    ]
  },
  { 
    maHo: 'HK003', 
    chuHo: 'Lê Văn C',
    thanhVien: [
      { id: 'TV006', ten: 'Lê Văn C', quanHe: 'Chủ hộ' },
      { id: 'TV007', ten: 'Lê Thị D', quanHe: 'Vợ' },
      { id: 'TV008', ten: 'Lê Văn E', quanHe: 'Con' },
      { id: 'TV009', ten: 'Lê Thị F', quanHe: 'Con' }
    ]
  }
];

interface NopPhiPopupProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFee?: any;
  selectedHoKhau?: any;
  onSave?: (data: any) => void;
  isEditMode?: boolean;
}

const NopPhiPopup: React.FC<NopPhiPopupProps> = ({ 
  isOpen, 
  onClose, 
  selectedFee, 
  selectedHoKhau, 
  onSave,
  isEditMode = false
}) => {
  const today = new Date().toISOString().slice(0, 10);
  // Format ngày để hiển thị
  const formatDate = (date: string): string => {
    const parts = date.split('-');
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  // Format ngày từ dd/mm/yyyy sang yyyy-mm-dd
  const parseDate = (date: string): string => {
    if (!date) return '';
    const parts = date.split('/');
    if (parts.length !== 3) return '';
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const [khoanThuId, setKhoanThuId] = useState('');
  const [hoKhauId, setHoKhauId] = useState('');
  const [nguoiNop, setNguoiNop] = useState('');
  const [soTien, setSoTien] = useState('');
  const [ngayNop, setNgayNop] = useState(today);
  const [currentHoKhau, setCurrentHoKhau] = useState<any>(null);
  const [trangThai, setTrangThai] = useState('Đã nộp');
  const [errors, setErrors] = useState<{ khoanThuId?: string; hoKhauId?: string; nguoiNop?: string; soTien?: string; ngayNop?: string }>({});
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [showConfirmSave, setShowConfirmSave] = useState(false);
  const [pendingAction, setPendingAction] = useState<'close' | 'save' | null>(null);

  // Cập nhật dữ liệu khi có khoản thu hoặc hộ khẩu được chọn trước
  useEffect(() => {
    // Reset form trước khi cập nhật
    setKhoanThuId('');
    setHoKhauId('');
    setNguoiNop('');
    setSoTien('');
    setNgayNop(today);
    setCurrentHoKhau(null);
    setTrangThai('Đã nộp');

    if (selectedFee) {
      setKhoanThuId(selectedFee.id);
      
      // Cập nhật số tiền nếu khoản thu được chọn
      const selectedKhoanThu = sampleKhoanThu.find(item => item.id === selectedFee.id);
      if (selectedKhoanThu) {
        setSoTien(selectedKhoanThu.soTien);
      }
    }
    
    if (selectedHoKhau) {
      setHoKhauId(selectedHoKhau.maHo);
      
      // Tìm và cập nhật thông tin hộ khẩu
      const hoKhau = sampleHoKhau.find(item => item.maHo === selectedHoKhau.maHo);
      if (hoKhau) {
        setCurrentHoKhau(hoKhau);
        
        // Nếu đang ở chế độ chỉnh sửa và hộ đã nộp phí
        if (isEditMode && selectedHoKhau.trangThai === 'Đã nộp') {
          setTrangThai('Đã nộp');
          // Lấy thông tin người nộp
          const thanhVien = hoKhau.thanhVien.find((item: any) => item.ten === selectedHoKhau.nguoiNop);
          if (thanhVien) {
            setNguoiNop(thanhVien.id);
          } else {
            // Mặc định chọn chủ hộ nếu không tìm thấy
            setNguoiNop(hoKhau.thanhVien[0].id);
          }
          // Cập nhật số tiền và ngày nộp
          setSoTien(selectedHoKhau.soTien || '');
          setNgayNop(parseDate(selectedHoKhau.ngayNop) || today);
        } else {
          // Mặc định chọn chủ hộ làm người nộp
          setNguoiNop(hoKhau.thanhVien[0].id);
        }
      }
    }
  }, [selectedFee, selectedHoKhau, isOpen, today, isEditMode]);

  // Cập nhật thông tin hộ khẩu khi hộ khẩu ID thay đổi
  useEffect(() => {
    if (hoKhauId) {
      const hoKhau = sampleHoKhau.find(item => item.maHo === hoKhauId);
      if (hoKhau) {
        setCurrentHoKhau(hoKhau);
        // Mặc định chọn chủ hộ làm người nộp
        setNguoiNop(hoKhau.thanhVien[0].id);
      }
    } else {
      setCurrentHoKhau(null);
      setNguoiNop('');
    }
  }, [hoKhauId]);

  // Format currency input
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

  if (!isOpen) return null;

  // Kiểm tra form có thay đổi không
  const isDirty = khoanThuId || hoKhauId || nguoiNop || soTien || (ngayNop !== today) || (isEditMode && trangThai !== selectedHoKhau?.trangThai);

  // Xác thực form
  const validate = () => {
    const newErrors: typeof errors = {};
    if (!khoanThuId) newErrors.khoanThuId = 'Vui lòng chọn khoản thu';
    if (!hoKhauId) newErrors.hoKhauId = 'Vui lòng chọn hộ khẩu';
    
    // Nếu trạng thái là Đã nộp, kiểm tra các thông tin khác
    if (trangThai === 'Đã nộp') {
      if (!nguoiNop) newErrors.nguoiNop = 'Vui lòng chọn người nộp';
      if (!soTien) newErrors.soTien = 'Vui lòng nhập số tiền';
      if (!ngayNop) newErrors.ngayNop = 'Vui lòng chọn ngày nộp';
    }
    
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
    setKhoanThuId('');
    setHoKhauId('');
    setNguoiNop('');
    setSoTien('');
    setNgayNop(today);
    setCurrentHoKhau(null);
    setTrangThai('Đã nộp');
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
      
      // Tìm thông tin người nộp
      const nguoiNopInfo = currentHoKhau?.thanhVien.find((item: any) => item.id === nguoiNop);
      
      onSave({ 
        khoanThuId,
        hoKhauId,
        trangThai,
        nguoiNopId: nguoiNop,
        nguoiNopTen: nguoiNopInfo?.ten || '',
        soTien: formattedSoTien,
        ngayNop: formatDate(ngayNop) // Chuyển đổi định dạng ngày sang dd/mm/yyyy
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

  // Lọc danh sách khoản thu (chỉ hiển thị khoản thu đang thu)
  const filteredKhoanThu = isEditMode && selectedFee
    ? [sampleKhoanThu.find(item => item.id === selectedFee.id)].filter(Boolean as any) as typeof sampleKhoanThu
    : sampleKhoanThu.filter(item => item.trangThai === 'Đang thu');

  // Lọc danh sách hộ khẩu để chỉ hiển thị các hộ chưa nộp với khoản phí đã chọn
  const filteredHoKhau = () => {
    // Nếu chưa chọn khoản thu, hiển thị tất cả các hộ khẩu
    if (!khoanThuId && !selectedFee) {
      return sampleHoKhau;
    }

    // ID của khoản thu đã chọn (từ tham số hoặc từ trạng thái)
    const currentFeeId = selectedFee ? selectedFee.id : khoanThuId;
    
    // Nếu đang ở chế độ chỉnh sửa và đã chọn hộ khẩu, luôn hiển thị hộ đó
    if (isEditMode && selectedHoKhau) {
      const foundHoKhau = sampleHoKhau.find(item => item.maHo === selectedHoKhau.maHo);
      return foundHoKhau ? [foundHoKhau] : [];
    }
    
    // Tìm khoản thu được chọn
    const currentFee = selectedFee || 
      (khoanThuId ? { id: khoanThuId, hoKhauList: [] } : null);
    
    if (!currentFee) return [];
    
    // Lọc các hộ khẩu chưa nộp
    return sampleHoKhau.filter(hoKhau => {
      // Nếu khoản phí không có danh sách hộ khẩu, hiển thị tất cả
      if (!currentFee.hoKhauList) return true;
      
      // Tìm hộ khẩu trong danh sách của khoản phí
      const hoKhauInList = currentFee.hoKhauList?.find((item: any) => item.maHo === hoKhau.maHo);
      
      // Nếu hộ khẩu không có trong danh sách hoặc chưa nộp, hiển thị
      return !hoKhauInList || hoKhauInList.trangThai === 'Chưa nộp';
    });
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
          <h3 className="text-2xl font-bold text-center mb-6">
            {isEditMode 
              ? `Chỉnh sửa thông tin nộp phí - ${selectedHoKhau?.maHo || ''}` 
              : 'Nhập thông tin nộp phí'}
          </h3>
          
          {/* Form */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Khoản thu <span className="text-red-500">*</span></label>
            <select
              className={`mt-1 block w-full px-3 py-2 border ${errors.khoanThuId ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              value={khoanThuId}
              onChange={e => {
                setKhoanThuId(e.target.value);
                // Cập nhật số tiền khi chọn khoản thu
                const selectedKhoanThu = sampleKhoanThu.find(item => item.id === e.target.value);
                if (selectedKhoanThu) {
                  setSoTien(selectedKhoanThu.soTien);
                }
                // Reset hộ khẩu đã chọn
                setHoKhauId('');
                setCurrentHoKhau(null);
              }}
              disabled={!!selectedFee} // Disable nếu đã chọn sẵn khoản thu
            >
              <option value="">-- Chọn khoản thu --</option>
              {filteredKhoanThu.map(item => (
                <option key={item.id} value={item.id}>{item.tenKhoan} - {item.soTien}</option>
              ))}
            </select>
            {errors.khoanThuId && <p className="text-xs text-red-500 mt-1">{errors.khoanThuId}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Hộ khẩu <span className="text-red-500">*</span></label>
            <select
              className={`mt-1 block w-full px-3 py-2 border ${errors.hoKhauId ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              value={hoKhauId}
              onChange={e => setHoKhauId(e.target.value)}
              disabled={!!selectedHoKhau} // Disable nếu đã chọn sẵn hộ khẩu
            >
              <option value="">-- Chọn hộ khẩu --</option>
              {filteredHoKhau().map(item => (
                <option key={item.maHo} value={item.maHo}>{item.maHo} - {item.chuHo}</option>
              ))}
            </select>
            {errors.hoKhauId && <p className="text-xs text-red-500 mt-1">{errors.hoKhauId}</p>}
          </div>

          {isEditMode && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái <span className="text-red-500">*</span></label>
              <select
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={trangThai}
                onChange={e => setTrangThai(e.target.value)}
              >
                <option value="Đã nộp">Đã nộp</option>
                <option value="Chưa nộp">Chưa nộp</option>
              </select>
            </div>
          )}
          
          {/* Các trường thông tin khi đã nộp */}
          {(trangThai === 'Đã nộp' || !isEditMode) && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Người nộp <span className="text-red-500">*</span></label>
                <select
                  className={`mt-1 block w-full px-3 py-2 border ${errors.nguoiNop ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  value={nguoiNop}
                  onChange={e => setNguoiNop(e.target.value)}
                  disabled={!currentHoKhau}
                >
                  <option value="">-- Chọn người nộp --</option>
                  {currentHoKhau?.thanhVien.map((item: any) => (
                    <option key={item.id} value={item.id}>{item.ten} ({item.quanHe})</option>
                  ))}
                </select>
                {errors.nguoiNop && <p className="text-xs text-red-500 mt-1">{errors.nguoiNop}</p>}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày nộp <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  className={`mt-1 block w-full px-3 py-2 border ${errors.ngayNop ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  value={ngayNop}
                  onChange={e => setNgayNop(e.target.value)}
                  max={today} // Không cho chọn ngày trong tương lai
                />
                {errors.ngayNop && <p className="text-xs text-red-500 mt-1">{errors.ngayNop}</p>}
              </div>
            </>
          )}
          
          {/* Buttons */}
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
              {showConfirmSave && isEditMode && 'Bạn xác nhận lưu thay đổi thông tin nộp phí này?'}
              {showConfirmSave && !isEditMode && 'Bạn xác nhận lưu thông tin nộp phí này?'}
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

export default NopPhiPopup; 