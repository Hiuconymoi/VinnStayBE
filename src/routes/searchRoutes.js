const express = require("express");
const router = express.Router();
const { searchRooms,searchHotels } = require("../controllers/searchController");

router.get("/rooms", searchRooms);
router.get("/hotels", searchHotels);

module.exports = router;
