import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout'; // Import Layout component
import AddEditDotThuPhiPopup from '../components/AddEditDotThuPhiPopup'; // Import Add popup
import EditDotThuPhiPopup from '../components/EditDotThuPhiPopup'; // Import Edit popup
import AddEditFeePopup from '../components/AddEditFeePopup'; // Import Add/Edit Fee popup
import { FEE_TYPES } from '../components/AddEditFeePopup';
import api from '../services/api';

// Function to map fee names from database to fee types
const mapFeeNameToType = (feeNameFromDB: string): string => {
  const nameLower = feeNameFromDB.toLowerCase();
  
  if (nameLower.includes('dịch vụ') || nameLower.includes('dich vu')) {
    return 'PHI_DICH_VU';
  } else if (nameLower.includes('quản lý') || nameLower.includes('quan ly')) {
    return 'PHI_QUAN_LY';
  } else if (nameLower.includes('gửi xe') || nameLower.includes('gui xe') || nameLower.includes('xe')) {
    return 'PHI_GUI_XE';
  } else if (nameLower.includes('điện') || nameLower.includes('dien')) {
    return 'PHI_DIEN';
  } else if (nameLower.includes('nước') || nameLower.includes('nuoc')) {
    return 'PHI_NUOC';
  } else if (nameLower.includes('internet') || nameLower.includes('mạng')) {
    return 'PHI_INTERNET';
  } else if (nameLower.includes('vệ sinh') || nameLower.includes('ve sinh')) {
    return 'PHI_VE_SINH';
  }
  
  // Default to service fee if no match found
  return 'PHI_DICH_VU';
};

// Định nghĩa type mới cho khoản thu và batch
interface HouseholdFee {
  amount: number;
  auto: boolean;
}
interface FeeItem {
  id: string;
  type: string;
  tenKhoan: string;
  chiTiet: string;
  batBuoc: string;
  householdFees: { [maHo: string]: HouseholdFee };
}
interface BatchDetails {
  maDot: string;
  tenDot: string;
  ngayTao: string;
  hanCuoi: string;
  khoanThu: FeeItem[];
}
interface Batch {
  maDot: string;
  tenDot: string;
  ngayTao: string;
  hanCuoi: string;
  trangThai: string;
  details: BatchDetails;
  isExpanded: boolean;
}

