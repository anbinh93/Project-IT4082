import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { populationAPI } from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, ChartDataLabels);

const HomepageToTruong: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [totalResidents, setTotalResidents] = useState(0);
  const [temporaryResidents, setTemporaryResidents] = useState(0);
  const [ageData, setAgeData] = useState({
    labels: ['0-10', '10-20', '20-30', '30-40', '40-50', '50-60', '> 60'],
    datasets: [{
      label: 'Số lượng',
      data: [0, 0, 0, 0, 0, 0, 0],
      backgroundColor: '#77A1EA',
      borderColor: '#1976D2',
      borderWidth: 1,
      borderRadius: 4,
    }]
  });
  const [genderData, setGenderData] = useState({
    labels: ['Nam', 'Nữ'],
    datasets: [{
      label: 'Tỷ lệ',
      data: [50, 50],
      backgroundColor: ['#2196F3', '#ffffff'],
      borderColor: ['#2196F3', '#cccccc'],
      borderWidth: 2,
    }]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch population statistics
        const [genderStats, ageStats, totalStats, temporaryStats] = await Promise.all([
          populationAPI.getGenderStatistics(),
          populationAPI.getAgeStatistics(),
          populationAPI.getTotalResidents(),
          populationAPI.getTemporaryStatusStatistics()
        ]);

        // Update total residents
        if (totalStats.success) {
          setTotalResidents(totalStats.data.pagination?.totalItems || 0);
        }

        // Update temporary residents/absence count
        if (temporaryStats.statistics) {
          const temporaryStatus = temporaryStats.statistics.temporaryStatus;
          setTemporaryResidents(temporaryStatus.total || 0);
        }

        // Update gender statistics
        if (genderStats.statistics) {
          const maleData = genderStats.statistics.byGender.find((g: any) => g.gender.toLowerCase().includes('nam'));
          const femaleData = genderStats.statistics.byGender.find((g: any) => g.gender.toLowerCase().includes('nữ'));
          
          setGenderData({
            labels: ['Nam', 'Nữ'],
            datasets: [{
              label: 'Tỷ lệ',
              data: [maleData?.percentage || 0, femaleData?.percentage || 0],
              backgroundColor: ['#2196F3', '#ffffff'],
              borderColor: ['#2196F3', '#cccccc'],
              borderWidth: 2,
            }]
          });
        }

        // Update age statistics  
        if (ageStats.statistics) {
          const ageGroups = ageStats.statistics.byAgeGroup;
          const labels = ageGroups.map((group: any) => {
            if (group.maxAge >= 150) return `${group.minAge}+`;
            return `${group.minAge}-${group.maxAge}`;
          });
          const data = ageGroups.map((group: any) => group.count);
          
          setAgeData({
            labels,
            datasets: [{
              label: 'Số lượng',
              data,
              backgroundColor: '#77A1EA',
              borderColor: '#1976D2',
              borderWidth: 1,
              borderRadius: 4,
            }]
          });
        }

      } catch (error) {
        console.error('Error fetching homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const maxY = Math.max(...ageData.datasets[0].data) + 100;

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
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: maxY,
        ticks: { stepSize: 100 },
        title: { display: false },
      },
      x: {
        title: { display: false },
      },
    },
  };

  const genderPieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
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

  if (loading) {
    return (
      <Layout role="totruong">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">TRANG CHỦ</h1>
            <p className="text-base text-gray-600 mt-2">Đang tải dữ liệu...</p>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Đang tải thống kê...</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
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
            <span className="text-5xl font-bold text-blue-600">{totalResidents.toLocaleString()}</span>
            <span className="text-xl text-gray-700">nhân khẩu</span>
          </div>
        </div>

        {/* Đang tạm trú/tạm vắng */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-700">Đang tạm trú/tạm vắng</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-blue-600">{temporaryResidents}</span>
            <span className="text-xl text-gray-700">nhân khẩu</span>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Phân phối nhân khẩu theo độ tuổi */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 flex flex-col gap-10">
          <h2 className="text-xl font-semibold text-gray-700">Phân phối nhân khẩu theo độ tuổi</h2>
          <div className="w-full h-64">
            <Bar data={ageData} options={ageBarOptions} plugins={[ChartDataLabels]} />
          </div>
        </div>

        {/* Tỷ lệ nam/nữ */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-700">Tỷ lệ (%) nam/nữ trong toàn khu chung cư</h2>
          <div className="w-full h-64 flex items-center justify-center">
            <Pie data={genderData} options={genderPieOptions} plugins={[ChartDataLabels]} />
          </div>
          <div className="flex gap-4 justify-center mt-2">
            <div className="flex items-center gap-1">
              <span className="w-4 h-4 bg-blue-500 rounded-full inline-block"></span>
              <span className="text-sm text-gray-700">Nam</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-4 h-4 bg-white border border-gray-400 rounded-full inline-block"></span>
              <span className="text-sm text-gray-700">Nữ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
  );
};

export default HomepageToTruong; 