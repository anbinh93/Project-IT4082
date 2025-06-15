import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import AddEditRoomPopup from '../components/AddEditRoomPopup';
import AddEditTenantPopup from '../components/AddEditTenantPopup';
import { Home, Users, Plus, Loader2, AlertTriangle } from 'lucide-react';
import { roomService } from '../services/roomService';
import type { Room, RoomStatistics } from '../services/roomService';
import { householdAPI } from '../services/api';

// Extended room interface for UI display
interface ExtendedRoom extends Room {
  hoThue?: string; // Name of the tenant head
  nguoiThue?: string; // Current tenant name
}

// Definition for household data structure
interface Household {
  soHoKhau: number;
  chuHoInfo?: {
    hoTen: string;
    soDienThoai?: string;
  };
  roomInfo?: {
    soPhong: string;
    ngayBatDau?: string;
  };
}

// Tenant interface for managing room assignments
interface Tenant {
  id: string;
  tenChuHo: string;
  nguoiThue: string; // Người thuê thực tế (có thể khác chủ hộ)
  soHoKhau: string;
  soPhong: string;
  ngayBatDau: string;
  sdt: string;
}

const QuanLyPhong: React.FC = () => {
  // State management
  const [rooms, setRooms] = useState<ExtendedRoom[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isRoomPopupOpen, setRoomPopupOpen] = useState(false);
  const [isTenantPopupOpen, setTenantPopupOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<ExtendedRoom | null>(null);
  const [roomToDelete, setRoomToDelete] = useState<ExtendedRoom | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTang, setFilterTang] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<RoomStatistics | null>(null);
  const [households, setHouseholds] = useState<Household[]>([]);

  // Load room data from API
  const loadRooms = async () => {
    try {
      setIsLoading(true);
      const response = await roomService.getRooms();
      
      // Transform API data to include hoThue and nguoiThue properties for UI
      const extendedRooms: ExtendedRoom[] = response.rooms.map(room => ({
        ...room,
        hoThue: room.hoKhau?.chuHoInfo?.hoTen || undefined,
        nguoiThue: room.nguoiThue || undefined
      }));
      
      setRooms(extendedRooms);
      
      // Get statistics
      const statsResponse = await roomService.getRoomStatistics();
      setStatistics(statsResponse);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching room data:', err);
      setError('Có lỗi xảy ra khi tải dữ liệu phòng. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadHouseholds = async () => {
    try {
      const response = await householdAPI.getAll();
      if (response.data) {
        setHouseholds(response.data.households || []);
        
        // Create tenant records from households that have rooms assigned
        const newTenants: Tenant[] = [];
        response.data.households.forEach((household: Household) => {
          if (household.roomInfo) {
            newTenants.push({
              id: household.soHoKhau.toString(),
              tenChuHo: household.chuHoInfo?.hoTen || 'Unknown',
              nguoiThue: household.chuHoInfo?.hoTen || 'Unknown', // Mặc định giống chủ hộ
              soHoKhau: household.soHoKhau.toString(),
              soPhong: household.roomInfo.soPhong,
              ngayBatDau: household.roomInfo.ngayBatDau || '',
              sdt: household.chuHoInfo?.soDienThoai || ''
            });
          }
        });
        setTenants(newTenants);
      }
    } catch (err) {
      console.error('Error fetching households:', err);
    }
  };

  useEffect(() => {
    loadRooms();
    loadHouseholds();
  }, []);

  const openRoomPopup = (room: ExtendedRoom | null = null) => {
    setEditingRoom(room);
    setRoomPopupOpen(true);
  };

  const closeRoomPopup = () => {
    setEditingRoom(null);
    setRoomPopupOpen(false);
  };

  const saveRoom = async (roomData: Omit<ExtendedRoom, 'id'> & { id?: number }) => {
    try {
      setIsLoading(true);
      
      if (editingRoom && editingRoom.id) {
        // Update existing room
        await roomService.updateRoom(editingRoom.id, roomData);
      } else {
        // Create new room
        await roomService.createRoom(roomData);
      }
      
      // Refresh room list
      await loadRooms();
      closeRoomPopup();
    } catch (err) {
      console.error('Error saving room:', err);
      setError('Có lỗi xảy ra khi lưu thông tin phòng. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const openTenantPopup = () => {
    setTenantPopupOpen(true);
  };

  const closeTenantPopup = () => {
    setTenantPopupOpen(false);
  };

  const saveTenant = async (tenant: Tenant) => {
    try {
      setIsLoading(true);
      
      // Find the room by soPhong
      const room = rooms.find(r => r.soPhong === tenant.soPhong);
      
      if (!room) {
        throw new Error('Không tìm thấy phòng');
      }
      
      // Assign room to household
      await roomService.assignRoom(room.id, Number(tenant.soHoKhau), tenant.ngayBatDau);
      
      // Update tenant information if provided
      if (tenant.nguoiThue) {
        await roomService.updateTenant(room.id, tenant.nguoiThue);
      }
      
      // Refresh data
      await loadRooms();
      await loadHouseholds();
      
      closeTenantPopup();
    } catch (err) {
      console.error('Error assigning room to tenant:', err);
      setError('Có lỗi xảy ra khi cập nhật thông tin người thuê. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDeleteRoom = async () => {
    if (roomToDelete) {
      try {
        setIsLoading(true);
        await roomService.deleteRoom(roomToDelete.id);
        
        // Refresh room list
        await loadRooms();
        setRoomToDelete(null);
      } catch (err) {
        console.error('Error deleting room:', err);
        setError('Có lỗi xảy ra khi xóa phòng. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const cancelDeleteRoom = () => {
    setRoomToDelete(null);
  };

  const phongDaThue = statistics?.rentedRooms || rooms.filter(r => r.hoKhauId).length;
  const phongTrong = statistics?.availableRooms || rooms.filter(r => r.trangThai === 'trong').length;
  const phongBaoTri = statistics?.maintenanceRooms || rooms.filter(r => r.trangThai === 'bao_tri').length;
  const totalRooms = statistics?.totalRooms || rooms.length;

  // Get list of unique floors for filter
  const uniqueTangs = [...new Set(rooms.map(r => r.tang))].sort();
  
  // Filter rooms based on search term and floor
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = 
      room.soPhong.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (room.hoThue || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFloor = !filterTang || room.tang === filterTang;
    
    return matchesSearch && matchesFloor;
  });

  return (
    <Layout role="totruong">
      <div className="p-4 flex flex-col gap-6">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Home className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">QUẢN LÝ PHÒNG</h1>
          </div>
          <p className="text-gray-600 text-sm">Quản lý thông tin phòng và người thuê trong chung cư</p>
        </div>
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {/* Search and filter */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-2">
              <div className="flex flex-col lg:flex-row gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tìm kiếm
                  </label>
                  <input
                    type="text"
                    placeholder="Tìm theo số phòng hoặc tên người thuê..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="w-full lg:w-48">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tầng
                  </label>
                  <select
                    value={filterTang}
                    onChange={(e) => setFilterTang(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tất cả các tầng</option>
                    {uniqueTangs.map(tang => (
                      <option key={tang} value={tang}>Tầng {tang}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => openRoomPopup()} 
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                    Thêm phòng mới
                  </button>
                  <button 
                    onClick={() => openTenantPopup()} 
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    disabled={phongTrong === 0}
                  >
                    <Users className="h-5 w-5" />
                    Thêm hộ thuê
                  </button>
                </div>
              </div>
            </div>

            {/* Statistics cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-gray-500 text-sm">Tổng số phòng</div>
                    <div className="text-2xl font-semibold">{totalRooms}</div>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Home className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-gray-500 text-sm">Phòng đã thuê</div>
                    <div className="text-2xl font-semibold">{phongDaThue}</div>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-gray-500 text-sm">Phòng trống</div>
                    <div className="text-2xl font-semibold">{phongTrong}</div>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Home className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-gray-500 text-sm">Phòng bảo trì</div>
                    <div className="text-2xl font-semibold">{phongBaoTri}</div>
                  </div>
                  <div className="p-3 bg-red-100 rounded-full">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Room table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Danh sách phòng ({filteredRooms.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số phòng
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tầng
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Diện tích (m²)
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Chủ hộ
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Người thuê
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ghi chú
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRooms.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-4 py-4 text-center text-gray-500">
                          Không tìm thấy phòng nào
                        </td>
                      </tr>
                    ) : (
                      filteredRooms.map(room => (
                        <tr key={room.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {room.soPhong}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                            {room.tang}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                            {room.dienTich}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                            {room.hoKhau?.chuHoInfo?.hoTen || (
                              <span className="text-gray-400 italic">Chưa có chủ hộ</span>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                            {room.nguoiThue || (
                              <span className="text-gray-400 italic">Chưa có người thuê</span>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                            {room.trangThai === 'da_thue' && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Đã thuê
                              </span>
                            )}
                            {room.trangThai === 'trong' && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Trống
                              </span>
                            )}
                            {room.trangThai === 'bao_tri' && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Bảo trì
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                            {room.ghiChu || '-'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center">
                            <div className="flex justify-center gap-3">
                              <button
                                onClick={() => openRoomPopup(room)}
                                className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                                title="Sửa"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => setRoomToDelete(room)}
                                className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                                disabled={Boolean(room.hoKhauId)}
                                title="Xóa"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          </>
        )}
      </div>

      {/* Popups */}
      <AddEditRoomPopup
        isOpen={isRoomPopupOpen}
        onClose={closeRoomPopup}
        onSave={saveRoom}
        editData={editingRoom}
        tenants={tenants}
      />

      <AddEditTenantPopup
        isOpen={isTenantPopupOpen}
        onClose={closeTenantPopup}
        onSave={saveTenant}
        availableRooms={rooms.filter(r => !r.hoKhauId)}
        households={households}
      />

      {/* Modal xác nhận xóa */}
      {roomToDelete && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={cancelDeleteRoom}></div>
          <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Xác nhận xóa phòng</h2>
              <p className="text-sm text-gray-600 mb-6">
                Bạn có chắc chắn muốn xóa phòng <strong>{roomToDelete.soPhong}</strong>?<br />
                {roomToDelete.hoKhauId && 'Hộ thuê sẽ bị gỡ liên kết khỏi phòng này.'}
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelDeleteRoom}
                  className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDeleteRoom}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default QuanLyPhong;
