const router = require("express").Router();
const { Message, User } = require("../models");

// GET MESSAGES OF A CHANNEL (pagination)
router.get("/:channelId", async (req, res) => {
  try {
    const { page = 1, limit = 25 } = req.query;

    const msgs = await Message.findAll({
      where: { channelId: req.params.channelId },
      include: [{ model: User, attributes: ["id", "name"] }],
      order: [["createdAt", "ASC"]],
      offset: (page - 1) * limit,
      limit: parseInt(limit),
    });

    res.json(msgs);
  } catch (err) {
    console.error("GET /api/messages error:", err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

// SAVE NEW MESSAGE (also emit to room)
router.post("/", async (req, res) => {
  try {
    const { userId, channelId, text } = req.body;
    if (!userId || !channelId || !text) {
      return res.status(400).json({ message: "userId, channelId and text required" });
    }

    // Save message
    const msg = await Message.create({ userId, channelId, text });

    // include user data for emit (optional - fetch user)
    const created = await Message.findOne({
      where: { id: msg.id },
      include: [{ model: User, attributes: ["id", "name"] }]
    });

    // Emit to socket room
    const io = req.app.get("io");
    if (io) {
      io.to(`channel_${channelId}`).emit("newMessage", created);
    }

    res.json(created);
  } catch (err) {
    console.error("POST /api/messages error:", err);
    res.status(500).json({ message: "Failed to save message" });
  }
});

module.exports = router;