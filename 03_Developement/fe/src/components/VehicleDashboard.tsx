import React, { useState, useEffect } from 'react';
import { vehicleService } from '../services/vehicleService';
import type { Vehicle, VehicleType } from '../services/vehicleService';
import { authService } from '../services/authService';
import { VehicleForm, VehicleTypeForm } from './VehicleForms';
import { 
  Car, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  LogOut,
  BarChart3,
  Users,
  Settings
} from 'lucide-react';

interface VehicleDashboardProps {
  onLogout: () => void;
}

export const VehicleDashboard: React.FC<VehicleDashboardProps> = ({ onLogout }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'vehicles' | 'types' | 'stats'>('vehicles');
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  
  // Modal states
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [showTypeForm, setShowTypeForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [editingType, setEditingType] = useState<VehicleType | null>(null);

  const currentUser = authService.getCurrentUser();
  const canManage = authService.hasRole(['admin', 'to_truong']);
  const canDelete = authService.hasRole(['admin', 'to_truong']);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [vehiclesData, typesData] = await Promise.all([
        vehicleService.getVehicles(),
        vehicleService.getVehicleTypes()
      ]);
      setVehicles(vehiclesData.vehicles || []);
      setVehicleTypes(typesData || []);
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.bienSo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.hoKhau?.chuHoInfo?.hoTen?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || vehicle.trangThai === filterStatus;
    const matchesType = !filterType || vehicle.loaiXeId.toString() === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleDeleteVehicle = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa xe này?')) return;
    
    try {
      await vehicleService.deleteVehicle(id);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Không thể xóa xe');
    }
  };

  const handleDeleteType = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa loại xe này?')) return;
    
    try {
      await vehicleService.deleteVehicleType(id);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Không thể xóa loại xe');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Quản lý xe</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Xin chào, <strong>{currentUser?.username}</strong> ({currentUser?.role})
              </span>
              <button
                onClick={onLogout}
                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('vehicles')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'vehicles'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Car className="h-4 w-4 inline mr-2" />
              Danh sách xe
            </button>
            <button
              onClick={() => setActiveTab('types')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'types'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Settings className="h-4 w-4 inline mr-2" />
              Loại xe
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'stats'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart3 className="h-4 w-4 inline mr-2" />
              Thống kê
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Vehicles Tab */}
        {activeTab === 'vehicles' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex-1 flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo biển số hoặc chủ xe..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="">Tất cả trạng thái</option>
                    <option value="ACTIVE">Đang sử dụng</option>
                    <option value="INACTIVE">Ngừng sử dụng</option>
                  </select>
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="">Tất cả loại xe</option>
                    {vehicleTypes.map(type => (
                      <option key={type.id} value={type.id.toString()}>
                        {type.tenLoaiXe}
                      </option>
                    ))}
                  </select>
                </div>
                {canManage && (
                  <button
                    onClick={() => setShowVehicleForm(true)}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm xe
                  </button>
                )}
              </div>
            </div>

            {/* Vehicles List */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
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
                      Chủ xe
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phí thuê
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày bắt đầu
                    </th>
                    {canManage && (
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {vehicle.bienSo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {vehicle.loaiXe?.tenLoaiXe}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          <div className="font-medium">{vehicle.hoKhau?.chuHoInfo?.hoTen}</div>
                          <div className="text-xs text-gray-400">
                            {vehicle.hoKhau?.soNha} {vehicle.hoKhau?.duong}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {vehicle.loaiXe?.phiThue ? `${Number(vehicle.loaiXe.phiThue).toLocaleString()} VNĐ` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          vehicle.trangThai === 'ACTIVE' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {vehicle.trangThai === 'ACTIVE' ? 'Đang sử dụng' : 'Ngừng sử dụng'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {vehicle.ngayBatDau ? new Date(vehicle.ngayBatDau).toLocaleDateString('vi-VN') : '-'}
                      </td>
                      {canManage && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => {
                                setEditingVehicle(vehicle);
                                setShowVehicleForm(true);
                              }}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            {canDelete && (
                              <button
                                onClick={() => handleDeleteVehicle(vehicle.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredVehicles.length === 0 && (
                <div className="text-center py-12">
                  <Car className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Không có xe nào</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {canManage ? 'Bắt đầu bằng cách thêm xe mới.' : 'Chưa có xe nào được đăng ký.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Vehicle Types Tab */}
        {activeTab === 'types' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Quản lý loại xe</h2>
              {canManage && (
                <button
                  onClick={() => setShowTypeForm(true)}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm loại xe
                </button>
              )}
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên loại xe
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phí thuê
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mô tả
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    {canManage && (
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vehicleTypes.map((type) => (
                    <tr key={type.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {type.tenLoaiXe}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Number(type.phiThue).toLocaleString()} VNĐ
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {type.moTa || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          type.trangThai 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {type.trangThai ? 'Hoạt động' : 'Ngừng hoạt động'}
                        </span>
                      </td>
                      {canManage && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => {
                                setEditingType(type);
                                setShowTypeForm(true);
                              }}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            {canDelete && (
                              <button
                                onClick={() => handleDeleteType(type.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Thống kê xe</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Tổng số xe</p>
                    <p className="text-2xl font-semibold text-gray-900">{vehicles.length}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Car className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Đang sử dụng</p>
                    <p className="text-2xl font-semibold text-green-600">
                      {vehicles.filter(v => v.trangThai === 'ACTIVE').length}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Loại xe</p>
                    <p className="text-2xl font-semibold text-purple-600">{vehicleTypes.length}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Settings className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal Forms */}
      {showVehicleForm && (
        <VehicleForm
          vehicle={editingVehicle}
          vehicleTypes={vehicleTypes}
          onSave={async (vehicleData) => {
            try {
              if (editingVehicle) {
                await vehicleService.updateVehicle(editingVehicle.id, vehicleData);
              } else {
                await vehicleService.createVehicle(vehicleData);
              }
              await loadData();
              setShowVehicleForm(false);
              setEditingVehicle(null);
            } catch (error) {
              console.error('Error saving vehicle:', error);
              setError('Có lỗi xảy ra khi lưu thông tin xe');
            }
          }}
          onClose={() => {
            setShowVehicleForm(false);
            setEditingVehicle(null);
          }}
        />
      )}

      {showTypeForm && (
        <VehicleTypeForm
          vehicleType={editingType}
          onSave={async (typeData) => {
            try {
              if (editingType) {
                await vehicleService.updateVehicleType(editingType.id, typeData);
              } else {
                await vehicleService.createVehicleType(typeData);
              }
              await loadData();
              setShowTypeForm(false);
              setEditingType(null);
            } catch (error) {
              console.error('Error saving vehicle type:', error);
              setError('Có lỗi xảy ra khi lưu loại xe');
            }
          }}
          onClose={() => {
            setShowTypeForm(false);
            setEditingType(null);
          }}
        />
      )}
    </div>
  );
};
