const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const notificationController = require("../controllers/notificationController");

router.get("/", verifyToken, notificationController.getUserNotifications);
router.patch("/:id/read", verifyToken, notificationController.markAsRead);

module.exports = router;
