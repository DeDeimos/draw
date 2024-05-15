import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import axios from "axios";

const app = express({
  cors: {
    origin: "*",
  },
});

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
  io.emit("message", req.body);
});

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });

  socket.on("message", (message) => {
    console.log("New message", message);
    io.emit("message", message);

    axios
      .post("https://af51-107-189-7-49.ngrok-free.app/send", message)
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
