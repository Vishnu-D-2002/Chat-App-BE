const express = require("express");
const Message = require("../Models/Message");
const messageRouter = express.Router();

messageRouter.get("/:sender/:receiver", async (req, res) => {
  try {
    const { sender, receiver } = req.params;
    const messages = await Message.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    }).populate("sender");
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

messageRouter.post("/send", async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;
    const newMessage = new Message({ sender, receiver, message });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = messageRouter;
