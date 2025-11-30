const mongoose = require("mongoose");



const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});


const conversationSchema = new mongoose.Schema(
  {
      orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
          },
      buyerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Buyer",
            required: true,
          },
      sellerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Seller",
            required: true,
          },
      messages: [messageSchema],
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
    },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);






module.exports = mongoose.model("Conversation", conversationSchema);
