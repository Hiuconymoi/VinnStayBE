const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const reviewController = require("../controllers/reviewController");

// Thêm review
router.post("/", verifyToken, reviewController.createReview);

// Lấy review theo hotel
router.get("/:hotelId", reviewController.getHotelReviews);

// Sửa review
router.put("/:id", verifyToken, reviewController.editReview);

// Xóa review
router.delete("/:id", verifyToken, reviewController.deleteReview);

module.exports = router;
