import React, { useState, useEffect } from "react";
import Layout from '../components/Layout';
import AddEditNhanKhauPopup from '../components/AddEditNhanKhauPopup';
import TachHoPopup from '../components/TachHoPopup';
import DoichuhoPopup from '../components/DoichuhoPopup';
import { residentAPI } from '../services/api';

interface Resident {
  id: number;
  hoTen: string;
  gioiTinh: string;
  ngaySinh: string;
  cccd: string;
  ngheNghiep: string;
  laChuHo?: boolean;
  maHoGiaDinh?: string;
  // Thêm thông tin hộ khẩu
  currentHousehold?: {
    soHoKhau: string;
    chuHo: string;
    diaChi: string;
    quanHeVoiChuHo?: string;
  } | null;
  householdStatus?: 'in_household' | 'no_household';
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
  
  // State for real data
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResidents, setTotalResidents] = useState(0);
  const itemsPerPage = 10;

  const openAddPopup = () => setIsAddPopupOpen(true);
  const closeAddPopup = () => {
    setIsAddPopupOpen(false);
  };

  const handleResidentCreated = () => {
    loadResidents(); // Refresh data after adding
  };

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

  // Load residents from API
  const loadResidents = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await residentAPI.getAll({
        page: currentPage,
        limit: itemsPerPage,
        search: search
      });

      if (response.success && response.data) {
        const residents = response.data.residents || [];
        
        // Lấy thông tin hộ khẩu cho mỗi nhân khẩu
        const residentsWithHousehold = await Promise.all(
          residents.map(async (resident: Resident) => {
            try {
              const householdResponse = await residentAPI.getHouseholdInfo(resident.id);
              if (householdResponse.success && householdResponse.data) {
                const householdData = householdResponse.data;
                return {
                  ...resident,
                  householdStatus: householdData.householdStatus,
                  currentHousehold: householdData.currentHousehold,
                  laChuHo: householdData.isHeadOfHousehold
                };
              }
              return {
                ...resident,
                householdStatus: 'no_household' as const,
                currentHousehold: null,
                laChuHo: false
              };
            } catch (err) {
              console.warn(`Failed to get household info for resident ${resident.id}:`, err);
              return {
                ...resident,
                householdStatus: 'no_household' as const,
                currentHousehold: null,
                laChuHo: false
              };
            }
          })
        );
        
        setResidents(residentsWithHousehold);
        setTotalPages(response.data.totalPages || 1);
        setTotalResidents(response.data.total || 0);
      } else {
        setError('Không thể tải danh sách nhân khẩu');
      }
    } catch (err: any) {
      console.error('Error loading residents:', err);
      setError(err.message || 'Có lỗi xảy ra khi tải danh sách nhân khẩu');
    } finally {
      setLoading(false);
    }
  };

  // Load data when component mounts or when search/page changes
  useEffect(() => {
    loadResidents();
  }, [currentPage]);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
      loadResidents();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search]);

  // Filter and sort residents
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
            <p className="text-gray-600 text-sm mt-1">
              Chào mừng đến với Hệ thống Quản lý Thu phí Chung cư
              {totalResidents > 0 && (
                <span className="ml-2 text-blue-600 font-medium">
                  (Tổng: {totalResidents} nhân khẩu)
                </span>
              )}
            </p>
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
            
            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
                <p className="text-red-600">{error}</p>
                <button 
                  onClick={loadResidents}
                  className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Thử lại
                </button>
              </div>
            )}

            {/* Data Table */}
            {!loading && !error && (
              <>
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
                        { key: 'household', label: 'Hộ khẩu' },
                      ].map(col => (
                        <th
                          key={col.key}
                          className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider cursor-pointer select-none"
                          onClick={() => {
                            if (col.key !== 'household') { // Không sort theo hộ khẩu
                              if (sortBy === col.key) setSortAsc(!sortAsc);
                              else { setSortBy(col.key as any); setSortAsc(true); }
                            }
                          }}
                        >
                          {col.label} {sortBy === col.key ? (sortAsc ? '▲' : '▼') : ''}
                        </th>
                      ))}
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sorted.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                          {search ? 'Không tìm thấy nhân khẩu nào phù hợp' : 'Chưa có nhân khẩu nào'}
                        </td>
                      </tr>
                    ) : (
                      sorted.map((rowData) => (
                        <tr key={rowData.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{rowData.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              {rowData.hoTen}
                              {rowData.laChuHo && (
                                <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                  Chủ hộ
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rowData.gioiTinh}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(rowData.ngaySinh).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rowData.cccd}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rowData.ngheNghiep}</td>
                          
                          {/* Cột Hộ khẩu */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {rowData.currentHousehold ? (
                              <div className="space-y-1">
                                <div className="flex items-center">
                                  <span className="font-medium text-blue-600">
                                    HK{String(rowData.currentHousehold.soHoKhau).padStart(3, '0')}
                                  </span>
                                  {rowData.laChuHo && (
                                    <span className="ml-2 text-xs text-blue-600">(Chủ hộ)</span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Chủ hộ: {rowData.currentHousehold.chuHo}
                                </div>
                                {rowData.currentHousehold.quanHeVoiChuHo && !rowData.laChuHo && (
                                  <div className="text-xs text-gray-500">
                                    Quan hệ: {rowData.currentHousehold.quanHeVoiChuHo}
                                  </div>
                                )}
                              </div>
                            ) : rowData.householdStatus === 'no_household' ? (
                              <span className="inline-flex px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                                Chưa có hộ khẩu
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">Đang tải...</span>
                            )}
                          </td>
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
                      ))
                    )}
                  </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Trước
                      </button>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Sau
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Hiển thị <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> đến{' '}
                          <span className="font-medium">
                            {Math.min(currentPage * itemsPerPage, totalResidents)}
                          </span>{' '}
                          trong tổng số <span className="font-medium">{totalResidents}</span> kết quả
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                          <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                          >
                            Trước
                          </button>
                          
                          {/* Page numbers */}
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNumber = i + 1;
                            return (
                              <button
                                key={pageNumber}
                                onClick={() => setCurrentPage(pageNumber)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                  currentPage === pageNumber
                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                }`}
                              >
                                {pageNumber}
                              </button>
                            );
                          })}
                          
                          <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                          >
                            Sau
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Layout>

      {/* Popups */}
      <AddEditNhanKhauPopup 
        isOpen={isAddPopupOpen} 
        onClose={closeAddPopup} 
        onSuccess={handleResidentCreated}
      />
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
