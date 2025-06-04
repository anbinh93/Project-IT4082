import React, { useState } from "react";
import Layout from '../components/Layout';
import AddEditNhanKhauPopup from '../components/AddEditNhanKhauPopup';
import TachHoPopup from '../components/TachHoPopup';
import DoichuhoPopup from '../components/DoichuhoPopup';

interface Resident {
  id: number;
  hoTen: string;
  gioiTinh: string;
  ngaySinh: string;
  cccd: string;
  ngheNghiep: string;
  laChuHo?: boolean;
  maHoGiaDinh?: string;
}

const QuanLyNhanKhau: React.FC = () => {
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [isDoichuhoPopupOpen, setIsDoichuhoPopupOpen] = useState(false);
  const [selectedResidentForDoichuho, setSelectedResidentForDoichuho] = useState<Resident | null>(null);
  const [isTachHoPopupOpen, setIsTachHoPopupOpen] = useState(false);
  const [selectedResidentForTachHo, setSelectedResidentForTachHo] = useState<Resident | null>(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'id' | 'hoTen' | 'gioiTinh' | 'ngaySinh' | 'cccd' | 'ngheNghiep'>('id');
  const [sortAsc, setSortAsc] = useState(true);

  const openAddPopup = () => setIsAddPopupOpen(true);
  const closeAddPopup = () => setIsAddPopupOpen(false);

  const openDoichuhoPopup = (resident: Resident) => {
    setSelectedResidentForDoichuho(resident);
    setIsDoichuhoPopupOpen(true);
  };
  const closeDoichuhoPopup = () => {
    setIsDoichuhoPopupOpen(false);
    setSelectedResidentForDoichuho(null);
  };

  const openTachHoPopup = (resident: Resident) => {
    setSelectedResidentForTachHo(resident);
    setIsTachHoPopupOpen(true);
  };
  const closeTachHoPopup = () => {
    setIsTachHoPopupOpen(false);
    setSelectedResidentForTachHo(null);
  };

  const handleTachHo = (rowData: Resident) => {
    openTachHoPopup(rowData);
  };

  const handleThayDoiChuHo = (rowData: Resident) => {
    openDoichuhoPopup(rowData);
  };

  const residents: Resident[] = [
    { id: 1, hoTen: 'Nguyễn Văn An', gioiTinh: 'Nam', ngaySinh: '1993-12-24', cccd: '0173048134', ngheNghiep: 'Kỹ sư', laChuHo: true, maHoGiaDinh: 'HO001' },
    { id: 2, hoTen: 'Trần Thị Bình', gioiTinh: 'Nữ', ngaySinh: '1987-07-15', cccd: '0173054376', ngheNghiep: 'Nhân viên văn phòng' },
    { id: 3, hoTen: 'Lê Minh Công', gioiTinh: 'Nam', ngaySinh: '2000-05-14', cccd: '0173081734', ngheNghiep: 'Sinh viên' },
    { id: 4, hoTen: 'Phạm Thị Dung', gioiTinh: 'Nữ', ngaySinh: '1995-03-08', cccd: '0173065432', ngheNghiep: 'Giáo viên' },
    { id: 5, hoTen: 'Hoàng Văn Em', gioiTinh: 'Nam', ngaySinh: '1990-11-20', cccd: '0173087654', ngheNghiep: 'Bác sĩ' },
  ];

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
      <Layout role="totruong">
        <div className="p-4 flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">QUẢN LÝ NHÂN KHẨU</h1>
            <p className="text-gray-600 text-sm mt-1">Chào mừng đến với Hệ thống Quản lý Thu phí Chung cư</p>
          </div>

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

            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 flex items-center gap-2"
              onClick={openAddPopup}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Thêm nhân khẩu
            </button>
          </div>

          <div className="mt-6 bg-white rounded-md shadow-md overflow-hidden border border-gray-200">
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
                {sorted.map((rowData) => (
                  <tr key={rowData.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{rowData.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rowData.hoTen}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rowData.gioiTinh}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rowData.ngaySinh}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rowData.cccd}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rowData.ngheNghiep}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleTachHo(rowData)}
                          className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                          Tách hộ
                        </button>
                        <button
                          onClick={() => handleThayDoiChuHo(rowData)}
                          className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Đổi chủ hộ
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

      {/* Popups */}
      <AddEditNhanKhauPopup isOpen={isAddPopupOpen} onClose={closeAddPopup} />
      <TachHoPopup
        isOpen={isTachHoPopupOpen}
        onClose={closeTachHoPopup}
        selectedResident={selectedResidentForTachHo}
      />
      <DoichuhoPopup
        isOpen={isDoichuhoPopupOpen}
        onClose={closeDoichuhoPopup}
        selectedResident={selectedResidentForDoichuho}
      />
    </>
  );
};

export default QuanLyNhanKhau;
