const Hotel = require("../models/Hotel");
const Room = require("../models/Room");

// Search rooms
exports.searchRooms = async (req, res) => {
  try {
    const { city, minPrice, maxPrice, room_type } = req.query;

    let query = {};
    if (room_type) query.room_type = room_type;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // join Hotel để lọc theo city
    const rooms = await Room.find(query).populate({
      path: "hotel_id",
      match: city ? { city: new RegExp(city, "i") } : {},
      select: "name city country"
    });

    // lọc những phòng không thuộc city
    const filtered = rooms.filter(r => r.hotel_id);
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: "Error searching rooms", error: error.message });
  }
};
