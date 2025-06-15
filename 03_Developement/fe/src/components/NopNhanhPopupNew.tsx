import React, { useState, useEffect } from 'react';

// Interface definitions
interface DotThu {
  id: number;
  tenDotThu: string;
  ngayTao: string;
  thoiHan: string;
}

interface HoKhau {
  id: number;
  soHoKhau: number;
  chuHo: string;
  diaChi: string;
}

interface KhoanThuInfo {
  id: number;
  tenKhoanThu: string;
  soTien: number;
  soTienDaNop: number;
  trangThai: string;
  ghiChu?: string;
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
  const [selectedDotThu, setSelectedDotThu] = useState<number | null>(null);
  const [selectedHoKhau, setSelectedHoKhau] = useState<number | null>(null);
  const [khoanThuInfo, setKhoanThuInfo] = useState<KhoanThuInfo[]>([]);
  const [selectedPayments, setSelectedPayments] = useState<{[key: number]: number}>({});
  const [ghiChu, setGhiChu] = useState('');

  // Load initial data when popup opens
  useEffect(() => {
    if (isOpen) {
      loadDotThuList();
      loadHoKhauList();
      setSelectedDotThu(null);
      setSelectedHoKhau(null);
      setKhoanThuInfo([]);
      setSelectedPayments({});
      setGhiChu('');
      setError(null);
    }
  }, [isOpen]);

  // Load household fees when both dot thu and ho khau are selected
  useEffect(() => {
    if (selectedDotThu && selectedHoKhau) {
      loadKhoanThuInfo(selectedDotThu, selectedHoKhau);
    }
  }, [selectedDotThu, selectedHoKhau]);

