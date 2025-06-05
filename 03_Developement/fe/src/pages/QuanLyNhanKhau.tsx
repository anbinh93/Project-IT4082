import React, { useState } from "react";
import Layout from '../components/Layout';
import AddEditNhanKhauPopup from '../components/AddEditNhanKhauPopup';

interface Resident {
  id: number;
  hoTen: string;
  gioiTinh: string;
  ngaySinh: string;
  cccd: string;
  ngheNghiep: string;
  laChuHo?: boolean;
  maHoGiaDinh?: string;
  danToc: string;
  tonGiao: string;
  ngayCap: string;
  noiCap: string;
  hoKhauHienTai: string;
  quanHeVoiChuHo: string;
}

const QuanLyNhanKhau: React.FC = () => {
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'id' | 'hoTen' | 'gioiTinh' | 'ngaySinh' | 'cccd' | 'ngheNghiep'>('id');
  const [sortAsc, setSortAsc] = useState(true);
  const [detailResident, setDetailResident] = useState<Resident | null>(null);
  const [editResident, setEditResident] = useState<Resident | null>(null);
  const [deleteResident, setDeleteResident] = useState<Resident | null>(null);

  const openAddPopup = () => setIsAddPopupOpen(true);

  const residents: Resident[] = [
    { id: 1, hoTen: 'Nguyễn Văn An', gioiTinh: 'Nam', ngaySinh: '1993-12-24', cccd: '0173048134', ngheNghiep: 'Kỹ sư', laChuHo: true, maHoGiaDinh: 'HO001', danToc: 'Kinh', tonGiao: 'Không', ngayCap: '2012-01-01', noiCap: 'CA Hà Nội', hoKhauHienTai: '12B/3 Phường 1, Quận 1', quanHeVoiChuHo: 'Chủ hộ' },
    { id: 2, hoTen: 'Trần Thị Bình', gioiTinh: 'Nữ', ngaySinh: '1987-07-15', cccd: '0173054376', ngheNghiep: 'Nhân viên văn phòng', danToc: 'Kinh', tonGiao: 'Không', ngayCap: '2013-02-02', noiCap: 'CA Hà Nội', hoKhauHienTai: '12B/3 Phường 1, Quận 1', quanHeVoiChuHo: 'Vợ' },
    { id: 3, hoTen: 'Lê Minh Công', gioiTinh: 'Nam', ngaySinh: '2000-05-14', cccd: '0173081734', ngheNghiep: 'Sinh viên', danToc: 'Kinh', tonGiao: 'Không', ngayCap: '2018-03-03', noiCap: 'CA Hà Nội', hoKhauHienTai: '12B/3 Phường 1, Quận 1', quanHeVoiChuHo: 'Con' },
    { id: 4, hoTen: 'Phạm Thị Dung', gioiTinh: 'Nữ', ngaySinh: '1995-03-08', cccd: '0173065432', ngheNghiep: 'Giáo viên', danToc: 'Kinh', tonGiao: 'Không', ngayCap: '2014-04-04', noiCap: 'CA Hà Nội', hoKhauHienTai: '45/6 Phường 5, Quận 5', quanHeVoiChuHo: 'Chủ hộ' },
    { id: 5, hoTen: 'Hoàng Văn Em', gioiTinh: 'Nam', ngaySinh: '1990-11-20', cccd: '0173087654', ngheNghiep: 'Bác sĩ', danToc: 'Kinh', tonGiao: 'Không', ngayCap: '2011-05-05', noiCap: 'CA Hà Nội', hoKhauHienTai: '45/6 Phường 5, Quận 5', quanHeVoiChuHo: 'Con' },
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
                      className="px-4 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => {
                        if (sortBy === col.key) setSortAsc(!sortAsc);
                        else { setSortBy(col.key as any); setSortAsc(true); }
                      }}
                    >
                      {col.label} {sortBy === col.key ? (sortAsc ? '▲' : '▼') : ''}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sorted.map((rowData) => (
                  <tr key={rowData.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">{rowData.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{rowData.hoTen}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{rowData.gioiTinh}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{rowData.ngaySinh}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{rowData.cccd}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{rowData.ngheNghiep}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setDetailResident(rowData)}
                          className="p-1 rounded hover:bg-green-100 transition"
                          title="Xem chi tiết"
                        >
                          <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setEditResident(rowData)}
                          className="p-1 rounded hover:bg-blue-100 transition"
                          title="Sửa"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteResident(rowData)}
                          className="p-1 rounded hover:bg-red-100 transition"
                          title="Xóa"
                        >
                          <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Popup Thêm/Sửa nhân khẩu (to hơn) */}
      <AddEditNhanKhauPopup isOpen={isAddPopupOpen || !!editResident} onClose={() => { setIsAddPopupOpen(false); setEditResident(null); }} initialData={editResident || undefined} large />
      {/* Popup xem chi tiết */}
      {detailResident && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto relative">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Chi tiết nhân khẩu</h2>
              <button onClick={() => setDetailResident(null)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="font-medium text-gray-700">Họ tên:</span> <span className="ml-2 text-gray-900">{detailResident.hoTen}</span></div>
              <div><span className="font-medium text-gray-700">CCCD:</span> <span className="ml-2 text-gray-900">{detailResident.cccd}</span></div>
              <div><span className="font-medium text-gray-700">Giới tính:</span> <span className="ml-2 text-gray-900">{detailResident.gioiTinh}</span></div>
              <div><span className="font-medium text-gray-700">Ngày sinh:</span> <span className="ml-2 text-gray-900">{detailResident.ngaySinh}</span></div>
              <div><span className="font-medium text-gray-700">Dân tộc:</span> <span className="ml-2 text-gray-900">{detailResident.danToc}</span></div>
              <div><span className="font-medium text-gray-700">Tôn giáo:</span> <span className="ml-2 text-gray-900">{detailResident.tonGiao}</span></div>
              <div><span className="font-medium text-gray-700">Ngày cấp:</span> <span className="ml-2 text-gray-900">{detailResident.ngayCap}</span></div>
              <div><span className="font-medium text-gray-700">Nơi cấp:</span> <span className="ml-2 text-gray-900">{detailResident.noiCap}</span></div>
              <div><span className="font-medium text-gray-700">Nghề nghiệp:</span> <span className="ml-2 text-gray-900">{detailResident.ngheNghiep}</span></div>
              <div><span className="font-medium text-gray-700">Hộ khẩu hiện tại:</span> <span className="ml-2 text-gray-900">{detailResident.hoKhauHienTai}</span></div>
              <div><span className="font-medium text-gray-700">Quan hệ với chủ hộ:</span> <span className="ml-2 text-gray-900">{detailResident.quanHeVoiChuHo}</span></div>
            </div>
          </div>
        </div>
      )}
      {/* Popup xác nhận xóa */}
      {deleteResident && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-md">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Xác nhận xóa nhân khẩu</h2>
            <p className="text-sm text-gray-700">
              Bạn có chắc chắn muốn xóa nhân khẩu <strong>{deleteResident.hoTen}</strong> không?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setDeleteResident(null)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                Hủy
              </button>
              <button onClick={() => { /* TODO: Xử lý xóa thực tế */ setDeleteResident(null); }} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuanLyNhanKhau;
