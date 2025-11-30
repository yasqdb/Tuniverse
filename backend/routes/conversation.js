const express = require("express");
const router = express.Router();
const Conversation = require("../models/Conversation");
const authMiddleware = require("../middleware/auth");

const {
  sendMessage,
  getConversation,
  getUserConversations,
} = require("../controllers/conversationController");

router.get("/user/:userId", authMiddleware, getUserConversations);

router.get("/:conversationId", authMiddleware, getConversation);

router.post("/:conversationId/message", authMiddleware, sendMessage);

module.exports = router;
