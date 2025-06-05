import React, { useState } from "react";
import Layout from '../components/Layout';

const CHANGE_TYPES = [
  { label: 'Tất cả', value: '' },
  { label: 'Thêm vào hộ', value: 'them' },
  { label: 'Xóa khỏi hộ', value: 'xoa' },
  { label: 'Cập nhật thông tin', value: 'capnhat' },
  { label: 'Tạm vắng', value: 'tamvang' },
];

const sampleData = [
  { ten: 'Nguyễn Văn An', cccd: '1234567890123456', soHoKhau: 'HK123456', loai: 'Cập nhật thông tin', thoiGian: '2025-05-01 09:15', chiTiet: '[Nội dung chi tiết thay đổi]' },
  { ten: 'Trần Thị Bình', cccd: '1234567890123457', soHoKhau: 'HK654321', loai: 'Tạm vắng', thoiGian: '2025-05-12 15:30', chiTiet: 'Xin tạm vắng để về quê chăm người thân' },
  { ten: 'Lê Minh Công', cccd: '1234567890123458', soHoKhau: 'HK123456', loai: 'Thêm vào hộ', thoiGian: '2025-05-24 11:10', chiTiet: '[Nội dung chi tiết thay đổi]' },
  { ten: 'Phạm Thị Hoa', cccd: '1234567890123459', soHoKhau: 'HK789012', loai: 'Xóa khỏi hộ', thoiGian: '2025-05-28 14:20', chiTiet: 'Chuyển hộ khẩu sang địa chỉ mới' },
];

const LichSuThayDoiNhanKhau: React.FC = () => {
  const [dateFrom, setDateFrom] = useState('2025-05-01');
  const [dateTo, setDateTo] = useState('2025-05-31');
  const [changeType, setChangeType] = useState('');
  const [sortBy, setSortBy] = useState<'ten'|'soHoKhau'|'loai'|'thoiGian'>('thoiGian');
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  // Lọc và sắp xếp dữ liệu
  const filtered = sampleData.filter(row => {
    const inDate = (!dateFrom || row.thoiGian >= dateFrom) && (!dateTo || row.thoiGian <= dateTo);
    const inType = !changeType || row.loai.toLowerCase().includes(changeType);
    return inDate && inType;
  });
  const sorted = [...filtered].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return sortAsc ? -1 : 1;
    if (a[sortBy] > b[sortBy]) return sortAsc ? 1 : -1;
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
        </div>
        {/* Bảng lịch sử */}
        <div className="mt-6 bg-white rounded-md shadow-md overflow-hidden border border-gray-200">
          <div className="p-4 bg-gray-100 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Danh sách lịch sử thay đổi hộ khẩu</h2>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider cursor-pointer" onClick={() => {setSortBy('ten');setSortAsc(s => !s);}}>Tên nhân khẩu</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider cursor-pointer" onClick={() => {setSortBy('soHoKhau');setSortAsc(s => !s);}}>Số hộ khẩu</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider cursor-pointer" onClick={() => {setSortBy('loai');setSortAsc(s => !s);}}>Loại thay đổi</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider cursor-pointer" onClick={() => {setSortBy('thoiGian');setSortAsc(s => !s);}}>Thời gian</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sorted.map((row, idx) => (
                <tr key={idx} className="hover:bg-blue-50 cursor-pointer" onClick={() => setSelectedRow(row)}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{row.ten}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.soHoKhau}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.loai}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.thoiGian}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Popup chi tiết */}
        {selectedRow && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] max-w-[90vw]">
              <h3 className="text-lg font-bold mb-2">Chi tiết thay đổi</h3>
              <div className="mb-2"><b>Tên nhân khẩu:</b> {selectedRow.ten}</div>
              <div className="mb-2"><b>Số hộ khẩu:</b> {selectedRow.soHoKhau}</div>
              <div className="mb-2"><b>Loại thay đổi:</b> {selectedRow.loai}</div>
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