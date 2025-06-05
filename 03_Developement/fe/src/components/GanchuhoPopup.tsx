import React, { useState, useEffect } from 'react';

interface Member {
  id: string;
  hoTen: string;
  ngaySinh: string;
  gioiTinh: string;
  cccd: string;
  quanHeVoiChuHo: string;
  ngheNghiep: string;
  noiLamViec: string;
}

interface AssignChuHoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (newChuHoId: string) => void;
  currentHousehold: {
    soHoKhau: string;
    chuHo: string;
    soNha: string;
    duong: string;
    phuong: string;
    quan: string;
    thanhPho: string;
    ngayLamHoKhau: string;
    danhSachThanhVien?: Member[];
  } | null;
}

const GanchuhoPopup: React.FC<AssignChuHoPopupProps> = ({
  isOpen,
  onClose,
  onAssign,
  currentHousehold
}) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRelation, setEditingRelation] = useState<string | null>(null);
  const [relationValue, setRelationValue] = useState('');

  // Sample members data - in real app this would come from props or API
  const sampleMembers: Member[] = [
    {
      id: 'TV001',
      hoTen: 'Nguyễn Văn An',
      ngaySinh: '1975-05-15',
      gioiTinh: 'Nam',
      cccd: '001234567890',
      quanHeVoiChuHo: 'Chủ hộ',
      ngheNghiep: 'Kỹ sư',
      noiLamViec: 'Công ty ABC'
    },
    {
      id: 'TV002',
      hoTen: 'Nguyễn Thị Bình',
      ngaySinh: '1978-08-20',
      gioiTinh: 'Nữ',
      cccd: '001234567891',
      quanHeVoiChuHo: 'Vợ',
      ngheNghiep: 'Giáo viên',
      noiLamViec: 'Trường THPT XYZ'
    },
    {
      id: 'TV003',
      hoTen: 'Nguyễn Văn Cường',
      ngaySinh: '2005-12-10',
      gioiTinh: 'Nam',
      cccd: '001234567892',
      quanHeVoiChuHo: 'Con',
      ngheNghiep: 'Học sinh',
      noiLamViec: 'Trường THPT DEF'
    },
    {
      id: 'TV004',
      hoTen: 'Nguyễn Thị Dung',
      ngaySinh: '2008-03-25',
      gioiTinh: 'Nữ',
      cccd: '001234567893',
      quanHeVoiChuHo: 'Con',
      ngheNghiep: 'Học sinh',
      noiLamViec: 'Trường THCS GHI'
    }
  ];

  const members = currentHousehold?.danhSachThanhVien || sampleMembers;

  useEffect(() => {
    if (!isOpen) {
      setSelectedMemberId('');
      setSearchTerm('');
    }
  }, [isOpen]);

  const filteredMembers = members.filter(member =>
    member.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.cccd.includes(searchTerm)
  );

  const handleAssign = () => {
    if (selectedMemberId) {
      onAssign(selectedMemberId);
      onClose();
    }
  };

  const getCurrentChuHo = () => {
    // Get current head from household data, not from members list
    if (currentHousehold) {
      return {
        hoTen: currentHousehold.chuHo,
        soHoKhau: currentHousehold.soHoKhau,
        // You can add more fields from household data if available
        soNha: currentHousehold.soNha,
        duong: currentHousehold.duong,
        phuong: currentHousehold.phuong,
        quan: currentHousehold.quan,
        thanhPho: currentHousehold.thanhPho,
        ngayLamHoKhau: currentHousehold.ngayLamHoKhau
      };
    }
    return null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-6xl max-h-[90vh] overflow-y-auto relative">
        <h2 className="text-2xl font-bold mb-4">Gán/Sửa Chủ Hộ - {currentHousehold?.soHoKhau || 'N/A'}</h2>
        <div className="space-y-6">
          {/* Current Head of Household Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-md font-semibold text-gray-800 mb-2">Chủ hộ hiện tại:</h3>
            {getCurrentChuHo() ? (
              <div className="text-sm text-gray-600 grid grid-cols-2 gap-2">
                <p><strong>Họ tên:</strong> {getCurrentChuHo()?.hoTen}</p>
                <p><strong>Số hộ khẩu:</strong> {getCurrentChuHo()?.soHoKhau}</p>
                <p><strong>Số nhà:</strong> {getCurrentChuHo()?.soNha}</p>
                <p><strong>Đường:</strong> {getCurrentChuHo()?.duong}</p>
                <p><strong>Phường:</strong> {getCurrentChuHo()?.phuong}</p>
                <p><strong>Quận:</strong> {getCurrentChuHo()?.quan}</p>
                <p><strong>Thành phố:</strong> {getCurrentChuHo()?.thanhPho}</p>
                <p><strong>Ngày làm HK:</strong> {getCurrentChuHo()?.ngayLamHoKhau}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Chưa có thông tin chủ hộ</p>
            )}
          </div>
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
              />
            </div>
          </div>
          {/* Members List */}
          <div className="mb-6">
            <h3 className="text-md font-semibold text-gray-800 mb-3">Chọn thành viên làm chủ hộ mới:</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden max-h-96 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chọn</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ tên</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày sinh</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giới tính</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CCCD</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quan hệ</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nghề nghiệp</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMembers.map((member) => (
                    <tr 
                      key={member.id} 
                      className={`hover:bg-blue-50 cursor-pointer ${selectedMemberId === member.id ? 'bg-blue-100' : ''}`}
                      onClick={() => setSelectedMemberId(member.id)}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <input
                          type="radio"
                          name="selectedMember"
                          value={member.id}
                          checked={selectedMemberId === member.id}
                          onChange={(e) => setSelectedMemberId(e.target.value)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {member.hoTen}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {member.ngaySinh}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {member.gioiTinh}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {member.cccd}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {editingRelation === member.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              className="border rounded px-2 py-1 text-sm"
                              value={relationValue}
                              onChange={e => setRelationValue(e.target.value)}
                              autoFocus
                              onClick={e => e.stopPropagation()}
                            />
                            <button
                              className="p-1 rounded hover:bg-green-100 transition"
                              title="Lưu"
                              onClick={e => {
                                e.stopPropagation();
                                // Cập nhật quan hệ cho member (giả lập, thực tế cần cập nhật state hoặc gọi API)
                                member.quanHeVoiChuHo = relationValue;
                                setEditingRelation(null);
                              }}
                              style={{ lineHeight: 0 }}
                            >
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>{member.quanHeVoiChuHo}</span>
                            <button
                              className="p-1 rounded hover:bg-blue-100 transition"
                              title="Sửa"
                              onClick={e => {
                                e.stopPropagation();
                                setEditingRelation(member.id);
                                setRelationValue(member.quanHeVoiChuHo);
                              }}
                              style={{ lineHeight: 0 }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {member.ngheNghiep}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredMembers.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  Không tìm thấy thành viên nào
                </div>
              )}
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border border-gray-300 rounded-xl text-gray-700 font-semibold bg-white hover:bg-gray-50 shadow-sm"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleAssign}
              disabled={!selectedMemberId}
              className={`px-5 py-2 rounded-xl font-semibold shadow transition-colors ${
                selectedMemberId
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Gán làm chủ hộ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanchuhoPopup;