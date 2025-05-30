import React, { useState } from "react";
import Layout from '../components/Layout'; // Import Layout component
import EditHoKhauPopup from '../components/EditHoKhauPopup'; // Import the popup component

const QuanLyHoKhau: React.FC = () => {
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false); // State to manage popup visibility

  const openEditPopup = () => setIsEditPopupOpen(true);
  const closeEditPopup = () => setIsEditPopupOpen(false);

  return (
    <>
      <Layout role="totruong"> {/* Wrap with Layout - Assuming this is for totruong role */} 
        <div className="p-4 flex flex-col gap-6">
          {/* Page Title and Welcome Text */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">QUẢN LÝ HỘ KHẨU</h1>
            <p className="text-gray-600 text-sm mt-1">Chào mừng đến với Hệ thống Quản lý Thu phí Chung cư</p>
          </div>

          {/* Search and Add Button Area */}
          <div className="flex items-center gap-4">
             {/* Select Type Dropdown/Button */}
             <div className="flex items-center border border-gray-300 rounded-md shadow-sm overflow-hidden">
                <input
                  type="text"
                  placeholder="Chọn kiểu"
                  className="flex-1 p-2 outline-none text-sm"
                />
                 <button className="p-2 border-l border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100">
                  ...
                 </button>
             </div>
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
                placeholder="Search"
                className="flex-1 p-2 border-l border-gray-300 outline-none text-sm"
              />
            </div>

            {/* Add Household Button */}
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Thêm hộ khẩu
            </button>
          </div>

          {/* Table Area */}
          <div className="mt-6 bg-white rounded-md shadow-md overflow-hidden border border-gray-200">
             {/* Table Title */}
            <div className="p-4 bg-gray-100 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Danh sách hộ khẩu</h2>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Sổ hộ khẩu</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Chủ hộ</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Số nhà</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Phường/Quận</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Ngày làm hộ khẩu</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Sample Row 1 */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">HK001</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Nguyễn Văn An</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">12B/3</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Phường 1</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2020-03-15</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 cursor-pointer">Chỉnh sửa/Gán chủ hộ</td>
                </tr>
                 {/* Sample Row 2 */}
                 <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">HK002</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Trần Thị Bình</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">45/6</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Phường 5</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2021-07-22</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 cursor-pointer" onClick={openEditPopup}>Chỉnh sửa/Gán chủ hộ</td>
                </tr>
                {/* Sample Row 3 */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">HK003</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Lê Minh Công</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">89A</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Phường Linh Đông</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2022-11-03</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 cursor-pointer">Chỉnh sửa/Gán chủ hộ</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
      <EditHoKhauPopup
        isOpen={isEditPopupOpen}
        onClose={closeEditPopup}
      />
    </>
  );
};

export default QuanLyHoKhau; 