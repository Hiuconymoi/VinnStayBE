const Booking = require("../models/Booking");
const Room = require("../models/Room");
const Hotel = require("../models/Hotel");

// API: Đặt phòng
exports.createBooking = async (req, res) => {
  try {
    const { room_id, hotel_id, check_in_date, check_out_date, total_guests, total_price } = req.body;
    const user_id = req.user.id; // lấy từ token

    // check room
    const room = await Room.findById(room_id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    if (!room.is_available) return res.status(400).json({ message: "Room is not available" });

    // tạo booking
    const booking = new Booking({
      user_id,
      room_id,
      hotel_id,
      check_in_date,
      check_out_date,
      total_guests,
      total_price,
      status: "pending",
    });

    await booking.save();

    // giữ phòng
    room.is_available = false;
    await room.save();

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Error creating booking", error: error.message });
  }
};

// API: Hủy phòng (user hoặc admin)
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // chỉ cho chủ booking hoặc admin hủy
    if (req.user.role !== "admin" && booking.user_id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to cancel this booking" });
    }

    booking.status = "cancelled";
    await booking.save();

    // mở lại phòng
    const room = await Room.findById(booking.room_id);
    if (room) {
      room.is_available = true;
      await room.save();
    }

    res.json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling booking", error: error.message });
  }
};

// API: Chủ khách sạn xác nhận / từ chối booking
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // confirmed | cancelled

    if (!["confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findById(id).populate("hotel_id");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // chỉ cho chủ khách sạn của booking hoặc admin
    if (req.user.role !== "admin" && booking.hotel_id.owner_id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this booking status" });
    }

    booking.status = status;
    await booking.save();

    // nếu chủ từ chối thì mở lại phòng
    if (status === "cancelled") {
      const room = await Room.findById(booking.room_id);
      if (room) {
        room.is_available = true;
        await room.save();
      }
    }

    res.json({ message: `Booking ${status} successfully`, booking });
  } catch (error) {
    res.status(500).json({ message: "Error updating booking status", error: error.message });
  }
};


// API: Lấy booking của user (chính mình)
exports.getUserBookings = async (req, res) => {
  try {
    const user_id = req.user.id;

    const bookings = await Booking.find({ user_id })
      .populate("room_id")
      .populate("hotel_id");

    res.json({ message: "User bookings fetched successfully", bookings });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user bookings", error: error.message });
  }
};

// API: Lấy booking cho owner (theo khách sạn của owner)
exports.getOwnerBookings = async (req, res) => {
  try {
    const owner_id = req.user.id;

    // Lấy tất cả hotel của owner
    const hotels = await Hotel.find({ owner_id });
    const hotelIds = hotels.map(h => h._id);

    // Lấy booking thuộc các hotel này
    const bookings = await Booking.find({ hotel_id: { $in: hotelIds } })
      .populate("room_id")
      .populate("hotel_id");

    res.json({ message: "Owner bookings fetched successfully", bookings });
  } catch (error) {
    res.status(500).json({ message: "Error fetching owner bookings", error: error.message });
  }
};

// API: Admin lấy tất cả bookings
exports.getAllBookings = async (req, res) => {
  try {
    // chỉ admin mới được gọi
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const bookings = await Booking.find()
      .populate("user_id", "username email")
      .populate("room_id")
      .populate("hotel_id");

    res.json({ message: "All bookings fetched successfully", bookings });
  } catch (error) {
    res.status(500).json({ message: "Error fetching all bookings", error: error.message });
  }
};