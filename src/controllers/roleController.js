const Role = require("../models/Role");

// Create new role
exports.createRole = async (req, res) => {
  const { name, description } = req.body;
  const role = new Role({ name, description });
  await role.save();
  res.status(201).json(role);
};

// Get all roles
exports.getRoles = async (req, res) => {
  const roles = await Role.find();
  res.json(roles);
};

// Get role by ID
exports.getRoleById = async (req, res) => {
  const role = await Role.findById(req.params.id);
  if (!role) return res.status(404).json({ message: "Role not found" });
  res.json(role);
};

// Update role
exports.updateRole = async (req, res) => {
  const role = await Role.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!role) return res.status(404).json({ message: "Role not found" });
  res.json(role);
};

// Delete role
exports.deleteRole = async (req, res) => {
  const role = await Role.findByIdAndDelete(req.params.id);
  if (!role) return res.status(404).json({ message: "Role not found" });
  res.json({ message: "Role deleted" });
};
