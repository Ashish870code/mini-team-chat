const router = require("express").Router();
const { Channel, Membership, User } = require("../models");
const auth = require("../middleware/auth");

// GET ALL CHANNELS WITH MEMBER COUNTS
router.get("/", async (req, res) => {
  try {
    const channels = await Channel.findAll({ order: [["createdAt", "ASC"]] });

    const results = await Promise.all(
      channels.map(async (c) => {
        const count = await Membership.count({ where: { channelId: c.id } });
        return { id: c.id, name: c.name, members: count };
      })
    );

    res.json(results);
  } catch (err) {
    console.error("GET /api/channel error:", err);
    res.status(500).json({ message: "Failed to fetch channels" });
  }
});

// CREATE CHANNEL + add creator as member
router.post("/", auth, async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    const channel = await Channel.create({ name });

    await Membership.create({ channelId: channel.id, userId });

    res.json(channel);
  } catch (err) {
    console.error("Channel create error:", err);
    res.status(500).json({ error: "Failed to create channel" });
  }
});

// JOIN CHANNEL
router.post("/:id/join", async (req, res) => {
  try {
    const channelId = req.params.id;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId required" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const channel = await Channel.findByPk(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    await Membership.findOrCreate({
      where: { userId, channelId },
    });

    res.json({ success: true, message: "Joined channel" });
  } catch (err) {
    console.error("POST /api/channel/:id/join error:", err);
    res.status(500).json({ message: "Failed to join channel" });
  }
});

// GET MEMBERS OF A CHANNEL
router.get("/:id/members", async (req, res) => {
  try {
    const channelId = req.params.id;

    const members = await Membership.findAll({
      where: { channelId },
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"],
        },
      ],
    });

    res.json(members);
  } catch (err) {
    console.error("GET /api/channel/:id/members error:", err);
    res.status(500).json({ message: "Failed to get members" });
  }
});

// Leave CHANNEL
router.delete("/:id/leave", async (req, res) => {
  try {
    const channelId = req.params.id;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId required" });
    }

    await Membership.destroy({
      where: { userId, channelId },
    });

    res.json({ success: true, message: "Left channel" });
  } catch (err) {
    console.error("LEAVE CHANNEL ERROR", err);
    res.status(500).json({ message: "Failed to leave channel" });
  }
});

module.exports = router;
