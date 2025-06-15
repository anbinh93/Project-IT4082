import React, { useState, useEffect } from "react";
import Layout from '../components/Layout';
import { residentAPI } from '../services/api';

const CHANGE_TYPES = [
  { label: 'Tất cả', value: '' },
  { label: 'Thêm vào hộ', value: '1' },
  { label: 'Xóa khỏi hộ', value: '2' },
  { label: 'Cập nhật thông tin', value: '3' },
  { label: 'Tạm vắng', value: '4' },
  { label: 'Tạm trú', value: '5' },
];

interface ChangeHistoryItem {
  id: number;
  tenNhanKhau: string;
  cccd: string;
  soHoKhau: string;
  diaChi: string;
  loaiThayDoi: string;
  loaiThayDoiCode: number;
  thoiGian: string;
  chiTiet: string;
}

const LichSuThayDoiNhanKhau: React.FC = () => {
  const [dateFrom, setDateFrom] = useState('2025-06-11');
  const [dateTo, setDateTo] = useState('2025-06-11');
  const [changeType, setChangeType] = useState('');
  const [sortBy, setSortBy] = useState<'tenNhanKhau'|'soHoKhau'|'loaiThayDoi'|'thoiGian'>('thoiGian');
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ChangeHistoryItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [historyData, setHistoryData] = useState<ChangeHistoryItem[]>([]);

  const fetchHistoryData = async () => {
    try {
      setLoading(true);
      
      const response = await residentAPI.getHouseholdChangeHistory({
        fromDate: dateFrom,
        toDate: dateTo,
        changeType: changeType ? parseInt(changeType) : undefined,
        limit: 100
      });

      if (response.success) {
        setHistoryData(response.data.history);
      } else {
        console.error('API returned error:', response);
        setHistoryData([]);
      }
    } catch (error) {
      console.error('Error fetching history data:', error);
      setHistoryData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoryData();
  }, [dateFrom, dateTo, changeType]);

  // Lọc và sắp xếp dữ liệu
  const filtered = historyData.filter((row: ChangeHistoryItem) => {
    // Skip date filtering since we're already filtering by date in the API call
    const inType = !changeType || row.loaiThayDoiCode.toString() === changeType;
    return inType;
  });
  
  const sorted = [...filtered].sort((a: ChangeHistoryItem, b: ChangeHistoryItem) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    if (aValue < bValue) return sortAsc ? -1 : 1;
    if (aValue > bValue) return sortAsc ? 1 : -1;
    return 0;
  });

  return (
    <Layout role="totruong">
      <div className="p-4 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">LỊCH SỬ THAY ĐỔI HỘ KHẨU</h1>
          <p className="text-gray-600 text-sm mt-1">Chào mừng đến với Hệ thống Quản lý Thu phí Chung cư</p>
        </div>
        {/* Bộ lọc */}
        <div className="flex flex-wrap items-center gap-4">
          <label className="font-semibold text-gray-700">Khoảng thời gian:</label>
          <input type="date" className="border border-gray-300 rounded-md px-2 py-1 text-sm" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          <span>-</span>
          <input type="date" className="border border-gray-300 rounded-md px-2 py-1 text-sm" value={dateTo} onChange={e => setDateTo(e.target.value)} />
          <label className="font-semibold text-gray-700 ml-4">Loại thay đổi:</label>
          <select className="border border-gray-300 rounded-md px-3 py-2 text-sm" value={changeType} onChange={e => setChangeType(e.target.value)}>
            {CHANGE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <button 
            onClick={fetchHistoryData}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
            disabled={loading}
          >
            {loading ? 'Đang tải...' : 'Làm mới'}
          </button>
        </div>
        {/* Bảng lịch sử */}
        <div className="mt-6 bg-white rounded-md shadow-md overflow-hidden border border-gray-200">
          <div className="p-4 bg-gray-100 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Danh sách lịch sử thay đổi hộ khẩu</h2>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider cursor-pointer" onClick={() => {setSortBy('tenNhanKhau');setSortAsc(s => !s);}}>Tên nhân khẩu</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider cursor-pointer" onClick={() => {setSortBy('soHoKhau');setSortAsc(s => !s);}}>Số hộ khẩu</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider cursor-pointer" onClick={() => {setSortBy('loaiThayDoi');setSortAsc(s => !s);}}>Loại thay đổi</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider cursor-pointer" onClick={() => {setSortBy('thoiGian');setSortAsc(s => !s);}}>Thời gian</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : sorted.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    Không có dữ liệu lịch sử thay đổi
                  </td>
                </tr>
              ) : (
                sorted.map((row, idx) => (
                  <tr key={idx} className="hover:bg-blue-50 cursor-pointer" onClick={() => setSelectedRow(row)}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{row.tenNhanKhau}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.soHoKhau}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.loaiThayDoi}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.thoiGian}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Popup chi tiết */}
        {selectedRow && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] max-w-[90vw]">
              <h3 className="text-lg font-bold mb-2">Chi tiết thay đổi</h3>
              <div className="mb-2"><b>Tên nhân khẩu:</b> {selectedRow.tenNhanKhau}</div>
              <div className="mb-2"><b>CCCD:</b> {selectedRow.cccd}</div>
              <div className="mb-2"><b>Số hộ khẩu:</b> {selectedRow.soHoKhau}</div>
              <div className="mb-2"><b>Địa chỉ:</b> {selectedRow.diaChi}</div>
              <div className="mb-2"><b>Loại thay đổi:</b> {selectedRow.loaiThayDoi}</div>
              <div className="mb-2"><b>Thời gian:</b> {selectedRow.thoiGian}</div>
              <div className="mb-2"><b>Nội dung chi tiết:</b> {selectedRow.chiTiet}</div>
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => setSelectedRow(null)}>Đóng</button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LichSuThayDoiNhanKhau;