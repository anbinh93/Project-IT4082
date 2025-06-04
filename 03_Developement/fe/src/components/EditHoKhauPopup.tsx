import React, { useState } from 'react';
import AddMemberPopup from './AddMemberPopup';

interface EditHoKhauPopupProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    soHoKhau: string;
    chuHo: string;
    soNha: string;
    duong: string;
    phuong: string;
    quan: string;
    thanhPho: string;
    ngayLamHoKhau: string;
    danhSachThanhVien: Array<{
      tenNhanKhau: string;
      quanHeVoiChuHo: string;
      ngayThem: string;
    }>;
  };
}

const EditHoKhauPopup: React.FC<EditHoKhauPopupProps> = ({ isOpen, onClose, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    soHoKhau: '',
    chuHo: '',
    soNha: '',
    duong: '',
    phuong: '',
    quan: '',
    thanhPho: '',
    ngayLamHoKhau: '',
    danhSachThanhVien: []
  });

  const [isAddMemberPopupOpen, setIsAddMemberPopupOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle form submission
    onClose();
  };

  const handleMemberRelationChange = (index: number, value: string) => {
    setFormData(prev => {
      const updated = [...prev.danhSachThanhVien];
      updated[index].quanHeVoiChuHo = value;
      return { ...prev, danhSachThanhVien: updated };
    });
  };

  const handleRemoveMember = (index: number) => {
    setFormData(prev => {
      const updated = [...prev.danhSachThanhVien];
      updated.splice(index, 1);
      return { ...prev, danhSachThanhVien: updated };
    });
  };

  const handleAddMember = (member: { tenNhanKhau: string; quanHeVoiChuHo: string; ngayThem: string }) => {
    setFormData(prev => ({
      ...prev,
      danhSachThanhVien: [...prev.danhSachThanhVien, member]
    }));
    setIsAddMemberPopupOpen(false);
  };

  // Add a sample resident list
  const sampleResidents = [
    { id: '1', name: 'Nguyễn Văn An' },
    { id: '2', name: 'Trần Thị Bình' },
    { id: '3', name: 'Lê Minh Công' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{initialData ? 'Chỉnh sửa Hộ khẩu' : 'Thêm Hộ khẩu mới'}</h2>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Grid Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Số hộ khẩu <span className="text-red-500">*</span> </label>
              <input
                type="text"
                name="soHoKhau"
                value={formData.soHoKhau}
                onChange={handleInputChange}
                className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Chủ hộ <span className="text-red-500">*</span></label>
              <select
                name="chuHo"
                value={formData.chuHo}
                onChange={handleInputChange}
                className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none appearance-none"
                required
              >
                <option value="">Chọn chủ hộ</option>
                {sampleResidents.map(r => (
                  <option key={r.id} value={r.name}>{r.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Số nhà <span className="text-red-500">*</span> </label>
              <input
                type="text"
                name="soNha"
                value={formData.soNha}
                onChange={handleInputChange}
                className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Đường <span className="text-red-500">*</span> </label>
              <input
                type="text"
                name="duong"
                value={formData.duong}
                onChange={handleInputChange}
                className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phường <span className="text-red-500">*</span> </label>
              <input
                type="text"
                name="phuong"
                value={formData.phuong}
                onChange={handleInputChange}
                className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Quận <span className="text-red-500">*</span> </label>
              <input
                type="text"
                name="quan"
                value={formData.quan}
                onChange={handleInputChange}
                className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Thành phố <span className="text-red-500">*</span> </label>
              <input
                type="text"
                name="thanhPho"
                value={formData.thanhPho}
                onChange={handleInputChange}
                className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày làm hộ khẩu</label>
              <input
                type="date"
                name="ngayLamHoKhau"
                value={formData.ngayLamHoKhau}
                onChange={handleInputChange}
                className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                required
              />
            </div>
          </div>

          {/* Danh sách thành viên */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold text-gray-800">Danh sách thành viên</h3>
              <button
                type="button"
                onClick={() => setIsAddMemberPopupOpen(true)}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-xl font-semibold shadow hover:bg-blue-600 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Thêm thành viên
              </button>
            </div>
            <div className="border rounded-xl overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Tên nhân khẩu</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Quan hệ với chủ hộ</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Ngày thêm</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.danhSachThanhVien.map((member, index) => (
                    <tr key={index} className="hover:bg-blue-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{member.tenNhanKhau}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <select
                          value={member.quanHeVoiChuHo}
                          onChange={e => handleMemberRelationChange(index, e.target.value)}
                          className="border rounded-lg px-2 py-1"
                        >
                          <option value="">Chọn quan hệ</option>
                          <option value="Con">Con</option>
                          <option value="Vợ/Chồng">Vợ/Chồng</option>
                          <option value="Cha/Mẹ">Cha/Mẹ</option>
                          <option value="Anh/Chị/Em">Anh/Chị/Em</option>
                          <option value="Khác">Khác</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.ngayThem}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button type="button" onClick={() => handleRemoveMember(index)} className="p-2 rounded-full hover:bg-red-50 group">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 group-hover:text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border border-gray-300 rounded-xl text-gray-700 font-semibold bg-white hover:bg-gray-50 shadow-sm"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-500 text-white rounded-xl font-semibold shadow hover:bg-blue-600 transition"
            >
              Lưu
            </button>
          </div>
        </form>

        <AddMemberPopup
          isOpen={isAddMemberPopupOpen}
          onClose={() => setIsAddMemberPopupOpen(false)}
          onAdd={handleAddMember}
          residents={sampleResidents}
        />
      </div>
    </div>
  );
};

export default EditHoKhauPopup; 