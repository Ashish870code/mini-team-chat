module.exports = (io) => {
  let onlineUsers = new Set();

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // USER IDENTIFY
    const userId = parseInt(socket.handshake.query.userId);
    if (userId) {
      onlineUsers.add(userId);
      console.log("onlineUsers:", onlineUsers);
      io.emit("presenceUpdate", Array.from(onlineUsers));
    }

    // JOIN ROOM (client sends: socket.emit("join", { channel: id }))
    socket.on("joinChannel", ({ channelId }) => {
      if (!channelId) {
        console.log("error: channelId missing!");
        return;
      }
      socket.join("channel_" + channelId);
      console.log(`User joined room ${channelId}`);
    });


    // SEND MESSAGE
  socket.on("sendMessage", (msg) => {
  console.log("Message Received:", msg);

  // send to everyone else in channel except sender
  socket.broadcast.to("channel_" + msg.channelId.toString()).emit("newMessage", msg);
  });

  socket.on("leaveChannel", ({ channelId }) => {
    socket.leave("channel_" + channelId);
    console.log(`User ${socket.id} left channel_ ${channelId}`);
  });


    // DISCONNECT
    socket.on("disconnect", () => {
      if (userId) {
        onlineUsers.delete(userId);
        io.emit("presenceUpdate", Array.from(onlineUsers));
      }
      console.log("User disconnected:", socket.id);
    });
  });
};
