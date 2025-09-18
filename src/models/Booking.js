const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    room_id: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    hotel_id: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
    check_in_date: { type: Date, required: true },
    check_out_date: { type: Date, required: true },
    total_guests: { type: Number },
    total_price: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ["pending", "confirmed", "cancelled", "completed"], 
      default: "pending" 
    },
    payment_id: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Booking", bookingSchema);
