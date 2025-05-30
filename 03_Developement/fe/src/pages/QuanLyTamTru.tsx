import React, { useState } from "react";
import Layout from '../components/Layout';
import AddEditTamTruPopup from '../components/AddEditTamTruPopup';

const QuanLyTamTru: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  return (
    <>
      <Layout role="totruong">
        <div className="p-4 flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">QUẢN LÝ TẠM TRÚ/TẠM VẮNG</h1>
            <p className="text-gray-600 text-sm mt-1">Chào mừng đến với Hệ thống Quản lý Thu phí Chung cư</p>
          </div>

          <div className="flex items-center gap-4">
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
            <div className="flex items-center border border-gray-300 rounded-md shadow-sm overflow-hidden flex-1">
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

            <button className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 flex items-center gap-2"
              onClick={openPopup}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Thêm TT/TV
            </button>
          </div>

          <div className="mt-6 bg-white rounded-md shadow-md overflow-hidden border border-gray-200">
            <div className="p-4 bg-gray-100 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Danh sách tạm trú/tạm vắng</h2>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Họ tên</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Địa chỉ</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Thời gian</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Nội dung đề nghị</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">Nguyễn Văn An</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Tạm trú</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">123 Lê Lợi, Q.1, TP.HCM</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2025-05-01 → 2025-08-01</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Đăng ký tạm trú để thực tập tại công ty</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 cursor-pointer" onClick={openPopup}>Thêm mới</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">Trần Thị Bình</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Tạm vắng</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">45 Nguyễn Du, Q.3, TP.HCM</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2025-06-10 → 2025-07-05</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Xin tạm vắng để về quê chăm người thân</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 cursor-pointer" onClick={openPopup}>Thêm mới</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">Lê Minh Công</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Tạm trú</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">98 Phạm Văn Đồng, Q. Gò Vấp</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2025-05-15 → 2025-06-30</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Gia hạn tạm trú do chưa hoàn thành khóa học</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 cursor-pointer" onClick={openPopup}>Thêm mới</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
      <AddEditTamTruPopup
        isOpen={isPopupOpen}
        onClose={closePopup}
      />
    </>
  );
};

export default QuanLyTamTru; 