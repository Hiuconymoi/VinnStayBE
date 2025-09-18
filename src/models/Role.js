const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // 'customer','hotel_owner','admin'
  description: { type: String }
}, { timestamps: false });

module.exports = mongoose.model('Role', roleSchema);
