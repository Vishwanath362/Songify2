// API Configuration utility
// Automatically detects if we're in local development or production

const isLocalDevelopment = 
  typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const API_BASE_URL = isLocalDevelopment 
  ? 'http://localhost:3000' 
  : (import.meta.env.VITE_API_BASE_URL || process.env.REACT_APP_API_BASE_URL || 'https://songify-v4q3.onrender.com');

console.log('🌍 Environment:', isLocalDevelopment ? 'Local Development' : 'Production');
console.log('🔗 API Base URL:', API_BASE_URL);

export default API_BASE_URL;
