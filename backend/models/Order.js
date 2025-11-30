const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Buyer",
      required: true,
    },

    buyerUsername: { type: String, required: true },
    buyerEmail: { type: String, required: true },

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      default: null,
    },

    sellerCandidates: [{ type: mongoose.Schema.Types.ObjectId, ref: "Seller" }],

    productName: { type: String, required: true },
    productPrice: { type: Number, required: true },
    productLink: { type: String, required: true },

    deliveryDate: { type: Date, required: true },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "in-progress", "completed"],
      default: "pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
