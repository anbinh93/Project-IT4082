import React, { useState } from "react";
import Layout from '../components/Layout'; // Import Layout component
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
  { label: 'Giới tính', value: 'gender' },
  { label: 'Độ tuổi', value: 'age' },
  { label: 'Khoảng thời gian', value: 'time' },
  { label: 'Trạng thái tạm trú', value: 'status' },
];
// Dữ liệu mẫu giống Figma
const ageBarData = {
  labels: ['<20', '20-30', '30-60', '>60'],
  datasets: [
    {
      label: 'Số lượng',
      data: [400, 600, 700, 300],
      backgroundColor: [
        '#B6E36C', // <20
        '#F6F36C', // 20-30
        '#F6A6F6', // 30-60
        '#7CC6F6', // >60
      ],
      borderColor: '#1976D2',
      borderWidth: 1,
      borderRadius: 4,
    },
  ],
};
const maxY = Math.max(...ageBarData.datasets[0].data) + 100;
const ageBarOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    datalabels: {
      anchor: 'end' as const,
      align: 'top' as const,
      clamp: true,
      color: '#222',
      font: { weight: 'bold' as const, size: 16 },
      formatter: (value: number) => value,
    },
    title: { display: false },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: maxY,
      ticks: { stepSize: 100 },
      title: { display: false },
    },
    x: { title: { display: false } },
  },
};

const genderPieData = {
  labels: ['Nam', 'Nữ'],
  datasets: [
    {
      label: 'Tỷ lệ',
      data: [70, 30],
      backgroundColor: [
        '#2196F3', // Nam
        '#ffffff', // Nữ
      ],
      borderColor: [
        '#2196F3',
        '#cccccc',
      ],
      borderWidth: 2,
    },
  ],
};
const genderPieOptions = {
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

const timeLineData = {
  labels: ['01/05', '05/05', '10/05', '15/05', '20/05', '25/05', '31/05'],
  datasets: [
    {
      label: 'Số lượng nhân khẩu',
      data: [1200, 1250, 1300, 1280, 1350, 1370, 1400],
      borderColor: '#2196F3',
      backgroundColor: 'rgba(33,150,243,0.1)',
      tension: 0.3,
      pointRadius: 5,
      pointBackgroundColor: '#2196F3',
      fill: true,
    },
  ],
};
const timeLineOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    datalabels: { display: false },
  },
  scales: {
    y: { beginAtZero: true, title: { display: false } },
    x: { title: { display: false } },
  },
};

const statusPieData = {
  labels: ['Tạm trú', 'Tạm vắng', 'Thường trú'],
  datasets: [
    {
      label: 'Tỷ lệ',
      data: [15, 10, 75],
      backgroundColor: ['#2196F3', '#F6A6F6', '#B6E36C'],
      borderColor: ['#2196F3', '#F6A6F6', '#B6E36C'],
      borderWidth: 2,
    },
  ],
};
const statusPieOptions = genderPieOptions;

const sampleTable = [
  { ten: 'Nguyễn Văn An', gioiTinh: 'Nam', tuoi: 30, trangThai: 'Thường trú', hoKhau: 'HK001' },
  { ten: 'Trần Thị Bình', gioiTinh: 'Nữ', tuoi: 37, trangThai: 'Tạm trú', hoKhau: 'HK002' },
  { ten: 'Lê Minh Công', gioiTinh: 'Nam', tuoi: 24, trangThai: 'Tạm vắng', hoKhau: 'HK003' },
];

function exportToExcel() {
  const ws = XLSX.utils.json_to_sheet(sampleTable.map(row => ({
    'Họ tên': row.ten,
    'Giới tính': row.gioiTinh,
    'Tuổi': row.tuoi,
    'Trạng thái': row.trangThai,
    'Hộ khẩu': row.hoKhau,
  })));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Nhân khẩu');
  XLSX.writeFile(wb, 'thong_ke_nhan_khau.xlsx');
}

