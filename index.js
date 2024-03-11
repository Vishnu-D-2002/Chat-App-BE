const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { MongoDB_URL, PORT } = require("./utils");
const userRouter = require("./Routes/userRoute");
const { Server } = require("socket.io");
const http = require("http");

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
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (data) => {
      socket.join(data);
      console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on("send_message", (data) => {
      socket.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id);
    });
});

app.use("/", userRouter);
