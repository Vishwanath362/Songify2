const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET || "blindhope34";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.log("no token")
    return res.sendStatus(401);
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; 
    next();
  });
};

module.exports = authenticateToken;
