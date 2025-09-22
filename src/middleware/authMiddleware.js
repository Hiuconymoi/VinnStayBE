import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Role from "../models/Role.js";

// Verify token (dùng cho tất cả user đã login)
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // payload sẽ chứa { id, role, iat, exp }
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Check role
export const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role_id) {
      return res.status(403).json({ message: "Forbidden - No role assigned" });
    }

    // 🔹 Check role by role name
    const userRole = req.user.role_id.name;
    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: "Forbidden - Insufficient role" });
    }

    next();
  };
};

