const Conversation = require("../models/Conversation");






exports.getUserConversations = async (req, res) => {
  try {
      const userId = req.params.userId;

	const conversations = await Conversation.find({
	      $or: [{ buyerId: userId }, { sellerId: userId }],
	    })
	  .populate("buyerId", "username")
	  .populate("sellerId", "username")
	  .sort({ updatedAt: -1 });



      res.status(200).json(conversations);
    } catch (err) {
        res.status(500).json({ error: err.message });
      }
};












exports.getConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId)
      .populate("buyerId", "username email")
      .populate("sellerId", "username email");

    if (!conversation)
      return res.status(404).json({ msg: "Conversation not found" });

    res.json(conversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation)
      return res.status(404).json({ msg: "Conversation not found" });

    conversation.messages.push({
      senderId: req.user.id,
      text,
      createdAt: new Date(), // FIXED
    });

    conversation.updatedAt = new Date(); // ensure sorting works

    await conversation.save();

    res.json({ message: "Message sent", conversation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
