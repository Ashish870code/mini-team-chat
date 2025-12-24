const express = require("express");
const cors = require("cors");
const http = require("http");
const { sequelize } = require("./models");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: { origin: "*" }
});

// Make io available in routes via app.locals (or app.set)
app.set("io", io);

// OPTIONAL: If you have a socket file, keep using it. If it duplicates handlers, remove it.
 require("./socket")(io);

// Basic socket handlers (simple, reliable)
io.on("connection", (socket) => {
  console.log("Socket connected", socket.id);

  // client should emit 'joinChannel' with channelId to actually join that room
  socket.on("joinChannel", (channelId) => {
    socket.join(`channel_${channelId}`);
    console.log("Socket joined channel room:", `channel_${channelId}`);
  });

  // client can either emit sendMessage via socket OR send via REST -> server will emit
  socket.on("sendMessage", (data) => {
    // data = { userId, channelId, text, maybe user object }
    console.log("sendMessage via socket:", data);
    io.to(`channel_${data.channelId}`).emit("newMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected", socket.id);
  });
});

// ROUTES
app.use("/api/auth", require("./routes/Auth"));
app.use("/api/channel", require("./routes/Channel"));
app.use("/api/messages", require("./routes/Messages"));

// Sync DB (use with caution in production)
sequelize.sync().then(() => {
  server.listen(4000, () => {
    console.log("Server running on port", 4000);
  });
}).catch(err => {
  console.error("DB sync error:", err);
});