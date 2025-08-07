import React, { useEffect, useState } from "react";
import { Music, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "./Auth";

// Environment variable with fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || process.env.REACT_APP_API_BASE_URL || 'https://songify-v4q3.onrender.com';

export const Signup = () => {
  const [focusedField, setFocusedField] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const { handleLogin } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    setError(null);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFocus = (field) => setFocusedField(field);
  const handleBlur = () => setFocusedField(null);

  const handleSubmit = async (e) => {
    console.log("Form submitted");
    console.log("API_BASE_URL:", API_BASE_URL);
    console.log("Form data:", formData);
    
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    
    try {
      console.log("Making API call to:", `${API_BASE_URL}/api/signup`);
      
      // Add timeout for slow backend startup
      const response = await axios.post(`${API_BASE_URL}/api/signup`, formData, {
        timeout: 60000, // 60 second timeout for cold starts
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log("API Response:", response.data);
      
      setFormData({ name: '', email: '', password: '' });
      const { token } = response.data;
      
      if (token) {
        console.log("Token received, storing and redirecting");
        localStorage.setItem('token', token);
        handleLogin(token);
        setSuccess(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1200);
      } else {
        console.error("No token in response");
        setError("No authentication token received from server");
      }
    } catch (error) {
      console.error("Signup error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      let errorMessage = "An error occurred during signup.";
      
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
    <div className="relative bg-gradient-to-br from-gray-950 via-gray-900 to-green-900 min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 select-none hidden sm:block">
        <div className="absolute top-20 right-20 text-green-400/20 text-4xl animate-bounce">♬</div>
        <div className="absolute bottom-40 left-10 text-emerald-400/20 text-3xl animate-pulse">♪</div>
        <div className="absolute top-1/2 right-10 text-green-500/20 text-2xl animate-ping">♫</div>
      </div>
      <div className="w-full max-w-md z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        <div className="bg-gray-900/80 backdrop-blur-xl border border-green-500/20 rounded-3xl shadow-2xl shadow-green-500/10 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full mb-4 shadow-lg">
              <Music className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-green-200 to-emerald-400 bg-clip-text text-transparent mb-2">
              Sign Up to Songify
            </h1>
            <p className="text-gray-400">Create your account and start listening.</p>
          </div>
          <form className="space-y-6" autoComplete="off" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  id="name"
                  autoComplete="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => handleFocus("name")}
                  onBlur={handleBlur}
                  className={`w-full pl-4 pr-4 py-4 bg-gray-800/50 backdrop-blur-sm border-2 rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none ${
                    focusedField === "name"
                      ? 'border-green-500 focus:border-green-400 shadow-lg shadow-green-500/20'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  required
                />
              </div>
            </div>
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
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
                  onFocus={() => handleFocus("email")}
                  onBlur={handleBlur}
                  className={`w-full pl-4 pr-4 py-4 bg-gray-800/50 backdrop-blur-sm border-2 rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none ${
                    focusedField === "email"
                      ? 'border-green-500 focus:border-green-400 shadow-lg shadow-green-500/20'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  required
                />
              </div>
            </div>
            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="new-password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => handleFocus("password")}
                  onBlur={handleBlur}
                  className={`w-full pl-4 pr-4 py-4 bg-gray-800/50 backdrop-blur-sm border-2 rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none ${
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
                <span className="text-sm">
                  {typeof error === "string" ? error : (error.message || "An error occurred during signup.")}
                </span>
              </div>
            )}
            {success && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3 text-green-400">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">Account created! Redirecting...</span>
              </div>
            )}
            {loading && (
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center gap-3 text-blue-400">
                <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                <span className="text-sm">Creating your account... This may take a moment.</span>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 font-semibold rounded-xl transition-all duration-300 shadow-lg transform ${
                loading 
                  ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:shadow-green-500/25 hover:scale-[1.02]'
              } text-white`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-green-400 hover:text-green-300 font-medium transition-colors">
                Log in
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

export default Signup;
