import React from "react";
import Layout from '../components/Layout'; // Import Layout component

const ThongKeNhanKhau: React.FC = () => (
  <Layout role="totruong"> {/* Wrap with Layout - Assuming this is for totruong role */} 
    <div className="p-4 flex flex-col gap-6">
      {/* Page Title and Welcome Text */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">THỐNG KÊ NHÂN KHẨU</h1>
        <p className="text-gray-600 text-sm mt-1">Chào mừng đến với Hệ thống Quản lý Thu phí Chung cư</p>
      </div>

      {/* Search Area */}
      <div className="flex items-center gap-4">
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
      </div>

      {/* Statistics Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Statistics by Age */}
        <div className="bg-white rounded-md shadow-md overflow-hidden border border-gray-200 p-4 flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-800">Thống kê theo tuổi</h2>
           {/* Placeholder for Age Chart/Visualization */}
          <div className="bg-gray-100 h-48 flex items-center justify-center text-gray-500">
            [Age Chart/Visualization Placeholder]
          </div>
           {/* Age Categories with Color Indicators */}
          <div className="text-sm text-gray-600 grid grid-cols-2 gap-2">
             <p><span className="inline-block w-3 h-3 bg-green-400 mr-2"></span> &lt;20</p>
             <p><span className="inline-block w-3 h-3 bg-yellow-400 mr-2"></span> 20-30</p>
             <p><span className="inline-block w-3 h-3 bg-pink-400 mr-2"></span> 30-60</p>
             <p><span className="inline-block w-3 h-3 bg-blue-400 mr-2"></span> &gt;60</p>
          </div>
        </div>

         {/* Statistics by Gender */}
        <div className="bg-white rounded-md shadow-md overflow-hidden border border-gray-200 p-4 flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-800">Thống kê theo giới tính</h2>
           {/* Placeholder for Gender Chart/Visualization */}
           <div className="bg-gray-100 h-48 flex items-center justify-center text-gray-500">
            [Gender Chart/Visualization Placeholder]
          </div>
           {/* Gender Categories with Color Indicators */}
          <div className="text-sm text-gray-600 grid grid-cols-2 gap-2">
             <p><span className="inline-block w-3 h-3 bg-blue-500 mr-2"></span> Nam</p>
             <p><span className="inline-block w-3 h-3 bg-white border border-gray-400 mr-2"></span> Nữ</p>
          </div>
        </div>
      </div>

      {/* Resident List Table */}
      <div className="mt-6 bg-white rounded-md shadow-md overflow-hidden border border-gray-200">
         {/* Table Title */}
        <div className="p-4 bg-gray-100 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Danh sách nhân khẩu</h2>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Họ tên</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Giới tính</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Ngày sinh</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">CCCD</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Ngày làm hộ khẩu</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Sample Row 1 */}
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">Nguyễn Văn An</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Nam</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">24/12/1993</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">0173048134</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2020-03-15</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 cursor-pointer">Xem chi tiết</td>
            </tr>
             {/* Sample Row 2 */}
             <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">Trần Thị Bình</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Nữ</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">15/07/1987</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">0173054376</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2021-07-22</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 cursor-pointer">Xem chi tiết</td>
            </tr>
            {/* Sample Row 3 */}
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">Lê Minh Công</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Nam</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">14/05/2000</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">0173081734</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2022-11-03</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 cursor-pointer">Xem chi tiết</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </Layout>
);

export default ThongKeNhanKhau; 