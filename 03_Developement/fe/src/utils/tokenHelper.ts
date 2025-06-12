// Token Helper Utilities
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error parsing token:', error);
    return true;
  }
};

export const getTokenExpiry = (token: string): Date | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return new Date(payload.exp * 1000);
  } catch (error) {
    console.error('Error parsing token expiry:', error);
    return null;
  }
};

export const validateAndCleanToken = (): string | null => {
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

  console.log('🔑 Token is valid');
  return token;
};

export const clearAuthData = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  console.log('🔑 Auth data cleared');
};
