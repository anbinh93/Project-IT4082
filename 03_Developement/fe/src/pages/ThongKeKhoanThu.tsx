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
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import * as XLSX from 'xlsx';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend, ChartDataLabels);

const FILTERS = [
  { label: 'Khoản thu', value: 'feeType' },
  { label: 'Đợt thu', value: 'period' },
  { label: 'Thời gian', value: 'time' },
  { label: 'Trạng thái thanh toán', value: 'status' },
];

// Sample static data for demonstration
const sampleFeeStats = {
  feeType: [
    { label: 'Phí quản lý', value: 550 },
    { label: 'Phí gửi xe', value: 320 },
    { label: 'Phí điện', value: 280 },
    { label: 'Phí nước', value: 180 },
  ],
  period: [
    { label: 'Đợt tháng 06/2025', value: 65 },
    { label: 'Đợt tháng 07/2025', value: 35 },
  ],
  time: [430, 310, 200, 150, 290, 160, 380],
  status: [
    { label: 'Đã thanh toán', value: 780 },
    { label: 'Chưa thanh toán', value: 120 },
  ],
};

const sampleHouseholds = [
  { tenHo: 'Nguyễn Văn A', soNha: 'A101', tongPhi: 1200000, daDong: 1200000, trangThai: 'Đã thanh toán' },
  { tenHo: 'Trần Thị B', soNha: 'B202', tongPhi: 950000, daDong: 950000, trangThai: 'Đã thanh toán' },
  { tenHo: 'Lê Văn C', soNha: 'C303', tongPhi: 1100000, daDong: 0, trangThai: 'Chưa thanh toán' },
  { tenHo: 'Phạm Thị D', soNha: 'D404', tongPhi: 800000, daDong: 800000, trangThai: 'Đã thanh toán' },
  { tenHo: 'Vũ Văn E', soNha: 'E505', tongPhi: 1000000, daDong: 0, trangThai: 'Chưa thanh toán' },
];

