import React, { useState } from 'react';
import Layout from '../components/Layout';
import EditVehiclePopup from '../components/EditVehiclePopup';

const sampleHouseholds = [
  {
    maHo: 'HK001',
    chuHo: 'Nguyễn Văn A',
    xe: [
      { bienSo: '30A-12345', loaiXe: 'Ô tô', thoiGianGui: '2025-04-01', trangThai: 'Đang gửi' },
      { bienSo: '30B-67890', loaiXe: 'Xe máy', thoiGianGui: '2025-04-03', trangThai: 'Tạm ngưng' }
    ]
  },
  {
    maHo: 'HK002',
    chuHo: 'Trần Thị B',
    xe: [
      { bienSo: '29B-88888', loaiXe: 'Xe máy', thoiGianGui: '2025-04-01', trangThai: 'Đang gửi' }
    ]
  }
];

const QuanLyXe: React.FC = () => {
  const [households, setHouseholds] = useState(sampleHouseholds);
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);
  const [editingHoKhauId, setEditingHoKhauId] = useState<string | null>(null);

  const handleEditVehicle = (vehicle: any, hoKhauId: string) => {
    setSelectedVehicle(vehicle);
    setEditingHoKhauId(hoKhauId);
  };

  const handleSaveVehicle = (newData: any) => {
    setHouseholds(prev =>
      prev.map(hk => {
        if (hk.maHo === editingHoKhauId) {
          const updatedXe = hk.xe.map((x: any) =>
            x.bienSo === selectedVehicle.bienSo ? newData : x
          );
          return { ...hk, xe: updatedXe };
        }
        return hk;
      })
    );
    setSelectedVehicle(null);
    setEditingHoKhauId(null);
  };

  const handleDeleteVehicle = (bienSo: string, hoKhauId: string) => {
    setHouseholds(prev =>
      prev.map(hk => {
        if (hk.maHo === hoKhauId) {
          return { ...hk, xe: hk.xe.filter((x: any) => x.bienSo !== bienSo) };
        }
        return hk;
      })
    );
  };

  return (
    <Layout role="totruong">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">QUẢN LÝ XE</h1>
          <p className="text-gray-600 text-sm mt-1">Chào mừng đến với Hệ thống Quản lý Thu phí Chung cư</p>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font text-gray-700 uppercase">Mã hộ</th>
                <th className="px-6 py-3 text-left text-xs font text-gray-700 uppercase">Chủ hộ</th>
                <th className="px-6 py-3 text-left text-xs font text-gray-700 uppercase">Thông tin xe</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {households.map(hk => (
                <tr key={hk.maHo}>
                  <td className="px-6 py-4 text-sm text-gray-900 align-top">{hk.maHo}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 align-top">{hk.chuHo}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {hk.xe.map((x: any, i: number) => (
                      <div key={i} className="mb-2 border-b pb-2">
                        <div><strong>Biển số:</strong> {x.bienSo}</div>
                        <div><strong>Loại xe:</strong> {x.loaiXe}</div>
                        <div><strong>Thời gian gửi:</strong> {x.thoiGianGui}</div>
                        <div><strong>Trạng thái:</strong> {x.trangThai}</div>
                        <div className="flex space-x-2 mt-1">
                          <button onClick={() => handleEditVehicle(x, hk.maHo)} className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                      title="Sửa">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        </button>
                          <button onClick={() => handleDeleteVehicle(x.bienSo, hk.maHo)} className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                      title="Xóa">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        </button>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => handleEditVehicle({ bienSo: '', loaiXe: '', thoiGianGui: '', trangThai: 'Đang gửi' }, hk.maHo)} className="mt-2 text-blue-600 hover:underline text-sm">
                      + Thêm xe
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedVehicle && (
          <EditVehiclePopup
            vehicle={selectedVehicle}
            onClose={() => setSelectedVehicle(null)}
            onSave={handleSaveVehicle}
          />
        )}
      </div>
    </Layout>
  );
};

export default QuanLyXe;