import React, { useState } from "react";
import Layout from '../components/Layout'; // Import Layout component
import EditHoKhauPopup from '../components/EditHoKhauPopup'; // Import the popup component
import AddMemberPopup from '../components/AddMemberPopup';

const QuanLyHoKhau: React.FC = () => {
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false); // State to manage popup visibility
  const [isAddMemberPopupOpen, setIsAddMemberPopupOpen] = useState(false);
  const [selectedHoKhau, setSelectedHoKhau] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'soHoKhau' | 'chuHo' | 'soNha' | 'duong' | 'phuong' | 'quan' | 'thanhPho' | 'ngayLamHoKhau'>('soHoKhau');
  const [sortAsc, setSortAsc] = useState(true);

  const openEditPopup = (hoKhau: any = undefined) => {
    setSelectedHoKhau(hoKhau);
    setIsEditPopupOpen(true);
  };

  const closeEditPopup = () => {
    setIsEditPopupOpen(false);
    setSelectedHoKhau(null);
  };

  const handleAddMember = (member: any) => {
    // TODO: Handle adding member to household
    console.log('Adding member:', member);
  };

  const handleAssignChuHo = (rowData: any) => {
    // TODO: Handle assigning a new head of household
    console.log('Assigning new head of household:', rowData);
  };

  // Sample data
  const households = [
    { soHoKhau: 'HK001', chuHo: 'Nguyễn Văn An', soNha: '12B/3', duong: 'Phường 1', phuong: 'Phường 1', quan: 'Quận 1', thanhPho: 'Thành phố Hồ Chí Minh', ngayLamHoKhau: '2020-03-15', danhSachThanhVien: [] },
    { soHoKhau: 'HK002', chuHo: 'Trần Thị Bình', soNha: '45/6', duong: 'Phường 5', phuong: 'Phường 5', quan: 'Quận 5', thanhPho: 'Thành phố Hồ Chí Minh', ngayLamHoKhau: '2021-07-22', danhSachThanhVien: [] },
    { soHoKhau: 'HK003', chuHo: 'Lê Minh Công', soNha: '89A', duong: 'Phường Linh Đông', phuong: 'Phường Linh Đông', quan: 'Quận Linh Đông', thanhPho: 'Thành phố Hồ Chí Minh', ngayLamHoKhau: '2022-11-03', danhSachThanhVien: [] },
  ];

  // Filter and sort
  const filtered = households.filter(hk =>
    hk.soHoKhau.toLowerCase().includes(search.toLowerCase()) ||
    hk.chuHo.toLowerCase().includes(search.toLowerCase())
  );
  const sorted = [...filtered].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return sortAsc ? -1 : 1;
    if (a[sortBy] > b[sortBy]) return sortAsc ? 1 : -1;
    return 0;
  });

  return (
    <>
      <Layout role="totruong"> {/* Wrap with Layout - Assuming this is for totruong role */} 
        <div className="p-4 flex flex-col gap-6">
          {/* Page Title and Welcome Text */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">QUẢN LÝ HỘ KHẨU</h1>
            <p className="text-gray-600 text-sm mt-1">Chào mừng đến với Hệ thống Quản lý Thu phí Chung cư</p>
          </div>

          {/* Search and Add Button Area */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-gray-300 rounded-md shadow-sm overflow-hidden flex-1">
              <div className="p-2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Tìm theo số hộ khẩu, tên chủ hộ"
                className="flex-1 p-2 border-l border-gray-300 outline-none text-sm"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Add Household Button */}
            <button 
              onClick={() => openEditPopup()} 
              className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Thêm hộ khẩu
            </button>
          </div>

          {/* Table Area */}
          <div className="mt-6 bg-white rounded-md shadow-md overflow-hidden border border-gray-200">
             {/* Table Title */}
            <div className="p-4 bg-gray-100 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Danh sách hộ khẩu</h2>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { key: 'soHoKhau', label: 'Sổ hộ khẩu' },
                    { key: 'chuHo', label: 'Chủ hộ' },
                    { key: 'soNha', label: 'Số nhà' },
                    { key: 'duong', label: 'Đường' },
                    { key: 'phuong', label: 'Phường' },
                    { key: 'quan', label: 'Quận' },
                    { key: 'thanhPho', label: 'Thành phố' },
                    { key: 'ngayLamHoKhau', label: 'Ngày làm hộ khẩu' },
                  ].map(col => (
                    <th
                      key={col.key}
                      className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => {
                        if (sortBy === col.key) setSortAsc(!sortAsc);
                        else { setSortBy(col.key as any); setSortAsc(true); }
                      }}
                    >
                      {col.label} {sortBy === col.key ? (sortAsc ? '▲' : '▼') : ''}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sorted.map((rowData, idx) => (
                  <tr key={rowData.soHoKhau} className="hover:bg-blue-50 cursor-pointer" onClick={() => openEditPopup(rowData)}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{rowData.soHoKhau}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rowData.chuHo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rowData.soNha}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rowData.duong}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rowData.phuong}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rowData.quan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rowData.thanhPho}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rowData.ngayLamHoKhau}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      <button onClick={e => { e.stopPropagation(); openEditPopup(rowData); }} className="mr-2 underline">Chỉnh sửa</button>
                      <button onClick={e => { e.stopPropagation(); handleAssignChuHo(rowData); }} className="underline">Gán chủ hộ</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
      <EditHoKhauPopup
        isOpen={isEditPopupOpen}
        onClose={closeEditPopup}
        initialData={selectedHoKhau || undefined}
      />
      <AddMemberPopup
        isOpen={isAddMemberPopupOpen}
        onClose={() => setIsAddMemberPopupOpen(false)}
        onAdd={handleAddMember}
      />
    </>
  );
};

export default QuanLyHoKhau; 