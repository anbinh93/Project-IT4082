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
    selectedHouseholdId?: string;
    quanHeVoiChuHo?: string;
  }) => {
    return apiRequest('/residents', {
      method: 'POST',
      body: JSON.stringify(data),
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
    targetType: 'new' | 'existing';
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

// Export default api object for convenience
const api = {
  auth: authAPI,
  vehicles: vehicleAPI,
  households: householdAPI,
  residents: residentAPI,
  population: populationAPI,
};

export default api;
