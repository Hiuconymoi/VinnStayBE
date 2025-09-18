const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    hotel_id: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
    room_number: { type: String },
    room_type: { type: String, required: true }, // Standard, Deluxe, Suite
    price: { type: Number, required: true },
    capacity: { type: Number, required: true },
    is_available: { type: Boolean, default: true },
    description: { type: String },
    amenities: [{ type: String }]
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Room", roomSchema);
