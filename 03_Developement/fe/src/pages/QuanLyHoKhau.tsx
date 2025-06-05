import React, { useState } from "react";
import Layout from '../components/Layout'; // Import Layout component
import EditHoKhauPopup from '../components/EditHoKhauPopup'; // Import the popup component
import AddMemberPopup from '../components/AddMemberPopup';
import GanchuhoPopup from '../components/GanchuhoPopup'; // Import the new popup
import TachHoPopup from '../components/TachHoPopup';
import AddHoKhauPopup from '../components/AddHoKhauPopup'; // Thay vì AddEditHoKhauPopup

const QuanLyHoKhau: React.FC = () => {
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false); // State to manage popup visibility
  const [isAddMemberPopupOpen, setIsAddMemberPopupOpen] = useState(false);
  const [isAssignChuHoPopupOpen, setIsAssignChuHoPopupOpen] = useState(false); // New state for assign popup
  const [selectedHoKhau, setSelectedHoKhau] = useState(null);
  const [selectedHouseholdForAssign, setSelectedHouseholdForAssign] = useState(null); // New state for household to assign
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'soHoKhau' | 'chuHo' | 'soNha' | 'duong' | 'phuong' | 'quan' | 'thanhPho' | 'ngayLamHoKhau'>('soHoKhau');
  const [sortAsc, setSortAsc] = useState(true);
  const [expandedHoKhau, setExpandedHoKhau] = useState<string | null>(null);
  const [addMemberHoKhau, setAddMemberHoKhau] = useState<any | null>(null);
  const [tachHoMember, setTachHoMember] = useState<{ hoKhau: any; member: any } | null>(null);
  const [deleteMember, setDeleteMember] = useState<{ hoKhau: any; member: any } | null>(null);
  const [membersData, setMembersData] = useState<any>(null); // For inline editing
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [editingRelation, setEditingRelation] = useState<{ hoKhauId: string; memberId: string } | null>(null);
  const [relationValue, setRelationValue] = useState('');

  // const openAddPopup = () => {
  //   setIsAddPopupOpen(true);
  // };

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

  // Lấy danh sách thành viên cho từng hộ khẩu (có thể cập nhật khi sửa inline)
  const getMembers = (hoKhau: any) => {
    if (membersData && membersData[hoKhau.soHoKhau]) return membersData[hoKhau.soHoKhau];
    return hoKhau.danhSachThanhVien;
  };

  // Xử lý lưu quan hệ khi sửa inline
  const handleSaveRelation = (hoKhauId: string, memberId: string, newRelation: string) => {
    setMembersData((prev: any) => {
      const updated = { ...(prev || {}) };
      const members = [...(getMembers(households.find(h => h.soHoKhau === hoKhauId)) || [])];
      const idx = members.findIndex((m: any) => m.id === memberId);
      if (idx !== -1) members[idx] = { ...members[idx], quanHeVoiChuHo: newRelation };
      updated[hoKhauId] = members;
      return updated;
    });
    setEditingRelation(null);
  };

  // Xử lý xóa thành viên khỏi hộ khẩu
  const handleDeleteMember = () => {
    if (!deleteMember) return;
    setMembersData((prev: any) => {
      const updated = { ...(prev || {}) };
      const members = [...(getMembers(deleteMember.hoKhau) || [])];
      const idx = members.findIndex((m: any) => m.id === deleteMember.member.id);
      if (idx !== -1) members.splice(idx, 1);
      updated[deleteMember.hoKhau.soHoKhau] = members;
      return updated;
    });
    setDeleteMember(null);
  };

  // Xử lý thêm thành viên
  const handleAddMemberToHoKhau = (member: any) => {
    if (!addMemberHoKhau) return;
    setMembersData((prev: any) => {
      const updated = { ...(prev || {}) };
      const members = [...(getMembers(addMemberHoKhau) || [])];
      members.push({ ...member, id: 'TV' + Math.random().toString().slice(2, 8) });
      updated[addMemberHoKhau.soHoKhau] = members;
      return updated;
    });
    setAddMemberHoKhau(null);
  };

  const handleAddHoKhau = (data: any) => {
    // TODO: Add logic to add new household to your state/data
    console.log('Adding new household:', data);
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
        { id: 'TV001', hoTen: 'Nguyễn Văn An', ngaySinh: '1975-05-15', gioiTinh: 'Nam', cccd: '001234567890', quanHeVoiChuHo: 'Chủ hộ', ngheNghiep: 'Kỹ sư', noiLamViec: 'Công ty ABC', ngayThem: '2020-03-15' },
        { id: 'TV002', hoTen: 'Nguyễn Thị Bình', ngaySinh: '1978-08-20', gioiTinh: 'Nữ', cccd: '001234567891', quanHeVoiChuHo: 'Vợ', ngheNghiep: 'Giáo viên', noiLamViec: 'Trường THPT XYZ', ngayThem: '2020-03-15' },
        { id: 'TV003', hoTen: 'Nguyễn Văn Cường', ngaySinh: '2005-12-10', gioiTinh: 'Nam', cccd: '001234567892', quanHeVoiChuHo: 'Con', ngheNghiep: 'Học sinh', noiLamViec: 'Trường THPT DEF', ngayThem: '2020-03-15' }
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
        { id: 'TV004', hoTen: 'Trần Thị Bình', ngaySinh: '1980-03-12', gioiTinh: 'Nữ', cccd: '002234567890', quanHeVoiChuHo: 'Chủ hộ', ngheNghiep: 'Kinh doanh', noiLamViec: 'Tự kinh doanh', ngayThem: '2021-07-22' },
        { id: 'TV005', hoTen: 'Trần Văn Dũng', ngaySinh: '2010-06-15', gioiTinh: 'Nam', cccd: '002234567891', quanHeVoiChuHo: 'Con', ngheNghiep: 'Học sinh', noiLamViec: 'Trường THCS ABC', ngayThem: '2021-07-22' }
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
        { id: 'TV006', hoTen: 'Lê Minh Công', ngaySinh: '1982-11-08', gioiTinh: 'Nam', cccd: '003234567890', quanHeVoiChuHo: 'Chủ hộ', ngheNghiep: 'Bác sĩ', noiLamViec: 'Bệnh viện Đa khoa', ngayThem: '2022-11-03' },
        { id: 'TV007', hoTen: 'Lê Thị Hoa', ngaySinh: '1985-02-20', gioiTinh: 'Nữ', cccd: '003234567891', quanHeVoiChuHo: 'Vợ', ngheNghiep: 'Y tá', noiLamViec: 'Bệnh viện Đa khoa', ngayThem: '2022-11-03' },
        { id: 'TV008', hoTen: 'Lê Minh Tuấn', ngaySinh: '2012-09-30', gioiTinh: 'Nam', cccd: '003234567892', quanHeVoiChuHo: 'Con', ngheNghiep: 'Học sinh', noiLamViec: 'Trường Tiểu học XYZ', ngayThem: '2022-11-03' }
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

  const sampleResidents = [
    { id: 'TV009', name: 'Nguyễn Văn Bình', cccd: '001234567893', ngaySinh: '1990-01-01', gioiTinh: 'Nam', ngheNghiep: 'Kỹ sư' },
    { id: 'TV010', name: 'Phạm Thị Hoa', cccd: '001234567894', ngaySinh: '1992-02-02', gioiTinh: 'Nữ', ngheNghiep: 'Giáo viên' },
    { id: 'TV011', name: 'Lê Văn Dũng', cccd: '001234567895', ngaySinh: '1985-03-03', gioiTinh: 'Nam', ngheNghiep: 'Bác sĩ' },
  ];

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
          <div className="flex items-center gap-4 mt-6">
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
              onClick={() => setIsAddPopupOpen(true)} 
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
                {sorted.map((rowData) => (
                  <React.Fragment key={rowData.soHoKhau}>
                    <tr className="hover:bg-blue-50 cursor-pointer" onClick={() => setExpandedHoKhau(expandedHoKhau === rowData.soHoKhau ? null : rowData.soHoKhau)}>
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
                          <button onClick={e => { e.stopPropagation(); setDeleteMember({ hoKhau: rowData, member: rowData.danhSachThanhVien[0] }); }} className="p-1 hover:bg-red-100 rounded text-red-600" title="Xoá hộ khẩu">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>

                        </div>
                      </td>
                    </tr>
                    {/* SUBLIST: Thành viên hộ khẩu */}
                    {expandedHoKhau === rowData.soHoKhau && (
                      <tr>
                        <td colSpan={10} className="px-0 py-0 bg-blue-50 border-b-2 border-blue-200">
                          <div className="p-4">
                            <div className="flex justify-between items-center mb-3 pb-2 border-b border-blue-200">
                              <h3 className="text-md font-semibold text-gray-800">Danh sách thành viên hộ khẩu</h3>
                              <button
                                className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 flex items-center gap-1"
                                onClick={e => { e.stopPropagation(); setAddMemberHoKhau(rowData); }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Thêm thành viên
                              </button>
                            </div>
                            <div className="overflow-x-auto bg-white rounded-lg shadow">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Họ tên</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Ngày sinh</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Giới tính</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">CCCD</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Nghề nghiệp</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Quan hệ với chủ hộ</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Ngày thêm</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Thao tác</th>
                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {(getMembers(rowData) || []).map((member: any) => (
                                    <tr key={member.id} className="hover:bg-gray-50">
                                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{member.hoTen || member.tenNhanKhau}</td>
                                      <td className="px-4 py-3 text-sm text-gray-900">{member.ngaySinh}</td>
                                      <td className="px-4 py-3 text-sm text-gray-900">{member.gioiTinh}</td>
                                      <td className="px-4 py-3 text-sm text-gray-900">{member.cccd}</td>
                                      <td className="px-4 py-3 text-sm text-gray-900">{member.ngheNghiep}</td>
                                      <td className="px-4 py-3 text-sm text-gray-900 text-center">
                                        <div className="flex items-center justify-center" style={{ minWidth: 160 }}>
                                          {editingRelation && editingRelation.hoKhauId === rowData.soHoKhau && editingRelation.memberId === member.id ? (
                                            <input
                                              className="border rounded px-2 py-1 text-sm flex-1"
                                              value={relationValue}
                                              onChange={e => setRelationValue(e.target.value)}
                                              autoFocus
                                            />
                                          ) : (
                                            <span className="truncate flex-1">{member.quanHeVoiChuHo}</span>
                                          )}
                                        </div>
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-900">{member.ngayThem}</td>
                                      <td className="px-4 py-3 text-sm text-center">
                                        <div className="flex justify-center space-x-2">
                                          {editingRelation && editingRelation.hoKhauId === rowData.soHoKhau && editingRelation.memberId === member.id ? (
                                            <button
                                              className="p-1 rounded hover:bg-green-100 transition"
                                              title="Lưu"
                                              onClick={() => {
                                                handleSaveRelation(rowData.soHoKhau, member.id, relationValue);
                                                setEditingRelation(null);
                                              }}
                                              style={{ lineHeight: 0 }}
                                            >
                                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                              </svg>
                                            </button>
                                          ) : (
                                            <button
                                              className="p-1 rounded hover:bg-blue-100 transition"
                                              title="Sửa quan hệ"
                                              onClick={() => {
                                                setEditingRelation({ hoKhauId: rowData.soHoKhau, memberId: member.id });
                                                setRelationValue(member.quanHeVoiChuHo);
                                              }}
                                              style={{ lineHeight: 0 }}
                                            >
                                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                              </svg>
                                            </button>
                                          )}
                                          <button
                                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                            onClick={e => { e.preventDefault(); setTachHoMember({ hoKhau: rowData, member }); }}
                                          >
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                            </svg>
                                            Tách hộ
                                          </button>
                                          <button
                                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200"
                                            onClick={e => { e.preventDefault(); setDeleteMember({ hoKhau: rowData, member }); }}
                                          >
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Xóa
                                          </button>
                                        </div>
                                      </td>
                </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
      
      {/* Add Household Popup */}
      <AddHoKhauPopup
        isOpen={isAddPopupOpen}
        onClose={() => setIsAddPopupOpen(false)}
        onAdd={handleAddHoKhau}
        residents={sampleResidents}
      />
      
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

      {/* Popup Thêm thành viên */}
      <AddMemberPopup
        isOpen={!!addMemberHoKhau}
        onClose={() => setAddMemberHoKhau(null)}
        onAdd={handleAddMemberToHoKhau}
        residents={[
          { id: 'TV009', name: 'Nguyễn Văn Bình', cccd: '001234567893', ngaySinh: '1990-01-01', gioiTinh: 'Nam', ngheNghiep: 'Kỹ sư' },
          { id: 'TV010', name: 'Phạm Thị Hoa', cccd: '001234567894', ngaySinh: '1992-02-02', gioiTinh: 'Nữ', ngheNghiep: 'Giáo viên' },
          { id: 'TV011', name: 'Lê Văn Dũng', cccd: '001234567895', ngaySinh: '1985-03-03', gioiTinh: 'Nam', ngheNghiep: 'Bác sĩ' },
        ]}
      />
      {/* Popup Tách hộ */}
      <TachHoPopup
        isOpen={!!tachHoMember}
        onClose={() => setTachHoMember(null)}
        selectedResident={tachHoMember ? {
          id: tachHoMember.member.id,
          hoTen: tachHoMember.member.hoTen || tachHoMember.member.tenNhanKhau,
          gioiTinh: tachHoMember.member.gioiTinh,
          ngaySinh: tachHoMember.member.ngaySinh,
          cccd: tachHoMember.member.cccd,
          ngheNghiep: tachHoMember.member.ngheNghiep,
        } : undefined}
      />
      {/* Xác nhận xóa thành viên */}
      {deleteMember && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-md">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Xác nhận xóa thành viên</h2>
            <p className="text-sm text-gray-700">
              Bạn có chắc chắn muốn xóa thành viên <strong>{deleteMember.member.hoTen || deleteMember.member.tenNhanKhau}</strong> khỏi hộ khẩu <strong>{deleteMember.hoKhau.soHoKhau}</strong> không?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setDeleteMember(null)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                Hủy
              </button>
              <button onClick={handleDeleteMember} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default QuanLyHoKhau; 