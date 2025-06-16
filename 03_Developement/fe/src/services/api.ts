// API Configuration and Service Functions
const API_BASE_URL = 'http://localhost:8000/api';

// Token validation utility
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error parsing token:', error);
    return true;
  }
};

// Get valid token or null
const getValidToken = (): string | null => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    console.log('🔑 No token found');
    return null;
  }

  if (isTokenExpired(token)) {
    console.log('🔑 Token expired, clearing storage');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    return null;
  }

  return token;
};

// Set authentication token
export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

// Clear authentication token
export const clearAuthToken = () => {
  localStorage.removeItem('authToken');
};

// Base API request function
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Always get fresh and valid token
  const validToken = getValidToken();
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (validToken) {
    defaultHeaders.Authorization = `Bearer ${validToken}`;
    console.log('🔑 Using valid token for request:', validToken.substring(0, 20) + '...');
  } else {
    console.log('⚠️  No valid token available');
  }

  const config: RequestInit = {
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    ...options,
  };

  try {
    console.log('Making API request to:', url);
    console.log('Request headers:', config.headers);
    
    const response = await fetch(url, config);
    console.log('Response status:', response.status);
    console.log('Response OK:', response.ok);
    
    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      console.error('API Response not OK:', {
        status: response.status,
        statusText: response.statusText,
        data: data
      });
      
      // Handle token expiry or invalid token
      if (response.status === 401 && data.message?.includes('Token')) {
        console.log('🔑 Token invalid, clearing auth data');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        // Redirect to login page
        window.location.href = '/login';
        return;
      }
      
      // For business logic errors (400, 422), return the response data instead of throwing
      // This allows the frontend to handle the error gracefully
      if (response.status === 400 || response.status === 422) {
        console.log('Business logic error, returning data with error info');
        return data; // Return the response data which should contain success: false
      }
      
      // For other HTTP errors (401, 403, 404, 500, etc.), throw an error
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    console.log('API request successful, returning data:', data);
    return data;
  } catch (error: any) {
    console.error('API Request Error Details:');
    console.error('Error type:', typeof error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Full error object:', error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (response.token) {
      setAuthToken(response.token);
    }
    return response;
  },

  logout: async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } finally {
      clearAuthToken();
    }
  },

  register: async (username: string, password: string) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },
};

