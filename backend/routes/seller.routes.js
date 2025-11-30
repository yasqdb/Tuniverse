const express = require("express");
const router = express.Router();
const sellerController = require("../controllers/sellerController");
const authMiddleware = require("../middleware/auth");
const Seller = require("../models/Seller");

router.post("/availability", authMiddleware, sellerController.setAvailability);

router.put("/availability/:id", authMiddleware, async (req, res) => {
  const sellerId = req.params.id;
  const { availability } = req.body;

  if (
    !availability ||
    !Array.isArray(availability) ||
    !availability[0].from ||
    !availability[0].to
  ) {
    return res.status(400).json({ message: "Invalid availability data" });
  }

  try {
    const seller = await Seller.findByIdAndUpdate(
      sellerId,
      { availability },
      { new: true },
    );

    if (!seller) return res.status(404).json({ message: "Seller not found" });

    res.json({ message: "Availability set", seller });
  } catch (err) {
    console.error("Error in /availability/:id:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) return res.status(404).json({ message: "Seller not found" });
    res.json({ seller });
  } catch (err) {
    console.error("Error fetching seller:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
