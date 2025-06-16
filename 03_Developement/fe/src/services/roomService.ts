import { apiRequest } from './api';

export interface Room {
  id: number;
  soPhong: string; // Match với số nhà trong hộ khẩu
  tang: string;
  dienTich: number;
  hoKhauId?: number;
  ngayBatDau?: string;
  ngayKetThuc?: string;
  trangThai: string;
  ghiChu?: string;
  nguoiThue?: string; // Tên người thuê thực tế
  hoKhau?: {
    soHoKhau: number;
    chuHoInfo?: {
      hoTen: string; // Tên chủ hộ thay vì giá phòng
    };
  };
}

export interface RoomStatistics {
  totalRooms: number;
  rentedRooms: number;
  availableRooms: number;
  maintenanceRooms: number;
  roomsByFloor: Array<{
    tang: string;
    count: number;
  }>;
}

export const roomService = {
  // Get all rooms with optional filters and pagination
  async getRooms(params?: {
    page?: number;
    limit?: number;
    search?: string;
    tang?: string;
    trangThai?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<{
    rooms: Room[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
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

    const response = await apiRequest(`/rooms${queryString}`);
    return response;
  },

  // Get a specific room by ID
  async getRoom(id: string | number): Promise<Room> {
    const response = await apiRequest(`/rooms/${id}`);
    return response;
  },

  // Create a new room
  async createRoom(data: Omit<Room, 'id'>): Promise<Room> {
    const response = await apiRequest('/rooms', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    // Handle business logic errors (like duplicate room number)
    if (response.message && !response.room) {
      throw new Error(response.message);
    }
    
    return response.room;
  },

  // Update room information
  async updateRoom(id: string | number, data: Partial<Room>): Promise<Room> {
    const response = await apiRequest(`/rooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.room;
  },

  // Delete a room
  async deleteRoom(id: string | number): Promise<void> {
    await apiRequest(`/rooms/${id}`, {
      method: 'DELETE',
    });
  },

  // Assign a room to a household
  async assignRoom(id: string | number, hoKhauId: number, ngayBatDau?: string): Promise<Room> {
    try {
      const response = await apiRequest(`/rooms/${id}/assign`, {
        method: 'POST',
        body: JSON.stringify({
          hoKhauId,
          ngayBatDau
        }),
      });
      
      console.log('AssignRoom response:', response);
      
      // Check if response has error message
      if (response.message && response.message.includes('lỗi')) {
        throw new Error(response.message);
      }
      
      // Check if response has room data
      if (!response.room) {
        throw new Error('Không nhận được dữ liệu phòng sau khi gán');
      }
      
      // Return the room object from response
      return response.room;
    } catch (error: any) {
      console.error('Error in assignRoom:', error);
      
      // Enhance error message
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Có lỗi xảy ra khi gán phòng cho hộ khẩu');
      }
    }
  },

  // Release a room from a household
  async releaseRoom(id: string | number, ngayKetThuc?: string): Promise<Room> {
    const response = await apiRequest(`/rooms/${id}/release`, {
      method: 'POST',
      body: JSON.stringify({
        ngayKetThuc
      }),
    });
    return response.room;
  },

  // Update tenant information for a room
  async updateTenant(id: string | number, nguoiThue: string): Promise<Room> {
    const response = await apiRequest(`/rooms/${id}/tenant`, {
      method: 'PUT',
      body: JSON.stringify({
        nguoiThue
      }),
    });
    return response.room;
  },

  // Get room statistics
  async getRoomStatistics(): Promise<RoomStatistics> {
    const response = await apiRequest('/rooms/statistics');
    return response;
  }
};

export default roomService;
