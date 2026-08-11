import { handleMockRoute } from './mockData';

const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
  ? '/api'
  : 'http://localhost:5000/api';

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

    if (response.ok) {
      const rawText = await response.text();
      try {
        return JSON.parse(rawText);
      } catch (parseErr) {
        // Fallback to mock if server returns non-JSON
        console.warn(`[Client Fallback] Non-JSON server response on ${endpoint}. Using client mock engine.`);
        return handleMockRoute(endpoint, method, data);
      }
    } else {
      console.warn(`[Client Fallback] Server HTTP ${response.status} on ${endpoint}. Using client mock engine.`);
      return handleMockRoute(endpoint, method, data);
    }
  } catch (error) {
    // Network or server offline -> execute client mock handler
    console.warn(`[Client Fallback] Server offline or network error on ${endpoint}. Executing client mock handler.`);
    return handleMockRoute(endpoint, method, data);
  }
}
