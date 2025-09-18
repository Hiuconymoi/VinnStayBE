const Joi = require('joi');

exports.registerSchema = Joi.object({
   username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  // password: Joi.string().min(6).required(), // bỏ check độ dài password
  password: Joi.string().required(), // chỉ bắt buộc có password
  // role: Joi.string().valid('customer','hotel_owner','admin').optional() // bỏ check role
  role: Joi.string().optional() // để nhận ObjectId từ client
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});
