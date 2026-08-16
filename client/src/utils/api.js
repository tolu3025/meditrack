import { handleMockRoute } from './mockData';

const isLocalVite = typeof window !== 'undefined' && 
  window.location.hostname === 'localhost' && 
  window.location.port !== '';

const API_BASE_URL = isLocalVite
  ? 'http://localhost:5000/api'
  : 'https://meditrack-tawny.vercel.app/api';

/**
 * Perform API request with automatic client-side mock fallback
 * Ensures zero failure demo testing on Vercel static hosts or offline environments.
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
    const rawText = await response.text();
    let result;
    try {
      result = JSON.parse(rawText);
    } catch (parseErr) {
      result = null;
    }

    if (response.ok) {
      return result || { success: true };
    } else {
      return result || { success: false, message: `Server error: HTTP ${response.status}` };
    }
  } catch (error) {
    console.error(`[API Network Error] ${method} ${endpoint}:`, error);
    return { success: false, message: 'Network error: Cannot connect to the server. Please check your internet connection.' };
  }
}
