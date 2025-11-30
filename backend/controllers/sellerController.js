
const Seller = require("../models/Seller");

exports.setAvailability = async (req, res) => {
  try {
      const { from, to } = req.body;
      const sellerId = req.user.id;

      const seller = await Seller.findById(sellerId);
      if (!seller) return res.status(404).json({ message: "Seller not found" });

      seller.availability.push({ from, to });
      await seller.save();

      res.status(200).json({ message: "Availability added", availability: seller.availability });
    } catch (err) {
        res.status(500).json({ message: err.message });
      }
};

