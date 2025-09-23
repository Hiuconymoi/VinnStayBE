const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");
const { verifyToken } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.post("/", verifyToken, upload.array("images", 5),roomController.createRoom);
router.get("/hotel/:hotelId", roomController.getRoomsByHotel);
router.get("/", roomController.getRooms);  
router.get("/:id", roomController.getRoomById);
router.put("/:id", verifyToken,upload.array("images", 5), roomController.updateRoom);
router.delete("/:id", verifyToken, roomController.deleteRoom);

module.exports = router;
