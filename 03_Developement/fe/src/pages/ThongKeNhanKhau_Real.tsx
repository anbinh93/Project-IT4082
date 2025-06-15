import React, { useState, useEffect } from "react";
import Layout from '../components/Layout';
import { apiRequest } from '../services/api';
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
import { Bar, Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import * as XLSX from 'xlsx';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend, ChartDataLabels);

const FILTERS = [
  { label: 'Giới tính', value: 'gender' },
  { label: 'Độ tuổi', value: 'age' },
  { label: 'Khoảng thời gian', value: 'time' },
  { label: 'Trạng thái tạm trú', value: 'status' },
];

const ThongKeNhanKhau: React.FC = () => {
  const [filterType, setFilterType] = useState('gender');
  const [dateFrom, setDateFrom] = useState('2024-05-01');
  const [dateTo, setDateTo] = useState('2024-05-31');
  
  // State for real data from API
  const [genderStats, setGenderStats] = useState<any>(null);
  const [ageStats, setAgeStats] = useState<any>(null);
  const [temporaryStats, setTemporaryStats] = useState<any>(null);
  const [residentsList, setResidentsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchPopulationData = async () => {
      try {
        setLoading(true);
        console.log('🔄 Fetching population data for filter:', filterType);
        
        // Fetch different statistics based on filter type
        let promises = [];
        
        switch (filterType) {
          case 'gender':
            promises = [
              apiRequest('/population/gender'),
              apiRequest('/residents')
            ];
            break;
          case 'age':
            promises = [
              apiRequest('/population/age'),
              apiRequest('/residents')
            ];
            break;
          case 'status':
            promises = [
              apiRequest('/population/temporary-status'),
              apiRequest('/residents')
            ];
            break;
          case 'time':
            promises = [
              apiRequest('/population/overview'),
              apiRequest('/residents')
            ];
            break;
          default:
            promises = [
              apiRequest('/population/gender'),
              apiRequest('/residents')
            ];
        }

        const [statsData, residentsData] = await Promise.all(promises);
        
        console.log('📊 Stats data received:', statsData);
        console.log('👥 Residents data received:', residentsData);
        
        // Update state based on filter type
        if (filterType === 'gender') {
          setGenderStats(statsData);
        } else if (filterType === 'age') {
          setAgeStats(statsData);
        } else if (filterType === 'status') {
          setTemporaryStats(statsData);
        }
        
        setResidentsList(residentsData.data?.residents || []);
        setError(null);
      } catch (error: any) {
        console.error('❌ Error fetching population data:', error);
        setError('Lỗi khi tải dữ liệu thống kê nhân khẩu: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPopulationData();
  }, [filterType, dateFrom, dateTo]);

  // Generate chart data based on API response
  const getChartData = () => {
    if (loading) {
      return {
        chart: <div className="text-center">Đang tải dữ liệu...</div>,
        legend: null
      };
    }

    if (error) {
      return {
        chart: <div className="text-center text-red-500">{error}</div>,
        legend: null
      };
    }

    if (filterType === 'gender' && genderStats?.statistics) {
      const data = genderStats.statistics.chartData || [];
      
      const chartData = {
        labels: data.map((item: any) => item.label),
        datasets: [{
          label: 'Số lượng',
          data: data.map((item: any) => item.value),
          backgroundColor: ['#2196F3', '#F6A6F6'],
          borderColor: ['#2196F3', '#F6A6F6'],
          borderWidth: 2,
        }],
      };

      const chartOptions = {
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

      return {
        chart: <Pie data={chartData} options={chartOptions} plugins={[ChartDataLabels]} />,
        legend: (
          <div className="flex gap-6 justify-center mt-4">
            {data.map((item: any, index: number) => (
              <p key={index} className="flex items-center">
                <span 
                  className="inline-block w-4 h-4 rounded-full mr-2" 
                  style={{ backgroundColor: index === 0 ? '#2196F3' : '#F6A6F6' }}
                ></span>
                {item.label}: {item.value} ({item.percentage}%)
              </p>
            ))}
          </div>
        )
      };
    }

    if (filterType === 'age' && ageStats?.statistics) {
      const data = ageStats.statistics.byAgeGroup || [];
      
      const chartData = {
        labels: data.map((item: any) => item.ageGroup),
        datasets: [{
          label: 'Số lượng',
          data: data.map((item: any) => item.count),
          backgroundColor: ['#B6E36C', '#F6F36C', '#F6A6F6', '#7CC6F6'],
          borderColor: '#1976D2',
          borderWidth: 1,
          borderRadius: 4,
        }],
      };

      const maxY = Math.max(...data.map((item: any) => item.count)) + 100;
      const chartOptions = {
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
        },
        scales: {
          y: {
            beginAtZero: true,
            max: maxY,
            ticks: { stepSize: Math.ceil(maxY / 10) },
          },
        },
      };

      return {
        chart: <Bar data={chartData} options={chartOptions} plugins={[ChartDataLabels]} />,
        legend: (
          <div className="flex flex-wrap gap-4 justify-center mt-4">
            {data.map((item: any, index: number) => (
              <p key={index}>
                <span 
                  className="inline-block w-3 h-3 mr-2" 
                  style={{ backgroundColor: ['#B6E36C', '#F6F36C', '#F6A6F6', '#7CC6F6'][index] }}
                ></span>
                {item.ageGroup}: {item.count}
              </p>
            ))}
          </div>
        )
      };
    }

    if (filterType === 'status' && temporaryStats?.statistics) {
      const chartData = temporaryStats.statistics.chartData || [];
      
      const pieData = {
        labels: chartData.map((item: any) => item.label),
        datasets: [{
          label: 'Số lượng',
          data: chartData.map((item: any) => item.value),
          backgroundColor: ['#2196F3', '#F6A6F6', '#B6E36C'],
          borderColor: ['#2196F3', '#F6A6F6', '#B6E36C'],
          borderWidth: 2,
        }],
      };

      return {
        chart: <Pie data={pieData} options={{
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
        }} plugins={[ChartDataLabels]} />,
        legend: (
          <div className="flex gap-6 justify-center mt-4">
            {chartData.map((item: any, index: number) => (
              <p key={index} className="flex items-center">
                <span 
                  className="inline-block w-4 h-4 rounded-full mr-2" 
                  style={{ backgroundColor: ['#2196F3', '#F6A6F6', '#B6E36C'][index] }}
                ></span>
                {item.label}: {item.value} ({item.percentage}%)
              </p>
            ))}
          </div>
        )
      };
    }

    // Default fallback for time or no data
    return {
      chart: <div className="text-center text-gray-500">Chọn loại thống kê để xem dữ liệu</div>,
      legend: null
    };
  };

  const { chart, legend } = getChartData();

  // Process residents list for table
  const processedResidents = residentsList.map((resident, index) => ({
    id: resident.id,
    ten: resident.hoTen || 'N/A',
    gioiTinh: resident.gioiTinh || 'N/A',
    tuoi: resident.ngaySinh ? new Date().getFullYear() - new Date(resident.ngaySinh).getFullYear() : 'N/A',
    trangThai: 'Thường trú', // Default status, could be enhanced
    hoKhau: `HK${String(index + 1).padStart(3, '0')}`, // Generate household code
  }));

  const exportToExcel = () => {
    const exportData = processedResidents.length > 0 ? processedResidents : [
      { ten: 'Không có dữ liệu', gioiTinh: '', tuoi: '', trangThai: '', hoKhau: '' }
    ];
    
    const ws = XLSX.utils.json_to_sheet(exportData.map(row => ({
      'Họ tên': row.ten,
      'Giới tính': row.gioiTinh,
      'Tuổi': row.tuoi,
      'Trạng thái': row.trangThai,
      'Hộ khẩu': row.hoKhau,
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Nhân khẩu');
    XLSX.writeFile(wb, 'thong_ke_nhan_khau.xlsx');
  };

  return (
    <Layout role="totruong">
      <div className="p-4 flex flex-col gap-6">
        {/* Page Title and Welcome Text */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">THỐNG KÊ NHÂN KHẨU</h1>
          <p className="text-gray-600 text-sm mt-1">Thống kê dữ liệu nhân khẩu thực tế từ hệ thống</p>
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
              <input 
                type="date" 
                className="border border-gray-300 rounded-md px-2 py-1 text-sm" 
                value={dateFrom} 
                onChange={e => setDateFrom(e.target.value)} 
              />
              <span>-</span>
              <input 
                type="date" 
                className="border border-gray-300 rounded-md px-2 py-1 text-sm" 
                value={dateTo} 
                onChange={e => setDateTo(e.target.value)} 
              />
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
            <h2 className="text-lg font-semibold text-gray-800">
              Danh sách nhân khẩu ({processedResidents.length} người)
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
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Họ tên</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Giới tính</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Tuổi</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Hộ khẩu</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : processedResidents.length > 0 ? (
                processedResidents.slice(0, 10).map((row, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{row.ten}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.gioiTinh}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.tuoi}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.trangThai}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.hoKhau}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Chưa có dữ liệu nhân khẩu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {processedResidents.length > 10 && (
            <div className="px-6 py-3 bg-gray-50 text-sm text-gray-500 text-center">
              Hiển thị 10/{processedResidents.length} kết quả đầu tiên
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ThongKeNhanKhau;
