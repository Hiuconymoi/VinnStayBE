const User = require('../models/User');
const Role = require('../models/Role');
const jwt = require('jsonwebtoken');

// helper: sign token
const signToken = (userId, roleName) => {
  return jwt.sign({ id: userId, role: roleName }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '1d' });
};

exports.register = async (req, res, next) => {
  try {
    const { username, email, password, phone_number, first_name, last_name, profile_picture, role } = req.body;

    // check existing
    const exist = await User.findOne({ $or: [{ email }, { username }] });
    if (exist) return res.status(400).json({ message: 'Email or username already exists' });

    // resolve role -> role_id
    let roleDoc;
    if (role) {
      roleDoc = await Role.findOne({ name: role });
      if (!roleDoc) return res.status(400).json({ message: 'Invalid role' });
    } else {
      roleDoc = await Role.findOne({ name: 'customer' }); // default
      if (!roleDoc) {
        // fallback: create minimal customer role if seeding not run
        roleDoc = await Role.create({ name: 'customer', description: 'Default customer role' });
      }
    }

    const user = new User({
      username, email, password, phone_number, first_name, last_name, profile_picture, role_id: roleDoc._id
    });

    await user.save();

    // populate role to return role name & for token
    await user.populate('role_id');

    const token = signToken(user._id, user.role_id.name);

    res.status(201).json({ message: 'Registered', token, user: user.toJSON() });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate('role_id');
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    // update last_login
    user.last_login = new Date();
    await user.save();

    const token = signToken(user._id, user.role_id.name);

    res.json({ message: 'Login successful', token, user: user.toJSON() });
  } catch (err) {
    next(err);
  }
};
