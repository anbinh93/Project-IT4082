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

interface HouseholdFeeInfo {
  hoKhauId: number;
  hoKhau: HoKhau;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  feeDetails: {
    id: number;
    tenKhoanThu: string;
    soTien: number;
    soTienDaNop: number;
    remaining: number;
  }[];
}

interface NopNhanhMultiplePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
}

const NopNhanhMultiplePopup: React.FC<NopNhanhMultiplePopupProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form data states
  const [dotThuList, setDotThuList] = useState<DotThu[]>([]);
  const [selectedDotThu, setSelectedDotThu] = useState<number | null>(null);
  const [householdsWithFees, setHouseholdsWithFees] = useState<HouseholdFeeInfo[]>([]);
  const [selectedHouseholds, setSelectedHouseholds] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [ghiChu, setGhiChu] = useState('');

  // Load initial data when popup opens
  useEffect(() => {
    if (isOpen) {
      loadDotThuList();
      setSelectedDotThu(null);
      setHouseholdsWithFees([]);
      setSelectedHouseholds(new Set());
      setSearchTerm('');
      setGhiChu('');
      setError(null);
    }
  }, [isOpen]);

  // Load household fees when dot thu is selected
  useEffect(() => {
    if (selectedDotThu) {
      loadAllHouseholdFees(selectedDotThu);
    }
  }, [selectedDotThu]);

  // Load danh sách đợt thu
  const loadDotThuList = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/dot-thu?page=0&size=20&sortBy=createdAt&sortDir=desc', {
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

  // Load tất cả household fees cho đợt thu
  const loadAllHouseholdFees = async (dotThuId: number) => {
    try {
      setLoading(true);
      
      // First get all households
      const householdsResponse = await fetch('http://localhost:8000/api/households', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const householdsData = await householdsResponse.json();
      if (!householdsData.success || !householdsData.data?.households) {
        throw new Error('Không thể lấy danh sách hộ khẩu');
      }

      const households = householdsData.data.households;
      const householdFeesInfo: HouseholdFeeInfo[] = [];

      // Get fees for each household
      for (const household of households) {
        try {
          const feesResponse = await fetch(`http://localhost:8000/api/household-fees/ho-khau/${household.soHoKhau}/dot-thu/${dotThuId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
              'Content-Type': 'application/json'
            }
          });
          
          const feesData = await feesResponse.json();
          if (feesData.success && feesData.data?.length > 0) {
            const fees = feesData.data;
            
            let totalAmount = 0;
            let paidAmount = 0;
            const feeDetails = fees.map((fee: any) => {
              const soTien = parseFloat(fee.soTien || '0');
              const soTienDaNop = parseFloat(fee.soTienDaNop || '0');
              totalAmount += soTien;
              paidAmount += soTienDaNop;
              
              return {
                id: fee.id,
                tenKhoanThu: fee.khoanThu?.tenkhoanthu || 'Không xác định',
                soTien,
                soTienDaNop,
                remaining: soTien - soTienDaNop
              };
            });

            // Only include households with unpaid fees
            const remainingAmount = totalAmount - paidAmount;
            if (remainingAmount > 0) {
              householdFeesInfo.push({
                hoKhauId: household.soHoKhau,
                hoKhau: {
                  id: household.soHoKhau,
                  soHoKhau: household.soHoKhau,
                  chuHo: household.chuHoInfo?.hoTen || 'Không xác định',
                  diaChi: `${household.soNha || ''} ${household.duong || ''}, ${household.phuong || ''}`.trim()
                },
                totalAmount,
                paidAmount,
                remainingAmount,
                feeDetails: feeDetails.filter((fee: any) => fee.remaining > 0)
              });
            }
          }
        } catch (feeError) {
          console.error(`Error loading fees for household ${household.soHoKhau}:`, feeError);
          // Continue to next household
        }
      }

      setHouseholdsWithFees(householdFeesInfo);
    } catch (err: any) {
      console.error('Error loading household fees:', err);
      setError('Không thể tải thông tin khoản thu: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle household selection
  const handleHouseholdToggle = (hoKhauId: number) => {
    const newSelected = new Set(selectedHouseholds);
    if (newSelected.has(hoKhauId)) {
      newSelected.delete(hoKhauId);
    } else {
      newSelected.add(hoKhauId);
    }
    setSelectedHouseholds(newSelected);
  };

  // Select all households
  const handleSelectAll = () => {
    const filteredHouseholds = getFilteredHouseholds();
    if (selectedHouseholds.size === filteredHouseholds.length) {
      setSelectedHouseholds(new Set());
    } else {
      setSelectedHouseholds(new Set(filteredHouseholds.map(h => h.hoKhauId)));
    }
  };

  // Get filtered households based on search
  const getFilteredHouseholds = () => {
    return householdsWithFees.filter(household =>
      household.hoKhau.chuHo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      household.hoKhau.soHoKhau.toString().includes(searchTerm)
    );
  };

  // Handle submit payment
  const handleSubmit = async () => {
    try {
      if (!selectedDotThu || selectedHouseholds.size === 0) {
        setError('Vui lòng chọn đợt thu và ít nhất một hộ khẩu');
        return;
      }

      setLoading(true);
      let totalProcessed = 0;
      let totalAmount = 0;

      for (const hoKhauId of selectedHouseholds) {
        const householdInfo = householdsWithFees.find(h => h.hoKhauId === hoKhauId);
        if (!householdInfo) continue;

        // Process each unpaid fee for this household
        for (const feeDetail of householdInfo.feeDetails) {
          if (feeDetail.remaining > 0) {
            const response = await fetch(`http://localhost:8000/api/household-fees/${feeDetail.id}/payment`, {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                soTienThanhToan: feeDetail.remaining,
                ghiChu: ghiChu || `Thanh toán nhanh cho ${householdInfo.hoKhau.chuHo}`
              })
            });

            const data = await response.json();
            if (data.success) {
              totalAmount += feeDetail.remaining;
              totalProcessed++;
            } else {
              console.error(`Failed to pay fee ${feeDetail.id}:`, data.message);
            }
          }
        }
      }

      // Success notification with toast
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
      toast.innerHTML = `
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
          <div>
            <div class="font-medium">Thanh toán thành công!</div>
            <div class="text-sm">Đã thanh toán cho ${selectedHouseholds.size} hộ khẩu</div>
            <div class="text-sm">Tổng số tiền: ${formatCurrency(totalAmount)}</div>
          </div>
        </div>
      `;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => document.body.removeChild(toast), 300);
      }, 5000);
      
      // Call onSave callback if provided
      if (onSave) {
        onSave({
          dotThuId: selectedDotThu,
          householdIds: Array.from(selectedHouseholds),
          totalHouseholds: selectedHouseholds.size,
          totalAmount,
          totalProcessed,
          ghiChu
        });
      }

      handleClose();
    } catch (err: any) {
      console.error('Error processing payments:', err);
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

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Handle close
  const handleClose = () => {
    setSelectedDotThu(null);
    setHouseholdsWithFees([]);
    setSelectedHouseholds(new Set());
    setSearchTerm('');
    setGhiChu('');
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  const filteredHouseholds = getFilteredHouseholds();
  const totalSelectedAmount = Array.from(selectedHouseholds)
    .reduce((sum, hoKhauId) => {
      const household = householdsWithFees.find(h => h.hoKhauId === hoKhauId);
      return sum + (household?.remainingAmount || 0);
    }, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Thanh toán nhanh - Chọn nhiều hộ</h2>
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
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
              <button 
                onClick={() => setError(null)}
                className="float-right text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          )}

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

          {selectedDotThu && (
            <>
              {/* Search and selection summary */}
              <div className="flex justify-between items-center">
                <div className="flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Tìm kiếm hộ khẩu theo tên chủ hộ hoặc số hộ khẩu..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="text-sm text-gray-600">
                  Đã chọn: {selectedHouseholds.size}/{filteredHouseholds.length} hộ
                  {selectedHouseholds.size > 0 && (
                    <span className="ml-2 font-medium text-green-600">
                      ({formatCurrency(totalSelectedAmount)})
                    </span>
                  )}
                </div>
              </div>

              {/* Household list */}
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Đang tải dữ liệu hộ khẩu...</p>
                </div>
              ) : filteredHouseholds.length > 0 ? (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Table header */}
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedHouseholds.size === filteredHouseholds.length && filteredHouseholds.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm font-medium text-gray-700">
                        Chọn tất cả ({filteredHouseholds.length} hộ có khoản phí chưa thanh toán)
                      </label>
                    </div>
                  </div>

                  {/* Household rows */}
                  <div className="max-h-96 overflow-y-auto">
                    {filteredHouseholds.map((household) => (
                      <div 
                        key={household.hoKhauId}
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          selectedHouseholds.has(household.hoKhauId) ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="px-4 py-3">
                          <div className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              checked={selectedHouseholds.has(household.hoKhauId)}
                              onChange={() => handleHouseholdToggle(household.hoKhauId)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900">
                                    HK{household.hoKhau.soHoKhau.toString().padStart(3, '0')} - {household.hoKhau.chuHo}
                                  </h4>
                                  <p className="text-xs text-gray-500">{household.hoKhau.diaChi}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium text-red-600">
                                    {formatCurrency(household.remainingAmount)}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {household.feeDetails.length} khoản chưa nộp
                                  </p>
                                </div>
                              </div>
                              
                              {/* Fee details */}
                              <div className="mt-2 space-y-1">
                                {household.feeDetails.map((fee, index) => (
                                  <div key={fee.id} className="flex justify-between text-xs text-gray-600">
                                    <span>• {fee.tenKhoanThu}</span>
                                    <span>{formatCurrency(fee.remaining)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {householdsWithFees.length === 0 
                    ? "Không có hộ khẩu nào có khoản phí chưa thanh toán trong đợt thu này"
                    : "Không tìm thấy hộ khẩu nào phù hợp với từ khóa tìm kiếm"
                  }
                </div>
              )}

              {/* Ghi chú */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú chung
                </label>
                <textarea
                  value={ghiChu}
                  onChange={(e) => setGhiChu(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ghi chú cho tất cả các thanh toán (tùy chọn)"
                />
              </div>

              {/* Action buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  {selectedHouseholds.size > 0 && (
                    <>
                      Sẽ thanh toán cho <strong>{selectedHouseholds.size}</strong> hộ khẩu
                      <br />
                      Tổng số tiền: <strong className="text-green-600">{formatCurrency(totalSelectedAmount)}</strong>
                    </>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                    disabled={loading}
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={selectedHouseholds.size === 0 || loading}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      selectedHouseholds.size > 0 && !loading
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {loading ? 'Đang xử lý...' : `Thanh toán ${selectedHouseholds.size} hộ`}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NopNhanhMultiplePopup;
