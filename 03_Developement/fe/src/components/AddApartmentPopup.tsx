import React, { useState, useEffect } from 'react';
import { X, Home } from 'lucide-react';
import { householdAPI } from '../services/api';
import { roomService } from '../services/roomService';

interface Household {
  soHoKhau: number;
  chuHoInfo?: {
    hoTen: string;
    soDienThoai?: string;
  };
  soNha: string;
  duong: string;
  phuong: string;
  quan: string;
  thanhPho: string;
}

interface AddApartmentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddApartmentPopup: React.FC<AddApartmentPopupProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    soPhong: '',
    tang: '',
    dienTich: '',
    hoKhauId: '',
    ghiChu: ''
  });
  
  const [households, setHouseholds] = useState<Household[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Load households that have address but no room assigned yet
  const loadAvailableHouseholds = async () => {
    try {
      const [householdsResponse, roomsResponse] = await Promise.all([
        householdAPI.getAll(),
        roomService.getRooms()
      ]);
      
      if (householdsResponse.data?.households) {
        const allHouseholds = householdsResponse.data.households;
        const allRooms = roomsResponse.rooms || [];
        
        // Get list of household IDs that already have rooms assigned
        const assignedHouseholdIds = new Set(
          allRooms
            .filter(room => room.hoKhauId)
            .map(room => room.hoKhauId)
        );
        
        // Filter households that have soNha but are not assigned to any room
        const availableHouseholds = allHouseholds.filter((h: any) => {
          return h.soNha && h.soNha !== '' && !assignedHouseholdIds.has(h.soHoKhau);
        });
        
        setHouseholds(availableHouseholds);
      }
    } catch (err) {
      console.error('Error loading households:', err);
      setError('Không thể tải danh sách hộ khẩu');
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadAvailableHouseholds();
      // Reset form
      setFormData({
        soPhong: '',
        tang: '',
        dienTich: '',
        hoKhauId: '',
        ghiChu: ''
      });
      setError('');
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // If household is selected, auto-fill room number from soNha
    if (name === 'hoKhauId' && value) {
      const selectedHousehold = households.find(h => h.soHoKhau.toString() === value);
      if (selectedHousehold && selectedHousehold.soNha) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          soPhong: selectedHousehold.soNha // Auto-fill room number
        }));
        return;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.soPhong || !formData.tang || !formData.dienTich || !formData.hoKhauId) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      setLoading(true);
      setError('');

      console.log('Creating apartment with data:', {
        soPhong: formData.soPhong,
        tang: formData.tang,
        dienTich: parseFloat(formData.dienTich),
        hoKhauId: parseInt(formData.hoKhauId)
      });

      // Create room first
      const roomData = {
        soPhong: formData.soPhong,
        tang: formData.tang,
        dienTich: parseFloat(formData.dienTich),
        trangThai: 'trong',
        ghiChu: formData.ghiChu
      };

      const newRoom = await roomService.createRoom(roomData);
      console.log('Room created successfully:', newRoom);

      // Room creation was successful, now assign to household
      if (newRoom && newRoom.id) {
        console.log('Assigning room to household:', {
          roomId: newRoom.id,
          hoKhauId: parseInt(formData.hoKhauId)
        });
        
        try {
          console.log('About to assign room to household...');
          const assignResult = await roomService.assignRoom(newRoom.id, parseInt(formData.hoKhauId));
          console.log('Room assigned successfully:', assignResult);
        } catch (assignError: any) {
          console.error('Error assigning room:', assignError);
          // If assign fails, we should delete the created room to avoid orphaned data
          try {
            await roomService.deleteRoom(newRoom.id);
            console.log('Cleaned up created room due to assign failure');
          } catch (cleanupError) {
            console.error('Failed to cleanup room:', cleanupError);
          }
          throw assignError; // Re-throw the original assign error
        }
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error creating apartment:', err);
      
      // Show more detailed error message
      let errorMessage = 'Có lỗi xảy ra khi tạo căn hộ';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose}></div>
      <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between p-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Home className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Thêm căn hộ mới</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chủ căn hộ <span className="text-red-500">*</span>
            </label>
            <select
              name="hoKhauId"
              value={formData.hoKhauId}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Chọn hộ khẩu làm chủ căn hộ</option>
              {households.map(household => (
                <option key={household.soHoKhau} value={household.soHoKhau}>
                  HK{household.soHoKhau.toString().padStart(3, '0')} - {household.chuHoInfo?.hoTen || 'Chưa có thông tin'} 
                  - Số nhà: {household.soNha}
                  {household.chuHoInfo?.soDienThoai && ` (${household.chuHoInfo.soDienThoai})`}
                </option>
              ))}
            </select>
            {households.length === 0 && (
              <p className="text-sm text-gray-500 mt-1">
                Không có hộ khẩu nào có địa chỉ nhưng chưa được gán căn hộ
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số căn hộ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="soPhong"
              value={formData.soPhong}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
              placeholder="Sẽ tự động điền khi chọn chủ căn hộ"
              required
              readOnly
            />
            <p className="text-sm text-gray-500 mt-1">
              Số căn hộ sẽ tự động điền theo thông tin từ hộ khẩu được chọn
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tầng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="tang"
                value={formData.tang}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="VD: 1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Diện tích (m²) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="dienTich"
                value={formData.dienTich}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="VD: 75"
                step="0.1"
                min="0"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ghi chú
            </label>
            <textarea
              name="ghiChu"
              value={formData.ghiChu}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập ghi chú về căn hộ..."
              rows={3}
            />
          </div>

          <div className="border-t border-gray-200 py-4 mt-6">
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-offset-1 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-offset-1 transition-colors disabled:opacity-50"
              >
                {loading ? 'Đang tạo...' : 'Tạo căn hộ'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddApartmentPopup;
