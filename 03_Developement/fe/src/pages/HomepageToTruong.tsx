import React from "react";
import Layout from "../components/Layout";

const HomepageToTruong: React.FC = () => (
  <Layout role="totruong">
    <div className="flex flex-col gap-8">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">TRANG CHỦ</h1>
        <p className="text-base text-gray-600 mt-2">Chào mừng đến với Hệ thống Quản lý Thu phí Chung cư</p>
      </div>

      {/* Info Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tổng số Nhân khẩu */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-700">Tổng số Nhân khẩu</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-blue-600">1374</span>
            <span className="text-xl text-gray-700">nhân khẩu</span>
          </div>
        </div>

        {/* Đang tạm trú/tạm vắng */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-700">Đang tạm trú/tạm vắng</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-blue-600">35</span>
            <span className="text-xl text-gray-700">nhân khẩu</span>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Phân phối nhân khẩu theo độ tuổi */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-700">Phân phối nhân khẩu theo độ tuổi</h2>
          {/* Placeholder cho biểu đồ tuổi */}
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">Placeholder Biểu đồ phân phối độ tuổi</div>
           <div className="flex flex-wrap gap-4 justify-center">
               <div className="flex items-center gap-1">
                    <span className="w-4 h-4 bg-[#77A1EA]"></span>
                    <span className="text-sm text-gray-700">0-10</span>
               </div>
                <div className="flex items-center gap-1">
                    <span className="w-4 h-4 bg-[#77A1EA]"></span>
                    <span className="text-sm text-gray-700">10-20</span>
               </div>
                <div className="flex items-center gap-1">
                    <span className="w-4 h-4 bg-[#77A1EA]"></span>
                    <span className="text-sm text-gray-700">20-30</span>
               </div>
                 <div className="flex items-center gap-1">
                    <span className="w-4 h-4 bg-[#77A1EA]"></span>
                    <span className="text-sm text-gray-700">30-40</span>
               </div>
                <div className="flex items-center gap-1">
                    <span className="w-4 h-4 bg-[#77A1EA]"></span>
                    <span className="text-sm text-gray-700">40-50</span>
               </div>
                 <div className="flex items-center gap-1">
                    <span className="w-4 h-4 bg-[#77A1EA]"></span>
                    <span className="text-sm text-gray-700">50-60</span>
               </div>
                 <div className="flex items-center gap-1">
                    <span className="w-4 h-4 bg-[#77A1EA]"></span>
                    <span className="text-sm text-gray-700">{'>'} 60</span>
               </div>
           </div>
        </div>

        {/* Tỷ lệ nam/nữ */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-700">Tỷ lệ (%) nam/nữ trong toàn khu chung cư</h2>
          {/* Placeholder cho biểu đồ giới tính */}
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">Placeholder Biểu đồ giới tính</div>
           <div className="flex gap-4 justify-center">
                <div className="flex items-center gap-1">
                    <span className="w-4 h-4 bg-blue-500 rounded-full"></span>
                    <span className="text-sm text-gray-700">Nam</span>
               </div>
                 <div className="flex items-center gap-1">
                    <span className="w-4 h-4 bg-white border border-gray-400 rounded-full"></span>
                    <span className="text-sm text-gray-700">Nữ</span>
               </div>
           </div>
        </div>
      </div>
    </div>
  </Layout>
);

export default HomepageToTruong; 