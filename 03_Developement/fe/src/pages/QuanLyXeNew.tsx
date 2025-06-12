import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Car } from 'lucide-react';
import Layout from '../components/Layout';
import VehicleFormModal from '../components/VehicleFormModal';
import { vehicleService } from '../services/vehicleService';
import type { Vehicle, VehicleType } from '../services/vehicleService';

const QuanLyXeNew: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  
  // Modal states
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Vehicle | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [vehiclesData, typesData] = await Promise.all([
        vehicleService.getVehicles(),
        vehicleService.getVehicleTypes()
      ]);
      
      setVehicles(vehiclesData.vehicles || []);
      setVehicleTypes(typesData || []);
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.bienSo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.hoKhau?.chuHoInfo?.hoTen?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      '';
    
    const matchesStatus = !filterStatus || vehicle.trangThai === filterStatus;
    const matchesType = !filterType || vehicle.loaiXeId.toString() === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleAddVehicle = () => {
    setEditingVehicle(null);
    setShowVehicleForm(true);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setShowVehicleForm(true);
  };

  const handleVehicleSubmit = async (formData: any) => {
    try {
      setLoading(true);
      
      if (editingVehicle) {
        // Update vehicle
        await vehicleService.updateVehicle(editingVehicle.id, formData);
      } else {
        // Create new vehicle
        await vehicleService.createVehicle(formData);
      }
      
      setShowVehicleForm(false);
      setEditingVehicle(null);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi lưu thông tin xe');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVehicle = async (vehicle: Vehicle) => {
    try {
      setLoading(true);
      await vehicleService.deleteVehicle(vehicle.id);
      setShowDeleteConfirm(null);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Không thể xóa xe');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'ACTIVE' ? (
      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
        Đang sử dụng
      </span>
    ) : (
      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
        Ngừng sử dụng
      </span>
    );
  };

  return (
    <Layout role="totruong">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Car className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Quản lý xe</h1>
          </div>
          <p className="text-gray-600 text-sm">Quản lý thông tin xe và phí gửi xe trong chung cư</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            {/* Search */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo biển số hoặc tên chủ xe..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filter by Status */}
            <div className="w-full lg:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="ACTIVE">Đang sử dụng</option>
                <option value="INACTIVE">Ngừng sử dụng</option>
              </select>
            </div>

            {/* Filter by Type */}
            <div className="w-full lg:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại xe
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">Tất cả loại xe</option>
                {vehicleTypes.map(type => (
                  <option key={type.id} value={type.id.toString()}>
                    {type.ten}
                  </option>
                ))}
              </select>
            </div>

            {/* Add Vehicle Button */}
            <div className="w-full lg:w-auto">
              <button
                onClick={handleAddVehicle}
                className="w-full lg:w-auto flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                <Plus className="h-5 w-5 mr-2" />
                Thêm xe mới
              </button>
            </div>
          </div>
        </div>

        {/* Vehicles Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Danh sách xe ({filteredVehicles.length})
            </h3>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-500">Đang tải dữ liệu...</p>
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Car className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p>Không tìm thấy xe nào</p>
            </div>
          ) : (
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
                      Chủ xe
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phí thuê/tháng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày bắt đầu
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {vehicle.bienSo}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {vehicle.loaiXe?.ten || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="font-medium">
                            {vehicle.hoKhau?.chuHoInfo?.hoTen || '-'}
                          </div>
                          <div className="text-xs text-gray-500">
                            HK{vehicle.hoKhau?.soHoKhau?.toString().padStart(3, '0')} - {vehicle.hoKhau?.soNha} {vehicle.hoKhau?.duong}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {vehicle.loaiXe?.phiThue ? 
                            `${Number(vehicle.loaiXe.phiThue).toLocaleString()} VNĐ` : 
                            '-'
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(vehicle.trangThai)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {vehicle.ngayBatDau ? 
                            new Date(vehicle.ngayBatDau).toLocaleDateString('vi-VN') : 
                            '-'
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEditVehicle(vehicle)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title="Chỉnh sửa"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(vehicle)}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            title="Xóa"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Vehicle Form Modal */}
        <VehicleFormModal
          isOpen={showVehicleForm}
          onClose={() => {
            setShowVehicleForm(false);
            setEditingVehicle(null);
          }}
          onSubmit={handleVehicleSubmit}
          editingVehicle={editingVehicle}
          vehicleTypes={vehicleTypes}
        />

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      Xác nhận xóa xe
                    </h3>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500">
                    Bạn có chắc chắn muốn xóa xe <strong>{showDeleteConfirm.bienSo}</strong> không? 
                    Hành động này không thể hoàn tác.
                  </p>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => handleDeleteVehicle(showDeleteConfirm)}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
                    disabled={loading}
                  >
                    {loading ? 'Đang xóa...' : 'Xóa'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default QuanLyXeNew;
