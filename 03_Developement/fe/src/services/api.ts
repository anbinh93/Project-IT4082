// API Configuration and Service Functions
const API_BASE_URL = 'http://localhost:8000/api';

// Storage for authentication token
let authToken: string | null = localStorage.getItem('authToken');

// Set authentication token
export const setAuthToken = (token: string) => {
  authToken = token;
  localStorage.setItem('authToken', token);
};

// Clear authentication token
export const clearAuthToken = () => {
  authToken = null;
  localStorage.removeItem('authToken');
};

// Base API request function
const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (authToken) {
    defaultHeaders.Authorization = `Bearer ${authToken}`;
  }

  const config: RequestInit = {
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
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
    hokhau_id: number;
    loaixe_id: number;
    bienso: string;
    hangxe: string;
    tengoi?: string;
    mausac: string;
    ghichu?: string;
  }) => {
    return apiRequest('/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    });
  },

  update: async (id: string, vehicleData: Partial<{
    hokhau_id: number;
    loaixe_id: number;
    bienso: string;
    hangxe: string;
    tengoi: string;
    mausac: string;
    ghichu: string;
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

// Room API
export const roomAPI = {
  getAll: async () => {
    return apiRequest('/rooms');
  },

  getById: async (id: string) => {
    return apiRequest(`/rooms/${id}`);
  },

  getStatistics: async () => {
    return apiRequest('/rooms/statistics');
  },

  assignRoom: async (roomId: string, hokhau_id: number) => {
    return apiRequest(`/rooms/${roomId}/assign`, {
      method: 'POST',
      body: JSON.stringify({ hokhau_id }),
    });
  },

  unassignRoom: async (roomId: string) => {
    return apiRequest(`/rooms/${roomId}/unassign`, {
      method: 'POST',
    });
  },
};

// Export default api object for convenience
const api = {
  auth: authAPI,
  vehicles: vehicleAPI,
  rooms: roomAPI,
};

export default api;
