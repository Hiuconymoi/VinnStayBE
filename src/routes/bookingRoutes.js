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

// User: lấy booking của chính mình
router.get("/user", verifyToken, bookingController.getUserBookings);

// Owner: lấy booking theo khách sạn mà mình sở hữu
router.get("/owner", verifyToken, bookingController.getOwnerBookings);

// Admin: lấy tất cả bookings
router.get("/", verifyToken, bookingController.getAllBookings);

module.exports = router;
