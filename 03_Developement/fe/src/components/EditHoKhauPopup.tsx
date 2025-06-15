import React, { useState, useEffect } from 'react';
import { householdAPI } from '../services/api';
import AddMemberPopup from './AddMemberPopup';

interface HouseholdMember {
  id: number;
  quanHeVoiChuHo: string;
  ngayVaoHo: string;
  ngayRoiHo?: string;
  lyDoRoiHo?: string;
  nhanKhau: {
    id: number;
    hoTen: string;
    ngaySinh: string;
    gioiTinh: string;
    soCCCD: string;
    soDienThoai: string;
    queQuan: string;
    danToc: string;
    ngheNghiep: string;
  };
}

interface HouseholdData {
  id: number;
  maHoKhau: string;
  chuHoId: number;
  diaChi: string;
  ngayLap: string;
  lyDoTao: string;
  chuHo: {
    id: number;
    hoTen: string;
    ngaySinh: string;
    gioiTinh: string;
    soCCCD: string;
    soDienThoai: string;
  };
  thanhVien: HouseholdMember[];
}

interface EditHoKhauPopupProps {
  isOpen: boolean;
  onClose: () => void;
  householdId?: number;
}

const EditHoKhauPopup: React.FC<EditHoKhauPopupProps> = ({ isOpen, onClose, householdId }) => {
  const [householdData, setHouseholdData] = useState<HouseholdData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddMemberPopupOpen, setIsAddMemberPopupOpen] = useState(false);

  const [formData, setFormData] = useState({
    maHoKhau: '',
    diaChi: '',
    lyDoTao: ''
  });

  // Fetch household data when popup opens
  useEffect(() => {
    if (isOpen && householdId) {
      fetchHouseholdData();
    }
  }, [isOpen, householdId]);

  const fetchHouseholdData = async () => {
    if (!householdId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await householdAPI.getById(householdId);
      if (response.success) {
        const data = response.data;
        setHouseholdData(data);
        setFormData({
          maHoKhau: data.maHoKhau,
          diaChi: data.diaChi,
          lyDoTao: data.lyDoTao
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải thông tin hộ khẩu');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!householdId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await householdAPI.update(householdId, formData);
      if (response.success) {
        onClose();
        // Optionally trigger a refresh of the household list
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi cập nhật hộ khẩu');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Chỉnh sửa Hộ khẩu</h2>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Form */}
        {!loading && householdData && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin cơ bản</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Mã hộ khẩu</label>
                  <input
                    type="text"
                    name="maHoKhau"
                    value={formData.maHoKhau}
                    onChange={handleInputChange}
                    className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày lập</label>
                  <input
                    type="text"
                    value={formatDate(householdData.ngayLap)}
                    disabled
                    className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] bg-gray-100 text-gray-600"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Địa chỉ</label>
                  <input
                    type="text"
                    name="diaChi"
                    value={formData.diaChi}
                    onChange={handleInputChange}
                    className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Lý do tạo</label>
                  <textarea
                    name="lyDoTao"
                    value={formData.lyDoTao}
                    onChange={handleInputChange}
                    rows={3}
                    className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Head of Household */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin chủ hộ</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Họ tên</label>
                  <input
                    type="text"
                    value={householdData.chuHo?.hoTen || ''}
                    disabled
                    className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] bg-gray-100 text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày sinh</label>
                  <input
                    type="text"
                    value={householdData.chuHo?.ngaySinh ? formatDate(householdData.chuHo.ngaySinh) : ''}
                    disabled
                    className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] bg-gray-100 text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Giới tính</label>
                  <input
                    type="text"
                    value={householdData.chuHo?.gioiTinh || ''}
                    disabled
                    className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] bg-gray-100 text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Số CCCD</label>
                  <input
                    type="text"
                    value={householdData.chuHo?.soCCCD || ''}
                    disabled
                    className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] bg-gray-100 text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    value={householdData.chuHo?.soDienThoai || ''}
                    disabled
                    className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] bg-gray-100 text-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* Household Members */}
            <div className="bg-green-50 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Danh sách thành viên ({householdData.thanhVien.length})</h3>
                <button
                  type="button"
                  onClick={() => setIsAddMemberPopupOpen(true)}
                  className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl font-semibold shadow hover:bg-green-600 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Thêm thành viên
                </button>
              </div>
              
              {householdData.thanhVien.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Chưa có thành viên nào trong hộ khẩu</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Họ tên</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Quan hệ với chủ hộ</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Ngày sinh</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Giới tính</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Ngày vào hộ</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {householdData.thanhVien.map((member) => (
                        <tr key={member.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {member.nhanKhau.hoTen}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {member.quanHeVoiChuHo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {formatDate(member.nhanKhau.ngaySinh)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {member.nhanKhau.gioiTinh}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {formatDate(member.ngayVaoHo)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              member.ngayRoiHo 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {member.ngayRoiHo ? 'Đã rời hộ' : 'Đang sinh sống'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition disabled:opacity-50"
              >
                {loading ? 'Đang cập nhật...' : 'Cập nhật'}
              </button>
            </div>
          </form>
        )}

        {/* Add Member Popup */}
        <AddMemberPopup
          isOpen={isAddMemberPopupOpen}
          onClose={() => setIsAddMemberPopupOpen(false)}
          onAdd={(member) => {
            // Handle adding member logic here
            console.log('Adding member:', member);
            setIsAddMemberPopupOpen(false);
            // Optionally refresh household data
            fetchHouseholdData();
          }}
          householdId={householdId}
        />
      </div>
    </div>
  );
};

export default EditHoKhauPopup;