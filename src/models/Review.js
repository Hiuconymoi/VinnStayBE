const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    hotel_id: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String }
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = mongoose.model("Review", reviewSchema);
