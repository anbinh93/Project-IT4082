import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import NopNhanhPopup from '../components/NopNhanhPopup';
import NopNhanhMultiplePopup from '../components/NopNhanhMultiplePopup';
import api from '../services/api';

interface DotThu {
  id: number;
  tenDotThu: string;
  ngayTao: string;
  thoiHan: string;
}

interface KhoanThuDashboard {
  khoanThuId: number;
  tenKhoanThu: string;
  batBuoc: boolean;
  ghiChu?: string;
  thongKe: {
    tongHoKhau: number;
    hoDaNop: number;
    hoNopMotPhan: number;
    hoChuaNop: number;
    tyLeHoanThanh: number;
  };
  taiChinh: {
    tongTienDuKien: number;
    tongTienDaThu: number;
    tyLeThuTien: number;
  };
}

interface DashboardData {
  dotThu: DotThu;
  tongKet: {
    tongHoKhau: number;
    tongTienDuKien: number;
    tongTienDaThu: number;
    tyLeThuTienTongQuat: number;
  };
  khoanThuList: KhoanThuDashboard[];
}

interface HouseholdFee {
  id: number;
  hoKhau: {
    soHoKhau: number;
    chuHo: string;
    diaChi: string;
    soDienThoai: string;
  };
  soTien: string;
  soTienDaNop: string;
  soTienConLai: number;
  trangThai: 'chua_nop' | 'nop_mot_phan' | 'da_nop_du';
  trangThaiText: string;
  ghiChu: string;
  chiTietTinhPhi?: any;
  createdAt: string;
}

