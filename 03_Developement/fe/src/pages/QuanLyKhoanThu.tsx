import React, { useState } from 'react';
import Layout from '../components/Layout';
import NopPhiPopup from '../components/NopPhiPopup';
import DetailFeePopup from '../components/DetailFeePopup';

// Dữ liệu mẫu cho các khoản thu
const sampleFees = [
  {
    id: 'KT001',
    ngayTao: '01/05/2025',
    thoiHan: '31/05/2025',
    tenKhoan: 'Phí dịch vụ chung cư',
    loaiKhoan: 'PHI_DICH_VU',
    batBuoc: true,
    ghiChu: 'Phí dịch vụ tháng 5',
    trangThai: 'Đang thu',
    hoKhauList: [
      { maHo: 'HK001', chuHo: 'Nguyễn Văn A', trangThai: 'Đã nộp', ngayNop: '10/05/2025', soTien: 755000, nguoiNop: 'Nguyễn Văn A' },
      { maHo: 'HK002', chuHo: 'Trần Thị B', trangThai: 'Chưa nộp', soTien: 1002000 },
      { maHo: 'HK003', chuHo: 'Lê Văn C', trangThai: 'Đã nộp', ngayNop: '12/05/2025', soTien: 600000, nguoiNop: 'Lê Văn C' },
      { maHo: 'HK004', chuHo: 'Phạm Thị D', trangThai: 'Chưa nộp', soTien: 1205000 },
      { maHo: 'HK005', chuHo: 'Đỗ Văn E', trangThai: 'Chưa nộp', soTien: 850000 },
    ],
    isExpanded: false,
    hoKhauFilterOption: 'Tất cả'
  },
  {
    id: 'KT002',
    ngayTao: '01/05/2025',
    thoiHan: '31/05/2025',
    tenKhoan: 'Phí gửi xe',
    loaiKhoan: 'PHI_GUI_XE',
    batBuoc: true,
    ghiChu: 'Phí gửi xe tháng 5',
    trangThai: 'Đang thu',
    hoKhauList: [
      { maHo: 'HK001', chuHo: 'Nguyễn Văn A', trangThai: 'Chưa nộp', soTien: 140000 },
      { maHo: 'HK002', chuHo: 'Trần Thị B', trangThai: 'Đã nộp', ngayNop: '11/05/2025', soTien: 1270000, nguoiNop: 'Trần Thị B' },
      { maHo: 'HK003', chuHo: 'Lê Văn C', trangThai: 'Chưa nộp', soTien: 210000 },
      { maHo: 'HK004', chuHo: 'Phạm Thị D', trangThai: 'Chưa nộp', soTien: 1270000 },
      { maHo: 'HK005', chuHo: 'Đỗ Văn E', trangThai: 'Chưa nộp', soTien: 1340000 },
    ],
    isExpanded: false,
    hoKhauFilterOption: 'Tất cả'
  },
  {
    id: 'KT003',
    ngayTao: '01/04/2025',
    thoiHan: '30/04/2025',
    tenKhoan: 'Phí dịch vụ chung cư',
    loaiKhoan: 'PHI_DICH_VU',
    batBuoc: true,
    ghiChu: 'Phí dịch vụ tháng 4',
    trangThai: 'Đã thu xong',
    hoKhauList: [
      { maHo: 'HK001', chuHo: 'Nguyễn Văn A', trangThai: 'Đã nộp', ngayNop: '10/04/2025', soTien: 700000, nguoiNop: 'Nguyễn Văn A' },
      { maHo: 'HK002', chuHo: 'Trần Thị B', trangThai: 'Đã nộp', ngayNop: '11/04/2025', soTien: 950000, nguoiNop: 'Trần Thị B' },
      { maHo: 'HK003', chuHo: 'Lê Văn C', trangThai: 'Đã nộp', ngayNop: '12/04/2025', soTien: 600000, nguoiNop: 'Lê Văn C' },
      { maHo: 'HK004', chuHo: 'Phạm Thị D', trangThai: 'Đã nộp', ngayNop: '13/04/2025', soTien: 1200000, nguoiNop: 'Phạm Thị D' },
      { maHo: 'HK005', chuHo: 'Đỗ Văn E', trangThai: 'Đã nộp', ngayNop: '14/04/2025', soTien: 800000, nguoiNop: 'Đỗ Văn E' },
    ],
    isExpanded: false,
    hoKhauFilterOption: 'Tất cả'
  },
  {
    id: 'KT004',
    ngayTao: '01/04/2025',
    thoiHan: '30/04/2025',
    tenKhoan: 'Phí gửi xe',
    loaiKhoan: 'PHI_GUI_XE',
    batBuoc: true,
    ghiChu: 'Phí gửi xe tháng 4',
    trangThai: 'Đã thu xong',
    hoKhauList: [
      { maHo: 'HK001', chuHo: 'Nguyễn Văn A', trangThai: 'Đã nộp', ngayNop: '10/04/2025', soTien: 70000, nguoiNop: 'Nguyễn Văn A' },
      { maHo: 'HK002', chuHo: 'Trần Thị B', trangThai: 'Đã nộp', ngayNop: '11/04/2025', soTien: 1270000, nguoiNop: 'Trần Thị B' },
      { maHo: 'HK003', chuHo: 'Lê Văn C', trangThai: 'Đã nộp', ngayNop: '12/04/2025', soTien: 210000, nguoiNop: 'Lê Văn C' },
      { maHo: 'HK004', chuHo: 'Phạm Thị D', trangThai: 'Đã nộp', ngayNop: '13/04/2025', soTien: 1270000, nguoiNop: 'Phạm Thị D' },
      { maHo: 'HK005', chuHo: 'Đỗ Văn E', trangThai: 'Đã nộp', ngayNop: '14/04/2025', soTien: 1340000, nguoiNop: 'Đỗ Văn E' },
    ],
    isExpanded: false,
    hoKhauFilterOption: 'Tất cả'
  },
  {
    id: 'KT005',
    ngayTao: '01/01/2025',
    thoiHan: '31/03/2025',
    tenKhoan: 'Phí quản lý',
    loaiKhoan: 'PHI_QUAN_LY',
    batBuoc: true,
    ghiChu: 'Phí quản lý quý',
    trangThai: 'Đã thu xong',
    hoKhauList: [
      { maHo: 'HK001', chuHo: 'Nguyễn Văn A', trangThai: 'Đã nộp', ngayNop: '10/01/2025', soTien: 400000, nguoiNop: 'Nguyễn Văn A' },
      { maHo: 'HK002', chuHo: 'Trần Thị B', trangThai: 'Đã nộp', ngayNop: '11/01/2025', soTien: 700000, nguoiNop: 'Trần Thị B' },
      { maHo: 'HK003', chuHo: 'Lê Văn C', trangThai: 'Đã nộp', ngayNop: '12/01/2025', soTien: 300000, nguoiNop: 'Lê Văn C' },
      { maHo: 'HK004', chuHo: 'Phạm Thị D', trangThai: 'Đã nộp', ngayNop: '13/01/2025', soTien: 900000, nguoiNop: 'Phạm Thị D' },
      { maHo: 'HK005', chuHo: 'Đỗ Văn E', trangThai: 'Đã nộp', ngayNop: '14/01/2025', soTien: 500000, nguoiNop: 'Đỗ Văn E' },
    ],
    isExpanded: false,
    hoKhauFilterOption: 'Tất cả'
  },
  {
    id: 'KT006',
    ngayTao: '01/01/2025',
    thoiHan: '31/03/2025',
    tenKhoan: 'Phí sửa chữa chung',
    loaiKhoan: 'KHOAN_DONG_GOP',
    batBuoc: false,
    ghiChu: 'Sửa chữa cơ sở vật chất',
    trangThai: 'Đã thu xong',
    hoKhauList: [
      { maHo: 'HK001', chuHo: 'Nguyễn Văn A', trangThai: 'Đã nộp', ngayNop: '10/01/2025', soTien: 100000, nguoiNop: 'Nguyễn Văn A' },
      { maHo: 'HK002', chuHo: 'Trần Thị B', trangThai: 'Đã nộp', ngayNop: '11/01/2025', soTien: 200000, nguoiNop: 'Trần Thị B' },
      { maHo: 'HK003', chuHo: 'Lê Văn C', trangThai: 'Đã nộp', ngayNop: '12/01/2025', soTien: 0, nguoiNop: 'Lê Văn C' },
      { maHo: 'HK004', chuHo: 'Phạm Thị D', trangThai: 'Đã nộp', ngayNop: '13/01/2025', soTien: 0, nguoiNop: 'Phạm Thị D' },
      { maHo: 'HK005', chuHo: 'Đỗ Văn E', trangThai: 'Đã nộp', ngayNop: '14/01/2025', soTien: 0, nguoiNop: 'Đỗ Văn E' },
    ],
    isExpanded: false,
    hoKhauFilterOption: 'Tất cả'
  }
];

