const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { MongoDB_URL, PORT } = require("./utils");
const userRouter = require("./Routes/userRoute");
const { Server } = require("socket.io");
const http = require("http");
const Chat = require("./Models/Message");
const messageRouter = require("./Routes/messageRoute");
const Message = require("./Models/Message");

const app = express();
const server = http.createServer(app);

mongoose.set("strictQuery", false);

app.use(cors());
app.use(express.json());

console.log("Connecting to MongoDB...");

mongoose.connect(MongoDB_URL).then(() => {
  console.log("Connected to MongoDB");
  server.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`);
  });
});

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://chat-in-app.netlify.app"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room ${userId}`);
  });

  socket.on("sendMessage", async ({ sender, receiver, message }) => {
    try {
      const messages = {
        sender,
        receiver,
        message,
        createdAt: new Date(),
      };
      let msg=new Message(messages);
      await msg.save();
      io.to(receiver).emit("message", messages);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
app.use("/", userRouter);
app.use('/msg', messageRouter);
app.get('/users/with-messages/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find messages where the logged-in user is the receiver
    const messages = await Message.find({ receiver: userId }).select('sender');

    // Extract sender IDs from the messages
    const senderIds = messages.map((message) => message.sender);

    // Find users based on the sender IDs
    const usersWithMessages = await User.find({ _id: { $in: senderIds } });

    res.json({ usersWithMessages });
  } catch (error) {
    console.error('Error fetching users with messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});