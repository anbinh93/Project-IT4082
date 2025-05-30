import React, { useState } from 'react';
import Layout from '../components/Layout'; // Import Layout component
import AddEditDotThuPhiPopup from '../components/AddEditDotThuPhiPopup'; // Import Add popup
import EditDotThuPhiPopup from '../components/EditDotThuPhiPopup'; // Import Edit popup

// Sample data for payment batches (based on your table)
const sampleBatches = [
  {
    maDot: 'D001',
    tenDot: 'Tháng 05/2025',
    ngayTao: '01/05/2025',
    hanCuoi: '31/05/2025',
    trangThai: 'Đang mở',
    details: { // Add sample details
      maDot: 'D001',
      tenDot: 'Tháng 05/2025',
      ngayTao: '01/05/2025',
      hanCuoi: '31/05/2025',
      khoanThu: [
        { tenKhoan: 'Phí dịch vụ', chiTiet: 'Phí dịch vụ hàng tháng', thoiHan: '31/05/2025', soTien: '200,000 VND', batBuoc: 'Bắt buộc' },
        // Add more sample fees here if needed
      ]
    }
  },
  {
    maDot: 'D002',
    tenDot: 'Tháng 04/2025',
    ngayTao: '01/04/2025',
    hanCuoi: '30/04/2025',
    trangThai: 'Đã đóng',
     details: { // Add sample details
      maDot: 'D002',
      tenDot: 'Tháng 04/2025',
      ngayTao: '01/04/2025',
      hanCuoi: '30/04/2025',
      khoanThu: [
        { tenKhoan: 'Phí chung cư', chiTiet: 'Phí chung cư hàng tháng', thoiHan: '30/04/2025', soTien: '150,000 VND', batBuoc: 'Bắt buộc' },
      ]
    }
  },
    {
    maDot: 'D003',
    tenDot: 'Quý I /2025',
    ngayTao: '01/01/2025',
    hanCuoi: '31/03/2025',
    trangThai: 'Đã đóng',
     details: { // Add sample details
      maDot: 'D003',
      tenDot: 'Quý I /2025',
      ngayTao: '01/01/2025',
      hanCuoi: '31/03/2025',
      khoanThu: [
        { tenKhoan: 'Phí quản lý', chiTiet: 'Phí quản lý quý', thoiHan: '31/03/2025', soTien: '300,000 VND', batBuoc: 'Bắt buộc' },
      ]
    }
  },
];

