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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            Gán/Sửa Chủ Hộ - {currentHousehold?.soHoKhau || 'N/A'}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
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
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          member.quanHeVoiChuHo === 'Chủ hộ' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {member.quanHeVoiChuHo}
                        </span>
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
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleAssign}
              disabled={!selectedMemberId}
              className={`px-4 py-2 rounded-md transition-colors ${
                selectedMemberId
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
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