// Vehicle API
export const vehicleAPI = {
  getAll: async () => {
    return apiRequest('/vehicles');
  },

  getById: async (id: string) => {
    return apiRequest(`/vehicles/${id}`);
  },

  getTypes: async () => {
    return apiRequest('/vehicles/types');
  },

  getStatistics: async () => {
    return apiRequest('/vehicles/statistics');
  },

  create: async (vehicleData: {
    hoKhauId: number;
    loaiXeId: number;
    bienSo: string;
    ngayBatDau?: string;
    ngayKetThuc?: string;
    trangThai?: string;
    ghiChu?: string;
  }) => {
    return apiRequest('/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    });
  },

  update: async (id: string, vehicleData: Partial<{
    hoKhauId: number;
    loaiXeId: number;
    bienSo: string;
    ngayBatDau: string;
    ngayKetThuc: string;
    trangThai: string;
    ghiChu: string;
  }>) => {
    return apiRequest(`/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vehicleData),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/vehicles/${id}`, {
      method: 'DELETE',
    });
  },
};

// Household API
export const householdAPI = {
  getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    return apiRequest(`/households${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id: string | number) => {
    return apiRequest(`/households/${id}`);
  },

  getAvailable: async () => {
    return apiRequest('/households/available');
  },

  create: async (householdData: {
    chuHoId?: number | string | null;
    diaChi: string;
    ngayLap?: string;
    soPhong?: string;
  }) => {
    return apiRequest('/households', {
      method: 'POST',
      body: JSON.stringify(householdData),
    });
  },

  update: async (id: string | number, householdData: {
    maHoKhau?: string;
    chuHoId?: number;
    diaChi?: string;
    lyDoTao?: string;
  }) => {
    return apiRequest(`/households/${id}`, {
      method: 'PUT',
      body: JSON.stringify(householdData),
    });
  },

  assignHead: async (householdId: string | number, newHeadId: string | number) => {
    return apiRequest('/households/assign-head', {
      method: 'POST',
      body: JSON.stringify({
        householdId,
        newHeadId
      }),
    });
  },
};

// Resident API
export const residentAPI = {
  getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    return apiRequest(`/residents${queryString ? `?${queryString}` : ''}`);
  },

  getAvailable: async (search?: string) => {
    const queryString = search ? new URLSearchParams({ search }).toString() : '';
    return apiRequest(`/residents/available${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id: string | number) => {
    return apiRequest(`/residents/${id}`);
  },

  create: async (data: {
    hoTen: string;
    ngaySinh: string;
    gioiTinh: string;
    danToc?: string;
    tonGiao?: string;
    cccd: string;
    ngayCap?: string;
    noiCap?: string;
    ngheNghiep?: string;
    soDienThoai?: string;
    selectedHouseholdId?: string;
    quanHeVoiChuHo?: string;
  }) => {
    return apiRequest('/residents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string | number, data: {
    hoTen?: string;
    ngaySinh?: string;
    gioiTinh?: string;
    danToc?: string;
    tonGiao?: string;
    cccd?: string;
    ngayCap?: string;
    noiCap?: string;
    ngheNghiep?: string;
    soDienThoai?: string;
    ghiChu?: string;
  }) => {
    return apiRequest(`/residents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string | number) => {
    return apiRequest(`/residents/${id}`, {
      method: 'DELETE',
    });
  },

  addToHousehold: async (data: {
    residentId: number;
    householdId: number;
    quanHeVoiChuHo: string;
    ngayThem: string;
  }) => {
    return apiRequest('/residents/add-to-household', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  separateHousehold: async (data: {
    residentId: number;
    targetType: 'new' | 'existing' | 'remove'; // Updated type
    targetHouseholdId?: number;
    newHouseholdAddress?: string;
    reason: string;
  }) => {
    return apiRequest('/residents/separate-household', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getHouseholdInfo: async (id: string | number) => {
    return apiRequest(`/residents/${id}/household-info`);
  },

  getHouseholdChangeHistory: async (params?: {
    page?: number;
    limit?: number;
    fromDate?: string;
    toDate?: string;
    changeType?: number;
  }) => {
    // Filter out undefined values to avoid "undefined" strings in URL
    const cleanParams: Record<string, string> = {};
    if (params) {
      if (params.page !== undefined) cleanParams.page = params.page.toString();
      if (params.limit !== undefined) cleanParams.limit = params.limit.toString();
      if (params.fromDate !== undefined && params.fromDate) cleanParams.fromDate = params.fromDate;
      if (params.toDate !== undefined && params.toDate) cleanParams.toDate = params.toDate;
      if (params.changeType !== undefined) cleanParams.changeType = params.changeType.toString();
    }
    const queryString = Object.keys(cleanParams).length ? new URLSearchParams(cleanParams).toString() : '';
    return apiRequest(`/residents/household-changes${queryString ? `?${queryString}` : ''}`);
  },
};

// Population Statistics API
export const populationAPI = {
  getGenderStatistics: async () => {
    return apiRequest('/population/gender');
  },

  getAgeStatistics: async (customAgeGroups?: string) => {
    const queryString = customAgeGroups ? new URLSearchParams({ customAgeGroups }).toString() : '';
    return apiRequest(`/population/age${queryString ? `?${queryString}` : ''}`);
  },

  getPopulationMovement: async (fromDate?: string, toDate?: string) => {
    const params: any = {};
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;
    const queryString = Object.keys(params).length ? new URLSearchParams(params).toString() : '';
    return apiRequest(`/population/movement${queryString ? `?${queryString}` : ''}`);
  },

  getTotalResidents: async () => {
    return apiRequest('/residents?limit=1');
  },

  getTemporaryStatusStatistics: async () => {
    return apiRequest('/population/temporary-status');
  },
};

// DotThu (Fee Collection) API functions
export const dotThuAPI = {
  // Get all fee collection periods with pagination and search
  getAll: async (params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
    search?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.size !== undefined) queryParams.append('size', params.size.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortDir) queryParams.append('sortDir', params.sortDir);
    if (params?.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    const endpoint = `/dot-thu${queryString ? `?${queryString}` : ''}`;
    
    return await apiRequest(endpoint);
  },

  // Get all fee collection periods with their fee items (for tab-based view)
  getAllWithKhoanThu: async (params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
    search?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.size !== undefined) queryParams.append('size', params.size.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortDir) queryParams.append('sortDir', params.sortDir);
    if (params?.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    const endpoint = `/dot-thu/with-khoan-thu${queryString ? `?${queryString}` : ''}`;
    
    return await apiRequest(endpoint);
  },

  // Get fee collection period by ID
  getById: async (id: string) => {
    return await apiRequest(`/dot-thu/${id}`);
  },

  // Create new fee collection period
  create: async (data: {
    tenDotThu: string;
    ngayTao: string;
    thoiHan: string;
    khoanThu?: Array<{
      khoanThuId: string;
      soTien?: number;
    }>;
  }) => {
    return await apiRequest('/dot-thu', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update fee collection period
  update: async (id: string, data: {
    tenDotThu?: string;
    ngayTao?: string;
    thoiHan?: string;
    khoanThu?: Array<{
      khoanThuId: string;
      soTien?: number;
    }>;
  }) => {
    return await apiRequest(`/dot-thu/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete fee collection period
  delete: async (id: string) => {
    return await apiRequest(`/dot-thu/${id}`, {
      method: 'DELETE',
    });
  },

  // Get fee collection statistics
  getStatistics: async () => {
    return await apiRequest('/dot-thu/statistics');
  },

  // Get payment statistics for a fee collection period
  getPaymentStatistics: async (dotThuId: string) => {
    return await apiRequest(`/dot-thu/${dotThuId}/payment-statistics`);
  },

  // Get payment info for a household in a specific fee collection period
  getPaymentInfo: async (dotThuId: string, hoKhauId: string) => {
    return await apiRequest(`/dot-thu/${dotThuId}/payment-info/${hoKhauId}`);
  },

  // Record payment for a household
  recordPayment: async (data: {
    dotThuId: string;
    khoanThuId: string;
    hoKhauId: string;
    nguoiNopId: string;
    soTien: number;
    ngayNop?: string;
    hinhThucNop?: string;
    ghiChu?: string;
  }) => {
    return await apiRequest('/dot-thu/record-payment', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Manual closure/reopening functions
  close: async (id: string) => {
    return await apiRequest(`/dot-thu/${id}/close`, {
      method: 'PATCH',
    });
  },

  reopen: async (id: string) => {
    return await apiRequest(`/dot-thu/${id}/reopen`, {
      method: 'PATCH',
    });
  },

  markCompleted: async (id: string) => {
    return await apiRequest(`/dot-thu/${id}/complete`, {
      method: 'PATCH',
    });
  },

  // Auto-closure function
  autoClose: async () => {
    return await apiRequest('/dot-thu/auto-close', {
      method: 'POST',
    });
  },
};

// KhoanThu API functions
export const khoanThuAPI = {
  // Get all fee types
  getAll: async () => {
    return await apiRequest('/khoan-thu');
  },

  // Get fee type by ID
  getById: async (id: string) => {
    return await apiRequest(`/khoan-thu/${id}`);
  },

  // Create new fee type
  create: async (data: {
    tenKhoan: string;
    batBuoc: boolean;
    ghiChu?: string;
    thoiHan?: string;
  }) => {
    return await apiRequest('/khoan-thu', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update fee type
  update: async (id: string, data: {
    tenKhoan?: string;
    batBuoc?: boolean;
    ghiChu?: string;
    thoiHan?: string;
  }) => {
    return await apiRequest(`/khoan-thu/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete fee type
  delete: async (id: string) => {
    return await apiRequest(`/khoan-thu/${id}`, {
      method: 'DELETE',
    });
  },
};

// Payment API functions
export const paymentAPI = {
  // Create new payment
  create: async (data: {
    householdId: number;
    feeTypeId: number;
    amountPaid: number;
    paymentDate?: string;
    paymentMethod?: string;
    notes?: string;
    nguoinop?: string;
  }) => {
    return await apiRequest('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get all payments
  getAll: async (params?: {
    householdId?: number;
    feeTypeId?: number;
    startDate?: string;
    endDate?: string;
    paymentMethod?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }) => {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    return await apiRequest(`/payments${queryString ? `?${queryString}` : ''}`);
  },

  // Get payment by ID
  getById: async (id: string | number) => {
    return await apiRequest(`/payments/${id}`);
  },

  // Update payment
  update: async (id: string | number, data: {
    amountPaid?: number;
    paymentDate?: string;
    paymentMethod?: string;
    notes?: string;
    nguoinop?: string;
  }) => {
    return await apiRequest(`/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete payment (soft delete)
  delete: async (id: string | number) => {
    return await apiRequest(`/payments/${id}`, {
      method: 'DELETE',
    });
  },

  // Restore payment
  restore: async (id: string | number, restoreReason?: string) => {
    return await apiRequest(`/payments/${id}/restore`, {
      method: 'POST',
      body: JSON.stringify({ restoreReason }),
    });
  },

  // Get payment statistics
  getStatistics: async (params?: {
    feeTypeId?: number;
    startDate?: string;
    endDate?: string;
  }) => {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    return await apiRequest(`/payments/statistics${queryString ? `?${queryString}` : ''}`);
  },
};

// Export the main API object with dotThu, khoanThu, and payment included
const api = {
  auth: authAPI,
  vehicles: vehicleAPI,
  households: householdAPI,
  residents: residentAPI,
  population: populationAPI,
  dotThu: dotThuAPI,
  khoanThu: khoanThuAPI,
  payment: paymentAPI,
};

export default api;
