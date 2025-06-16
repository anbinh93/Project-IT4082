import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Home, Users, Plus, Loader2, AlertTriangle, Edit, Trash2 } from 'lucide-react';
import { roomService } from '../services/roomService';
import type { Room, RoomStatistics } from '../services/roomService';
import { householdAPI } from '../services/api';

// Extended room interface for apartment management
interface ApartmentRoom extends Room {
  chuCanHo?: string; // Name of apartment owner (head of household)
  maHoKhau?: string; // Household code (formatted)
  soThanhVien?: number; // Number of household members
  ngayVaoO?: string; // Move-in date
  soDienThoai?: string; // Phone number of household head
  diaChiDayDu?: string; // Full address
}

// Definition for household data structure with apartment info
interface HouseholdWithApartment {
  soHoKhau: number;
  soNha: string; // This should match Room.soPhong
  duong: string;
  phuong: string;
  quan: string;
  thanhPho: string;
  chuHoInfo?: {
    hoTen: string;
    soDienThoai?: string;
  };
  thanhVien?: Array<{
    nhanKhauId: number;
    quanHeVoiChuHo: string;
  }>;
  ngayLamHoKhau: string;
}

const QuanLyPhong: React.FC = () => {
  // State management
  const [rooms, setRooms] = useState<ApartmentRoom[]>([]);
  const [households, setHouseholds] = useState<HouseholdWithApartment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTang, setFilterTang] = useState("");
  const [filterTrangThai, setFilterTrangThai] = useState(""); // all, occupied, vacant
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<RoomStatistics | null>(null);

  // Load room data from API and merge with household data
  const loadRooms = async () => {
    try {
      setIsLoading(true);
      
      // Load rooms and households data in parallel
      const [roomsResponse, householdsResponse, statsResponse] = await Promise.all([
        roomService.getRooms(),
        householdAPI.getAll(),
        roomService.getRoomStatistics()
      ]);
      
      const households = householdsResponse.data?.households || [];
      setHouseholds(households);
      
      // Transform API data to include household information
      const extendedRooms: ApartmentRoom[] = roomsResponse.rooms.map(room => {
        // Find matching household by room number (soPhong should match soNha)
        const matchingHousehold = households.find((h: any) => h.soNha === room.soPhong);
        
        return {
          ...room,
          chuCanHo: matchingHousehold?.chuHoInfo?.hoTen || undefined,
          maHoKhau: matchingHousehold ? `HK${matchingHousehold.soHoKhau.toString().padStart(3, '0')}` : undefined,
          soThanhVien: matchingHousehold?.thanhVien?.length || 0,
          ngayVaoO: matchingHousehold?.ngayLamHoKhau || undefined,
          soDienThoai: matchingHousehold?.chuHoInfo?.soDienThoai || undefined,
          diaChiDayDu: matchingHousehold ? 
            `${matchingHousehold.soNha}, ${matchingHousehold.duong}, ${matchingHousehold.phuong}, ${matchingHousehold.quan}, ${matchingHousehold.thanhPho}` : 
            undefined
        };
      });
      
      setRooms(extendedRooms);
      setStatistics(statsResponse);
      setError(null);
    } catch (err) {
      console.error('Error fetching room data:', err);
      setError('Có lỗi xảy ra khi tải dữ liệu phòng. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  // Calculate statistics
  const phongCoNguoi = rooms.filter(r => r.chuCanHo).length;
  const phongTrong = rooms.filter(r => !r.chuCanHo).length;
  const totalRooms = rooms.length;

  // Get list of unique floors for filter
  const uniqueTangs = [...new Set(rooms.map(r => r.tang))].sort();
  
  // Filter rooms based on search term, floor, and status
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = 
      room.soPhong.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (room.chuCanHo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (room.maHoKhau || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFloor = !filterTang || room.tang === filterTang;
    
    const matchesStatus = !filterTrangThai || 
      (filterTrangThai === 'occupied' && room.chuCanHo) ||
      (filterTrangThai === 'vacant' && !room.chuCanHo);
    
    return matchesSearch && matchesFloor && matchesStatus;
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
            <h1 className="text-2xl font-bold text-gray-800">QUẢN LÝ CĂN HỘ</h1>
          </div>
          <p className="text-gray-600 text-sm">Quản lý thông tin căn hộ và chủ hộ trong chung cư</p>
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
            {/* Statistics cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-gray-500 text-sm">Tổng số căn hộ</div>
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
                    <div className="text-gray-500 text-sm">Căn hộ có người ở</div>
                    <div className="text-2xl font-semibold">{phongCoNguoi}</div>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-gray-500 text-sm">Căn hộ trống</div>
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
                    <div className="text-gray-500 text-sm">Tỷ lệ lấp đầy</div>
                    <div className="text-2xl font-semibold">{totalRooms > 0 ? Math.round((phongCoNguoi / totalRooms) * 100) : 0}%</div>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <AlertTriangle className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Search and filter */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-col lg:flex-row gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tìm kiếm
                  </label>
                  <input
                    type="text"
                    placeholder="Tìm theo số căn hộ, tên chủ hộ, mã hộ khẩu..."
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
                <div className="w-full lg:w-48">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái
                  </label>
                  <select
                    value={filterTrangThai}
                    onChange={(e) => setFilterTrangThai(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tất cả</option>
                    <option value="occupied">Có người ở</option>
                    <option value="vacant">Trống</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Room table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Danh sách căn hộ ({filteredRooms.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số căn hộ
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tầng
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Diện tích (m²)
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Chủ căn hộ
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mã hộ khẩu
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số thành viên
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Liên hệ
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRooms.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                          {searchTerm || filterTang || filterTrangThai ? 
                            'Không tìm thấy căn hộ nào phù hợp với điều kiện lọc' : 
                            'Chưa có căn hộ nào'}
                        </td>
                      </tr>
                    ) : (
                      filteredRooms.map(room => (
                        <tr key={room.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {room.soPhong}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            Tầng {room.tang}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {room.dienTich}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {room.chuCanHo ? (
                              <div className="flex flex-col">
                                <span className="font-medium text-gray-900">{room.chuCanHo}</span>
                                {room.ngayVaoO && (
                                  <span className="text-xs text-gray-500">
                                    Từ {new Date(room.ngayVaoO).toLocaleDateString('vi-VN')}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">Chưa có chủ hộ</span>
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {room.maHoKhau ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {room.maHoKhau}
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {room.soThanhVien ? (
                              <span className="flex items-center">
                                <Users className="h-4 w-4 mr-1 text-gray-400" />
                                {room.soThanhVien} người
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {room.soDienThoai || '-'}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {room.chuCanHo ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Có người ở
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Trống
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">Lưu ý:</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <div className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span><strong>Chủ căn hộ:</strong> Là chủ hộ của hộ khẩu đăng ký tại căn hộ đó.</span>
                </div>
                <div className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span><strong>Số thành viên:</strong> Tổng số người trong hộ khẩu đăng ký tại căn hộ.</span>
                </div>
                <div className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span><strong>Mã hộ khẩu:</strong> Mã định danh của hộ khẩu đăng ký tại căn hộ.</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default QuanLyPhong;
