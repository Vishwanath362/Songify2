const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'https://songify-v4q3.onrender.com', //  backend URL
    'https://songify2.onrender.com', //  frontend URL 
    'https://songify-frontend.onrender.com', // Alternative frontend URL
    /\.onrender\.com$/ // Allow any onrender.com
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const userRoutes = require("./routes/userRoutes");
const songRoutes = require("./routes/songRoutes");

app.use("/api",userRoutes);
app.use("/api",songRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

module.exports = app;