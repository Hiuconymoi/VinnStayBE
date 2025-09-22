const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/", verifyToken, roomController.createRoom);
router.get("/hotel/:hotelId", roomController.getRoomsByHotel);
router.get("/:id", roomController.getRoomById);
router.put("/:id", verifyToken, roomController.updateRoom);
router.delete("/:id", verifyToken, roomController.deleteRoom);

module.exports = router;
