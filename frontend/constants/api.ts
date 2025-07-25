// API Configuration for Bucks & Balance
// For physical device testing, replace localhost with your computer's IP
// Example: "http://192.168.1.100:5001/api"

export const API_BASE_URL = "http://10.0.0.74:5001/api"; // Your computer's IP address

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  
  // Expenses
  EXPENSES: "/expenses",
  EXPENSE_BY_ID: (id: string) => `/expenses/${id}`,
  EXPENSES_BY_CATEGORY: (categoryId: string) => `/expenses/category/${categoryId}`,
  EXPENSES_SUMMARY: "/expenses/summary/by-category",
  
  // Categories
  CATEGORIES: "/categories",
  CATEGORY_BY_ID: (id: string) => `/categories/${id}`,
  
  // Health check
  TEST: "/test",
};

// Full URL helper function
export const getFullUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`;
