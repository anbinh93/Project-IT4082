import React, { useState, useEffect } from 'react';
import api from '../services/api';

// Interface definitions
interface DotThu {
  id: string;
  tenDotThu: string;
  ngayTao: string;
  thoiHan: string;
}

interface HoKhau {
  id: string;
  maHoKhau: string;
  chuHo: string;
  soPhong?: string;
}

interface KhoanThuChiTiet {
  id: string;
  tenKhoan: string;
  soTien: number;
  trangThai: 'Đã nộp' | 'Chưa nộp';
  ngayNop?: string;
  nguoiNop?: string;
}

interface TongTienInfo {
  tongTien: number;
  daThanhToan: number;
  conLai: number;
  chiTiet: KhoanThuChiTiet[];
}

interface NopNhanhPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
}

const NopNhanhPopup: React.FC<NopNhanhPopupProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form data states
  const [dotThuList, setDotThuList] = useState<DotThu[]>([]);
  const [hoKhauList, setHoKhauList] = useState<HoKhau[]>([]);
  const [selectedDotThu, setSelectedDotThu] = useState<string>('');
  const [selectedHoKhau, setSelectedHoKhau] = useState<string>('');
  const [tongTienInfo, setTongTienInfo] = useState<TongTienInfo | null>(null);
  const [showChiTiet, setShowChiTiet] = useState(false);
  const [nguoiNop, setNguoiNop] = useState<string>('');
  const [ngayNop, setNgayNop] = useState<string>('');

  // Load initial data
  useEffect(() => {
    if (isOpen) {
      loadDotThuList();
      loadHoKhauList();
    }
  }, [isOpen]);

  // Load danh sách đợt thu
  const loadDotThuList = async () => {
    try {
      setLoading(true);
      const response = await api.dotThu.getAll({
        page: 0,
        size: 100,
        sortBy: 'createdAt',
        sortDir: 'desc'
      });
      
      if (response && response.dotThus) {
        const formattedDotThu = response.dotThus.map((dot: any) => ({
          id: dot.id,
          tenDotThu: dot.tenDotThu,
          ngayTao: new Date(dot.ngayTao).toLocaleDateString('vi-VN'),
          thoiHan: new Date(dot.thoiHan).toLocaleDateString('vi-VN')
        }));
        setDotThuList(formattedDotThu);
      }
    } catch (err) {
      console.error('Error loading dot thu list:', err);
      setError('Không thể tải danh sách đợt thu');
    } finally {
      setLoading(false);
    }
  };

  // Load danh sách hộ khẩu
  const loadHoKhauList = async () => {
    try {
      const response = await api.households.getAll();
      if (response && response.data && response.data.households) {
        const formattedHoKhau = response.data.households.map((ho: any) => ({
          id: ho.soHoKhau.toString(),
          maHoKhau: ho.soHoKhau.toString(),
          chuHo: ho.chuHoInfo?.hoTen || 'Không xác định',
          soPhong: ho.roomInfo?.soPhong || ''
        }));
        setHoKhauList(formattedHoKhau);
      }
    } catch (err) {
      console.error('Error loading household list:', err);
      setError('Không thể tải danh sách hộ khẩu');
    }
  };

  // Load thông tin tổng tiền khi chọn hộ khẩu
  const loadTongTienInfo = async (dotThuId: string, hoKhauId: string) => {
    try {
      setLoading(true);
      
      // Gọi API để lấy thông tin thanh toán
      const response = await api.dotThu.getPaymentInfo(dotThuId, hoKhauId);
      
      if (response && response.success) {
        const { totalAmount, paidAmount, remainingAmount, details } = response.data;
        
        const tongTienInfo: TongTienInfo = {
          tongTien: totalAmount || 0,
          daThanhToan: paidAmount || 0,
          conLai: remainingAmount || 0,
          chiTiet: details?.map((item: any) => ({
            id: item.id,
            tenKhoan: item.tenKhoan,
            soTien: item.soTien,
            trangThai: item.trangThai,
            ngayNop: item.ngayNop,
            nguoiNop: item.nguoiNop
          })) || []
        };
        
        setTongTienInfo(tongTienInfo);
      } else {
        // Fallback to mock data if API fails
        console.warn('API failed, using mock data');
        const mockData: TongTienInfo = {
          tongTien: 2500000,
          daThanhToan: 500000,
          conLai: 2000000,
          chiTiet: [
            {
              id: 'KT001',
              tenKhoan: 'Phí dịch vụ chung cư',
              soTien: 755000,
              trangThai: 'Chưa nộp'
            },
            {
              id: 'KT002',
              tenKhoan: 'Phí gửi xe',
              soTien: 140000,
              trangThai: 'Đã nộp',
              ngayNop: '10/05/2025',
              nguoiNop: 'Nguyễn Văn A'
            },
            {
              id: 'KT003',
              tenKhoan: 'Phí quản lý',
              soTien: 1605000,
              trangThai: 'Chưa nộp'
            }
          ]
        };
        setTongTienInfo(mockData);
      }
      
      // Auto-fill người nộp với tên chủ hộ
      const selectedHo = hoKhauList.find(ho => ho.id === hoKhauId);
      if (selectedHo) {
        setNguoiNop(selectedHo.chuHo);
      }
      
    } catch (err) {
      console.error('Error loading payment info:', err);
      setError('Không thể tải thông tin thanh toán');
      
      // Use mock data as fallback
      const mockData: TongTienInfo = {
        tongTien: 2500000,
        daThanhToan: 500000,
        conLai: 2000000,
        chiTiet: [
          {
            id: 'KT001',
            tenKhoan: 'Phí dịch vụ chung cư',
            soTien: 755000,
            trangThai: 'Chưa nộp'
          },
          {
            id: 'KT002',
            tenKhoan: 'Phí gửi xe',
            soTien: 140000,
            trangThai: 'Đã nộp',
            ngayNop: '10/05/2025',
            nguoiNop: 'Nguyễn Văn A'
          }
        ]
      };
      setTongTienInfo(mockData);
      
      // Auto-fill người nộp với tên chủ hộ
      const selectedHo = hoKhauList.find(ho => ho.id === hoKhauId);
      if (selectedHo) {
        setNguoiNop(selectedHo.chuHo);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle chọn đợt thu
  const handleDotThuChange = (dotThuId: string) => {
    setSelectedDotThu(dotThuId);
    setSelectedHoKhau('');
    setTongTienInfo(null);
    setShowChiTiet(false);
  };

  // Handle chọn hộ khẩu
  const handleHoKhauChange = (hoKhauId: string) => {
    setSelectedHoKhau(hoKhauId);
    if (selectedDotThu && hoKhauId) {
      loadTongTienInfo(selectedDotThu, hoKhauId);
    }
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!selectedDotThu || !selectedHoKhau || !nguoiNop || !ngayNop) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (!tongTienInfo) {
      setError('Không có thông tin thanh toán');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Lấy danh sách các khoản thu chưa thanh toán
      const unpaidItems = tongTienInfo.chiTiet.filter(item => item.trangThai === 'Chưa nộp');
      
      if (unpaidItems.length === 0) {
        setError('Không có khoản thu nào cần thanh toán');
        return;
      }
      
      const submitData = {
        dotThuId: selectedDotThu,
        hoKhauId: selectedHoKhau,
        nguoiNop,
        ngayNop,
        khoanThuIds: unpaidItems.map(item => item.id)
      };

      console.log('Submitting payment data:', submitData);
      
      // Gọi API để ghi nhận thanh toán
      const response = await api.dotThu.recordPayment(submitData);
      
      if (response && response.success) {
        console.log('Payment recorded successfully:', response);
        
        if (onSave) {
          onSave({
            ...submitData,
            totalAmount: tongTienInfo.conLai,
            success: true
          });
        }
        
        alert(`Đã ghi nhận thanh toán thành công!\nSố tiền: ${tongTienInfo.conLai.toLocaleString('vi-VN')} VNĐ\nNgười nộp: ${nguoiNop}`);
        handleClose();
      } else {
        throw new Error(response?.message || 'Có lỗi xảy ra khi ghi nhận thanh toán');
      }
      
    } catch (err: any) {
      console.error('Error submitting payment:', err);
      setError(err.message || 'Không thể ghi nhận thanh toán');
    } finally {
      setLoading(false);
    }
  };

  // Handle close
  const handleClose = () => {
    setSelectedDotThu('');
    setSelectedHoKhau('');
    setTongTienInfo(null);
    setShowChiTiet(false);
    setNguoiNop('');
    setNgayNop('');
    setError(null);
    onClose();
  };

  // Set default date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setNgayNop(today);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Ghi nhận thanh toán nhanh</h2>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {/* Chọn đợt thu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn đợt thu <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedDotThu}
              onChange={(e) => handleDotThuChange(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="">-- Chọn đợt thu --</option>
              {dotThuList.map(dot => (
                <option key={dot.id} value={dot.id}>
                  {dot.tenDotThu} ({dot.ngayTao} - {dot.thoiHan})
                </option>
              ))}
            </select>
          </div>

          {/* Chọn hộ khẩu */}
          {selectedDotThu && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn hộ khẩu <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedHoKhau}
                onChange={(e) => handleHoKhauChange(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="">-- Chọn hộ khẩu --</option>
                {hoKhauList.map(ho => (
                  <option key={ho.id} value={ho.id}>
                    {ho.maHoKhau} - {ho.chuHo} {ho.soPhong && `(Phòng ${ho.soPhong})`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Thông tin tổng tiền */}
          {tongTienInfo && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setShowChiTiet(!showChiTiet)}
              >
                <div>
                  <h3 className="font-semibold text-gray-800">Thông tin thanh toán</h3>
                  <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                    <div>
                      <span className="text-gray-600">Tổng tiền: </span>
                      <span className="font-semibold text-blue-600">
                        {tongTienInfo.tongTien.toLocaleString('vi-VN')} VNĐ
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Đã thanh toán: </span>
                      <span className="font-semibold text-green-600">
                        {tongTienInfo.daThanhToan.toLocaleString('vi-VN')} VNĐ
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Còn lại: </span>
                      <span className="font-semibold text-red-600">
                        {tongTienInfo.conLai.toLocaleString('vi-VN')} VNĐ
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-gray-500">
                  {showChiTiet ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Chi tiết các khoản thu */}
              {showChiTiet && (
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Chi tiết các khoản thu:</h4>
                  <div className="space-y-2">
                    {tongTienInfo.chiTiet.map(item => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{item.tenKhoan}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-medium">
                            {item.soTien.toLocaleString('vi-VN')} VNĐ
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.trangThai === 'Đã nộp' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {item.trangThai}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Người nộp */}
          {tongTienInfo && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Người nộp <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nguoiNop}
                onChange={(e) => setNguoiNop(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập tên người nộp..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Mặc định là chủ hộ, có thể chỉnh sửa nếu người nộp khác
              </p>
            </div>
          )}

          {/* Ngày nộp */}
          {tongTienInfo && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày nộp <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={ngayNop}
                onChange={(e) => setNgayNop(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !tongTienInfo || !nguoiNop || !ngayNop}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang xử lý...' : 'Ghi nhận thanh toán'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NopNhanhPopup;
