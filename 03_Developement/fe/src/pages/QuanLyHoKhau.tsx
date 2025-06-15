import React, { useState, useEffect } from "react";
import Layout from '../components/Layout';
import EditHoKhauPopup from '../components/EditHoKhauPopup';
import AddEditHoKhauPopup from '../components/AddEditHoKhauPopup';
import AddMemberPopup from '../components/AddMemberPopup';
import GanchuhoPopup from '../components/GanchuhoPopup';
import { householdAPI } from '../services/api';

interface Household {
  soHoKhau: number;
  chuHo: number;
  chuHoInfo?: {
    id: number;
    hoTen: string;
  };
  soNha: string;
  duong: string;
  phuong: string;
  quan: string;
  thanhPho: string;
  ngayLamHoKhau: string;
  createdAt?: string;
  updatedAt?: string;
}

const QuanLyHoKhau: React.FC = () => {
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isAddHouseholdPopupOpen, setIsAddHouseholdPopupOpen] = useState(false);
  const [isAddMemberPopupOpen, setIsAddMemberPopupOpen] = useState(false);
  const [isAssignChuHoPopupOpen, setIsAssignChuHoPopupOpen] = useState(false);
  const [selectedHoKhau, setSelectedHoKhau] = useState<Household | null>(null);
  const [selectedHouseholdForAssign, setSelectedHouseholdForAssign] = useState<Household | null>(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'soHoKhau' | 'chuHo' | 'soNha' | 'duong' | 'phuong' | 'quan' | 'thanhPho' | 'ngayLamHoKhau'>('soHoKhau');
  const [sortAsc, setSortAsc] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; hoKhau: Household | null }>({ isOpen: false, hoKhau: null });
  const [households, setHouseholds] = useState<Household[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load households data from API
  useEffect(() => {
    loadHouseholds();
  }, []);

  const loadHouseholds = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await householdAPI.getAll();
      if (response.success && response.data && response.data.households) {
        setHouseholds(response.data.households);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải danh sách hộ khẩu');
      console.error('Error loading households:', err);
    } finally {
      setLoading(false);
    }
  };

  const openEditPopup = (hoKhau: Household | undefined = undefined) => {
    setSelectedHoKhau(hoKhau || null);
    setIsEditPopupOpen(true);
  };

  const closeEditPopup = () => {
    setIsEditPopupOpen(false);
    setSelectedHoKhau(null);
    // Reload households after editing
    loadHouseholds();
  };

  const openAddHouseholdPopup = () => {
    setIsAddHouseholdPopupOpen(true);
  };

  const closeAddHouseholdPopup = () => {
    setIsAddHouseholdPopupOpen(false);
    // Reload households after adding
    loadHouseholds();
  };

  const openAssignChuHoPopup = (hoKhau: Household) => {
    setSelectedHouseholdForAssign(hoKhau);
    setIsAssignChuHoPopupOpen(true);
  };

  const closeAssignChuHoPopup = () => {
    setIsAssignChuHoPopupOpen(false);
    setSelectedHouseholdForAssign(null);
  };

  const handleAddMember = (member: any) => {
    console.log('Adding member:', member);
  };

  // const handleAssignChuHo = (newChuHoId: string) => {
  //   console.log('Assigning new head of household with ID:', newChuHoId, 'to household:', selectedHouseholdForAssign);
  // };

  const handleAssignSuccess = () => {
    loadHouseholds(); // Refresh the household list
    closeAssignChuHoPopup();
  };

  const handleDelete = async () => {
    if (!confirmDelete.hoKhau) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await householdAPI.delete(confirmDelete.hoKhau.soHoKhau);
      
      if (response.success) {
        // Refresh danh sách hộ khẩu sau khi xóa thành công
        await loadHouseholds();
        setConfirmDelete({ isOpen: false, hoKhau: null });
      } else {
        setError(response.message || 'Có lỗi xảy ra khi xóa hộ khẩu');
      }
    } catch (err: any) {
      console.error('Error deleting household:', err);
      setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra khi xóa hộ khẩu');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort households
  const filtered = households.filter(item => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      item.soHoKhau.toString().includes(searchLower) ||
      (item.chuHoInfo?.hoTen || '').toLowerCase().includes(searchLower) ||
      item.soNha.toLowerCase().includes(searchLower) ||
      item.duong.toLowerCase().includes(searchLower)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    let aVal: any, bVal: any;
    
    if (sortBy === 'chuHo') {
      aVal = a.chuHoInfo?.hoTen || '';
      bVal = b.chuHoInfo?.hoTen || '';
    } else {
      aVal = a[sortBy];
      bVal = b[sortBy];
    }
    
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    
    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

  if (loading) {
    return (
      <Layout role="totruong">
        <div className="p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-lg text-gray-600">Đang tải danh sách hộ khẩu...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout role="totruong">
        <div className="p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-lg text-red-600">Lỗi: {error}</div>
            <button 
              onClick={loadHouseholds}
              className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Thử lại
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Layout role="totruong">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Quản lý hộ khẩu</h1>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search Box */}
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
              onClick={openAddHouseholdPopup} 
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
                  <tr key={rowData.soHoKhau} className="hover:bg-blue-50 cursor-pointer" onClick={() => openEditPopup(rowData)}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">HK{rowData.soHoKhau.toString().padStart(3, '0')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rowData.chuHoInfo?.hoTen || 'N/A'}</td>
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

                        {/* Delete Button */}
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
        householdId={selectedHoKhau ? selectedHoKhau.soHoKhau : undefined}
      />
      
      {/* Add Household Popup */}
      <AddEditHoKhauPopup
        isOpen={isAddHouseholdPopupOpen}
        onClose={closeAddHouseholdPopup}
      />
      
      {/* Add Member Popup */}
      <AddMemberPopup
        isOpen={isAddMemberPopupOpen}
        onClose={() => setIsAddMemberPopupOpen(false)}
        onAdd={handleAddMember}
        householdId={selectedHoKhau ? selectedHoKhau.soHoKhau : undefined}
      />
      
      {/* Assign Head of Household Popup */}
      <GanchuhoPopup
        isOpen={isAssignChuHoPopupOpen}
        onClose={closeAssignChuHoPopup}
        onSuccess={handleAssignSuccess}
        currentHousehold={selectedHouseholdForAssign ? {
          soHoKhau: `HK${selectedHouseholdForAssign.soHoKhau.toString().padStart(3, '0')}`,
          chuHo: selectedHouseholdForAssign.chuHoInfo?.hoTen || '',
          soNha: selectedHouseholdForAssign.soNha,
          duong: selectedHouseholdForAssign.duong,
          phuong: selectedHouseholdForAssign.phuong,
          quan: selectedHouseholdForAssign.quan,
          thanhPho: selectedHouseholdForAssign.thanhPho,
          ngayLamHoKhau: selectedHouseholdForAssign.ngayLamHoKhau,
        } : null}
      />

      {confirmDelete.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-md">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Xác nhận xoá</h2>
            <p className="text-sm text-gray-700">
              Bạn có chắc chắn muốn xoá hộ khẩu <strong>HK{confirmDelete.hoKhau?.soHoKhau.toString().padStart(3, '0')}</strong> không?
            </p>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            <div className="mt-6 flex justify-end gap-3">
              <button 
                onClick={() => {
                  setConfirmDelete({ isOpen: false, hoKhau: null });
                  setError(null);
                }} 
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                disabled={loading}
              >
                Huỷ
              </button>
              <button 
                onClick={handleDelete} 
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Đang xóa...' : 'Xoá'}
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default QuanLyHoKhau;