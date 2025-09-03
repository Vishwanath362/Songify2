const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config()
const secret = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];


  if (!token) {
    console.log("❌ No token provided");
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      console.log("❌ Token verification failed:");
      console.log("- Error type:", err.name);
      console.log("- Error message:", err.message);
      
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({ message: "Token expired, please login again" });
      } else if (err.name === 'JsonWebTokenError') {
        return res.status(403).json({ message: "Invalid token" });
      } else {
        return res.status(403).json({ message: "Token verification failed" });
      }
    }
    
    // console.log("✅ Token verified successfully for user:", user.name);
    req.user = user; 
    next();
  });
};

module.exports = authenticateToken;