  // Load danh sách đợt thu
  const loadDotThuList = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/dotThu?page=0&size=20&sortBy=createdAt&sortDir=desc', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (data.success && data.dotThus) {
        setDotThuList(data.dotThus);
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
      const response = await fetch('http://localhost:8000/api/households?page=0&size=100', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (data.success && data.data?.households) {
        const formattedHoKhau = data.data.households.map((ho: any) => ({
          id: ho.id,
          soHoKhau: ho.soHoKhau,
          chuHo: ho.chuHoInfo?.hoTen || 'Không xác định',
          diaChi: `${ho.soNha || ''} ${ho.duong || ''}, ${ho.phuong || ''}`.trim()
        }));
        setHoKhauList(formattedHoKhau);
      }
    } catch (err) {
      console.error('Error loading household list:', err);
      setError('Không thể tải danh sách hộ khẩu');
    }
  };

  // Load thông tin khoản thu của hộ khẩu trong đợt thu
  const loadKhoanThuInfo = async (dotThuId: number, hoKhauId: number) => {
    try {
      setLoading(true);
      
      // Lấy tất cả khoản thu của hộ khẩu trong đợt thu này
      const response = await fetch(`http://localhost:8000/api/household-fees/ho-khau/${hoKhauId}/dot-thu/${dotThuId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success && data.data) {
        const fees = data.data.map((fee: any) => ({
          id: fee.id,
          tenKhoanThu: fee.khoanThu?.tenkhoanthu || 'Không xác định',
          soTien: parseFloat(fee.soTien || '0'),
          soTienDaNop: parseFloat(fee.soTienDaNop || '0'),
          trangThai: fee.trangThai,
          ghiChu: fee.ghiChu || ''
        }));
        
        setKhoanThuInfo(fees);
        
        // Auto-select unpaid amounts for convenience
        const autoPayments: {[key: number]: number} = {};
        fees.forEach((fee: KhoanThuInfo) => {
          if (fee.soTien > fee.soTienDaNop) {
            autoPayments[fee.id] = fee.soTien - fee.soTienDaNop;
          }
        });
        setSelectedPayments(autoPayments);
      } else {
        setKhoanThuInfo([]);
        setSelectedPayments({});
      }
    } catch (err) {
      console.error('Error loading khoan thu info:', err);
      setError('Không thể tải thông tin khoản thu');
      setKhoanThuInfo([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle payment amount change
  const handlePaymentChange = (khoanThuId: number, amount: string) => {
    const numAmount = parseFloat(amount) || 0;
    setSelectedPayments(prev => ({
      ...prev,
      [khoanThuId]: numAmount
    }));
  };

  // Handle submit payment
  const handleSubmit = async () => {
    try {
      if (!selectedDotThu || !selectedHoKhau) {
        setError('Vui lòng chọn đợt thu và hộ khẩu');
        return;
      }

      const paymentsToProcess = Object.entries(selectedPayments)
        .filter(([_, amount]) => amount > 0)
        .map(([khoanThuId, amount]) => ({ 
          householdFeeId: parseInt(khoanThuId), 
          amount: amount 
        }));

      if (paymentsToProcess.length === 0) {
        setError('Vui lòng nhập số tiền thanh toán');
        return;
      }

      setLoading(true);

      // Process each payment
      for (const payment of paymentsToProcess) {
        const response = await fetch(`http://localhost:8000/api/household-fees/${payment.householdFeeId}/payment`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            soTienThanhToan: payment.amount,
            ghiChu: ghiChu || 'Thanh toán nhanh'
          })
        });

        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message || 'Có lỗi xảy ra khi thanh toán');
        }
      }

      // Success notification
      const totalAmount = paymentsToProcess.reduce((sum, p) => sum + p.amount, 0);
      alert(`Thanh toán thành công!\nTổng số tiền: ${formatCurrency(totalAmount)}`);
      
      // Call onSave callback if provided
      if (onSave) {
        onSave({
          dotThuId: selectedDotThu,
          hoKhauId: selectedHoKhau,
          payments: paymentsToProcess,
          totalAmount,
          ghiChu
        });
      }

      handleClose();
    } catch (err: any) {
      console.error('Error processing payment:', err);
      setError(err.message || 'Có lỗi xảy ra khi xử lý thanh toán');
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Handle close
  const handleClose = () => {
    setSelectedDotThu(null);
    setSelectedHoKhau(null);
    setKhoanThuInfo([]);
    setSelectedPayments({});
    setGhiChu('');
    setError(null);
    onClose();
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
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
        <div className="p-6 max-h-[calc(90vh-180px)] overflow-y-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
              {error}
              <button 
                onClick={() => setError(null)}
                className="float-right text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          )}

          <div className="space-y-6">
            {/* Chọn đợt thu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn đợt thu phí
              </label>
              <select
                value={selectedDotThu || ''}
                onChange={(e) => setSelectedDotThu(parseInt(e.target.value) || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Chọn đợt thu --</option>
                {dotThuList.map((dotThu) => (
                  <option key={dotThu.id} value={dotThu.id}>
                    {dotThu.tenDotThu} ({formatDate(dotThu.ngayTao)} - {formatDate(dotThu.thoiHan)})
                  </option>
                ))}
              </select>
            </div>

            {/* Chọn hộ khẩu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn hộ khẩu
              </label>
              <select
                value={selectedHoKhau || ''}
                onChange={(e) => setSelectedHoKhau(parseInt(e.target.value) || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!selectedDotThu}
              >
                <option value="">-- Chọn hộ khẩu --</option>
                {hoKhauList.map((hoKhau) => (
                  <option key={hoKhau.id} value={hoKhau.id}>
                    HK{hoKhau.soHoKhau.toString().padStart(3, '0')} - {hoKhau.chuHo}
                  </option>
                ))}
              </select>
            </div>

            {/* Danh sách khoản thu */}
            {khoanThuInfo.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Danh sách khoản thu</h3>
                <div className="space-y-3">
                  {khoanThuInfo.map((khoan) => (
                    <div key={khoan.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-800">{khoan.tenKhoanThu}</h4>
                          <div className="text-sm text-gray-600 mt-1">
                            <p>Tổng tiền: <span className="font-medium">{formatCurrency(khoan.soTien)}</span></p>
                            <p>Đã nộp: <span className="font-medium text-green-600">{formatCurrency(khoan.soTienDaNop)}</span></p>
                            <p>Còn lại: <span className="font-medium text-red-600">{formatCurrency(khoan.soTien - khoan.soTienDaNop)}</span></p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            khoan.trangThai === 'da_nop_du' 
                              ? 'bg-green-100 text-green-600'
                              : khoan.trangThai === 'nop_mot_phan'
                              ? 'bg-yellow-100 text-yellow-600'
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {khoan.trangThai === 'da_nop_du' ? 'Đã nộp đủ' : 
                             khoan.trangThai === 'nop_mot_phan' ? 'Nộp một phần' : 'Chưa nộp'}
                          </span>
                        </div>
                      </div>

                      {khoan.soTien > khoan.soTienDaNop && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Số tiền thanh toán
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              min="0"
                              max={khoan.soTien - khoan.soTienDaNop}
                              step="1000"
                              value={selectedPayments[khoan.id] || ''}
                              onChange={(e) => handlePaymentChange(khoan.id, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Nhập số tiền"
                            />
                            <button
                              type="button"
                              onClick={() => handlePaymentChange(khoan.id, (khoan.soTien - khoan.soTienDaNop).toString())}
                              className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                            >
                              Toàn bộ
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Ghi chú */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ghi chú
                  </label>
                  <textarea
                    value={ghiChu}
                    onChange={(e) => setGhiChu(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ghi chú về thanh toán (tùy chọn)"
                  />
                </div>

                {/* Tổng tiền */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800">Tổng tiền thanh toán:</span>
                    <span className="text-xl font-bold text-blue-600">
                      {formatCurrency(Object.values(selectedPayments).reduce((sum, amount) => sum + amount, 0))}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-600">Đang xử lý...</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={loading}
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !selectedDotThu || !selectedHoKhau || khoanThuInfo.length === 0 || Object.values(selectedPayments).every(amount => amount === 0)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NopNhanhPopup;