const QuanLyKhoanThuNew: React.FC = () => {
  const [dotThuList, setDotThuList] = useState<DotThu[]>([]);
  const [selectedDotThu, setSelectedDotThu] = useState<number | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [selectedKhoanThu, setSelectedKhoanThu] = useState<number | null>(null);
  const [householdFees, setHouseholdFees] = useState<HouseholdFee[]>([]);
  const [selectedHousehold, setSelectedHousehold] = useState<HouseholdFee | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNopNhanhPopup, setShowNopNhanhPopup] = useState(false);
  const [showNopNhanhMultiplePopup, setShowNopNhanhMultiplePopup] = useState(false);
  
  // Notification state để thay thế alert
  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'info';
    message: string;
  }>({ show: false, type: 'info', message: '' });

  // Function to show notification
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 4000); // Auto hide after 4 seconds
  };

  // Load danh sách đợt thu
  useEffect(() => {
    loadDotThuList();
  }, []);

  // Load dashboard khi chọn đợt thu
  useEffect(() => {
    if (selectedDotThu) {
      loadDashboard(selectedDotThu);
    }
  }, [selectedDotThu]);

  // Load household fees khi chọn khoản thu
  useEffect(() => {
    if (selectedDotThu && selectedKhoanThu) {
      loadHouseholdFees(selectedDotThu, selectedKhoanThu);
    }
  }, [selectedDotThu, selectedKhoanThu]);

  const loadDotThuList = async () => {
    try {
      setLoading(true);
      const response = await api.dotThu.getAll({
        page: 0,
        size: 20,
        sortBy: 'createdAt',
        sortDir: 'desc'
      });
      
      if (response.success && response.dotThus) {
        setDotThuList(response.dotThus);
        if (response.dotThus.length > 0) {
          setSelectedDotThu(response.dotThus[0].id);
        }
      }
    } catch (err) {
      console.error('Error loading dot thu list:', err);
      setError('Không thể tải danh sách đợt thu phí');
    } finally {
      setLoading(false);
    }
  };

  const loadDashboard = async (dotThuId: number) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/api/household-fees/dashboard/${dotThuId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setDashboardData(data.data);
        setSelectedKhoanThu(null); // Reset selected khoản thu
        setHouseholdFees([]); // Clear household fees
      } else {
        throw new Error(data.message || 'Không thể tải dashboard');
      }
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError('Không thể tải dashboard khoản thu');
    } finally {
      setLoading(false);
    }
  };

  // Function riêng để reload dashboard mà KHÔNG reset selection
  const reloadDashboardKeepSelection = async (dotThuId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/household-fees/dashboard/${dotThuId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setDashboardData(data.data);
        // KHÔNG reset selectedKhoanThu và householdFees
      } else {
        throw new Error(data.message || 'Không thể tải dashboard');
      }
    } catch (err) {
      console.error('Error reloading dashboard:', err);
      showNotification('error', 'Không thể cập nhật dữ liệu dashboard');
    }
  };

  const loadHouseholdFees = async (dotThuId: number, khoanThuId: number) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/api/household-fees/dot-thu/${dotThuId}/khoan-thu/${khoanThuId}/households`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setHouseholdFees(data.data.households);
      } else {
        throw new Error(data.message || 'Không thể tải danh sách hộ gia đình');
      }
    } catch (err) {
      console.error('Error loading household fees:', err);
      setError('Không thể tải danh sách hộ gia đình');
    } finally {
      setLoading(false);
    }
  };

  const handleKhoanThuClick = (khoanThuId: number) => {
    setSelectedKhoanThu(khoanThuId);
  };

  const handlePaymentUpdate = async (householdFeeId: number, soTienNop: number, ghiChu?: string) => {
    try {
      // Validate số tiền
      if (isNaN(soTienNop) || soTienNop < 0) {
        showNotification('error', 'Số tiền thanh toán không hợp lệ. Vui lòng nhập số tiền >= 0');
        return;
      }

      const response = await fetch(`http://localhost:8000/api/household-fees/${householdFeeId}/payment`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          soTienThanhToan: soTienNop,
          ghiChu
        })
      });
      
      const data = await response.json();
      if (data.success) {
        // Đóng modal trước khi reload
        setSelectedHousehold(null);
        
        // Show success notification
        showNotification('success', `Cập nhật thanh toán thành công! Đã nộp ${formatCurrency(soTienNop)}`);
        
        // Reload data nhưng GIỮ NGUYÊN selection
        if (selectedDotThu) {
          await reloadDashboardKeepSelection(selectedDotThu);
        }
        if (selectedDotThu && selectedKhoanThu) {
          await loadHouseholdFees(selectedDotThu, selectedKhoanThu);
          // Giữ nguyên selectedKhoanThu để user không phải click lại
        }
      } else {
        throw new Error(data.message || 'Không thể cập nhật thanh toán');
      }
    } catch (err) {
      console.error('Error updating payment:', err);
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật thanh toán';
      showNotification('error', errorMessage);
    }
  };

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(numAmount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const getTrangThaiColor = (trangThai: string) => {
    switch (trangThai) {
      case 'da_nop_du':
        return 'text-green-600 bg-green-100';
      case 'nop_mot_phan':
        return 'text-yellow-600 bg-yellow-100';
      case 'chua_nop':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading && !dashboardData) {
    return (
      <Layout role="ketoan">
        <div className="p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout role="ketoan">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Quản lý khoản thu</h1>
              <p className="text-gray-600 mt-1">Theo dõi tình hình thu phí từng khoản</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowNopNhanhPopup(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nộp nhanh (1 hộ)
              </button>
              <button 
                onClick={() => setShowNopNhanhMultiplePopup(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Thanh toán nhiều hộ
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button 
              onClick={() => setError(null)}
              className="float-right text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Notification Toast */}
        {notification.show && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border-l-4 ${
            notification.type === 'success' 
              ? 'bg-green-50 border-green-400 text-green-700' 
              : notification.type === 'error'
              ? 'bg-red-50 border-red-400 text-red-700'
              : 'bg-blue-50 border-blue-400 text-blue-700'
          } transform transition-all duration-300 ${notification.show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {notification.type === 'success' && (
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {notification.type === 'error' && (
                  <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                {notification.type === 'info' && (
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium">{notification.message}</p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <button
                  onClick={() => setNotification(prev => ({ ...prev, show: false }))}
                  className="inline-flex text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dropdown chọn đợt thu */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chọn đợt thu phí:
          </label>
          <select 
            value={selectedDotThu || ''} 
            onChange={(e) => setSelectedDotThu(parseInt(e.target.value))}
            className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Chọn đợt thu --</option>
            {dotThuList.map((dotThu) => (
              <option key={dotThu.id} value={dotThu.id}>
                {dotThu.tenDotThu} ({formatDate(dotThu.ngayTao)} - {formatDate(dotThu.thoiHan)})
              </option>
            ))}
          </select>
        </div>

        {dashboardData && (
          <>
            {/* Thống kê tổng quan */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Tổng quan: {dashboardData.dotThu.tenDotThu}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Tổng hộ khẩu</p>
                  <p className="text-2xl font-bold text-blue-800">{dashboardData.tongKet.tongHoKhau}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Đã thu</p>
                  <p className="text-2xl font-bold text-green-800">{formatCurrency(dashboardData.tongKet.tongTienDaThu)}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-orange-600 font-medium">Dự kiến</p>
                  <p className="text-2xl font-bold text-orange-800">{formatCurrency(dashboardData.tongKet.tongTienDuKien)}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600 font-medium">Tỷ lệ thu</p>
                  <p className="text-2xl font-bold text-purple-800">{dashboardData.tongKet.tyLeThuTienTongQuat}%</p>
                </div>
              </div>
            </div>

            {/* Danh sách khoản thu */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Danh sách khoản thu</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dashboardData.khoanThuList.map((khoanThu) => (
                  <div 
                    key={khoanThu.khoanThuId}
                    onClick={() => handleKhoanThuClick(khoanThu.khoanThuId)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedKhoanThu === khoanThu.khoanThuId 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-800">{khoanThu.tenKhoanThu}</h4>
                      {khoanThu.batBuoc && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Bắt buộc</span>
                      )}
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tỷ lệ hoàn thành:</span>
                        <span className="font-medium">{khoanThu.thongKe.tyLeHoanThanh}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Đã thu:</span>
                        <span className="font-medium text-green-600">{formatCurrency(khoanThu.taiChinh.tongTienDaThu)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dự kiến:</span>
                        <span className="font-medium">{formatCurrency(khoanThu.taiChinh.tongTienDuKien)}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {khoanThu.thongKe.hoDaNop}/{khoanThu.thongKe.tongHoKhau} hộ đã nộp
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chi tiết hộ gia đình */}
            {selectedKhoanThu && householdFees.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Chi tiết hộ gia đình - {dashboardData.khoanThuList.find(k => k.khoanThuId === selectedKhoanThu)?.tenKhoanThu}
                  </h3>
                  <button
                    onClick={() => setSelectedKhoanThu(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hộ khẩu
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Chủ hộ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Số tiền
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Đã nộp
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trạng thái
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {householdFees.map((fee) => (
                        <tr key={fee.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            HK{fee.hoKhau.soHoKhau.toString().padStart(3, '0')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {fee.hoKhau.chuHo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(fee.soTien)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                            {formatCurrency(fee.soTienDaNop)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTrangThaiColor(fee.trangThai)}`}>
                              {fee.trangThaiText}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button 
                              onClick={() => setSelectedHousehold(fee)}
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Cập nhật
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Payment Update Modal */}
        {selectedHousehold && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Cập nhật thanh toán</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-600">Hộ khẩu: <span className="font-medium">HK{selectedHousehold.hoKhau.soHoKhau.toString().padStart(3, '0')}</span></p>
                  <p className="text-sm text-gray-600">Chủ hộ: <span className="font-medium">{selectedHousehold.hoKhau.chuHo}</span></p>
                  <p className="text-sm text-gray-600">Số tiền phải nộp: <span className="font-medium text-blue-600">{formatCurrency(parseFloat(selectedHousehold.soTien))}</span></p>
                  <p className="text-sm text-gray-600">Đã nộp: <span className="font-medium text-green-600">{formatCurrency(parseFloat(selectedHousehold.soTienDaNop))}</span></p>
                  <p className="text-sm text-gray-600">Còn lại: <span className="font-medium text-red-600">{formatCurrency(parseFloat(selectedHousehold.soTien) - parseFloat(selectedHousehold.soTienDaNop))}</span></p>
                  {/* Vehicle fee breakdown */}
                  {selectedHousehold.chiTietTinhPhi && selectedHousehold.chiTietTinhPhi.vehicle && (
                    <div className="mt-3 p-2 bg-blue-50 rounded">
                      <p className="text-xs font-semibold text-blue-700 mb-1">Chi tiết phí phương tiện:</p>
                      {Array.isArray(selectedHousehold.chiTietTinhPhi.vehicle) ? (
                        <ul className="text-xs text-blue-800 list-disc ml-4">
                          {selectedHousehold.chiTietTinhPhi.vehicle.map((v: any, idx: number) => (
                            <li key={idx}>
                              {v.loaiXe ? `${v.loaiXe}: ` : ''}{formatCurrency(v.phiThue)}
                              {v.bienSo ? ` (Biển số: ${v.bienSo})` : ''}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-xs text-blue-800">{formatCurrency(selectedHousehold.chiTietTinhPhi.vehicle)}</span>
                      )}
                    </div>
                  )}
                </div>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const soTienNopInput = formData.get('soTienNop') as string;
                  const soTienNop = parseFloat(soTienNopInput);
                  const ghiChu = formData.get('ghiChu') as string;
                  
                  // Validation trước khi gọi API
                  if (!soTienNopInput || isNaN(soTienNop) || soTienNop < 0) {
                    alert('Vui lòng nhập số tiền hợp lệ (>= 0)');
                    return;
                  }
                  
                  handlePaymentUpdate(selectedHousehold.id, soTienNop, ghiChu);
                }}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số tiền nộp
                    </label>
                    <input
                      type="number"
                      name="soTienNop"
                      min="0"
                      step="1000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập số tiền nộp"
                      required
                    />
                    {/* Autofill buttons */}
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = (e.target as HTMLElement).closest('form')?.querySelector('input[name="soTienNop"]') as HTMLInputElement;
                          if (input) input.value = (parseFloat(selectedHousehold.soTien) - parseFloat(selectedHousehold.soTienDaNop)).toString();
                        }}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Số tiền còn lại ({formatCurrency(parseFloat(selectedHousehold.soTien) - parseFloat(selectedHousehold.soTienDaNop))})
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = (e.target as HTMLElement).closest('form')?.querySelector('input[name="soTienNop"]') as HTMLInputElement;
                          if (input) input.value = selectedHousehold.soTien.toString();
                        }}
                        className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                      >
                        Toàn bộ ({formatCurrency(parseFloat(selectedHousehold.soTien))})
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ghi chú
                    </label>
                    <textarea
                      name="ghiChu"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ghi chú về thanh toán (tùy chọn)"
                    />
                  </div>
                  
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setSelectedHousehold(null)}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Cập nhật thanh toán
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Popup nộp nhanh */}
        {showNopNhanhPopup && (
          <NopNhanhPopup
            isOpen={showNopNhanhPopup}
            onClose={() => setShowNopNhanhPopup(false)}
            onSave={(data) => {
              console.log('Payment data:', data);
              setShowNopNhanhPopup(false);
              
              // Show success notification
              showNotification('success', 'Thanh toán nhanh thành công!');
              
              // Optimized update: only reload dashboard data without resetting selection
              if (selectedDotThu) {
                reloadDashboardKeepSelection(selectedDotThu);
              }
              if (selectedDotThu && selectedKhoanThu) {
                loadHouseholdFees(selectedDotThu, selectedKhoanThu);
                // Keep selectedKhoanThu to preserve user selection
              }
            }}
          />
        )}

        {/* Popup thanh toán nhiều hộ */}
        {showNopNhanhMultiplePopup && (
          <NopNhanhMultiplePopup
            isOpen={showNopNhanhMultiplePopup}
            onClose={() => setShowNopNhanhMultiplePopup(false)}
            onSave={(data) => {
              console.log('Multiple payment data:', data);
              setShowNopNhanhMultiplePopup(false);
              
              // Show success notification with details
              showNotification('success', 
                `Thanh toán thành công cho ${data.totalHouseholds} hộ khẩu! Tổng số tiền: ${formatCurrency(data.totalAmount)}`
              );
              
              // Optimized update: only reload dashboard data without resetting selection
              if (selectedDotThu) {
                reloadDashboardKeepSelection(selectedDotThu);
              }
              if (selectedDotThu && selectedKhoanThu) {
                loadHouseholdFees(selectedDotThu, selectedKhoanThu);
                // Keep selectedKhoanThu to preserve user selection
              }
            }}
          />
        )}
      </div>
    </Layout>
  );
};

export default QuanLyKhoanThuNew;
