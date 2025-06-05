import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import AddEditRoomPopup from '../components/AddEditRoomPopup';
import AddEditTenantPopup from '../components/AddEditTenantPopup';

interface Room {
  id: string;
  soPhong: string;
  tang: string;
  dienTich: number;
  donGia: number;
  hoThue?: string;
  ngayBatDau?: string;
  ghiChu?: string;
}

interface Tenant {
  id: string;
  tenChuHo: string;
  soHoKhau: string;
  soPhong: string;
  ngayBatDau: string;
  sdt: string;
}

const sampleRooms: Room[] = [
  {
    id: '1',
    soPhong: '101',
    tang: '1',
    dienTich: 30,
    donGia: 100000,
    hoThue: 'Nguyễn Văn A',
    ngayBatDau: '2025-06-01',
    ghiChu: 'Phòng hướng Đông, có ban công'
  },
  {
    id: '2',
    soPhong: '202',
    tang: '2',
    dienTich: 28,
    donGia: 95000,
    hoThue: '',
    ngayBatDau: '',
    ghiChu: ''
  },
  {
    id: '3',
    soPhong: '303',
    tang: '3',
    dienTich: 32,
    donGia: 110000,
    hoThue: 'Trần Thị B',
    ngayBatDau: '2025-06-03',
    ghiChu: 'Đã trang bị điều hòa'
  }
];

const sampleTenants: Tenant[] = [
  {
    id: 't1',
    tenChuHo: 'Nguyễn Văn A',
    soHoKhau: 'HK001',
    soPhong: '101',
    ngayBatDau: '2025-06-01',
    sdt: '0912345678'
  },
  {
    id: 't2',
    tenChuHo: 'Trần Thị B',
    soHoKhau: 'HK002',
    soPhong: '303',
    ngayBatDau: '2025-06-03',
    sdt: '0987654321'
  }
];

const QuanLyPhong: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isRoomPopupOpen, setRoomPopupOpen] = useState(false);
  const [isTenantPopupOpen, setTenantPopupOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);

  useEffect(() => {
    setRooms(sampleRooms);
    setTenants(sampleTenants);
  }, []);

  const openRoomPopup = (room: Room | null = null) => {
    setEditingRoom(room);
    setRoomPopupOpen(true);
  };

  const closeRoomPopup = () => {
    setEditingRoom(null);
    setRoomPopupOpen(false);
  };

  const saveRoom = (roomData: Room) => {
    if (editingRoom) {
      setRooms(prev => prev.map(r => r.id === editingRoom.id ? { ...roomData, id: editingRoom.id } : r));
    } else {
      setRooms(prev => [...prev, { ...roomData, id: Date.now().toString() }]);
    }
    closeRoomPopup();
  };

  const openTenantPopup = () => {
    setTenantPopupOpen(true);
  };

  const closeTenantPopup = () => {
    setTenantPopupOpen(false);
  };

  const saveTenant = (tenant: Tenant) => {
    setTenants(prev => [...prev, { ...tenant, id: Date.now().toString() }]);
    setRooms(prev => prev.map(r => r.soPhong === tenant.soPhong ? { ...r, hoThue: tenant.tenChuHo, ngayBatDau: tenant.ngayBatDau } : r));
  };

  const confirmDeleteRoom = () => {
    if (roomToDelete) {
      setRooms(prev => prev.filter(r => r.id !== roomToDelete.id));
      setTenants(prev => prev.filter(t => t.soPhong !== roomToDelete.soPhong));
      setRoomToDelete(null);
    }
  };

  const cancelDeleteRoom = () => {
    setRoomToDelete(null);
  };

  return (
    <Layout role="totruong">
      <div className="p-4 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">QUẢN LÝ PHÒNG</h1>
          <p className="text-gray-600 text-sm mt-1">Chào mừng đến với Hệ thống Quản lý Thu phí Chung cư</p>
        </div>
          
        <div className="flex justify-between items-center">
          <button onClick={() => openRoomPopup()} className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600">
            + Thêm phòng mới
          </button>
          <button onClick={() => openTenantPopup()} className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600">
            + Thêm hộ thuê
          </button>
        </div>

        <div className="mt-2 bg-white rounded-md shadow-md overflow-hidden border border-gray-200">
          <div className="p-4 bg-gray-100 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Danh sách phòng</h2>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Số phòng</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Tầng</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Diện tích (m²)</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Đơn giá (VNĐ/m²)</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Hộ thuê</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-800 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rooms.map(room => (
                <tr key={room.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">{room.soPhong}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{room.tang}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{room.dienTich}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{room.donGia.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{room.hoThue || '-'}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => openRoomPopup(room)} 
                        className="p-1 rounded hover:bg-blue-100 transition"
                        title="Sửa">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button onClick={() => setRoomToDelete(room)} 
                        className="p-1 rounded hover:bg-red-100 transition"
                        title="Xóa">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
        availableRooms={rooms.filter(r => !r.hoThue)}
      />

      {/* Modal xác nhận xóa */}
      {roomToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center space-y-4">
            <h2 className="text-lg font-bold text-gray-800">Xác nhận xóa phòng</h2>
            <p className="text-sm text-gray-600">
              Bạn có chắc chắn muốn xóa phòng <strong>{roomToDelete.soPhong}</strong>?<br />
              Hộ thuê (nếu có) sẽ bị gỡ liên kết khỏi phòng này.
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={confirmDeleteRoom}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Xóa
              </button>
              <button
                onClick={cancelDeleteRoom}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default QuanLyPhong;
