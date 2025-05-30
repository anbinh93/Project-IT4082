import React from "react";
import Layout from "../components/Layout";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const HomepageKeToan: React.FC = () => {
  const data = {
    labels: ['Số hộ đã nộp', 'Số hộ chưa nộp'],
    datasets: [
      {
        label: 'Tỷ lệ hộ',
        data: [75, 25], // Dữ liệu mẫu: 75% đã nộp, 25% chưa nộp
        backgroundColor: [
          '#2196F3', // Màu xanh dương cho đã nộp
          '#E0E0E0', // Màu xám nhạt cho chưa nộp
        ],
        borderColor: [
          '#ffffff',
          '#ffffff',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right' as const, // Đặt legend sang phải
        align: 'center' as const, // Căn giữa legend theo chiều dọc
      },
      datalabels: {
        color: '#ffffff', // Màu chữ cho nhãn dữ liệu
        formatter: (value: number, context: any) => {
          // Hiển thị giá trị hoặc phần trăm (ví dụ đơn giản)
          const total = context.chart.data.datasets[0].data.reduce((sum: number, current: number) => sum + current, 0);
          const percentage = ((value / total) * 100).toFixed(1) + '%';
          return percentage; // Có thể trả về value hoặc percentage tùy ý
        },
        font: {
          weight: 'bold',
        },
      },
    },
    layout: {
      padding: { // Thêm padding để biểu đồ và legend không dính vào nhau
        left: 0,
        right: 16, // Padding bên phải để cách legend
        top: 0,
        bottom: 0
      }
    }
  };

  return (
    <Layout role="ketoan">
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">TRANG CHỦ</h1>
          <p className="text-base text-gray-600 mt-2">Chào mừng đến với Hệ thống Quản lý Thu phí Chung cư</p>
        </div>

        {/* Info Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tổng số hộ gia đình */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-gray-700">Tổng số hộ gia đình</h2>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-blue-600">125</span>
              <span className="text-xl text-gray-700">hộ</span>
            </div>
          </div>

          {/* Khoản thu đang mở */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-gray-700">Khoản thu đang mở</h2>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-blue-600">3</span>
              <span className="text-xl text-gray-700">khoản thu</span>
            </div>
          </div>

          {/* Biểu đồ tỷ lệ nộp/chưa nộp */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 flex flex-col gap-4 col-span-1 md:col-span-3">
             <h2 className="text-xl font-semibold text-gray-700">Tỷ lệ (%) hộ đã nộp / chưa nộp trong đợt thu tháng 5</h2>
             <div className="w-full h-64 flex items-center justify-center">
               <Pie data={data} options={options} />
             </div>
          </div>
        </div>
         {/* Doanh thu table */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 flex flex-col gap-4">
           <h2 className="text-xl font-semibold text-gray-700">Doanh thu của đợt thu tháng 5</h2>
           {/* Placeholder cho bảng */}
           <div className="w-full overflow-x-auto">
               <table className="min-w-full divide-y divide-gray-200">
                   <thead>
                       <tr>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên khoản thu</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đã thu</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tỷ lệ</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                       </tr>
                   </thead>
                   <tbody className="bg-white divide-y divide-gray-200">
                       <tr>
                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Phí chung cư tháng 5/2025</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">01/05 - 31/05/2025</td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">102,650,234 VND</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">89,6%</td>
                               <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">Đang thu</td>
                       </tr>
                       <tr>
                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Phí chung cư tháng 4/2025</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">01/04 - 30/04/2025</td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">123,654,259 VND</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">100%</td>
                               <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">Đã thu xong</td>
                       </tr>
                        <tr>
                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Phí chung cư tháng 3/2025</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">01/03 - 31/03/2025</td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">113,276,093 VND</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">100%</td>
                               <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">Đã thu xong</td>
                       </tr>
                   </tbody>
               </table>
           </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomepageKeToan; 