// Sample data for payment batches (dùng cấu trúc mới cho khoản thu)
const sampleBatches: Batch[] = [
  {
    maDot: 'D001',
    tenDot: 'Tháng 05/2025',
    ngayTao: '01/05/2025',
    hanCuoi: '31/05/2025',
    trangThai: 'Đang mở',
    details: {
      maDot: 'D001',
      tenDot: 'Tháng 05/2025',
      ngayTao: '01/05/2025',
      hanCuoi: '31/05/2025',
      khoanThu: [
        {
          id: 'K001',
          type: 'PHI_DICH_VU',
          tenKhoan: 'Phí dịch vụ chung cư',
          chiTiet: 'Phí dịch vụ tháng 5',
          batBuoc: 'Bắt buộc',
          householdFees: {
            HK001: { amount: 755000, auto: true },
            HK002: { amount: 1002000, auto: true },
            HK003: { amount: 600000, auto: true },
            HK004: { amount: 1205000, auto: true },
            HK005: { amount: 850000, auto: true }
          }
        },
        {
          id: 'K002',
          type: 'PHI_GUI_XE',
          tenKhoan: 'Phí gửi xe',
          chiTiet: 'Phí gửi xe tháng 5',
          batBuoc: 'Bắt buộc',
          householdFees: {
            HK001: { amount: 140000, auto: true },
            HK002: { amount: 1270000, auto: true },
            HK003: { amount: 210000, auto: true },
            HK004: { amount: 1270000, auto: true },
            HK005: { amount: 1340000, auto: true }
          }
        }
      ]
    },
    isExpanded: false
  },
  {
    maDot: 'D002',
    tenDot: 'Tháng 04/2025',
    ngayTao: '01/04/2025',
    hanCuoi: '30/04/2025',
    trangThai: 'Đã đóng',
    details: {
      maDot: 'D002',
      tenDot: 'Tháng 04/2025',
      ngayTao: '01/04/2025',
      hanCuoi: '30/04/2025',
      khoanThu: [
        {
          id: 'K004',
          type: 'PHI_DICH_VU',
          tenKhoan: 'Phí dịch vụ chung cư',
          chiTiet: 'Phí dịch vụ tháng 4',
          batBuoc: 'Bắt buộc',
          householdFees: {
            HK001: { amount: 700000, auto: true },
            HK002: { amount: 950000, auto: true },
            HK003: { amount: 600000, auto: true },
            HK004: { amount: 1200000, auto: true },
            HK005: { amount: 800000, auto: true }
          }
        },
        {
          id: 'K005',
          type: 'PHI_GUI_XE',
          tenKhoan: 'Phí gửi xe',
          chiTiet: 'Phí gửi xe tháng 4',
          batBuoc: 'Bắt buộc',
          householdFees: {
            HK001: { amount: 70000, auto: true },
            HK002: { amount: 1270000, auto: true },
            HK003: { amount: 210000, auto: true },
            HK004: { amount: 1270000, auto: true },
            HK005: { amount: 1340000, auto: true }
          }
        }
      ]
    },
    isExpanded: false
  },
  {
    maDot: 'D003',
    tenDot: 'Quý I /2025',
    ngayTao: '01/01/2025',
    hanCuoi: '31/03/2025',
    trangThai: 'Đã đóng',
    details: {
      maDot: 'D003',
      tenDot: 'Quý I /2025',
      ngayTao: '01/01/2025',
      hanCuoi: '31/03/2025',
      khoanThu: [
        {
          id: 'K006',
          type: 'PHI_QUAN_LY',
          tenKhoan: 'Phí quản lý',
          chiTiet: 'Phí quản lý quý',
          batBuoc: 'Bắt buộc',
          householdFees: {
            HK001: { amount: 400000, auto: true },
            HK002: { amount: 700000, auto: true },
            HK003: { amount: 300000, auto: true },
            HK004: { amount: 900000, auto: true },
            HK005: { amount: 500000, auto: true }
          }
        },
        {
          id: 'K007',
          type: 'KHOAN_DONG_GOP',
          tenKhoan: 'Phí sửa chữa chung',
          chiTiet: 'Sửa chữa cơ sở vật chất',
          batBuoc: 'Không bắt buộc',
          householdFees: {
            HK001: { amount: 100000, auto: true },
            HK002: { amount: 200000, auto: true },
            HK003: { amount: 0, auto: true },
            HK004: { amount: 0, auto: true },
            HK005: { amount: 0, auto: true }
          }
        }
      ]
    },
    isExpanded: false
  }
];

