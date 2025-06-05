import React, { useState, useEffect } from "react";
import Layout from '../components/Layout';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { sampleBatches } from './QuanLyDotThuPhi';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels // Register datalabels plugin
);

const ThongKeKhoanThu: React.FC = () => {

  const [selectedTimeRange, setSelectedTimeRange] = useState('7days');
  const [lineChartData, setLineChartData] = useState({
    labels: [] as string[],
    datasets: [] as any[],
  });
  const [selectedBatchId, setSelectedBatchId] = useState<string>(sampleBatches[0].maDot);
  const selectedBatch = sampleBatches.find((b: any) => b.maDot === selectedBatchId);

  // Mock data generation functions (replace with actual data fetching later)
  const generate7DaysData = () => ({
    labels: ['08 May', '09 May', '10 May', '11 May', '12 May', '13 May', '14 May'],
    datasets: [
      {
        label: 'Doanh thu (triệu VND)',
        data: [430, 310, 200, 50, 90, 160, 30],
        borderColor: '#9E9E9E',
        backgroundColor: '#9E9E9E',
        tension: 0.3,
        pointRadius: 5,
        pointBackgroundColor: '#9E9E9E',
      },
    ],
  });

  const generate30DaysData = () => ({
    labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`), // Placeholder labels
    datasets: [
      {
        label: 'Doanh thu (triệu VND)',
        data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 500)), // Random placeholder data
        borderColor: '#9E9E9E',
        backgroundColor: '#9E9E9E',
        tension: 0.3,
        pointRadius: 5,
        pointBackgroundColor: '#9E9E9E',
      },
    ],
  });

  const generate90DaysData = () => ({
     labels: Array.from({ length: 90 }, (_, i) => `Day ${i + 1}`), // Placeholder labels
    datasets: [
      {
        label: 'Doanh thu (triệu VND)',
        data: Array.from({ length: 90 }, () => Math.floor(Math.random() * 500)), // Random placeholder data
        borderColor: '#9E9E9E',
        backgroundColor: '#9E9E9E',
        tension: 0.3,
        pointRadius: 5,
        pointBackgroundColor: '#9E9E9E',
      },
    ],
  });

  // Effect to update chart data when selectedTimeRange changes
  useEffect(() => {
    switch (selectedTimeRange) {
      case '7days':
        setLineChartData(generate7DaysData());
        break;
      case '30days':
        setLineChartData(generate30DaysData());
        break;
      case '90days':
        setLineChartData(generate90DaysData());
        break;
      default:
        setLineChartData(generate7DaysData());
    }
  }, [selectedTimeRange]);

  // Bar chart data theo khoản thu của đợt đã chọn
  const barChartData = selectedBatch ? {
    labels: selectedBatch.details.khoanThu.map((k: any) => k.tenKhoan),
    datasets: [
      {
        label: 'Số tiền đã thu (VND)',
        data: selectedBatch.details.khoanThu.map(
          (k: any) => Object.values(k.householdFees).reduce((sum: number, h: any) => sum + (h.amount || 0), 0)
        ),
        backgroundColor: ['#8BC34A', '#FFEB3B', '#E91E63', '#2196F3'],
      },
    ],
  } : { labels: [], datasets: [] };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide legend for bar chart
      },
      title: {
        display: true,
        text: 'Doanh thu theo khoản',
        font: {
          size: 16,
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Triệu VND',
        },
      },
    },
  };

  // Pie chart data: tổng số tiền đã thu của từng đợt thu
  const pieChartData = {
    labels: sampleBatches.map((b: any) => b.tenDot),
    datasets: [
      {
        label: 'Tỷ lệ đợt thu',
        data: sampleBatches.map((b: any) =>
          b.details.khoanThu.reduce((sum: number, k: any) => sum + Object.values(k.householdFees).reduce((s: number, h: any) => s + (h.amount || 0), 0), 0)
        ),
        backgroundColor: [
          '#2196F3', // Blue
          '#E0E0E0', // Light Gray
          '#8BC34A', // Green
          '#E91E63', // Pink
          '#FFEB3B', // Yellow
          '#FF9800', // Orange
        ],
        borderColor: [
          '#ffffff',
          '#ffffff',
          '#ffffff',
          '#ffffff',
          '#ffffff',
          '#ffffff',
        ],
        borderWidth: 2,
      },
    ],
  };

  const pieChartOptions = {
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
          const total = context.chart.data.datasets[0].data.reduce((sum: number, current: number) => sum + current, 0);
          const percentage = ((value / total) * 100).toFixed(1) + '%';
          return percentage; // Hiển thị phần trăm
        },
        font: {
          weight: 'bold' as 'bold', // Corrected type
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

  // Data and options for Line Chart (Theo thời gian)
  const lineChartOptions = {
    responsive: true,
    aspectRatio: 5,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y + ' triệu VND'; // Add unit
            }
            return label;
          }
        }
      },
      datalabels: {
        display: selectedTimeRange !== '90days', // Hide datalabels when 90days is selected
        color: '#000000',
        align: 'end' as 'end',
        anchor: 'end' as 'end',
        offset: 4,
        formatter: (value: number) => {
          return value; // Hiển thị giá trị số
        },
        font: {
          weight: 'bold' as 'bold',
          size: 12,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Triệu VND',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Ngày',
        },
      }
    },
    layout: {
      padding: { // Thêm padding để nhãn dữ liệu không bị cắt
        top: 40, // Thêm padding 20px ở phía trên
        left: 0,
        right: 0,
        bottom: 0,
      }
    }
  };


  return (
    <Layout role="ketoan">
      <div className="p-4 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">THỐNG KÊ THU PHÍ</h1>
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

          <button className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600">
            Áp dụng
          </button>
        </div>

        <div className="flex items-center gap-4">
          <label className="font-semibold text-gray-700">Chọn đợt thu:</label>
          <select
            value={selectedBatchId}
            onChange={e => setSelectedBatchId(e.target.value)}
            className="p-2 border rounded"
          >
            {sampleBatches.map((b: any) => (
              <option key={b.maDot} value={b.maDot}>
                {b.tenDot} ({b.maDot})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Theo khoản Chart */}
          <div className="bg-white rounded-md shadow-md overflow-hidden border border-gray-200 p-4 flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-gray-800">Theo khoản (VND)</h2>
            <div className="h-48 flex items-center justify-center">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </div>

          {/* Theo đợt thu Chart */}
          <div className="bg-white rounded-md shadow-md overflow-hidden border border-gray-200 p-4 flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-gray-800">Theo đợt thu</h2>
            <div className="h-48 flex items-center justify-center">
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>
          </div>
        </div>

        {/* Danh sách các khoản thu của đợt đã chọn */}
        <div className="bg-white rounded-md shadow-md overflow-hidden border border-gray-200 p-4 flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-800">Danh sách khoản thu trong đợt</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Khoản thu</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Số tiền dự kiến</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Số tiền đã thu</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Số hộ đã nộp</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {selectedBatch && selectedBatch.details.khoanThu.map((k: any) => {
                const total = Object.values(k.householdFees).reduce((sum: number, h: any) => sum + (h.amount || 0), 0);
                const paid = Object.values(k.householdFees).filter((h: any) => h.amount > 0).length;
                return (
                  <tr key={k.id}>
                    <td className="px-4 py-2 text-sm text-gray-900">{k.tenKhoan}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{total.toLocaleString('vi-VN')}</td>
                    <td className="px-4 py-2 text-sm text-blue-700 font-semibold">{total.toLocaleString('vi-VN')}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{paid}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{k.batBuoc}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default ThongKeKhoanThu;