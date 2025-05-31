import React, { useState } from "react";
import Layout from '../components/Layout'; // Import Layout component
import AddEditNhanKhauPopup from '../components/AddEditNhanKhauPopup'; // Import Add popup
import EditNhanKhauPopup from '../components/EditNhanKhauPopup'; // Import Edit popup

const QuanLyNhanKhau: React.FC = () => {
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false); // State for Add popup
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false); // State for Edit popup
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'id' | 'hoTen' | 'gioiTinh' | 'ngaySinh' | 'cccd' | 'ngheNghiep'>('id');
  const [sortAsc, setSortAsc] = useState(true);

  const openAddPopup = () => setIsAddPopupOpen(true);
  const closeAddPopup = () => setIsAddPopupOpen(false);
  const openEditPopup = () => setIsEditPopupOpen(true); // Handler to open edit popup
  const closeEditPopup = () => setIsEditPopupOpen(false); // Handler to close edit popup

  const handleTachHo = (rowData: any) => {
    // TODO: Handle splitting household
    console.log('Tách hộ:', rowData);
  };
  const handleThayDoiChuHo = (rowData: any) => {
    // TODO: Handle changing head of household
    console.log('Thay đổi chủ hộ:', rowData);
  };

  // Sample data
  const residents = [
    { id: 1, hoTen: 'Nguyễn Văn An', gioiTinh: 'Nam', ngaySinh: '1993-12-24', cccd: '0173048134', ngheNghiep: 'Kỹ sư' },
    { id: 2, hoTen: 'Trần Thị Bình', gioiTinh: 'Nữ', ngaySinh: '1987-07-15', cccd: '0173054376', ngheNghiep: 'Nhân viên văn phòng' },
    { id: 3, hoTen: 'Lê Minh Công', gioiTinh: 'Nam', ngaySinh: '2000-05-14', cccd: '0173081734', ngheNghiep: 'Sinh viên' },
  ];

  // Filter and sort
  const filtered = residents.filter(nk =>
    nk.hoTen.toLowerCase().includes(search.toLowerCase()) ||
    nk.cccd.toLowerCase().includes(search.toLowerCase())
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
            <h1 className="text-2xl font-bold text-gray-800">QUẢN LÝ NHÂN KHẨU</h1>
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
                placeholder="Tìm theo họ tên, CCCD"
                className="flex-1 p-2 border border-gray-300 outline-none text-sm"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Add Resident Button */}
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 flex items-center gap-2"
                    onClick={openAddPopup}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Thêm nhân khẩu
            </button>
          </div>

          {/* Table Area */}
          <div className="mt-6 bg-white rounded-md shadow-md overflow-hidden border border-gray-200">
             {/* Table Title */}
            <div className="p-4 bg-gray-100 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Danh sách nhân khẩu</h2>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { key: 'id', label: 'ID' },
                    { key: 'hoTen', label: 'Họ tên' },
                    { key: 'gioiTinh', label: 'Giới tính' },
                    { key: 'ngaySinh', label: 'Ngày sinh' },
                    { key: 'cccd', label: 'CCCD' },
                    { key: 'ngheNghiep', label: 'Nghề nghiệp' },
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
                  <tr key={rowData.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{rowData.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rowData.hoTen}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rowData.gioiTinh}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rowData.ngaySinh}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rowData.cccd}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rowData.ngheNghiep}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 cursor-pointer">
                      <button onClick={() => handleTachHo(rowData)} className="mr-2 underline">Tách hộ</button>
                      <button onClick={() => handleThayDoiChuHo(rowData)} className="underline">Thay đổi chủ hộ</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
      <AddEditNhanKhauPopup isOpen={isAddPopupOpen} onClose={closeAddPopup} />
      <EditNhanKhauPopup isOpen={isEditPopupOpen} onClose={closeEditPopup} />
    </>
  );
};

export default QuanLyNhanKhau;