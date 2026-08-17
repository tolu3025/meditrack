// Detect Capacitor native environment (file:// or capacitor:// protocol)
const isCapacitor = typeof window !== 'undefined' &&
  (window.location.protocol === 'capacitor:' ||
   window.location.protocol === 'file:' ||
   (window.Capacitor && window.Capacitor.isNative));

// Detect local Vite development server
const isLocalVite = typeof window !== 'undefined' &&
  window.location.hostname === 'localhost' &&
  window.location.port !== '' &&
  !isCapacitor;

// Backend URLs
const RENDER_URL = 'https://meditrack-i1p8.onrender.com'; // Render backend
const VERCEL_URL = 'https://meditrack-tawny.vercel.app';

// Set API base URL:
// - Local dev: connect to local Express server
// - Mobile/Capacitor: connect to Render production backend
// - Deployed web: use relative /api (same origin as Vercel frontend)
const API_BASE_URL = isLocalVite
  ? 'http://localhost:5000/api'
  : isCapacitor
    ? `${RENDER_URL}/api`
    : '/api';

export { API_BASE_URL };

/**
 * Perform an API request using the live backend.
 * No mock fallback – errors are surfaced to the user.
 */
export async function apiRequest(endpoint, method = 'GET', data = null) {
  const token = localStorage.getItem('accessToken');

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = { method, headers };

  if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const rawText = await response.text();

    let result;
    try {
      result = JSON.parse(rawText);
    } catch {
      result = null;
    }

    if (response.ok) {
      return result || { success: true };
    } else {
      const message = result?.message || `Server error (HTTP ${response.status})`;
      return { success: false, message };
    }
  } catch (error) {
    console.error(`[API] ${method} ${endpoint} failed:`, error.message);
    return {
      success: false,
      message: 'Cannot connect to the server. Please check your internet connection.',
    };
  }
}
