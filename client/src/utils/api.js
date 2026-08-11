const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
  ? '/api'
  : 'http://localhost:5000/api';

/**
 * Perform custom API requests with automatic JWT Bearer header insertion
 */
export async function apiRequest(endpoint, method = 'GET', data = null) {
  const token = localStorage.getItem('accessToken');

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    // Handle 401 Unauthorized (token refresh opportunity)
    if (response.status === 401 && !endpoint.includes('/auth/login')) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: refreshToken }),
        });
        const refreshData = await refreshRes.json();
        if (refreshData.success) {
          localStorage.setItem('accessToken', refreshData.data.accessToken);
          localStorage.setItem('refreshToken', refreshData.data.refreshToken);
          // Retry original request with new token
          headers['Authorization'] = `Bearer ${refreshData.data.accessToken}`;
          const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, options);
          return await retryResponse.json();
        }
      }
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'An error occurred during API call');
    }

    return result;
  } catch (error) {
    console.error(`API Request Error [${method} ${endpoint}]:`, error);
    throw error;
  }
}
