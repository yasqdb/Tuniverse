const Buyer = require("../models/Buyer");
const Seller = require("../models/Seller");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "your_jwt_secret_key";

exports.signupBuyer = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existing = await Buyer.findOne({ email });
    if (existing) return res.status(400).json({ msg: "Buyer already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newBuyer = new Buyer({ username, email, password: hashedPassword });
    await newBuyer.save();
    const token = jwt.sign({ id: newBuyer._id, role: "buyer" }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(201).json({ token, buyer: newBuyer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.signupSeller = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existing = await Seller.findOne({ email });
    if (existing) return res.status(400).json({ msg: "Seller already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newSeller = new Seller({ username, email, password: hashedPassword });
    await newSeller.save();
    const token = jwt.sign({ id: newSeller._id, role: "seller" }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(201).json({ token, seller: newSeller });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await Buyer.findOne({ email });
    let role = "buyer";

    if (!user) {
      user = await Seller.findOne({ email });
      role = "seller";
    }

    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role, // <-- ADD THIS
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
