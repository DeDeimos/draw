import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import axios from "axios";

const app = express({
  cors: {
    origin: "*",
  },
});

let messages = {};

app.use(express.json());
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.get("/", (req, res) => {
  res.send("Hello, Express.js!");
});

app.post('/api/receive', (req, res) => {
  const message = req.body;

  if (message.error) {
    // find whose message is not delivered and deliver it to him
    const socket = messages[message.time];
    if (socket) {
      socket.emit("message", message);
    }
    return res.send("Message delivered");
  }
  io.emit("message", req.body);
  res.send("Message received");

  delete messages[message.time];
});

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });

  socket.on("message", (message) => {
    console.log("New message", message);
    // io.emit("message", message);
    messages[message.time] =  socket

    axios
      .post("https://bed5-107-189-7-49.ngrok-free.app/send", message)
      .then((res) => {
        console.log(`statusCode: ${res.statusCode}`);
        console.log(res);
      })
      .catch((error) => {
        console.error(error);
      });
  });
});



server.listen(5000, () => {
  console.log("Server started on http://localhost:5000");
});