const ThongKeNhanKhau: React.FC = () => {
  const [filterType, setFilterType] = useState('gender');
  const [status, setStatus] = useState('tamtru');
  const [dateFrom, setDateFrom] = useState('2024-05-01');
  const [dateTo, setDateTo] = useState('2024-05-31');

  let chart, legend;
  if (filterType === 'gender') {
    chart = <Pie data={genderPieData} options={genderPieOptions} plugins={[ChartDataLabels]} />;
    legend = (
      <div className="flex gap-6 justify-center mt-4">
        <p className="flex items-center"><span className="inline-block w-4 h-4 bg-blue-500 rounded-full mr-2"></span> Nam</p>
        <p className="flex items-center"><span className="inline-block w-4 h-4 bg-white border border-gray-400 rounded-full mr-2"></span> Nữ</p>
      </div>
    );
  } else if (filterType === 'age') {
    chart = <Bar data={ageBarData} options={ageBarOptions} plugins={[ChartDataLabels]} />;
    legend = (
      <div className="flex flex-wrap gap-4 justify-center mt-4">
        <p><span className="inline-block w-3 h-3" style={{background:'#B6E36C', marginRight:6}}></span> &lt;20</p>
        <p><span className="inline-block w-3 h-3" style={{background:'#F6F36C', marginRight:6}}></span> 20-30</p>
        <p><span className="inline-block w-3 h-3" style={{background:'#F6A6F6', marginRight:6}}></span> 30-60</p>
        <p><span className="inline-block w-3 h-3" style={{background:'#7CC6F6', marginRight:6}}></span> &gt;60</p>
      </div>
    );
  } else if (filterType === 'time') {
    chart = <Line data={timeLineData} options={timeLineOptions} plugins={[ChartDataLabels]} />;
    legend = null;
  } else if (filterType === 'status') {
    chart = <Pie data={statusPieData} options={statusPieOptions} plugins={[ChartDataLabels]} />;
    legend = (
      <div className="flex gap-6 justify-center mt-4">
        <p className="flex items-center"><span className="inline-block w-4 h-4 bg-blue-500 rounded-full mr-2"></span> Tạm trú</p>
        <p className="flex items-center"><span className="inline-block w-4 h-4 bg-pink-300 rounded-full mr-2"></span> Tạm vắng</p>
        <p className="flex items-center"><span className="inline-block w-4 h-4 bg-lime-300 rounded-full mr-2"></span> Thường trú</p>
      </div>
    );
  }

  return (
  <Layout role="totruong"> {/* Wrap with Layout - Assuming this is for totruong role */} 
    <div className="p-4 flex flex-col gap-6">
      {/* Page Title and Welcome Text */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">THỐNG KÊ NHÂN KHẨU</h1>
        <p className="text-gray-600 text-sm mt-1">Chào mừng đến với Hệ thống Quản lý Thu phí Chung cư</p>
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
            <>
              <input type="date" className="border border-gray-300 rounded-md px-2 py-1 text-sm" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
              <span>-</span>
              <input type="date" className="border border-gray-300 rounded-md px-2 py-1 text-sm" value={dateTo} onChange={e => setDateTo(e.target.value)} />
            </>
          )}
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-md shadow-md border border-gray-200 p-6 flex flex-col items-center">
          <div className="w-full h-80 flex items-center justify-center">
            {chart}
          </div>
          {legend}
      </div>

      {/* Resident List Table */}
      <div className="mt-6 bg-white rounded-md shadow-md overflow-hidden border border-gray-200">
          <div className="p-4 bg-gray-100 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Danh sách nhân khẩu</h2>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-600 transition" onClick={exportToExcel}>Xuất báo cáo</button>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Họ tên</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Giới tính</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Tuổi</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Hộ khẩu</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
              {sampleTable.map((row, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{row.ten}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.gioiTinh}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.tuoi}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.trangThai}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.hoKhau}</td>
            </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  </Layout>
);
};

export default ThongKeNhanKhau; 