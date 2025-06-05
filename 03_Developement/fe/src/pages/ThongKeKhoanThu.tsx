import React, { useState } from "react";
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
import { Bar, Pie } from 'react-chartjs-2';
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

  const [selectedBatchId, setSelectedBatchId] = useState<string>(sampleBatches[0].maDot);
  const selectedBatch = sampleBatches.find((b: any) => b.maDot === selectedBatchId);

  // Bar chart data theo khoản thu của đợt đã chọn
  const barChartData = selectedBatch ? {
    labels: selectedBatch.details.khoanThu.map((k: any) => k.tenKhoan),
    datasets: [
      {
        label: 'Số tiền đã thu (Nghìn đồng)',
        data: selectedBatch.details.khoanThu.map(
          (k: any) => Math.round(Object.values(k.householdFees).reduce((sum: number, h: any) => sum + (h.amount || 0), 0) / 1000)
        ),
        backgroundColor: ['#8BC34A', '#FFEB3B', '#E91E63', '#2196F3', '#FF9800', '#9C27B0', '#00BCD4', '#F44336', '#607D8B', '#795548', '#CDDC39'],
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
          size: 20,
        }
      },
      datalabels: {
        display: false // Ẩn số trên cột
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Nghìn đồng',
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
        display: false, // Ẩn legend mặc định
      },
      datalabels: {
        color: '#000000',
        formatter: (value: number, context: any) => {
          const total = context.chart.data.datasets[0].data.reduce((sum: number, current: number) => sum + current, 0);
          const percentage = ((value / total) * 100).toFixed(1) + '%';
          return percentage;
        },
        font: {
          weight: 'bold' as 'bold',
          size: 14,
        },
      },
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Theo khoản Chart */}
          <div className="bg-white rounded-md shadow-md overflow-hidden border border-gray-200 p-4 flex flex-col gap-4 md:col-span-3">
            <h2 className="text-lg font-semibold text-gray-800">Theo khoản (Nghìn đồng)</h2>
            <div className="h-96 flex items-center justify-center">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </div>
          {/* Theo đợt thu Chart */}
          <div className="bg-white rounded-md shadow-md overflow-hidden border border-gray-200 p-4 flex flex-col gap-2 md:col-span-1 items-center justify-center">
            <h2 className="text-lg font-semibold text-gray-800 w-full text-center mb-0 mt-[-12px]">Theo đợt thu</h2>
            <div className="h-44 w-full flex items-center justify-center">
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>
            {/* Custom legend dưới đáy, căn giữa */}
            <div className="flex flex-col items-center w-full mt-2">
              {pieChartData.labels.map((label: string, idx: number) => (
                <div key={label} className="flex items-center gap-2 text-sm mb-1">
                  <span className="inline-block w-4 h-4 rounded-full" style={{ backgroundColor: pieChartData.datasets[0].backgroundColor[idx] }}></span>
                  <span className="text-gray-700">{label}</span>
                </div>
              ))}
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