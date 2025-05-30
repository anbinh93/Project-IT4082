import React from "react";
import Layout from '../components/Layout';

const LichSuThayDoiNhanKhau: React.FC = () => (
  <Layout role="totruong">
    <div className="p-4 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">LỊCH SỬ THAY ĐỔI NHÂN KHẨU</h1>
        <p className="text-gray-600 text-sm mt-1">Chào mừng đến với Hệ thống Quản lý Thu phí Chung cư</p>
      </div>

      <div className="flex items-center gap-4">
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
      </div>

      <div className="mt-6 bg-white rounded-md shadow-md overflow-hidden border border-gray-200">
        <div className="p-4 bg-gray-100 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Danh sách lịch sử thay đổi nhân khẩu</h2>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Tên nhân khẩu</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Số hộ khẩu</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Loại thay đổi</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Thời gian</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Nội dung chi tiết</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">Nguyễn Văn An</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">HK123456</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Cập nhật thông tin</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2025-05-01 09:15</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">[Nội dung chi tiết thay đổi]</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 cursor-pointer">Xem chi tiết</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">Trần Thị Bình</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">HK654321</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Tạm vắng</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2025-05-12 15:30</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Xin tạm vắng để về quê chăm người thân</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 cursor-pointer">Xem chi tiết</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">Lê Minh Công</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">HK123456</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Cập nhật thông tin</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2025-05-24 11:10</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">[Nội dung chi tiết thay đổi]</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 cursor-pointer">Xem chi tiết</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </Layout>
);

export default LichSuThayDoiNhanKhau;