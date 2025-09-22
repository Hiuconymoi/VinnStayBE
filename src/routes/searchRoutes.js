const express = require("express");
const router = express.Router();
const { searchRooms } = require("../controllers/searchController");

router.get("/rooms", searchRooms);

module.exports = router;
