const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.email - User email
 * @param {string} userData.username - Username
 * @param {string} userData.password - Password
 * @returns {Promise<Object>} Response with user data and token
 */
export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Important: Include cookies
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Registration failed");
  }

  return response.json();
};

/**
 * Login user
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - Password
 * @returns {Promise<Object>} Response with user data and token
 */
export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Important: Include cookies
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Login failed");
  }

  return response.json();
};

/**
 * Logout user
 * @returns {Promise<Object>} Logout response
 */
export const logoutUser = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include", // Important: Include cookies
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Logout failed");
  }

  return response.json();
};

/**
 * Verify current authentication token
 * @returns {Promise<Object>} User data if authenticated
 */
export const verifyToken = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/verify`, {
    method: "GET",
    credentials: "include", // Important: Include cookies
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Token verification failed");
  }

  return response.json();
};

/**
 * Get current user info
 * @returns {Promise<Object>} Current user data
 */
export const getCurrentUser = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    credentials: "include", // Important: Include cookies
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to get user info");
  }

  return response.json();
};
