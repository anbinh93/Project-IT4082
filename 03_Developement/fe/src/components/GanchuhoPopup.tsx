import React, { useState, useEffect } from 'react';
import { householdAPI, residentAPI } from '../services/api';

interface Member {
  id: number;
  hoTen: string;
  ngaySinh: string;
  gioiTinh: string;
  cccd: string;
  quanHeVoiChuHo: string;
  ngheNghiep?: string;
  danToc?: string;
  tonGiao?: string;
}

interface HouseholdData {
  id: number;
  maHoKhau: string;
  chuHoId: number | null;
  diaChi: string;
  ngayLap: string;
  chuHo: {
    id: number;
    hoTen: string;
    cccd: string;
  } | null;
  thanhVien: {
    id: number;
    quanHeVoiChuHo: string;
    ngayVaoHo: string;
    nhanKhau: Member;
  }[];
}

interface AssignChuHoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  currentHousehold: {
    soHoKhau: string;
    chuHo: string;
    soNha: string;
    duong: string;
    phuong: string;
    quan: string;
    thanhPho: string;
    ngayLamHoKhau: string;
  } | null;
}

const GanchuhoPopup: React.FC<AssignChuHoPopupProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentHousehold
}) => {
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [householdData, setHouseholdData] = useState<HouseholdData | null>(null);
  const [availableResidents, setAvailableResidents] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  // Extract household ID from the formatted soHoKhau (e.g., "HK001" -> 1)
  const householdId = currentHousehold ? parseInt(currentHousehold.soHoKhau.replace('HK', '')) : null;

  useEffect(() => {
    if (isOpen && householdId) {
      fetchHouseholdData();
      fetchAvailableResidents();
    }
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, householdId]);

  const resetForm = () => {
    setSelectedMemberId(null);
    setSearchTerm('');
    setHouseholdData(null);
    setAvailableResidents([]);
    setError('');
  };

  const fetchHouseholdData = async () => {
    if (!householdId) return;
    
    try {
      setLoading(true);
      setError('');
      
      const response = await householdAPI.getById(householdId);
      if (response.success) {
        setHouseholdData(response.data);
      } else {
        setError('Không thể tải thông tin hộ khẩu');
      }
    } catch (err: any) {
      console.error('Error fetching household data:', err);
      setError('Có lỗi xảy ra khi tải thông tin hộ khẩu');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableResidents = async () => {
    try {
      const response = await residentAPI.getAvailable();
      if (response.success) {
        setAvailableResidents(response.data || []);
      }
    } catch (err: any) {
      console.error('Error fetching available residents:', err);
    }
  };

  const handleAssign = async () => {
    if (!selectedMemberId || !householdId) return;

    try {
      setSubmitting(true);
      setError('');

      const response = await householdAPI.assignHead(householdId, selectedMemberId);
      
      if (response.success) {
        if (onSuccess) {
          onSuccess();
        }
        onClose();
      } else {
        setError(response.message || 'Có lỗi xảy ra khi gán chủ hộ');
      }
    } catch (err: any) {
      console.error('Error assigning household head:', err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi gán chủ hộ');
    } finally {
      setSubmitting(false);
    }
  };

  // Combine household members and available residents for selection
  const allPotentialHeads = [
    ...(householdData?.thanhVien?.map(member => ({
      ...member.nhanKhau,
      quanHeVoiChuHo: member.quanHeVoiChuHo,
      isCurrentMember: true
    })) || []),
    ...availableResidents.map(resident => ({
      ...resident,
      quanHeVoiChuHo: 'Ngoài hộ',
      isCurrentMember: false
    }))
  ];

  const filteredMembers = allPotentialHeads.filter(member =>
    member.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.cccd.includes(searchTerm)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            Gán/Sửa Chủ Hộ - {currentHousehold?.soHoKhau || 'N/A'}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
            disabled={submitting}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Current Head Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-md font-semibold text-gray-800 mb-2">Thông tin hộ khẩu:</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Số hộ khẩu:</strong> {currentHousehold?.soHoKhau}</p>
                <p><strong>Chủ hộ hiện tại:</strong> {householdData?.chuHo?.hoTen || 'Chưa có'}</p>
                <p><strong>CCCD chủ hộ:</strong> {householdData?.chuHo?.cccd || 'N/A'}</p>
              </div>
              <div>
                <p><strong>Địa chỉ:</strong> {householdData?.diaChi || `${currentHousehold?.soNha}, ${currentHousehold?.duong}, ${currentHousehold?.phuong}`}</p>
                <p><strong>Số thành viên:</strong> {householdData?.thanhVien?.length || 0}</p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="mb-4 p-4 text-center">
              <p className="text-gray-600">Đang tải dữ liệu...</p>
            </div>
          )}

          {/* Search */}
          <div className="mb-4">
            <div className="flex items-center border border-gray-300 rounded-md shadow-sm overflow-hidden">
              <div className="p-2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc CCCD..."
                className="flex-1 p-2 border-l border-gray-300 outline-none text-sm"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                disabled={loading || submitting}
              />
            </div>
          </div>

          {/* Members List */}
          {!loading && (
            <div className="mb-6">
              <h3 className="text-md font-semibold text-gray-800 mb-3">
                Chọn người làm chủ hộ mới ({filteredMembers.length} người):
              </h3>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden max-h-96 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chọn</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ tên</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày sinh</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giới tính</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CCCD</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMembers.map((member: any) => (
                      <tr 
                        key={member.id} 
                        className={`hover:bg-blue-50 cursor-pointer ${
                          selectedMemberId === member.id ? 'bg-blue-100' : ''
                        }`}
                        onClick={() => setSelectedMemberId(member.id)}
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="radio"
                            name="selectedMember"
                            value={member.id}
                            checked={selectedMemberId === member.id}
                            onChange={(e) => setSelectedMemberId(parseInt(e.target.value))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            disabled={submitting}
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {member.hoTen}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {new Date(member.ngaySinh).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {member.gioiTinh}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {member.cccd}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            member.isCurrentMember
                              ? member.quanHeVoiChuHo === 'chủ hộ' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {member.isCurrentMember ? member.quanHeVoiChuHo : 'Ngoài hộ'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {filteredMembers.length === 0 && !loading && (
                  <div className="p-4 text-center text-gray-500">
                    Không tìm thấy người nào phù hợp
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              disabled={submitting}
            >
              Hủy
            </button>
            <button
              onClick={handleAssign}
              disabled={!selectedMemberId || submitting || loading}
              className={`px-4 py-2 rounded-md transition-colors ${
                selectedMemberId && !submitting && !loading
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {submitting ? 'Đang xử lý...' : 'Gán làm chủ hộ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanchuhoPopup;