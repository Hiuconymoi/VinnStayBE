const express = require("express");
const router = express.Router();
const hotelController = require("../controllers/hotelController");
const { verifyToken, authorize } = require("../middleware/authMiddleware");

router.post("/", verifyToken, hotelController.createHotel);
router.get("/", hotelController.getHotels);
router.get("/:id", hotelController.getHotelById);
router.put("/:id", verifyToken, hotelController.updateHotel);
router.delete("/:id", verifyToken, hotelController.deleteHotel);

module.exports = router;
