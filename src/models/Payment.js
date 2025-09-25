const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    booking_id: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true, unique: true },
    amount: { type: Number, required: true },
    payment_method: { type: String, required: true },
    transaction_id: { type: String, required: true },
    status: { type: String, enum: ["success", "failed", "pending"], required: true },
    payment_date: { type: Date, default: Date.now },
  }
);

module.exports = mongoose.model("Payment", paymentSchema);
