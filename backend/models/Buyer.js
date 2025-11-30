const mongoose = require("mongoose");

const buyerSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Buyer", buyerSchema);