const ThongKeKhoanThu: React.FC = () => {
  const [filterType, setFilterType] = useState('feeType');
  const [selectedTimeRange, setSelectedTimeRange] = useState('7days');

  // Chart data and options
  let chartData: any = {};
  let chartOptions: any = {};
  let chartComponent: React.ReactNode = null;

  if (filterType === 'feeType') {
    chartData = {
      labels: sampleFeeStats.feeType.map(item => item.label),
      datasets: [{
        label: 'Tổng thu (triệu VND)',
        data: sampleFeeStats.feeType.map(item => item.value),
        backgroundColor: ['#8BC34A', '#FFEB3B', '#E91E63', '#2196F3'],
        borderColor: '#fff',
        borderWidth: 1,
      }],
    };
    chartOptions = {
      responsive: true,
      plugins: {
        legend: { display: false },
        datalabels: {
          color: '#222',
          font: { weight: 'bold' as const, size: 16 },
          formatter: (value: number) => value,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Triệu VND' },
        },
      },
    };
    chartComponent = <Bar data={chartData} options={chartOptions} plugins={[ChartDataLabels]} />;
  } else if (filterType === 'period') {
    chartData = {
      labels: sampleFeeStats.period.map(item => item.label),
      datasets: [{
        label: 'Tỷ lệ (%)',
        data: sampleFeeStats.period.map(item => item.value),
        backgroundColor: ['#2196F3', '#E0E0E0'],
        borderColor: '#fff',
        borderWidth: 2,
      }],
    };
    chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        datalabels: {
          color: '#222',
          font: { weight: 'bold' as const, size: 16 },
          formatter: (value: number, context: any) => {
            const total = context.chart.data.datasets[0].data.reduce((sum: number, current: number) => sum + current, 0);
            const percentage = ((value / total) * 100).toFixed(0) + '%';
            return percentage;
          },
        },
      },
    };
    chartComponent = <Pie data={chartData} options={chartOptions} plugins={[ChartDataLabels]} />;
  } else if (filterType === 'status') {
    chartData = {
      labels: sampleFeeStats.status.map(item => item.label),
      datasets: [{
        label: 'Số hộ',
        data: sampleFeeStats.status.map(item => item.value),
        backgroundColor: ['#4CAF50', '#F44336'],
        borderColor: '#fff',
        borderWidth: 2,
      }],
    };
    chartOptions = {
      responsive: true,
      plugins: {
        legend: { display: false },
        datalabels: {
          color: '#222',
          font: { weight: 'bold' as const, size: 16 },
          formatter: (value: number, context: any) => {
            const total = context.chart.data.datasets[0].data.reduce((sum: number, current: number) => sum + current, 0);
            const percentage = ((value / total) * 100).toFixed(0) + '%';
            return percentage;
          },
        },
      },
    };
    chartComponent = <Pie data={chartData} options={chartOptions} plugins={[ChartDataLabels]} />;
  } else if (filterType === 'time') {
    const labels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    chartData = {
      labels,
      datasets: [{
        label: 'Doanh thu (triệu VND)',
        data: sampleFeeStats.time,
        borderColor: '#1976D2',
        backgroundColor: '#90CAF9',
        tension: 0.3,
        pointRadius: 5,
        pointBackgroundColor: '#1976D2',
        fill: true,
      }],
    };
    chartOptions = {
      responsive: true,
      plugins: {
        legend: { display: false },
        datalabels: {
          color: '#222',
          font: { weight: 'bold' as const, size: 14 },
          align: 'end' as const,
          anchor: 'end' as const,
          offset: 4,
          formatter: (value: number) => value,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Triệu VND' },
        },
      },
    };
    chartComponent = <Line data={chartData} options={chartOptions} plugins={[ChartDataLabels]} />;
  }

  // Table data
  const processedHouseholds = sampleHouseholds.map((row, idx) => ({
    ...row,
    stt: idx + 1,
    tongPhiTrieu: (row.tongPhi / 1000000).toFixed(2),
    daDongTrieu: (row.daDong / 1000000).toFixed(2),
  }));

  const exportToExcel = () => {
    const exportData = processedHouseholds.length > 0 ? processedHouseholds : [
      { stt: '', tenHo: 'Không có dữ liệu', soNha: '', tongPhiTrieu: '', daDongTrieu: '', trangThai: '' }
    ];
    const ws = XLSX.utils.json_to_sheet(exportData.map(row => ({
      'STT': row.stt,
      'Chủ hộ': row.tenHo,
      'Số nhà': row.soNha,
      'Tổng phí (triệu VND)': row.tongPhiTrieu,
      'Đã đóng (triệu VND)': row.daDongTrieu,
      'Trạng thái': row.trangThai,
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Khoản thu');
    XLSX.writeFile(wb, 'thong_ke_khoan_thu.xlsx');
  };

  return (
    <Layout role="ketoan">
      <div className="p-4 flex flex-col gap-6">
        {/* Page Title and Welcome Text */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">THỐNG KÊ KHOẢN THU</h1>
          <p className="text-gray-600 text-sm mt-1">Thống kê dữ liệu thu phí thực tế từ hệ thống</p>
        </div>

        {/* Filter Area */}
        <div className="flex flex-wrap items-center gap-4">
          <label className="font-semibold text-gray-700">Thống kê theo:</label>
          <select
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
          >
            {FILTERS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
          {filterType === 'time' && (
            <div className="flex gap-2 items-center">
              <button
                className={`px-4 py-1 text-sm rounded-full ${selectedTimeRange === '7days' ? 'bg-blue-500 text-white' : 'border border-gray-300 text-gray-700'}`}
                onClick={() => setSelectedTimeRange('7days')}
              >
                7 ngày
              </button>
              <button
                className={`px-4 py-1 text-sm rounded-full ${selectedTimeRange === '30days' ? 'bg-blue-500 text-white' : 'border border-gray-300 text-gray-700'}`}
                onClick={() => setSelectedTimeRange('30days')}
              >
                30 ngày
              </button>
              <button
                className={`px-4 py-1 text-sm rounded-full ${selectedTimeRange === '90days' ? 'bg-blue-500 text-white' : 'border border-gray-300 text-gray-700'}`}
                onClick={() => setSelectedTimeRange('90days')}
              >
                90 ngày
              </button>
            </div>
          )}
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-md shadow-md border border-gray-200 p-6 flex flex-col items-center">
          <div className="w-full h-80 flex items-center justify-center">
            {chartComponent}
          </div>
        </div>

        {/* Household Fee Table */}
        <div className="mt-6 bg-white rounded-md shadow-md overflow-hidden border border-gray-200">
          <div className="p-4 bg-gray-100 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Danh sách hộ gia đình ({processedHouseholds.length} hộ)
            </h2>
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-600 transition" 
              onClick={exportToExcel}
            >
              Xuất báo cáo
            </button>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">STT</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Chủ hộ</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Số nhà</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Tổng phí (triệu VND)</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Đã đóng (triệu VND)</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {processedHouseholds.length > 0 ? (
                processedHouseholds.slice(0, 10).map((row, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{row.stt}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.tenHo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.soNha}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.tongPhiTrieu}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.daDongTrieu}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.trangThai}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Chưa có dữ liệu hộ gia đình
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {processedHouseholds.length > 10 && (
            <div className="px-6 py-3 bg-gray-50 text-sm text-gray-500 text-center">
              Hiển thị 10/{processedHouseholds.length} kết quả đầu tiên
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ThongKeKhoanThu;