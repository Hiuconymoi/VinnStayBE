const app = require('./app');
const connectDB = require('./config/db');
const logger = require('./config/logger');

// Import modules for Socket.IO setup
const http = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 5000;

// 1. Create the HTTP server using the existing Express app
const server = http.createServer(app);

// 2. Initialize Socket.IO Server
const io = new Server(server, {
  cors: { origin: "*" }, // Cho phép tất cả các domain kết nối, nên giới hạn trong production
  path: "/socket.io", // Tùy chỉnh path nếu cần
});
app.set("io", io);
io.engine.on("connection_error", (err) => {
  console.log("[engine] connection_error", err.code, err.message);
});

// 3. Socket.IO connection handling
io.on("connection", (socket) => {
  logger.info(`User connected: ${socket.id}`);

  socket.on("join", (payload) => {
    const userId = typeof payload === "string" ? payload : payload?.userId;
    if (!userId) return;
    socket.join(String(userId));
    logger.info(`Socket ${socket.id} joined room: ${userId}`);
  });

  socket.on("disconnect", () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
});



// Start the server
(async () => {
  await connectDB();
  // Use server.listen() to start the combined HTTP/Socket.IO server
  server.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
})();
