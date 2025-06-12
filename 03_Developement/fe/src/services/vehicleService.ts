import { apiRequest } from './api';

export interface VehicleType {
  id: number;
  ten: string;
  phiThue: number;
  moTa?: string;
}

export interface Vehicle {
  id: number;
  hoKhauId: number;
  loaiXeId: number;
  bienSo: string;
  ngayBatDau: string;
  ngayKetThuc?: string;
  trangThai: string;
  ghiChu?: string;
  loaiXe?: VehicleType;
  hoKhau?: {
    soHoKhau: number;
    chuHo: number;
    soNha: string;
    duong: string;
    phuong?: string;
    quan?: string;
    chuHoInfo?: {
      id: number;
      hoTen: string;
      cccd: string;
    };
  };
}

export interface VehicleStatistics {
  overview: {
    total: number;
    active: number;
    inactive: number;
  };
  byType: Array<{
    loaiXeId: number;
    count: string;
    loaiXe: VehicleType;
  }>;
  monthly: Array<{
    year: number;
    month: number;
    count: string;
  }>;
}

export const vehicleService = {
  // Vehicle Type Services
  async getVehicleTypes(): Promise<VehicleType[]> {
    const response = await apiRequest('/vehicles/types');
    return response.data || response;
  },

  async createVehicleType(data: Omit<VehicleType, 'id'>): Promise<VehicleType> {
    const response = await apiRequest('/vehicles/types', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  async updateVehicleType(id: number, data: Partial<VehicleType>): Promise<VehicleType> {
    const response = await apiRequest(`/vehicles/types/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  async deleteVehicleType(id: number): Promise<void> {
    await apiRequest(`/vehicles/types/${id}`, {
      method: 'DELETE',
    });
  },

  // Vehicle Services
  async getVehicles(params?: {
    page?: number;
    limit?: number;
    search?: string;
    hoKhauId?: string;
    loaiXeId?: string;
    trangThai?: string;
  }): Promise<{ vehicles: Vehicle[]; pagination: any }> {
    const queryString = params 
      ? '?' + new URLSearchParams(
          Object.entries(params).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== '') {
              acc[key] = String(value);
            }
            return acc;
          }, {} as Record<string, string>)
        ).toString()
      : '';
    
    const response = await apiRequest(`/vehicles${queryString}`);
    return response.data;
  },

  async createVehicle(data: {
    hoKhauId: number;
    loaiXeId: number;
    bienSo: string;
    ngayBatDau: string;
    ngayKetThuc?: string;
    trangThai?: string;
    ghiChu?: string;
  }): Promise<Vehicle> {
    const response = await apiRequest('/vehicles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  async updateVehicle(id: number, data: Partial<Vehicle>): Promise<Vehicle> {
    const response = await apiRequest(`/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  async deleteVehicle(id: number): Promise<void> {
    await apiRequest(`/vehicles/${id}`, {
      method: 'DELETE',
    });
  },

  async getVehiclesByHousehold(hoKhauId: number): Promise<Vehicle[]> {
    const response = await apiRequest(`/vehicles/household/${hoKhauId}`);
    return response.data || response;
  },

  async getVehicleStatistics(): Promise<VehicleStatistics> {
    const response = await apiRequest('/vehicles/statistics');
    return response.data || response;
  },
};
