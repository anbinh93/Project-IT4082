import React, { useState } from 'react';
import Layout from '../components/Layout';
import AddEditHoKhauPopup from '../components/AddEditHoKhauPopup';

const QuanLyKhoanThu: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
    <Layout role="ketoan">
    <div className="p-4">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-800">QUẢN LÝ KHOẢN THU</h1>

      {/* Welcome Text */}
      <p className="text-gray-600 text-sm mt-1">Chào mừng đến với Hệ thống Quản lý Thu phí Chung cư</p>

      {/* Search and Add Button Area */}
      <div className="mt-6 flex items-center gap-4">
        {/* Search Input Container */}
        <div className="flex items-center border border-gray-300 rounded-md shadow-sm overflow-hidden flex-1">
          {/* Search Icon Placeholder */}
          <div className="p-2 text-gray-400">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
             </svg>
          </div>
          <input
            type="text"
            placeholder="Nhập tên khoản thu"
            className="flex-1 p-2 border-l border-gray-300 outline-none text-sm"
          />
           {/* Small Button Placeholder - Based on Figma visual, could be filter or similar */}
           <button className="p-2 border-l border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100">
            {/* Placeholder Icon or Text */}
            ...
           </button>
        </div>

        {/* Add Button */}
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 flex items-center gap-2"
                onClick={handleOpenPopup}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nhập thông tin nộp phí
        </button>
      </div>

      {/* Table Area */}
      <div className="mt-6 bg-white rounded-md shadow-md overflow-hidden border border-gray-200"> {/* Added border */} 
        {/* Table Title */}
        <div className="p-4 bg-gray-100 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Khoản thu gần nhất</h2>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Ngày tạo</th> {/* Adjusted styles */} 
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Thời hạn</th> {/* Adjusted styles */} 
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Tên khoản thu</th> {/* Adjusted styles */} 
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Bắt buộc ?</th> {/* Adjusted styles */} 
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Ghi chú</th> {/* Adjusted styles */} 
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Trạng thái</th> {/* Adjusted styles */} 
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Sample Row 1 */}
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">01/03/2025</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">31/03/2025</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">Phí dịch vụ</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">Có</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Phí dịch vụ hàng tháng</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">Đang thu</td>
            </tr>
            {/* Sample Row 2 */}
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">15/02/2025</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">15/04/2025</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">Phí bảo trì</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">Không</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Phí bảo trì cơ sở hạ tầng</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">Đã thu xong</td>
            </tr>
             {/* Sample Row 3 */}
             <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">10/03/2025</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">31/01/2025</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">Phí quản lý</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">Có</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Phí quản lý chung cư</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">Đã thu xong</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </Layout>
    <AddEditHoKhauPopup
      isOpen={isPopupOpen}
      onClose={handleClosePopup}
    />
    </>
  );
};

export default QuanLyKhoanThu; 