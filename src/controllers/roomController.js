const Room = require("../models/Room");
const Hotel = require("../models/Hotel");

// Tạo phòng
exports.createRoom = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.body.hotel_id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    if (req.user.role !== "admin" && hotel.owner_id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to add room to this hotel" });
    }

    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: "Error creating room", error: error.message });
  }
};

// Lấy tất cả phòng của khách sạn
exports.getRoomsByHotel = async (req, res) => {
  try {
    const rooms = await Room.find({ hotel_id: req.params.hotelId });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rooms", error: error.message });
  }
};

// Lấy phòng theo id
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate("hotel_id", "name city");
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: "Error fetching room", error: error.message });
  }
};

// Update room
exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate("hotel_id");
    if (!room) return res.status(404).json({ message: "Room not found" });

    if (req.user.role !== "admin" && room.hotel_id.owner_id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this room" });
    }

    Object.assign(room, req.body);
    await room.save();
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: "Error updating room", error: error.message });
  }
};

// Delete room
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate("hotel_id");
    if (!room) return res.status(404).json({ message: "Room not found" });

    if (req.user.role !== "admin" && room.hotel_id.owner_id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this room" });
    }

    await room.deleteOne();
    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting room", error: error.message });
  }
};
