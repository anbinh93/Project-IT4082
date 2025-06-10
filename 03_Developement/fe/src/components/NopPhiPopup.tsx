import React, { useState, useEffect } from 'react';

// Dữ liệu mẫu (Giữ nguyên để hàm filteredHoKhau và filteredKhoanThu vẫn hoạt động)
const sampleKhoanThu = [
  { id: '1', tenKhoan: 'Phí dịch vụ', trangThai: 'Đang thu'}, 
  { id: '2', tenKhoan: 'Phí bảo trì', trangThai: 'Đã thu xong' },
  { id: '3', tenKhoan: 'Phí quản lý', trangThai: 'Đã thu xong' },
  { id: '4', tenKhoan: 'Phí gửi xe', trangThai: 'Đang thu' },
  { id: '5', tenKhoan: 'Bảo hiểm chung cư', trangThai: 'Đang thu' }
];

const sampleHoKhau = [
  { 
    maHo: '1', 
    chuHo: 'Nguyễn Văn A',
  },
  { 
    maHo: '2', 
    chuHo: 'Trần Thị B',
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

  // Format ngày từ dd/mm/yyyy sang YYYY-mm-dd
  const parseDate = (date: string): string => {
    if (!date) return '';
    const parts = date.split('/');
    if (parts.length !== 3) return '';
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const [khoanThuId, setKhoanThuId] = useState('');
  const [hoKhauId, setHoKhauId] = useState('');
  const [nguoiNop, setNguoiNop] = useState(''); // State này giờ sẽ lưu TÊN người nộp
  const [soTien, setSoTien] = useState('');
  const [ngayNop, setNgayNop] = useState(today);
  const [currentHoKhau, setCurrentHoKhau] = useState<any>(null); // Vẫn giữ để hiển thị chuHo
  const [trangThai, setTrangThai] = useState('Đã nộp');
  // Error message cho nguoiNop sẽ vẫn dùng, nhưng kiểm tra input thay vì select
  const [errors, setErrors] = useState<{ khoanThuId?: string; hoKhauId?: string; nguoiNop?: string; soTien?: string; ngayNop?: string }>({});
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [showConfirmSave, setShowConfirmSave] = useState(false);
  const [pendingAction, setPendingAction] = useState<'close' | 'save' | null>(null);

  // Cập nhật dữ liệu khi có khoản thu hoặc hộ khẩu được chọn trước
  useEffect(() => {
    // Reset form trước khi cập nhật
    setKhoanThuId('');
    setHoKhauId('');
    setNguoiNop(''); // Reset người nộp
    setSoTien('');
    setNgayNop(today);
    setCurrentHoKhau(null);
    setTrangThai('Đã nộp');

    if (selectedFee) {
      console.log('Selected Fee:', selectedFee);
      setKhoanThuId(selectedFee.id);
      
      // Cập nhật số tiền nếu khoản thu được chọn (từ sampleKhoanThu)
      // *Lưu ý*: selectedFee.soTien có thể không tồn tại trong selectedFee nếu nó không phải từ sample
      const foundFeeInSample = sampleKhoanThu.find(item => item.id === selectedFee.id);
      if (foundFeeInSample) {
        setSoTien(new Intl.NumberFormat('vi-VN').format(foundFeeInSample.soTien));
      } else if (selectedFee.hoKhauList && selectedHoKhau) {
         // Nếu selectedFee có hoKhauList (từ API) và selectedHoKhau cũng có
         const hoInSelectedFee = selectedFee.hoKhauList.find((h:any) => h.maHo === selectedHoKhau.maHo);
         if (hoInSelectedFee && hoInSelectedFee.soTien !== undefined) {
           setSoTien(new Intl.NumberFormat('vi-VN').format(hoInSelectedFee.soTien));
         }
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
          // Điền tên người nộp từ selectedHoKhau.nguoiNop (nếu có)
          setNguoiNop(selectedHoKhau.nguoiNop || ''); // Điền thẳng tên
          
          // Cập nhật số tiền và ngày nộp
          setSoTien(selectedHoKhau.soTien ? new Intl.NumberFormat('vi-VN').format(selectedHoKhau.soTien) : '');
          setNgayNop(parseDate(selectedHoKhau.ngayNop) || today);
        } else {
          // Khi tạo mới hoặc chuyển trạng thái, mặc định tên chủ hộ
          setNguoiNop(hoKhau.chuHo); // Mặc định điền tên chủ hộ
        }
      }
    }
    // Logic cập nhật số tiền khi cả selectedFee và selectedHoKhau được truyền vào
    // Đây là trường hợp phổ biến khi bạn click vào một dòng hộ khẩu cụ thể
    if (selectedFee && selectedHoKhau) {
        const ho = selectedFee.hoKhauList?.find((h: any) => h.maHo === selectedHoKhau.maHo);
        if (ho && ho.soTien !== undefined) {
            setSoTien(typeof ho.soTien === 'number' ? new Intl.NumberFormat('vi-VN').format(ho.soTien) : ho.soTien);
        }
    }
  }, [selectedFee, selectedHoKhau, isOpen, today, isEditMode]);

  // Cập nhật thông tin hộ khẩu khi hộ khẩu ID thay đổi
  useEffect(() => {
    if (hoKhauId) {
      const hoKhau = sampleHoKhau.find(item => item.maHo === hoKhauId);
      if (hoKhau) {
        setCurrentHoKhau(hoKhau);
        setNguoiNop(hoKhau.chuHo); // Mặc định điền tên chủ hộ khi chọn hộ khẩu
      }
    } else {
      setCurrentHoKhau(null);
      setNguoiNop(''); // Reset tên người nộp
    }
  }, [hoKhauId]);

  // Format currency input
  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, '');
    if (!numericValue) return '';
    const formattedValue = new Intl.NumberFormat('vi-VN').format(parseInt(numericValue));
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
      // Kiểm tra trường input người nộp
      if (!nguoiNop.trim()) newErrors.nguoiNop = 'Vui lòng nhập tên người nộp';
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
    setNguoiNop(''); // Reset người nộp
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
      // Đảm bảo số tiền được định dạng đúng (chỉ lấy phần số)
      const numericSoTien = parseInt(soTien.replace(/[^\d]/g, '')) || 0;
      
      onSave({ 
        khoanThuId,
        hoKhauId,
        trangThai,
        nguoiNopTen: nguoiNop.trim(), // Lưu trực tiếp giá trị được nhập vào
        soTien: numericSoTien,
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

    const currentFee = selectedFee || 
      (khoanThuId ? { id: khoanThuId, hoKhauList: [] } : null);
    
    if (!currentFee) return [];
    
    // Nếu đang ở chế độ chỉnh sửa và đã chọn hộ khẩu, luôn hiển thị hộ đó
    if (isEditMode && selectedHoKhau) {
      const foundHoKhau = sampleHoKhau.find(item => item.maHo === selectedHoKhau.maHo);
      return foundHoKhau ? [foundHoKhau] : [];
    }

    // Lọc các hộ khẩu chưa nộp
    return sampleHoKhau.filter(hoKhau => {
      // Nếu currentFee không có hoKhauList (ví dụ: selectedFee chưa tải từ API đầy đủ), hiển thị tất cả
      if (!currentFee.hoKhauList) return true;
      
      const hoKhauInList = currentFee.hoKhauList?.find((item: any) => item.maHo === hoKhau.maHo);
      
      // Nếu hộ khẩu không có trong danh sách của khoản phí HOẶC trạng thái là 'Chưa nộp', thì hiển thị
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
                  setSoTien(new Intl.NumberFormat('vi-VN').format(selectedKhoanThu.soTien));
                }
                // Reset hộ khẩu đã chọn
                setHoKhauId('');
                setCurrentHoKhau(null);
              }}
              disabled={!!selectedFee} // Disable nếu đã chọn sẵn khoản thu
            >
              <option value="">-- Chọn khoản thu --</option>
              {filteredKhoanThu.map(item => (
                <option key={item.id} value={item.id}>{item.tenKhoan} - {new Intl.NumberFormat('vi-VN').format(item.soTien)} VND</option>
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
                onChange={e => {
                    setTrangThai(e.target.value);
                    // Nếu chuyển sang "Chưa nộp", xóa các trường liên quan
                    if (e.target.value === 'Chưa nộp') {
                        setNguoiNop('');
                        setSoTien('');
                        setNgayNop(today);
                    } else {
                        // Nếu chuyển sang "Đã nộp", mặc định điền lại các giá trị (nếu có từ selectedHoKhau hoặc mặc định)
                        if (selectedHoKhau) {
                            setSoTien(selectedHoKhau.soTien ? new Intl.NumberFormat('vi-VN').format(selectedHoKhau.soTien) : '');
                            setNgayNop(parseDate(selectedHoKhau.ngayNop) || today);
                            setNguoiNop(selectedHoKhau.nguoiNop || currentHoKhau?.chuHo || '');
                        } else {
                            // Trường hợp tạo mới, mặc định chủ hộ và ngày hiện tại
                            setNguoiNop(currentHoKhau?.chuHo || '');
                            setNgayNop(today);
                            // Lấy lại số tiền từ selectedFee nếu có
                            if (selectedFee) {
                                const ho = selectedFee.hoKhauList?.find((h: any) => h.maHo === hoKhauId);
                                if (ho && ho.soTien !== undefined) {
                                    setSoTien(typeof ho.soTien === 'number' ? new Intl.NumberFormat('vi-VN').format(ho.soTien) : ho.soTien);
                                }
                            }
                        }
                    }
                }}
              >
                <option value="Đã nộp">Đã nộp</option>
                <option value="Chưa nộp">Chưa nộp</option>
              </select>
            </div>
          )}
          
          {/* Các trường thông tin khi đã nộp */}
          {(trangThai === 'Đã nộp' || !isEditMode) && ( // Hiển thị nếu trạng thái là "Đã nộp" HOẶC không phải chế độ chỉnh sửa (tức là tạo mới)
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Người nộp <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className={`mt-1 block w-full px-3 py-2 border ${errors.nguoiNop ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  value={nguoiNop}
                  onChange={e => setNguoiNop(e.target.value)}
                  placeholder="Nhập tên người nộp"
                />
                {errors.nguoiNop && <p className="text-xs text-red-500 mt-1">{errors.nguoiNop}</p>}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền phải nộp <span className="text-red-500">*</span> <span className="ml-2 text-xs text-gray-500">(VND)</span></label>
                <input
                  type="text"
                  className={`mt-1 block w-full px-3 py-2 border ${errors.soTien ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm bg-gray-100 text-gray-700 focus:outline-none sm:text-sm`}
                  value={soTien}
                  readOnly // Vẫn giữ là readOnly
                  tabIndex={-1}
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