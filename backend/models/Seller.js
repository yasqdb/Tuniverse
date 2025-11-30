const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: null },
    availability: [
      {
        from: { type: Date, required: true },
        to: { type: Date, required: true },
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Seller", sellerSchema);
