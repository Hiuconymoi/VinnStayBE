const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  phone_number: { type: String },
  first_name: { type: String },
  last_name: { type: String },
  profile_picture: { type: String },
  role_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
  is_active: { type: Boolean, default: true },
  last_login: { type: Date }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// Hash password before save (only if modified)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const saltRounds = parseInt(process.env.SALT_ROUNDS || '10', 10);
  const salt = await bcrypt.genSalt(saltRounds);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// compare password
userSchema.methods.comparePassword = function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

// remove sensitive data when toJSON
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
