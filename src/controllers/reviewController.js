const Review = require("../models/Review");
const Hotel = require("../models/Hotel");
const Notification = require("../models/Notification");

// ➤ Thêm đánh giá mới
exports.createReview = async (req, res) => {
  try {
    const { hotel_id, rating, comment } = req.body;
    const user_id = req.user.id;

    const hotel = await Hotel.findById(hotel_id).populate("owner_id");
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    const review = await Review.create({
      user_id,
      hotel_id,
      rating,
      comment,
    });

    // Cập nhật điểm trung bình của khách sạn
    const reviews = await Review.find({ hotel_id });
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    hotel.rating = avgRating.toFixed(1);
    await hotel.save();

    // Gửi notification cho chủ khách sạn
    const notification = await Notification.create({
      user_id: hotel.owner_id._id,
      title: "New Review Received",
      message: `Your hotel "${hotel.name}" just got a new review (${rating}★) with comment "${comment}".`,
    });

    const io = req.app.get("io");
    if (io) {
      io.to(String(hotel.owner_id._id)).emit("notification:new", {
        notification: {
          _id: notification._id,
          title: notification.title,
          message: notification.message,
          created_at: notification.created_at || new Date().toISOString(),
          type: "review:created",
        },
      });
    }

    res.status(201).json({ message: "Review created successfully", review });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating review", error: error.message });
  }
};

// ➤ Lấy tất cả review của một hotel
exports.getHotelReviews = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const reviews = await Review.find({ hotel_id: hotelId }).populate(
      "user_id",
      "username email"
    );
    res.json({ message: "Hotel reviews fetched successfully", reviews });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching reviews", error: error.message });
  }
};

// ➤ Sửa review
exports.editReview = async (req, res) => {
  try {
    const { id } = req.params; // id của review
    const { rating, comment } = req.body;

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    // Chỉ người viết hoặc admin mới được sửa
    if (
      req.user.role !== "admin" &&
      review.user_id.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this review" });
    }

    // Cập nhật nội dung
    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;
    await review.save();

    // Cập nhật lại rating trung bình của hotel
    const reviews = await Review.find({ hotel_id: review.hotel_id });
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Hotel.findByIdAndUpdate(review.hotel_id, {
      rating: avgRating.toFixed(1),
    });

    res.json({ message: "Review updated successfully", review });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating review", error: error.message });
  }
};

// ➤ Xóa review
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    // Chỉ người viết hoặc admin mới được xóa
    if (
      req.user.role !== "admin" &&
      review.user_id.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this review" });
    }

    await review.deleteOne();

    // Cập nhật lại rating trung bình sau khi xóa
    const reviews = await Review.find({ hotel_id: review.hotel_id });
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;
    await Hotel.findByIdAndUpdate(review.hotel_id, {
      rating: avgRating.toFixed(1),
    });

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting review", error: error.message });
  }
};
