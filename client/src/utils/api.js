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
    
    // Read raw response text first to handle non-JSON HTML/Text error responses gracefully
    const rawText = await response.text();
    let result = null;

    try {
      result = JSON.parse(rawText);
    } catch (parseErr) {
      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}: ${rawText.slice(0, 120)}`);
      }
      throw new Error(`Invalid JSON response: ${rawText.slice(0, 100)}`);
    }

    // Handle 401 Unauthorized (token refresh opportunity)
    if (response.status === 401 && !endpoint.includes('/auth/login')) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: refreshToken }),
        });
        const refreshText = await refreshRes.text();
        try {
          const refreshData = JSON.parse(refreshText);
          if (refreshData.success) {
            localStorage.setItem('accessToken', refreshData.data.accessToken);
            localStorage.setItem('refreshToken', refreshData.data.refreshToken);
            headers['Authorization'] = `Bearer ${refreshData.data.accessToken}`;
            const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, options);
            const retryText = await retryResponse.text();
            return JSON.parse(retryText);
          }
        } catch (e) {}
      }
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }

    if (!response.ok) {
      throw new Error(result.message || result.error || `Server Error (${response.status})`);
    }

    return result;
  } catch (error) {
    console.error(`API Request Error [${method} ${endpoint}]:`, error);
    throw error;
  }
}