const QuanLyDotThuPhi: React.FC = () => {
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false); // State for Add popup
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false); // State for Edit popup
  const [selectedBatch, setSelectedBatch] = useState(sampleBatches[0].details); // State for selected batch details

  const openAddPopup = () => setIsAddPopupOpen(true);
  const closeAddPopup = () => setIsAddPopupOpen(false);
  const openEditPopup = () => setIsEditPopupOpen(true); // Handler to open edit popup
  const closeEditPopup = () => setIsEditPopupOpen(false); // Handler to close edit popup

  const handleRowClick = (batchDetails: any) => {
    setSelectedBatch(batchDetails);
  };

  return (
    <>
    <Layout role="ketoan"> {/* Wrap with Layout */} 
      <div className="p-4 flex flex-col gap-6">
        {/* Page Title and Welcome Text */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">QUẢN LÝ ĐỢT THU PHÍ</h1>
          <p className="text-gray-600 text-sm mt-1">Chào mừng đến với Hệ thống Quản lý Thu phí Chung cư</p>
        </div>

        {/* Search and Add Button Area */}
        <div className="flex items-center gap-4">
          {/* Search Input Container */}
          <div className="flex items-center border border-gray-300 rounded-md shadow-sm overflow-hidden flex-1">
            {/* Search Icon Placeholder */}
            <div className="p-2 text-gray-400">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
               </svg>
            </div>
            <input
              type="text"
              placeholder="Nhập tên đợt thu"
              className="flex-1 p-2 border-l border-gray-300 outline-none text-sm"
            />
             {/* Small Button Placeholder */}
             <button className="p-2 border-l border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100">
              ...
             </button>
          </div>

          {/* Add New Batch Button */}
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 flex items-center gap-2"
                  onClick={openAddPopup} // Add onClick handler
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tạo đợt thu mới
          </button>
        </div>

        {/* Main Content Area (Table and Details) */}
        <div className="flex gap-6">
          {/* Left Section: List of Payment Batches (Table) */}
          <div className="flex-1 bg-white rounded-md shadow-md overflow-hidden border border-gray-200">
             {/* Table Title */}
            <div className="p-4 bg-gray-100 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Danh sách đợt thu</h2>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Mã đợt</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Tên đợt</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Ngày tạo</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Hạn cuối</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Sample Rows */}
                {sampleBatches.map((batch) => (
                  <tr key={batch.maDot}> {/* Use a unique key, like maDot */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{batch.maDot}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{batch.tenDot}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{batch.ngayTao}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{batch.hanCuoi}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${batch.trangThai === 'Đang mở' ? 'text-green-600' : 'text-red-600'}`}>
                      {batch.trangThai}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 cursor-pointer"
                      onClick={() => handleRowClick(batch.details)} // Pass the correct details for this batch
                    >
                      Chi tiết
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right Section: Payment Batch Details */}
          <div className="w-1/3 bg-white rounded-md shadow-md overflow-hidden border border-gray-200 p-4 flex flex-col gap-4"> {/* Added padding and flex column */}
             {/* Details Title */}
             <h2 className="text-lg font-semibold text-gray-800">Chi tiết đợt thu</h2>

             {/* Display Details based on selectedBatch state */}
             {selectedBatch ? (
               <div className="flex flex-col gap-2">
                  <p className="text-sm text-gray-700 font-semibold">{selectedBatch.tenDot}</p>
                  <div className="text-sm text-gray-600">
                      <p><strong>Mã đợt:</strong> {selectedBatch.maDot}</p>
                      <p><strong>Ngày tạo:</strong> {selectedBatch.ngayTao}</p>
                      <p><strong>Hạn cuối:</strong> {selectedBatch.hanCuoi}</p>
                  </div>

                   <hr className="border-gray-200"/> {/* Divider */}

                   {/* List of Fees in the Batch */}
                   <h3 className="text-md font-semibold text-gray-800">Danh sách khoản thu</h3>

                   {selectedBatch.khoanThu.map((fee, index) => (
                     <div key={index} className="border border-gray-300 rounded-md p-3 flex flex-col gap-2">
                         <p className="text-sm text-gray-800 font-semibold">{fee.tenKhoan}</p>
                         <p className="text-sm text-gray-600">{fee.chiTiet}</p>
                         <div className="flex items-center justify-between text-sm text-gray-700">
                            <p><strong>Thời hạn:</strong> {fee.thoiHan}</p>
                            <p><strong>Số tiền:</strong> <span className="text-green-600 font-semibold">{fee.soTien}</span></p>
                         </div>
                         <div className="flex items-center justify-between text-sm text-gray-700">
                            <p><strong>Bắt buộc:</strong> <span className="text-red-600 font-semibold">{fee.batBuoc}</span></p>
                             <button className="text-indigo-600 hover:text-indigo-900" onClick={openEditPopup}>Sửa</button>
                         </div>
                     </div>
                   ))}
               </div>
             ) : (
               <div className="text-center text-gray-500 text-sm">Chọn một đợt thu để xem chi tiết</div>
             )}
          </div>
    </div>
  </div>
    </Layout>
    <AddEditDotThuPhiPopup isOpen={isAddPopupOpen} onClose={closeAddPopup} />
    <EditDotThuPhiPopup isOpen={isEditPopupOpen} onClose={closeEditPopup} />
    </>
  );
};

export default QuanLyDotThuPhi; 