import React, { useState, useEffect } from 'react';
import { residentAPI } from '../services/api';

interface Resident {
  id: number;
  name: string;
  ngaySinh: string;
  gioiTinh: string;
  cccd: string;
}

interface AddMemberPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (member: {
    residentId: number;
    tenNhanKhau: string;
    quanHeVoiChuHo: string;
    ngayThem: string;
  }) => void;
  householdId?: number;
}

const AddMemberPopup: React.FC<AddMemberPopupProps> = ({
  isOpen,
  onClose,
  onAdd,
  householdId
}) => {
  const [availableResidents, setAvailableResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState({
    selectedResidentId: '',
    quanHeVoiChuHo: '',
    ngayThem: ''
  });

  // Fetch available residents when popup opens
  useEffect(() => {
    if (isOpen) {
      fetchAvailableResidents();
    }
  }, [isOpen]);

  const fetchAvailableResidents = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await residentAPI.getAvailable();
      
      if (response.success) {
        setAvailableResidents(response.data);
      } else {
        setError('Không thể lấy danh sách nhân khẩu');
      }
    } catch (err: any) {
      console.error('Error fetching available residents:', err);
      setError(err.message || 'Có lỗi xảy ra khi lấy danh sách nhân khẩu');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.selectedResidentId || !formData.quanHeVoiChuHo || !formData.ngayThem) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const selectedResident = availableResidents.find(r => r.id.toString() === formData.selectedResidentId);
    if (!selectedResident) {
      setError('Nhân khẩu không hợp lệ');
      return;
    }

    try {
      setLoading(true);
      
      // Call the API to add resident to household
      if (householdId) {
        await residentAPI.addToHousehold({
          residentId: selectedResident.id,
          householdId: householdId,
          quanHeVoiChuHo: formData.quanHeVoiChuHo,
          ngayThem: formData.ngayThem
        });
      }

      // Call the parent callback
      onAdd({
        residentId: selectedResident.id,
        tenNhanKhau: selectedResident.name,
        quanHeVoiChuHo: formData.quanHeVoiChuHo,
        ngayThem: formData.ngayThem
      });

      // Reset form and close
      setFormData({
        selectedResidentId: '',
        quanHeVoiChuHo: '',
        ngayThem: ''
      });
      onClose();
    } catch (err: any) {
      console.error('Error adding resident to household:', err);
      setError(err.message || 'Có lỗi xảy ra khi thêm nhân khẩu vào hộ khẩu');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Thêm Nhân khẩu vào Hộ khẩu
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nhân khẩu <span className="text-red-500">*</span>
            </label>
            <select
              name="selectedResidentId"
              value={formData.selectedResidentId}
              onChange={handleInputChange}
              className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none appearance-none"
              required
              disabled={loading}
            >
              <option value="">
                {loading ? 'Đang tải...' : 'Chọn nhân khẩu'}
              </option>
              {availableResidents.map(resident => (
                <option key={resident.id} value={resident.id.toString()}>
                  {resident.name} - {resident.cccd}
                </option>
              ))}
              {availableResidents.length === 0 && !loading && (
                <option value="" disabled>
                  Không có nhân khẩu khả dụng
                </option>
              )}
            </select>
            {availableResidents.length === 0 && !loading && (
              <p className="text-sm text-gray-500 mt-1">
                Tất cả nhân khẩu đã được phân bổ vào các hộ khẩu
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Quan hệ với chủ hộ <span className="text-red-500">*</span>
            </label>
            <select
              name="quanHeVoiChuHo"
              value={formData.quanHeVoiChuHo}
              onChange={handleInputChange}
              className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none appearance-none"
              required
            >
              <option value="">Chọn quan hệ</option>
              <option value="con">Con</option>
              <option value="vợ/chồng">Vợ/Chồng</option>
              <option value="bố/mẹ">Bố/Mẹ</option>
              <option value="khác">Khác</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Ngày thêm <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="ngayThem"
              value={formData.ngayThem}
              onChange={handleInputChange}
              className="block w-full rounded-xl border border-gray-300 px-4 py-2 text-[15px] shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              required
            />
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
              disabled={loading || availableResidents.length === 0}
              className={`px-5 py-2 rounded-xl font-semibold shadow transition ${
                loading || availableResidents.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {loading ? 'Đang thêm...' : 'Thêm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberPopup;
