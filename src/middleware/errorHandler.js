const logger = require('../config/logger');

module.exports = (err, req, res, next) => {
  logger.error(err);

  // Mongoose duplicate key
  if (err && err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ message: `${field} already exists`, detail: err.keyValue });
  }

  // Mongoose validation error
  if (err && err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ message: 'Validation error', errors: messages });
  }

  const status = err.status || 500;
  const message = err.message || 'Server Error';
  const body = { message };
  if (process.env.NODE_ENV === 'development' && err.stack) body.stack = err.stack;
  res.status(status).json(body);
};
