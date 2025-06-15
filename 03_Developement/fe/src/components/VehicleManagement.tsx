import React, { useState, useEffect } from 'react';
import { vehicleAPI, householdAPI } from '../services/api';

interface Vehicle {
  id: number;
  hoKhauId: number;
  loaiXeId: number;
  bienSo: string;
  ngayBatDau: string;
  ngayKetThuc?: string;
  trangThai: string;
  ghiChu?: string;
  loaiXe?: {
    id: number;
    ten: string;
    phiThue: number;
  };
  hoKhau?: {
    soHoKhau: number;
    chuHoInfo?: {
      hoTen: string;
    };
  };
}

interface VehicleType {
  id: number;
  ten: string;
  phiThue: number;
  moTa?: string;
}

interface Household {
  soHoKhau: number;
  chuHoInfo?: {
    hoTen: string;
  };
  soNha: string;
  duong: string;
}

const VehicleManagement: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [households, setHouseholds] = useState<Household[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  
  // Form data
  const [formData, setFormData] = useState({
    hoKhauId: '',
    loaiXeId: '',
    bienSo: '',
    ngayBatDau: '',
    ngayKetThuc: '',
    trangThai: 'ACTIVE',
    ghiChu: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [vehiclesResponse, typesResponse, householdsResponse] = await Promise.all([
        vehicleAPI.getAll(),
        vehicleAPI.getTypes(),
        householdAPI.getAll()
      ]);
      
      setVehicles(vehiclesResponse.data?.vehicles || []);
      setVehicleTypes(typesResponse.data || []);
      setHouseholds(householdsResponse.data?.households || []);
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      hoKhauId: '',
      loaiXeId: '',
      bienSo: '',
      ngayBatDau: '',
      ngayKetThuc: '',
      trangThai: 'ACTIVE',
      ghiChu: ''
    });
    setEditingVehicle(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      hoKhauId: vehicle.hoKhauId.toString(),
      loaiXeId: vehicle.loaiXeId.toString(),
      bienSo: vehicle.bienSo,
      ngayBatDau: vehicle.ngayBatDau.split('T')[0],
      ngayKetThuc: vehicle.ngayKetThuc ? vehicle.ngayKetThuc.split('T')[0] : '',
      trangThai: vehicle.trangThai,
      ghiChu: vehicle.ghiChu || ''
    });
    setShowEditModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = {
        hoKhauId: parseInt(formData.hoKhauId),
        loaiXeId: parseInt(formData.loaiXeId),
        bienSo: formData.bienSo,
        ngayBatDau: formData.ngayBatDau || new Date().toISOString().split('T')[0],
        ngayKetThuc: formData.ngayKetThuc || undefined,
        trangThai: formData.trangThai,
        ghiChu: formData.ghiChu
      };

      if (editingVehicle) {
        await vehicleAPI.update(editingVehicle.id.toString(), submitData);
        setShowEditModal(false);
      } else {
        await vehicleAPI.create(submitData);
        setShowAddModal(false);
      }
      
      resetForm();
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa xe này?')) return;
    
    try {
      await vehicleAPI.delete(id.toString());
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Không thể xóa xe');
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.bienSo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (vehicle.hoKhau?.chuHoInfo?.hoTen || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || vehicle.loaiXeId.toString() === selectedType;
    const matchesStatus = !selectedStatus || vehicle.trangThai === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const VehicleModal = ({ show, onClose, title }: { show: boolean; onClose: () => void; title: string }) => {
    if (!show) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hộ khẩu</label>
              <select
                value={formData.hoKhauId}
                onChange={(e) => setFormData({...formData, hoKhauId: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              >
                <option value="">Chọn hộ khẩu</option>
                {households.map(household => (
                  <option key={household.soHoKhau} value={household.soHoKhau}>
                    HK{household.soHoKhau.toString().padStart(3, '0')} - {household.chuHoInfo?.hoTen} - {household.soNha} {household.duong}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loại xe</label>
              <select
                value={formData.loaiXeId}
                onChange={(e) => setFormData({...formData, loaiXeId: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              >
                <option value="">Chọn loại xe</option>
                {vehicleTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.ten} - {type.phiThue.toLocaleString()} VNĐ/tháng
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Biển số</label>
              <input
                type="text"
                value={formData.bienSo}
                onChange={(e) => setFormData({...formData, bienSo: e.target.value.toUpperCase()})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="VD: 30A-12345"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
              <textarea
                value={formData.ghiChu}
                onChange={(e) => setFormData({...formData, ghiChu: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                rows={3}
                placeholder="Ghi chú về xe..."
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                {editingVehicle ? 'Cập nhật' : 'Thêm mới'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">QUẢN LÝ XE</h1>
        <p className="text-gray-600 text-sm">Quản lý thông tin xe và loại xe trong chung cư</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Tìm kiếm theo biển số hoặc tên chủ hộ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">Tất cả loại xe</option>
            {vehicleTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.ten}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="ACTIVE">Đang hoạt động</option>
            <option value="INACTIVE">Tạm ngưng</option>
          </select>

          <button
            onClick={handleAdd}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Thêm xe mới
          </button>
        </div>
      </div>

      {/* Vehicle List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Biển số
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại xe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hộ khẩu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chủ xe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ghi chú
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Không có dữ liệu xe nào
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {vehicle.bienSo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.loaiXe?.ten}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      HK{vehicle.hoKhau?.soHoKhau.toString().padStart(3, '0')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.hoKhau?.chuHoInfo?.hoTen}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.ghiChu || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(vehicle)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Chỉnh sửa"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(vehicle.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Xóa"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Add Modal */}
      <VehicleModal 
        show={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        title="Thêm xe mới" 
      />

      {/* Edit Modal */}
      <VehicleModal 
        show={showEditModal} 
        onClose={() => setShowEditModal(false)} 
        title="Chỉnh sửa thông tin xe" 
      />
    </div>
  );
};

export { VehicleManagement };
