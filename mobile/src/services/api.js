// Mobile API client pointing to shared backend API (Local IP / Localhost for emulator)
const BASE_URL = 'http://10.0.2.2:5000/api'; // 10.0.2.2 for Android Emulator, localhost for iOS simulator

export async function mobileApiRequest(endpoint, method = 'GET', data = null, token = null) {
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

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Mobile API Request Failed');
  }
  return result;
}
