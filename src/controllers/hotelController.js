const Hotel = require("../models/Hotel");
const User = require("../models/User");

// Tạo khách sạn (chỉ hotel_owner)
exports.createHotel = async (req, res) => {
  try {
    if (req.user.role !== "hotel_owner" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only hotel owners or admin can create hotels" });
    }

    const hotel = await Hotel.create({ ...req.body, owner_id: req.user.id });
    res.status(201).json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Error creating hotel", error: error.message });
  }
};

// Lấy tất cả khách sạn
exports.getHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find().populate("owner_id", "username email");
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels", error: error.message });
  }
};

// Lấy khách sạn theo id
exports.getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate("owner_id", "username email");
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotel", error: error.message });
  }
};

// Update hotel (chỉ chủ hoặc admin)
exports.updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    if (req.user.role !== "admin" && hotel.owner_id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this hotel" });
    }

    Object.assign(hotel, req.body);
    await hotel.save();
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Error updating hotel", error: error.message });
  }
};

// Delete hotel
exports.deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    if (req.user.role !== "admin" && hotel.owner_id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this hotel" });
    }

    await hotel.deleteOne();
    res.json({ message: "Hotel deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting hotel", error: error.message });
  }
};
