import React, { useEffect, useState } from "react";
import { Music, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "./Auth";

export const Signup = () => {
  const [focusedField, setFocusedField] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
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
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const response = await axios.post('http://localhost:3000/api/signup', formData);
      setFormData({ name: '', email: '', password: '' });
      const { token } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        handleLogin(token);
        setSuccess(true);
        setTimeout(() => {
          navigate("/Dashboard");
        }, 1200);
      } else setError(new Error("No token received from server"));
    } catch (error) {
      setError(
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : error.message || "An error occurred during signup."
      );
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
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-500/25 transform hover:scale-[1.02]"
            >
              Create Account
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
