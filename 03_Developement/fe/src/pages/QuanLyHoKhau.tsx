import React, { useState } from "react";
import Layout from '../components/Layout'; // Import Layout component
import EditHoKhauPopup from '../components/EditHoKhauPopup'; // Import the popup component
import AddMemberPopup from '../components/AddMemberPopup';
import GanchuhoPopup from '../components/GanchuhoPopup'; // Import the new popup

const QuanLyHoKhau: React.FC = () => {
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false); // State to manage popup visibility
  const [isAddMemberPopupOpen, setIsAddMemberPopupOpen] = useState(false);
  const [isAssignChuHoPopupOpen, setIsAssignChuHoPopupOpen] = useState(false); // New state for assign popup
  const [selectedHoKhau, setSelectedHoKhau] = useState(null);
  const [selectedHouseholdForAssign, setSelectedHouseholdForAssign] = useState(null); // New state for household to assign
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'soHoKhau' | 'chuHo' | 'soNha' | 'duong' | 'phuong' | 'quan' | 'thanhPho' | 'ngayLamHoKhau'>('soHoKhau');
  const [sortAsc, setSortAsc] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; hoKhau: any | null }>({ isOpen: false, hoKhau: null });

  const openEditPopup = (hoKhau: any = undefined) => {
    setSelectedHoKhau(hoKhau);
    setIsEditPopupOpen(true);
  };

  const closeEditPopup = () => {
    setIsEditPopupOpen(false);
    setSelectedHoKhau(null);
  };

  const openAssignChuHoPopup = (hoKhau: any) => {
    setSelectedHouseholdForAssign(hoKhau);
    setIsAssignChuHoPopupOpen(true);
  };

  const closeAssignChuHoPopup = () => {
    setIsAssignChuHoPopupOpen(false);
    setSelectedHouseholdForAssign(null);
  };

  const handleAddMember = (member: any) => {
    // TODO: Handle adding member to household
    console.log('Adding member:', member);
  };

  const handleAssignChuHo = (newChuHoId: string) => {
    // TODO: Handle assigning a new head of household
    console.log('Assigning new head of household with ID:', newChuHoId, 'to household:', selectedHouseholdForAssign);
    // Here you would update the household data with the new head
    // For example: update the chuHo field and member relationships
  };

  const handleDelete = () => {
    if (!confirmDelete.hoKhau) return;
    console.log("Đã xóa hộ khẩu:", confirmDelete.hoKhau.soHoKhau);
    setConfirmDelete({ isOpen: false, hoKhau: null });
  };

  // Sample data with complete household information
  const households = [
    { 
      soHoKhau: 'HK001', 
      chuHo: 'Nguyễn Văn An', 
      soNha: '12B/3', 
      duong: 'Phường 1', 
      phuong: 'Phường 1', 
      quan: 'Quận 1', 
      thanhPho: 'Thành phố Hồ Chí Minh', 
      ngayLamHoKhau: '2020-03-15', 
      danhSachThanhVien: [
        { id: 'TV001', hoTen: 'Nguyễn Văn An', ngaySinh: '1975-05-15', gioiTinh: 'Nam', cccd: '001234567890', quanHeVoiChuHo: 'Chủ hộ', ngheNghiep: 'Kỹ sư', noiLamViec: 'Công ty ABC' },
        { id: 'TV002', hoTen: 'Nguyễn Thị Bình', ngaySinh: '1978-08-20', gioiTinh: 'Nữ', cccd: '001234567891', quanHeVoiChuHo: 'Vợ', ngheNghiep: 'Giáo viên', noiLamViec: 'Trường THPT XYZ' },
        { id: 'TV003', hoTen: 'Nguyễn Văn Cường', ngaySinh: '2005-12-10', gioiTinh: 'Nam', cccd: '001234567892', quanHeVoiChuHo: 'Con', ngheNghiep: 'Học sinh', noiLamViec: 'Trường THPT DEF' }
      ]
    },
    { 
      soHoKhau: 'HK002', 
      chuHo: 'Trần Thị Bình', 
      soNha: '45/6', 
      duong: 'Phường 5', 
      phuong: 'Phường 5', 
      quan: 'Quận 5', 
      thanhPho: 'Thành phố Hồ Chí Minh', 
      ngayLamHoKhau: '2021-07-22', 
      danhSachThanhVien: [
        { id: 'TV004', hoTen: 'Trần Thị Bình', ngaySinh: '1980-03-12', gioiTinh: 'Nữ', cccd: '002234567890', quanHeVoiChuHo: 'Chủ hộ', ngheNghiep: 'Kinh doanh', noiLamViec: 'Tự kinh doanh' },
        { id: 'TV005', hoTen: 'Trần Văn Dũng', ngaySinh: '2010-06-15', gioiTinh: 'Nam', cccd: '002234567891', quanHeVoiChuHo: 'Con', ngheNghiep: 'Học sinh', noiLamViec: 'Trường THCS ABC' }
      ]
    },
    { 
      soHoKhau: 'HK003', 
      chuHo: 'Lê Minh Công', 
      soNha: '89A', 
      duong: 'Phường Linh Đông', 
      phuong: 'Phường Linh Đông', 
      quan: 'Quận Linh Đông', 
      thanhPho: 'Thành phố Hồ Chí Minh', 
      ngayLamHoKhau: '2022-11-03', 
      danhSachThanhVien: [
        { id: 'TV006', hoTen: 'Lê Minh Công', ngaySinh: '1982-11-08', gioiTinh: 'Nam', cccd: '003234567890', quanHeVoiChuHo: 'Chủ hộ', ngheNghiep: 'Bác sĩ', noiLamViec: 'Bệnh viện Đa khoa' },
        { id: 'TV007', hoTen: 'Lê Thị Hoa', ngaySinh: '1985-02-20', gioiTinh: 'Nữ', cccd: '003234567891', quanHeVoiChuHo: 'Vợ', ngheNghiep: 'Y tá', noiLamViec: 'Bệnh viện Đa khoa' },
        { id: 'TV008', hoTen: 'Lê Minh Tuấn', ngaySinh: '2012-09-30', gioiTinh: 'Nam', cccd: '003234567892', quanHeVoiChuHo: 'Con', ngheNghiep: 'Học sinh', noiLamViec: 'Trường Tiểu học XYZ' }
      ]
    },
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
        <div className="p-4 flex flex-col gap-6 min-h-screen w-full bg-white overflow-auto">

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
                      <div className="flex items-center gap-2">
                        {/* Edit Button */}
                        <button 
                          onClick={e => { e.stopPropagation(); openEditPopup(rowData); }} 
                          className="p-1 hover:bg-blue-100 rounded transition-colors"
                          title="Chỉnh sửa hộ khẩu"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        
                        {/* Assign Head Button */}
                        <button 
                          onClick={e => { e.stopPropagation(); openAssignChuHoPopup(rowData); }} 
                          className="p-1 hover:bg-green-100 rounded transition-colors text-green-600"
                          title="Gán chủ hộ"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </button>

                        {/* Assign Delete Button*/}
                        <button onClick={e => { e.stopPropagation(); setConfirmDelete({ isOpen: true, hoKhau: rowData }); }} className="p-1 hover:bg-red-100 rounded text-red-600" title="Xoá hộ khẩu">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
      
      {/* Edit Household Popup */}
      <EditHoKhauPopup
        isOpen={isEditPopupOpen}
        onClose={closeEditPopup}
        initialData={selectedHoKhau || undefined}
      />
      
      {/* Add Member Popup */}
      <AddMemberPopup
        isOpen={isAddMemberPopupOpen}
        onClose={() => setIsAddMemberPopupOpen(false)}
        onAdd={handleAddMember}
      />
      
      {/* Assign Head of Household Popup */}
      <GanchuhoPopup
        isOpen={isAssignChuHoPopupOpen}
        onClose={closeAssignChuHoPopup}
        onAssign={handleAssignChuHo}
        currentHousehold={selectedHouseholdForAssign}
      />

      {confirmDelete.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-md">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Xác nhận xoá</h2>
            <p className="text-sm text-gray-700">
              Bạn có chắc chắn muốn xoá hộ khẩu <strong>{confirmDelete.hoKhau?.soHoKhau}</strong> không?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setConfirmDelete({ isOpen: false, hoKhau: null })} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                Huỷ
              </button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                Xoá
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default QuanLyHoKhau;