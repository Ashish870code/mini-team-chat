const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ where: { email } });
    if (exists)
      return res.status(400).json({ message: "Email already exists" });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hash });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json(err);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    res.json({ success: true, user, token });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;