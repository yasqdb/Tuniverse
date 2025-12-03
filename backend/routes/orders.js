const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/auth");
const Order = require("../models/Order");
const Conversation = require("../models/Conversation");
const mongoose = require("mongoose");

router.post("/create", authMiddleware, orderController.createOrder);

router.get("/buyer/:id", authMiddleware, orderController.getBuyerOrders);

router.get("/seller/:sellerId", authMiddleware, async (req, res) => {
  try {
    const sellerId = req.params.sellerId;

    const orders = await Order.find({
      $or: [{ sellerId }, { sellerCandidates: sellerId }],
      status: "pending",
    }).sort({ deliveryDate: 1 });

    res.json({ success: true, orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/seller/pending/:id", authMiddleware, async (req, res) => {
  try {
    const sellerId = req.params.id;
    const orders = await Order.find({
      $or: [{ sellerId }, { sellerCandidates: sellerId }],
      status: "pending",
    }).sort({ deliveryDate: 1 });

    res.json({ success: true, orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.put("/accept/:orderId/:sellerId", authMiddleware, async (req, res) => {
  try {
    const { orderId, sellerId } = req.params;
    console.log("ACCEPT ORDER CALLED", { orderId, sellerId }); // <--- add this

    const order = await Order.findById(orderId);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    order.status = "accepted";
    order.sellerId = new mongoose.Types.ObjectId(sellerId);

    order.sellerCandidates = [];
    order.acceptedAt = new Date();
    await order.save();

    let conversation = await Conversation.findOne({
      buyerId: order.buyerId,
      sellerId: order.sellerId,
      orderId: order._id,
    });

    if (!conversation) {
      conversation = new Conversation({
        orderId: order._id,
        buyerId: order.buyerId,
        sellerId: order.sellerId,
        messages: [],
      });
      await conversation.save();
    }

    console.log(
      "Order saved and conversation created",
      order._id,
      conversation._id,
    );

    return res.status(200).json({
      success: true,
      message: "Order accepted and conversation created",
      order,
      conversation: {
        _id: conversation._id,
        orderId: conversation.orderId,
        buyerId: conversation.buyerId,
        sellerId: conversation.sellerId,
      },
    });
  } catch (err) {
    console.error("Accept order error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.put(
  "/reject/:orderId/:sellerId",
  authMiddleware,
  orderController.rejectOrder,
);

module.exports = router;
