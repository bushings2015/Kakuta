const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/constants");
const prisma = require("../config/db");

const authMiddleware = async (req, res, next) => {
  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    // Verify token
    const payload = jwt.verify(token, JWT_SECRET);

    // Fetch user data
    const user = await prisma.user.findFirst({ where: { id: payload.userId } });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = user; // Attach user to req
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = authMiddleware;