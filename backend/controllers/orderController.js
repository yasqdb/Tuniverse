const Order = require("../models/Order");
const Seller = require("../models/Seller");
const Buyer = require("../models/Buyer");
const Conversation = require("../models/Conversation");

exports.createOrder = async (req, res) => {
  try {
    const { productName, productPrice, productLink, deliveryDate } = req.body;

    const buyerId = req.user.id;
    const buyerRole = req.user.role;

    if (buyerRole !== "buyer")
      return res.status(403).json({ message: "Only buyers can create orders" });

    const buyer = await Buyer.findById(buyerId);
    if (!buyer) return res.status(404).json({ message: "Buyer not found" });

    const newOrder = new Order({
      buyerId,
      buyerUsername: buyer.username,
      buyerEmail: buyer.email,
      productName,
      productPrice,
      productLink,
      deliveryDate,
      status: "pending",
    });

    await newOrder.save();

    const sellers = await Seller.find();
    const delivery = new Date(deliveryDate);
    const matchingSellerIds = [];

    for (const s of sellers) {
      if (!Array.isArray(s.availability)) continue;

      const match = s.availability.some((slot) => {
        const from = new Date(slot.from);
        const to = new Date(slot.to);
        return delivery >= from && delivery <= to;
      });

      if (match) matchingSellerIds.push(s._id);
    }

    newOrder.sellerCandidates = matchingSellerIds;
    await newOrder.save();

    return res.status(201).json({ message: "Order created", order: newOrder });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getSellerPendingOrders = async (req, res) => {
  try {
    const sellerId = req.params.id;

    const orders = await Order.find({
      status: "pending",
      sellerCandidates: sellerId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({ orders });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getSellerOrdersAll = async (req, res) => {
  try {
    const sellerId = req.params.id;

    const orders = await Order.find({ sellerId }).sort({ updatedAt: -1 });

    return res.status(200).json(orders);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getBuyerOrders = async (req, res) => {
  try {
    const buyerId = req.user.id;

    const orders = await Order.find({ buyerId }).sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.acceptOrder = async (req, res) => {
  try {
    const { orderId, sellerId } = req.params;

    const order = await Order.findById(orderId);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    order.status = "accepted";
    order.sellerId = sellerId;
    order.acceptedAt = new Date();
    order.sellerCandidates = [];
    await order.save();

    let conversation = await Conversation.findOne({
      orderId: order._id,
    });

    if (!conversation) {
      conversation = new Conversation({
        orderId: order._id,
        buyerId: order.buyerId,
        sellerId: sellerId,
        messages: [],
      });
      await conversation.save();
    }

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
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.rejectOrder = async (req, res) => {
  try {
    const { orderId, sellerId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== "pending")
      return res
        .status(400)
        .json({ message: "Cannot reject non-pending order" });

    order.sellerCandidates = (order.sellerCandidates || []).filter(
      (id) => id.toString() !== sellerId.toString(),
    );

    await order.save();

    return res.status(200).json({
      message: "You have rejected the order",
      sellerCandidates: order.sellerCandidates,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
