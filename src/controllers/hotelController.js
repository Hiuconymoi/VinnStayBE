const Hotel = require("../models/Hotel");
const User = require("../models/User");

// Tạo khách sạn (chỉ hotel_owner)
exports.createHotel = async (req, res) => {
  try {
    if (req.user.role !== "hotel_owner" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only hotel owners or admin can create hotels" });
    }

    const imageUrls = req.files ? req.files.map((file) => file.path) : [];

    const hotel = await Hotel.create({
      ...req.body,
      owner_id: req.user.id,
      images: imageUrls, // thêm ảnh
    });

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

exports.getHotelsByOwner = async (req, res) => {
  try {
    // check role
    if (req.user.role !== "hotel_owner" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only hotel owners or admin can view their hotels" });
    }

    const ownerId = req.params.ownerId;

    const hotels = await Hotel.find({ owner_id: ownerId }).populate("owner_id", "username email");

    if (hotels.length === 0) {
      return res.status(404).json({ message: "No hotels found for this owner" });
    }

    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching owner's hotels", error: error.message });
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

    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map((file) => file.path);
      hotel.images.push(...imageUrls); // append thêm ảnh
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
