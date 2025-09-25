const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { verifyToken, authorize } = require("../middleware/authMiddleware");

// User đặt phòng
router.post("/", verifyToken, bookingController.createBooking);

// User hủy booking của chính mình
router.patch("/:id/cancel", verifyToken, bookingController.cancelBooking);

// Chủ khách sạn / admin xác nhận hoặc từ chối booking
router.patch("/:id/status", verifyToken, bookingController.updateBookingStatus);

module.exports = router;
