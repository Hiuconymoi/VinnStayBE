const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: { type: String },
    address: { type: String },
    city: { type: String },
    country: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    rating: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "inactive"], default: "active" },

    images: [{ type: String }],
    amenities: [{ type: String }],
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Hotel", hotelSchema);
