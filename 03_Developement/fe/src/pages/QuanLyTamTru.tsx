import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Layout from '../components/Layout';
import AddEditTamTruPopup from '../components/AddEditTamTruPopup';

interface TamTruData {
  id: string;
  hoTen: string;
  trangThai: 'Tạm trú' | 'Tạm vắng';
  diaChi: string;
  tuNgay: string;
  denNgay: string;
  noiDungDeNghi: string;
}

const QuanLyTamTru: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Tất cả");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [editingData, setEditingData] = useState<TamTruData | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [dataList, setDataList] = useState<TamTruData[]>([
    {
      id: "1",
      hoTen: "Nguyễn Văn An",
      trangThai: "Tạm trú",
      diaChi: "123 Lê Lợi, Q.1, TP.HCM",
      tuNgay: "2025-05-01",
      denNgay: "2025-08-01",
      noiDungDeNghi: "Đăng ký tạm trú để thực tập tại công ty"
    },
    {
      id: "2",
      hoTen: "Trần Thị Bình",
      trangThai: "Tạm vắng",
      diaChi: "45 Nguyễn Du, Q.3, TP.HCM",
      tuNgay: "2025-06-10",
      denNgay: "2025-07-05",
      noiDungDeNghi: "Xin tạm vắng để về quê chăm người thân"
    },
    {
      id: "3",
      hoTen: "Lê Minh Công",
      trangThai: "Tạm trú",
      diaChi: "98 Phạm Văn Đồng, Q. Gò Vấp",
      tuNgay: "2025-05-15",
      denNgay: "2025-06-30",
      noiDungDeNghi: "Gia hạn tạm trú do chưa hoàn thành khóa học"
    }
  ]);

  const openPopupForAdd = () => {
    setEditingData(null);
    setIsPopupOpen(true);
  };

  const openPopupForEdit = (data: TamTruData) => {
    setEditingData(data);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setEditingData(null);
  };

  const handleSave = (newData: Omit<TamTruData, 'id'>) => {
    if (editingData) {
      // Cập nhật
      setDataList(prev =>
        prev.map(item =>
          item.id === editingData.id ? { ...editingData, ...newData } : item
        )
      );
    } else {
      // Thêm mới
      const newId = Date.now().toString();
      setDataList(prev => [...prev, { id: newId, ...newData }]);
    }
    closePopup();
  };

  const handleEdit = (id: string) => {
    const item = dataList.find(d => d.id === id);
    if (item) openPopupForEdit(item);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa không?")) {
      setDataList(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleFilterSelect = (option: string) => {
    setSelectedFilter(option);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    if (!isDropdownOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setIsDropdownOpen(false);
    };

    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isDropdownOpen]);

  // Xử lý tìm kiếm
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  // Logic lọc dữ liệu kết hợp cả filter và search
  const filteredData = dataList.filter(item => {
    // Lọc theo trạng thái
    const matchesFilter = selectedFilter === "Tất cả" || item.trangThai === selectedFilter;
    
    // Lọc theo từ khóa tìm kiếm (tìm trong họ tên, địa chỉ, nội dung đề nghị)
    const matchesSearch = searchKeyword === "" || 
      item.hoTen.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.diaChi.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.noiDungDeNghi.toLowerCase().includes(searchKeyword.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <Layout role="totruong">
        <div className="min-h-screen bg-gray-50">
          <div className="p-4 flex flex-col gap-6" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' }}>
            <div>
              <h1 className="text-2xl font-medium text-gray-900" style={{ fontWeight: '500' }}>QUẢN LÝ TẠM TRÚ/TẠM VẮNG</h1>
              <p className="text-gray-500 text-sm mt-1" style={{ fontWeight: '400' }}>Chào mừng đến với Hệ thống Quản lý Thu phí Chung cư</p>
            </div>

            <div className="flex items-center gap-4">
              {/* Dropdown chọn kiểu */}
              <div>
                <div 
                  ref={dropdownRef}
                  className="flex items-center border border-gray-300 rounded-md shadow-sm overflow-hidden cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown();
                  }}
                >
                  <input
                    type="text"
                    value={selectedFilter}
                    readOnly
                    className="flex-1 p-2 outline-none text-sm cursor-pointer bg-white"
                    style={{ fontWeight: '400', minWidth: '120px' }}
                  />
                  <button className="p-2 border-l border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Thanh tìm kiếm */}
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, địa chỉ hoặc nội dung"
                className="flex-1 p-2 border rounded-md shadow-sm text-sm"
                style={{ fontWeight: '400' }}
                value={searchKeyword}
                onChange={handleSearchChange}
              />

              <button 
                className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 flex items-center gap-2"
                style={{ fontWeight: '500' }}
                onClick={openPopupForAdd}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Thêm TT/TV
              </button>
            </div>

            <div className="mt-6 bg-white rounded-md shadow-md overflow-hidden border border-gray-200">
              <div className="p-4 bg-gray-100 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900" style={{ fontWeight: '500' }}>
                  Danh sách tạm trú/tạm vắng 
                  {searchKeyword && (
                    <span className="text-sm font-normal text-gray-600">
                      ({filteredData.length} kết quả cho "{searchKeyword}")
                    </span>
                  )}
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider" style={{ fontWeight: '500' }}>Họ tên</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider" style={{ fontWeight: '500' }}>Trạng thái</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider" style={{ fontWeight: '500' }}>Địa chỉ</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider" style={{ fontWeight: '500' }}>Thời gian</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider" style={{ fontWeight: '500' }}>Nội dung đề nghị</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider" style={{ fontWeight: '500' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500 text-sm">
                          {searchKeyword ? 
                            `Không tìm thấy kết quả nào cho "${searchKeyword}"` : 
                            "Không có dữ liệu"
                          }
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" style={{ fontWeight: '500' }}>{item.hoTen}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700" style={{ fontWeight: '400' }}>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              item.trangThai === 'Tạm trú' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {item.trangThai}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700" style={{ fontWeight: '400' }}>{item.diaChi}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700" style={{ fontWeight: '400' }}>{item.tuNgay} → {item.denNgay}</td>
                          <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate" style={{ fontWeight: '400' }} title={item.noiDungDeNghi}>{item.noiDungDeNghi}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex gap-3">
                              <button 
                                onClick={() => handleEdit(item.id)} 
                                className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                                title="Sửa"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button 
                                onClick={() => handleDelete(item.id)} 
                                className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                                title="Xóa"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Layout>

      {/* Portal Dropdown - render outside of Layout */}
      {isDropdownOpen && createPortal(
        <div 
          className="bg-white border border-gray-300 rounded-md shadow-lg"
          style={{
            position: 'fixed',
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
            zIndex: 9999,
            maxHeight: '200px',
            overflowY: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {["Tất cả", "Tạm trú", "Tạm vắng"].map((option) => (
            <div
              key={option}
              className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
              style={{ fontWeight: '400' }}
              onClick={() => handleFilterSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>,
        document.body
      )}

      <AddEditTamTruPopup
        isOpen={isPopupOpen}
        onClose={closePopup}
        editData={editingData}
        onSave={handleSave}
      />
    </>
  );
};

export default QuanLyTamTru;