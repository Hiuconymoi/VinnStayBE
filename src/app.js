require('dotenv').config();
require('express-async-errors'); // giúp xử lý lỗi async
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('./config/logger');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// morgan -> winston
app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) } }));

// routes (gắn sau)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/roles', require('./routes/roleRoutes'));

app.use("/api/hotels", require("./routes/hotelRoutes"));
app.use("/api/rooms", require("./routes/roomRoutes"));
app.use("/api/search", require("./routes/searchRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));

app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

// 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

// error handler (custom)
app.use(require('./middleware/errorHandler'));

module.exports = app;
