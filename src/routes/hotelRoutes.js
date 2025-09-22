const express = require("express");
const router = express.Router();
const hotelController = require("../controllers/hotelController");
const { verifyToken, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.post("/", verifyToken, upload.array("images", 5), hotelController.createHotel);
router.get("/", hotelController.getHotels);
router.get("/:id", hotelController.getHotelById);
router.put("/:id", verifyToken,upload.array("images", 5), hotelController.updateHotel);
router.delete("/:id", verifyToken, hotelController.deleteHotel);

module.exports = router;
