import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import NopNhanhPopup from '../components/NopNhanhPopup';
import HouseholdPaymentDetails from '../components/HouseholdPaymentDetails';
import { dotThuAPI } from '../services/api';

interface DotThu {
  id: number;
  tenDotThu: string;
  ngayTao: string;
  thoiHan: string;
  khoanThu?: KhoanThu[];
}

interface KhoanThu {
  id: number;
  tenKhoan: string;
  loaiKhoan: string;
  batBuoc: boolean;
  ghiChu: string;
  DotThu_KhoanThu?: {
    soTien: number;
    dotThuId: number;
    khoanThuId: number;
  };
}

interface HouseholdPayment {
  maHo: string;
  chuHo: string;
  trangThai: string;
  ngayNop?: string;
  soTien: number;
  nguoiNop?: string;
}

const QuanLyKhoanThu: React.FC = () => {
  const [dotThuList, setDotThuList] = useState<DotThu[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNopNhanhPopup, setShowNopNhanhPopup] = useState(false);

  // Fetch đợt thu từ API
  useEffect(() => {
    fetchDotThuData();
  }, []);

  const fetchDotThuData = async () => {
    try {
      setLoading(true);
      const response = await dotThuAPI.getAllWithKhoanThu();
      console.log('API Response:', response);
      
      if (response.success && Array.isArray(response.dotThus)) {
        setDotThuList(response.dotThus);
        if (response.dotThus.length > 0) {
          setActiveTab(0);
        }
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (err) {
      console.error('Error fetching dot thu data:', err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý mở popup nộp nhanh
  const handleOpenNopNhanhPopup = () => {
    setShowNopNhanhPopup(true);
  };

  // Đóng popup nộp nhanh  
  const handleCloseNopNhanhPopup = () => {
    setShowNopNhanhPopup(false);
  };

  // Xử lý khi lưu thông tin nộp nhanh
  const handleSaveNopNhanh = (data: any) => {
    console.log('Payment data received:', data);
    // TODO: Implement payment processing logic
    alert('Đã ghi nhận thanh toán thành công!');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <Layout role="ketoan">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout role="ketoan">
        <div className="p-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
            <button 
              onClick={fetchDotThuData}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Thử lại
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout role="ketoan">
      <div className="p-4 flex flex-col gap-6">
        {/* Page Title */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">QUẢN LÝ KHOẢN THU</h1>
            <p className="text-gray-600 text-sm mt-1">Quản lý các khoản thu theo từng đợt thu phí</p>
          </div>
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 flex items-center gap-2"
            onClick={handleOpenNopNhanhPopup}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Ghi nhận thanh toán nhanh
          </button>
        </div>

        {/* Tab Navigation */}
        {dotThuList.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md">
            {/* Tab Headers */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                {dotThuList.map((dotThu, index) => (
                  <button
                    key={dotThu.id}
                    onClick={() => setActiveTab(index)}
                    className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                      activeTab === index
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <span className="font-semibold">{dotThu.tenDotThu}</span>
                      <span className="text-xs text-gray-400">
                        {formatDate(dotThu.ngayTao)} - {formatDate(dotThu.thoiHan)}
                      </span>
                      {dotThu.khoanThu && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                          {dotThu.khoanThu.length} khoản thu
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {dotThuList[activeTab] && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      Đợt thu phí: {dotThuList[activeTab].tenDotThu}
                    </h2>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>Ngày tạo: {formatDate(dotThuList[activeTab].ngayTao)}</span>
                      <span>Thời hạn: {formatDate(dotThuList[activeTab].thoiHan)}</span>
                    </div>
                  </div>

                  {/* Fee List */}
                  {dotThuList[activeTab].khoanThu && dotThuList[activeTab].khoanThu!.length > 0 ? (
                    <div className="space-y-4">
                      {dotThuList[activeTab].khoanThu!.map((khoanThu) => (
                        <div key={khoanThu.id} className="border border-gray-200 rounded-lg">
                          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">
                                  {khoanThu.tenKhoan}
                                </h3>
                                <div className="flex items-center gap-4 mt-1">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    khoanThu.batBuoc 
                                      ? 'bg-red-100 text-red-800' 
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {khoanThu.batBuoc ? 'Bắt buộc' : 'Không bắt buộc'}
                                  </span>
                                  <span className="text-sm text-gray-600">
                                    Loại: {khoanThu.loaiKhoan}
                                  </span>
                                  {khoanThu.DotThu_KhoanThu && (
                                    <span className="text-sm font-medium text-green-600">
                                      Số tiền: {formatCurrency(khoanThu.DotThu_KhoanThu.soTien)}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm">
                                Xem chi tiết
                              </button>
                            </div>
                            {khoanThu.ghiChu && (
                              <p className="text-sm text-gray-600 mt-2">{khoanThu.ghiChu}</p>
                            )}
                          </div>
                          
                          {/* Placeholder for household payment details */}
                          <div className="p-6">
                            <HouseholdPaymentDetails 
                              dotThuId={dotThuList[activeTab].id}
                              khoanThuId={khoanThu.id}
                              soTien={khoanThu.DotThu_KhoanThu?.soTien || 0}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có khoản thu nào</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Đợt thu phí này chưa có khoản thu nào được thêm vào.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có đợt thu phí nào</h3>
            <p className="mt-1 text-sm text-gray-500">
              Hệ thống chưa có đợt thu phí nào được tạo.
            </p>
          </div>
        )}
      </div>

      {/* Popup Ghi nhận thanh toán nhanh */}
      <NopNhanhPopup
        isOpen={showNopNhanhPopup}
        onClose={handleCloseNopNhanhPopup}
        onSave={handleSaveNopNhanh}
      />
    </Layout>
  );
};

export default QuanLyKhoanThu;
