const Notification = require("../models/Notification");

// Lấy thông báo của user
exports.getUserNotifications = async (req, res) => {
  try {
    const user_id = req.user.id;
    const notifications = await Notification.find({ user_id }).sort({ created_at: -1 });
    res.json({ message: "Notifications fetched successfully", notifications });
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error: error.message });
  }
};

// Đánh dấu là đã đọc
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);
    if (!notification) return res.status(404).json({ message: "Notification not found" });

    if (notification.user_id.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    notification.is_read = true;
    await notification.save();

    res.json({ message: "Notification marked as read", notification });
  } catch (error) {
    res.status(500).json({ message: "Error marking notification as read", error: error.message });
  }
};