const QuanLyKhoanThu: React.FC = () => {
  const [isNopPhiPopupOpen, setIsNopPhiPopupOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('Tất cả');
  const [selectedFee, setSelectedFee] = useState<any | null>(null);
  const [selectedHoKhau, setSelectedHoKhau] = useState<any | null>(null);
  const [fees, setFees] = useState(sampleFees);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDetailFeePopupOpen, setIsDetailFeePopupOpen] = useState(false);
  const [selectedDetailFee, setSelectedDetailFee] = useState<any | null>(null);

  // Xử lý mở popup nhập thông tin nộp phí
  const handleOpenPopup = (fee?: any, hoKhau?: any, isEdit: boolean = false) => {
    setSelectedFee(fee || null);
    setSelectedHoKhau(hoKhau || null);
    setIsEditMode(isEdit);
    setIsNopPhiPopupOpen(true);
  };

  // Đóng popup
  const handleClosePopup = () => {
    setIsNopPhiPopupOpen(false);
    setIsEditMode(false);
  };

  // Xử lý khi lưu thông tin nộp phí
  const handleSaveNopPhi = (data: any) => {
    // Cập nhật trạng thái của hộ khẩu
    setFees(prevFees => 
      prevFees.map(fee => {
        if (fee.id === data.khoanThuId) {
          const updatedHoKhauList = fee.hoKhauList.map((ho: any) => {
            if (ho.maHo === data.hoKhauId) {
              // Nếu đang chuyển từ đã nộp sang chưa nộp
              if (data.trangThai === 'Chưa nộp') {
                return {
                  ...ho,
                  trangThai: 'Chưa nộp',
                  ngayNop: undefined,
                  soTien: undefined,
                  nguoiNop: undefined
                };
              }
              // Nếu đang chuyển từ chưa nộp sang đã nộp
              return {
                ...ho,
                trangThai: 'Đã nộp',
                ngayNop: data.ngayNop,
                soTien: data.soTien,
                nguoiNop: data.nguoiNopTen
              };
            }
            return ho;
          });

          return {
            ...fee,
            hoKhauList: updatedHoKhauList,
            // Kiểm tra xem tất cả các hộ đã nộp hay chưa
            trangThai: updatedHoKhauList.every((ho: any) => ho.trangThai === 'Đã nộp') 
              ? 'Đã thu xong' 
              : 'Đang thu'
          };
        }
        return fee;
      })
    );
  };

  // Mở rộng/thu gọn thông tin khoản thu
  const toggleExpandFee = (id: string) => {
    setFees(prev => prev.map(fee => 
      fee.id === id 
        ? { ...fee, isExpanded: !fee.isExpanded } 
        : fee
    ));
  };

  // Sắp xếp danh sách khoản thu: gần đây nhất trước, cùng ngày thì sắp xếp theo thứ tự từ điển của tên
  const sortedFees = [...fees].sort((a, b) => {
    // Chuyển đổi định dạng ngày dd/mm/yyyy sang yyyy-mm-dd để so sánh
    const dateA = a.ngayTao.split('/').reverse().join('-');
    const dateB = b.ngayTao.split('/').reverse().join('-');
    
    // So sánh ngày tạo (gần đây nhất trước)
    if (dateB !== dateA) {
      return dateB.localeCompare(dateA);
    }
    
    // Nếu cùng ngày, sắp xếp theo tên
    return a.tenKhoan.localeCompare(b.tenKhoan);
  });

  // Lọc danh sách khoản thu theo điều kiện tìm kiếm và bộ lọc
  const filteredFees = sortedFees.filter(fee => {
    const matchSearch = fee.tenKhoan.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Lọc theo trạng thái
    const matchFilter = 
      filterOption === 'Tất cả' ? true :
      filterOption === 'Bắt buộc' ? fee.batBuoc === true :
      filterOption === 'Không bắt buộc' ? fee.batBuoc === false :
      filterOption === 'Đang thu' ? fee.trangThai === 'Đang thu' :
      filterOption === 'Đã thu xong' ? fee.trangThai === 'Đã thu xong' : 
      true;
    
    return matchSearch && matchFilter;
  });

  const openDetailFeePopup = (fee: any) => {
    setSelectedDetailFee(fee);
    setIsDetailFeePopupOpen(true);
  };

  const closeDetailFeePopup = () => {
    setIsDetailFeePopupOpen(false);
    setSelectedDetailFee(null);
  };

  return (
    <>
    <Layout role="ketoan">
    <div className="p-4 flex flex-col gap-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">QUẢN LÝ KHOẢN THU</h1>
        <p className="text-gray-600 text-sm mt-1">Chào mừng đến với Hệ thống Quản lý Thu phí Chung cư</p>
      </div>

      {/* Search and Add Button Area */}
      <div className="flex items-center gap-4">
        {/* Search Input Container */}
        <div className="flex items-center border border-gray-300 rounded-md shadow-sm overflow-hidden flex-1">
          {/* Search Icon */}
          <div className="p-2 text-gray-400">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
             </svg>
          </div>
          <input
            type="text"
            placeholder="Tìm theo tên khoản thu..."
            className="flex-1 p-2 border-l border-gray-300 outline-none text-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>

        {/* Filter Dropdown */}
        <div className="border border-gray-300 rounded-md shadow-sm overflow-hidden bg-white">
          <select
            className="p-2 text-sm bg-white outline-none"
            value={filterOption}
            onChange={e => setFilterOption(e.target.value)}
          >
            <option value="Tất cả">Tất cả</option>
            <option value="Bắt buộc">Bắt buộc</option>
            <option value="Không bắt buộc">Không bắt buộc</option>
            <option value="Đang thu">Đang thu</option>
            <option value="Đã thu xong">Đã thu xong</option>
          </select>
        </div>

        {/* Add Button */}
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 flex items-center gap-2"
          onClick={() => handleOpenPopup()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nhập thông tin nộp phí
        </button>
      </div>

      {/* Main Content Area - Table */}
      <div className="bg-white rounded-md shadow-md overflow-hidden border border-gray-200">
        {/* Table Title */}
        <div className="p-4 bg-gray-100 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Danh sách khoản thu</h2>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Ngày tạo</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Thời hạn</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Tên khoản thu</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Bắt buộc?</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Ghi chú</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredFees.map((fee) => (
              <React.Fragment key={fee.id}>
                <tr 
                  className={`hover:bg-gray-50 cursor-pointer transition-all ${fee.isExpanded ? 'bg-blue-50 border-t-2 border-blue-200' : ''}`}
                  onClick={() => toggleExpandFee(fee.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fee.ngayTao}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fee.thoiHan}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    <div className="flex items-center">
                      <span className="mr-2">{fee.tenKhoan}</span>
                      {fee.isExpanded ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${fee.batBuoc ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                      {fee.batBuoc ? 'Có' : 'Không'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fee.ghiChu}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${fee.trangThai === 'Đang thu' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {fee.trangThai}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button onClick={e => { e.stopPropagation(); openDetailFeePopup(fee); }} className="text-green-600 hover:text-green-800" title="Xem chi tiết">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </Layout>
    
    {/* Popup Nhập thông tin nộp phí */}
    <NopPhiPopup
      isOpen={isNopPhiPopupOpen}
      onClose={handleClosePopup}
      selectedFee={selectedFee}
      selectedHoKhau={selectedHoKhau}
      onSave={handleSaveNopPhi}
      isEditMode={isEditMode}
    />

    {/* Popup chi tiết khoản thu */}
    <DetailFeePopup
      isOpen={isDetailFeePopupOpen}
      onClose={closeDetailFeePopup}
      fee={selectedDetailFee}
    />
    </>
  );
};

export default QuanLyKhoanThu; 