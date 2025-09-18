const User = require("../models/User");

// Get all users
exports.getUsers = async (req, res) => {
  const users = await User.find().populate("role_id", "name description");
  res.json(users);
};

// Get user by ID
exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).populate("role_id", "name description");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

// Update user (profile/admin update)
exports.updateUser = async (req, res) => {
  const updates = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  }).populate("role_id", "name description");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

// Delete user
exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User deleted" });
};
