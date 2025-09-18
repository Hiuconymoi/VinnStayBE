const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");
const { verifyToken } = require("../middleware/authMiddleware");

// All routes should be protected -> chỉ admin mới quản lý role
router.post("/", roleController.createRole);
router.get("/", roleController.getRoles);
router.get("/:id", verifyToken, roleController.getRoleById);
router.put("/:id", verifyToken, roleController.updateRole);
router.delete("/:id", verifyToken, roleController.deleteRole);

module.exports = router;