const QuanLyDotThuPhi: React.FC = () => {
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false); // State for Add popup
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false); // State for Edit popup
  const [selectedBatch, setSelectedBatch] = useState<any | null>(null); // State for selected batch details
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Tất cả');
  const [batches, setBatches] = useState<Batch[]>([]); // State for all batches - start empty
  
  // API related states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Thêm các state mới
  const [isDeleteBatchConfirmOpen, setIsDeleteBatchConfirmOpen] = useState(false); // Xác nhận xóa đợt thu
  const [isAddFeePopupOpen, setIsAddFeePopupOpen] = useState(false); // Thêm khoản thu
  const [isEditFeePopupOpen, setIsEditFeePopupOpen] = useState(false); // Sửa khoản thu
  const [isDeleteFeeConfirmOpen, setIsDeleteFeeConfirmOpen] = useState(false); // Xác nhận xóa khoản thu
  const [selectedFee, setSelectedFee] = useState<any | null>(null); // Khoản thu được chọn để sửa/xóa
  const [activeBatchForFee, setActiveBatchForFee] = useState<any | null>(null); // Đợt thu đang được thao tác với khoản thu
  const [addFeeError, setAddFeeError] = useState<string | null>(null);

  // Load fee collection periods from API
  useEffect(() => {
    console.log('🚀 QuanLyDotThuPhi component mounted');
    loadDotThuData();
  }, []);

  const loadDotThuData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Loading fee collection data from API...');
      console.log('📊 Current batches state:', batches);
      console.log('📊 Sample batches available:', sampleBatches);
      console.log('🔑 Checking authentication token...');
      
      // Check if we have a valid auth token
      const authToken = localStorage.getItem('authToken');
      console.log('🔑 Auth token:', authToken ? 'Present' : 'Missing');
      
      if (!authToken) {
        console.warn('⚠️  No auth token found, using sample data');
        setError('Vui lòng đăng nhập để tải dữ liệu từ server.');
        setBatches(sampleBatches);
        return;
      }
      
      try {
        // Load all fee collection periods
        const response = await api.dotThu.getAll({
          page: 0,
          size: 100, // Load all for now
          sortBy: 'createdAt',
          sortDir: 'desc'
        });
        
        console.log('📊 API Response:', response);
        
        if (response && response.dotThus) {
          // Transform API data to match frontend structure
          const transformedBatches = response.dotThus.map((dotThu: any) => {
            // Transform khoanThu from API format to frontend format
            const transformedKhoanThu = (dotThu.khoanThu || []).map((khoanthu: any) => ({
              id: khoanthu.id,
              type: mapFeeNameToType(khoanthu.tenkhoanthu), // Use mapping function
              tenKhoan: khoanthu.tenkhoanthu, // Fix field name to match interface
              chiTiet: khoanthu.tenkhoanthu, // Use name as description for now
              batBuoc: 'Bắt buộc', // Default to mandatory
              soTien: khoanthu.DotThu_KhoanThu?.soTien || '0',
              householdFees: {} // Empty for now, can be populated later
            }));

            console.log('🔄 Transformed khoanThu for dotThu', dotThu.id, ':', transformedKhoanThu);

            return {
              maDot: dotThu.id,
              tenDot: dotThu.tenDotThu,
              ngayTao: formatDate(dotThu.ngayTao),
              hanCuoi: formatDate(dotThu.thoiHan),
              trangThai: isDatePast(dotThu.thoiHan) ? 'Đã đóng' : 'Đang mở',
              details: {
                maDot: dotThu.id,
                tenDot: dotThu.tenDotThu,
                ngayTao: formatDate(dotThu.ngayTao),
                hanCuoi: formatDate(dotThu.thoiHan),
                khoanThu: transformedKhoanThu
              },
              isExpanded: false
            };
          });
          
          console.log('✅ Transformed batches:', transformedBatches);
          setBatches(transformedBatches);
        } else {
          console.log('⚠️  No data returned from API, setting empty array');
          setBatches([]);
        }
      } catch (apiError) {
        console.warn('⚠️  API call failed, using sample data as fallback:', apiError);
        setError('Không thể tải dữ liệu từ server. Đang hiển thị dữ liệu mẫu.');
        setBatches(sampleBatches);
      }
    } catch (error) {
      console.error('❌ Error loading fee collection data:', error);
      setError('Không thể tải dữ liệu đợt thu phí. Đang sử dụng dữ liệu mẫu.');
      // Fallback to sample data if API fails
      setBatches(sampleBatches);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format date from API response
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Helper function to check if date is past
  const isDatePast = (dateString: string) => {
    const today = new Date();
    const compareDate = new Date(dateString);
    return compareDate < today;
  };

  // Hàm kiểm tra và cập nhật trạng thái đợt thu
  const updateBatchStatus = (batch: any) => {
    const today = new Date().toISOString().slice(0, 10);
    const hanCuoi = batch.hanCuoi;
    
    // Nếu ngày hiện tại > hạn cuối và đang mở thì chuyển sang đã đóng
    if (today > hanCuoi && batch.trangThai === 'Đang mở') {
      return { ...batch, trangThai: 'Đã đóng' };
    }
    
    return batch;
  };

  // Filtered batches với trạng thái đã cập nhật
  const filteredBatches = batches
    .map(updateBatchStatus) // Cập nhật trạng thái trước khi filter
    .filter(batch => {
      const matchSearch = batch.tenDot.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === 'Tất cả' ? true : (filter === 'Đang mở' ? batch.trangThai === 'Đang mở' : batch.trangThai === 'Đã đóng');
      return matchSearch && matchFilter;
    });

  // Debug logs
  console.log('🔍 Debug render state:');
  console.log('- Batches:', batches);
  console.log('- Filtered batches:', filteredBatches);
  console.log('- Loading:', loading);
  console.log('- Error:', error);
  console.log('- Search:', search);
  console.log('- Filter:', filter);

  // Mở rộng/thu gọn thông tin đợt thu
  const toggleExpandBatch = (maDot: string) => {
    setBatches(prev => prev.map(batch => 
      batch.maDot === maDot 
        ? { ...batch, isExpanded: !batch.isExpanded } 
        : batch
    ));
  };

  const openAddPopup = () => setIsAddPopupOpen(true);
  const closeAddPopup = () => setIsAddPopupOpen(false);
  
  // Chỉnh sửa đợt thu phí
  const openEditPopup = (batch: any, e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn việc mở rộng khi click vào nút sửa
    setSelectedBatch(batch);
    setIsEditPopupOpen(true);
  };
  const closeEditPopup = () => {
    setIsEditPopupOpen(false);
    setSelectedBatch(null);
  };

  // Xóa đợt thu phí
  const openDeleteBatchConfirm = (batch: any, e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn việc mở rộng khi click vào nút xóa
    setSelectedBatch(batch);
    setIsDeleteBatchConfirmOpen(true);
  };
  const closeDeleteBatchConfirm = () => {
    setIsDeleteBatchConfirmOpen(false);
    setSelectedBatch(null);
  };
  const handleDeleteBatch = async () => {
    if (selectedBatch) {
      try {
        console.log('🔄 Deleting batch:', selectedBatch.maDot);
        
        // Call API to delete batch
        const response = await api.dotThu.delete(selectedBatch.maDot);

        if (response.success) {
          console.log('✅ Batch deleted successfully');
          
          // Reload data from API to get fresh data
          await loadDotThuData();
          
          closeDeleteBatchConfirm();
          alert('Đã xóa đợt thu thành công!');
        } else {
          throw new Error(response.message || 'Không thể xóa đợt thu');
        }
      } catch (error: any) {
        console.error('❌ Error deleting batch:', error);
        alert('Có lỗi xảy ra khi xóa đợt thu: ' + (error.message || 'Lỗi không xác định'));
        
        // Fallback: remove from local state if API fails
        setBatches(prev => prev.filter(batch => batch.maDot !== selectedBatch.maDot));
        closeDeleteBatchConfirm();
      }
    }
  };

  // Thêm khoản thu vào đợt thu
  const openAddFeePopup = (batch: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (batch.trangThai === 'Đã đóng') {
      setAddFeeError('Không thể thêm khoản thu vào đợt thu đã đóng.');
      return;
    }
    setSelectedBatch(batch);
    setActiveBatchForFee(batch);
    setSelectedFee(null);
    setIsAddFeePopupOpen(true);
  };
  const closeAddFeePopup = () => {
    setIsAddFeePopupOpen(false);
  };
  const handleAddFee = async (newFee: any) => {
    if (activeBatchForFee) {
      try {
        // First, create the fee type in the backend
        const response = await api.khoanThu.create({
          tenKhoan: newFee.tenKhoan,
          batBuoc: newFee.batBuoc === 'Bắt buộc',
          ghiChu: newFee.chiTiet || '',
        });

        if (response.success) {
          console.log('✅ Fee created successfully:', response.data);
          
          // Reload data from API to get fresh data
          await loadDotThuData();
          closeAddFeePopup();
          
          // Show success message
          alert('Đã tạo khoản thu thành công!');
        } else {
          alert('Có lỗi xảy ra khi tạo khoản thu: ' + (response.message || 'Lỗi không xác định'));
        }
      } catch (error: any) {
        console.error('Error creating fee type:', error);
        alert('Có lỗi xảy ra khi tạo khoản thu: ' + (error.message || 'Lỗi không xác định'));
      }
    }
  };

  // Sửa khoản thu
  const openEditFeePopup = (fee: any, batch: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFee(fee);
    setActiveBatchForFee(batch);
    setIsEditFeePopupOpen(true);
  };
  const closeEditFeePopup = () => {
    setIsEditFeePopupOpen(false);
    setSelectedFee(null);
  };
  const handleEditFee = async (updatedFee: any) => {
    if (activeBatchForFee && selectedFee) {
      try {
        // Update the fee type in the backend if it has a backendId
        if (selectedFee.backendId) {
          const response = await api.khoanThu.update(selectedFee.backendId, {
            tenKhoan: updatedFee.tenKhoan,
            batBuoc: updatedFee.batBuoc === 'Bắt buộc',
            ghiChu: updatedFee.chiTiet || '',
          });

          if (!response.success) {
            alert('Có lỗi xảy ra khi cập nhật khoản thu: ' + (response.message || 'Lỗi không xác định'));
            return;
          }
        }

        console.log('✅ Fee updated successfully');
        
        // Reload data from API to get fresh data
        await loadDotThuData();
        closeEditFeePopup();
        
        // Show success message
        alert('Đã cập nhật khoản thu thành công!');
      } catch (error: any) {
        console.error('Error updating fee type:', error);
        alert('Có lỗi xảy ra khi cập nhật khoản thu: ' + (error.message || 'Lỗi không xác định'));
      }
    }
  };

  // Xóa khoản thu
  const openDeleteFeeConfirm = (fee: any, batch: any, e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn việc mở rộng/thu gọn khi click vào nút xóa
    setSelectedFee(fee);
    setActiveBatchForFee(batch);
    setIsDeleteFeeConfirmOpen(true);
  };
  const closeDeleteFeeConfirm = () => {
    setIsDeleteFeeConfirmOpen(false);
    setSelectedFee(null);
  };
  const handleDeleteFee = async () => {
    if (activeBatchForFee && selectedFee) {
      try {
        // Delete from backend if it has a backendId
        if (selectedFee.backendId) {
          const response = await api.khoanThu.delete(selectedFee.backendId);
          
          if (!response.success) {
            alert('Có lỗi xảy ra khi xóa khoản thu: ' + (response.message || 'Lỗi không xác định'));
            return;
          }
        }

        console.log('✅ Fee deleted successfully');
        
        // Reload data from API to get fresh data
        await loadDotThuData();
        closeDeleteFeeConfirm();
        
        // Show success message
        alert('Đã xóa khoản thu thành công!');
      } catch (error: any) {
        console.error('Error deleting fee type:', error);
        alert('Có lỗi xảy ra khi xóa khoản thu: ' + (error.message || 'Lỗi không xác định'));
      }
    }
  };

  // Thêm đợt thu mới vào danh sách
  const handleAddBatch = async (data: { maDot: string; tenDot: string; ngayTao: string; hanThu: string }) => {
    try {
      console.log('🔄 Creating new batch:', data);
      
      // Call API to create new batch
      const response = await api.dotThu.create({
        tenDotThu: data.tenDot,
        ngayTao: data.ngayTao,
        thoiHan: data.hanThu,
      });

      if (response.success) {
        console.log('✅ Batch created successfully:', response.data);
        
        // Reload data from API to get fresh data
        await loadDotThuData();
        
        alert('Đã tạo đợt thu mới thành công!');
      } else {
        throw new Error(response.message || 'Không thể tạo đợt thu');
      }
    } catch (error: any) {
      console.error('❌ Error creating batch:', error);
      alert('Có lỗi xảy ra khi tạo đợt thu: ' + (error.message || 'Lỗi không xác định'));
      
      // Fallback: add to local state if API fails
      const today = new Date().toISOString().slice(0, 10);
      const trangThai = data.hanThu >= today ? 'Đang mở' : 'Đã đóng';
      
      setBatches(prev => [
        {
          maDot: data.maDot,
          tenDot: data.tenDot,
          ngayTao: data.ngayTao,
          hanCuoi: data.hanThu,
          trangThai: trangThai,
          details: {
            maDot: data.maDot,
            tenDot: data.tenDot,
            ngayTao: data.ngayTao,
            hanCuoi: data.hanThu,
            khoanThu: []
          },
          isExpanded: false
        },
        ...prev
      ]);
    }
  };

  // Cập nhật thông tin đợt thu
  const handleEditBatch = async (data: { maDot: string; tenDot: string; ngayTao: string; hanThu: string }) => {
    if (!selectedBatch) return;
    
    try {
      console.log('🔄 Updating batch:', selectedBatch.maDot, data);
      
      // Call API to update batch
      const response = await api.dotThu.update(selectedBatch.maDot, {
        tenDotThu: data.tenDot,
        ngayTao: data.ngayTao,
        thoiHan: data.hanThu,
      });

      if (response.success) {
        console.log('✅ Batch updated successfully:', response.data);
        
        // Reload data from API to get fresh data
        await loadDotThuData();
        
        closeEditPopup();
        alert('Đã cập nhật đợt thu thành công!');
      } else {
        throw new Error(response.message || 'Không thể cập nhật đợt thu');
      }
    } catch (error: any) {
      console.error('❌ Error updating batch:', error);
      alert('Có lỗi xảy ra khi cập nhật đợt thu: ' + (error.message || 'Lỗi không xác định'));
      
      // Fallback: update local state if API fails
      const today = new Date().toISOString().slice(0, 10);
      const trangThai = data.hanThu >= today ? 'Đang mở' : 'Đã đóng';
      
      setBatches(prev => prev.map(batch => {
        if (batch.maDot === selectedBatch.maDot) {
          return {
            maDot: data.maDot,
            tenDot: data.tenDot,
            ngayTao: data.ngayTao,
            hanCuoi: data.hanThu,
            trangThai: trangThai,
            details: {
              ...batch.details,
              maDot: data.maDot,
              tenDot: data.tenDot,
              ngayTao: data.ngayTao,
              hanCuoi: data.hanThu
            },
            isExpanded: batch.isExpanded
          };
        }
        return batch;
      }));
      
      closeEditPopup();
    }
  };

  return (
    <>
      <Layout role="ketoan">
        <div className="p-4 flex flex-col gap-6">
          {/* Page Title and Welcome Text */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">QUẢN LÝ ĐỢT THU PHÍ</h1>
            <p className="text-gray-600 text-sm mt-1">Chào mừng đến với Hệ thống Quản lý Thu phí Chung cư</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
                <button 
                  onClick={() => {setError(null); loadDotThuData();}} 
                  className="ml-auto text-sm underline hover:no-underline"
                >
                  Thử lại
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-gray-600">Đang tải dữ liệu...</span>
              </div>
            </div>
          ) : (
            <>

          {/* Search, Filter and Add Button Area */}
          <div className="flex items-center gap-4">
            {/* Search Input Container */}
            <div className="flex items-center border border-gray-300 rounded-md shadow-sm overflow-hidden flex-1">
              <div className="p-2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Tìm đợt thu..."
                className="flex-1 p-2 border-l border-gray-300 outline-none text-sm"
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            {/* Dropdown Filter - Cập nhật CSS để giống thanh tìm kiếm */}
            <div className="border border-gray-300 rounded-md shadow-sm overflow-hidden bg-white">
              <select
                className="p-2 text-sm bg-white outline-none"
                value={filter}
                onChange={e => setFilter(e.target.value)}
              >
                <option value="Tất cả">Tất cả</option>
                <option value="Đang mở">Đang mở</option>
                <option value="Đã đóng">Đã đóng</option>
              </select>
            </div>
            {/* Add New Batch Button */}
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 flex items-center gap-2"
              onClick={openAddPopup}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tạo đợt thu mới
            </button>
          </div>

          {/* Main Content Area (Table) */}
          <div className="bg-white rounded-md shadow-md overflow-hidden border border-gray-200">
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
                {(() => {
                  console.log('🎯 Rendering table with filteredBatches:', filteredBatches);
                  console.log('🎯 filteredBatches.length:', filteredBatches.length);
                  return null;
                })()}
                {filteredBatches.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      Không có đợt thu phí nào
                    </td>
                  </tr>
                ) : (
                  filteredBatches.map((batch) => (
                    <React.Fragment key={batch.maDot}>
                    <tr 
                      className="hover:bg-gray-50 cursor-pointer transition-all"
                      onClick={() => toggleExpandBatch(batch.maDot)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{batch.maDot}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <span className="mr-2">{batch.tenDot}</span>
                          {batch.isExpanded ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{batch.ngayTao}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{batch.hanCuoi}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${batch.trangThai === 'Đang mở' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {batch.trangThai}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-4">
                          <button 
                            onClick={(e) => openEditPopup(batch, e)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Chỉnh sửa"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={(e) => openDeleteBatchConfirm(batch, e)}
                            className="text-red-600 hover:text-red-800"
                            title="Xóa"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                    {batch.isExpanded && (
                      <tr>
                        <td colSpan={6} className="px-0 py-0 bg-gray-50">
                          <div className="p-4">
                            <div className="flex justify-between items-center mb-3">
                              <h3 className="text-md font-semibold text-gray-800">Danh sách khoản thu</h3>
                              <button 
                                className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 flex items-center gap-1"
                                onClick={(e) => openAddFeePopup(batch, e)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Thêm khoản thu
                              </button>
                            </div>
                            {batch.details.khoanThu.length > 0 ? (
                              <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-100">
                                    <tr>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Loại khoản thu</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Mô tả</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Tổng tiền</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Bắt buộc</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Thao tác</th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {batch.details.khoanThu.map((fee: any) => {
                                      const feeType = FEE_TYPES[fee.type];
                                      // Use soTien directly from API data, fallback to householdFees calculation
                                      const total = fee.soTien ? parseFloat(fee.soTien) : 
                                                   (fee.householdFees ? Object.values(fee.householdFees).reduce((sum: number, h: any) => sum + (h.amount || 0), 0) : 0);
                                      return (
                                        <tr key={fee.id} className="hover:bg-gray-50">
                                          <td className="px-4 py-3 text-sm text-gray-900 font-medium">{feeType?.name || fee.tenKhoan || 'Không xác định'}</td>
                                          <td className="px-4 py-3 text-sm text-gray-700">{fee.chiTiet}</td>
                                          <td className="px-4 py-3 text-sm text-blue-700 font-semibold">{total.toLocaleString('vi-VN')} VND</td>
                                          <td className="px-4 py-3 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${fee.batBuoc === 'Bắt buộc' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>{fee.batBuoc}</span>
                                          </td>
                                          <td className="px-4 py-3 text-sm text-gray-500">
                                            <div className="flex space-x-3">
                                              <button onClick={(e) => openEditFeePopup(fee, batch, e)} className="text-indigo-600 hover:text-indigo-900" title="Chỉnh sửa">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                              </button>
                                              <button onClick={(e) => openDeleteFeeConfirm(fee, batch, e)} className="text-red-600 hover:text-red-800" title="Xóa">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                              </button>
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <div className="text-center text-gray-500 text-sm py-6">
                                Chưa có khoản thu nào
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )))}
              </tbody>
            </table>
          </div>
            </>
          )}
        </div>
      </Layout>
      <AddEditDotThuPhiPopup isOpen={isAddPopupOpen} onClose={closeAddPopup} onSave={handleAddBatch} />
      <EditDotThuPhiPopup 
        isOpen={isEditPopupOpen} 
        onClose={closeEditPopup}
        onSave={handleEditBatch}
        batch={selectedBatch}
      />
      
      {/* Popup thêm khoản thu */}
      <AddEditFeePopup 
        isOpen={isAddFeePopupOpen}
        onClose={closeAddFeePopup}
        onSave={handleAddFee}
        title="Thêm khoản thu"
      />

      {/* Popup sửa khoản thu */}
      <AddEditFeePopup 
        isOpen={isEditFeePopupOpen}
        onClose={closeEditFeePopup}
        onSave={handleEditFee}
        initialData={selectedFee}
        title="Chỉnh sửa khoản thu"
      />
      
      {/* Popup xác nhận xóa đợt thu */}
      {isDeleteBatchConfirmOpen && selectedBatch && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={closeDeleteBatchConfirm}>
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full relative" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Xác nhận xóa</h3>
            <p className="text-gray-700 mb-6">
              Bạn có chắc chắn muốn xóa đợt thu <span className="font-bold text-red-600">"{selectedBatch.tenDot}"</span> không? <br/>
              <span className="text-sm text-gray-500">Thao tác này không thể hoàn tác.</span>
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 font-medium"
                onClick={closeDeleteBatchConfirm}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-medium"
                onClick={handleDeleteBatch}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup xác nhận xóa khoản thu */}
      {isDeleteFeeConfirmOpen && selectedFee && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={closeDeleteFeeConfirm}>
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full relative" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Xác nhận xóa</h3>
            <p className="text-gray-700 mb-6">
              Bạn có chắc chắn muốn xóa khoản thu <span className="font-bold text-red-600">"{selectedFee.tenKhoan}"</span> không? <br/>
              <span className="text-sm text-gray-500">Thao tác này không thể hoàn tác.</span>
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 font-medium"
                onClick={closeDeleteFeeConfirm}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-medium"
                onClick={handleDeleteFee}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {addFeeError && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setAddFeeError(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Không thể thêm khoản thu</h3>
            <p className="text-gray-700 mb-6 text-center">{addFeeError}</p>
            <div className="flex justify-center w-full">
              <button
                className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold shadow hover:bg-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={() => setAddFeeError(null)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuanLyDotThuPhi;