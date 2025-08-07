import React, { useState } from "react";
import { Music, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "./Auth";

// Environment variable with fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || process.env.REACT_APP_API_BASE_URL || 'https://songify-v4q3.onrender.com';

export const Login = () => {
  const [focusedField, setFocusedField] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const { handleLogin } = useAuthContext();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    console.log("Login form submitted");
    console.log("API_BASE_URL:", API_BASE_URL);
    console.log("Form data:", formData);
    
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    
    try {
      console.log("Making API call to:", `${API_BASE_URL}/api/login`);
      
      const response = await axios.post(`${API_BASE_URL}/api/login`, formData, {
        timeout: 60000, // 60 second timeout for cold starts
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Login API Response:", response.data);
      
      const { token } = response.data;
      if (token) {
        console.log("Login successful, storing token");
        localStorage.setItem('token', token);
        handleLogin(token);
        setSuccess(true);
        setFormData({ email: '', password: '' });
        setTimeout(() => {
          navigate("/dashboard");
        }, 1200);
      } else {
        console.error("No token in login response");
        setError("No authentication token received from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      let errorMessage = "Login failed. Please try again.";
      
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        errorMessage = "Request timed out. The server might be starting up. Please try again in a moment.";
      } else if (error.response?.status === 0 || !error.response) {
        errorMessage = "Cannot connect to server. Please check your internet connection and try again.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-gray-950 via-gray-900 to-green-900 min-h-screen flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 select-none hidden sm:block">
        <div className="absolute top-12 right-8 text-green-400/20 text-2xl md:text-4xl animate-bounce">♪</div>
        <div className="absolute bottom-28 left-6 text-emerald-400/20 text-xl md:text-3xl animate-pulse">♫</div>
        <div className="absolute top-1/2 right-6 text-green-500/20 text-lg md:text-2xl animate-ping">♬</div>
      </div>
      <div className="w-full max-w-md z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-base">Back to Home</span>
        </Link>

        <div className="bg-gray-900/80 backdrop-blur-xl border border-green-500/20 rounded-3xl shadow-2xl shadow-green-500/10 p-4 sm:p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full mb-4 shadow-lg">
              <Music className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-green-200 to-emerald-400 bg-clip-text text-transparent mb-2">
              Log in to Songify
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">Welcome back! Please log into your account.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full pl-3 pr-3 sm:pl-4 sm:pr-4 py-3 sm:py-4 bg-gray-800/50 backdrop-blur-sm border-2 rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none ${
                    focusedField === "email"
                      ? 'border-green-500 focus:border-green-400 shadow-lg shadow-green-500/20'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full pl-3 pr-3 sm:pl-4 sm:pr-4 py-3 sm:py-4 bg-gray-800/50 backdrop-blur-sm border-2 rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none ${
                    focusedField === "password"
                      ? 'border-green-500 focus:border-green-400 shadow-lg shadow-green-500/20'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            {success && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3 text-green-400">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">Login success! Redirecting...</span>
              </div>
            )}
            <button
              type="submit"
              className="w-full py-3 sm:py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-500/25 transform hover:scale-[1.02]"
            >
              Login
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-xs sm:text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="text-green-400 hover:text-green-300 font-medium transition-colors">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>🎶 Enjoy your music, securely &amp; privately</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
