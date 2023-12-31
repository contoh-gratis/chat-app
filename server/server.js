const dotenv = require('dotenv');
const logger = require('./libs/logger/logger');

dotenv.config();

const PORT = process.env.PORT;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN.split(",");

const io = require("socket.io")(PORT, {
  cors: {
    origin: ALLOWED_ORIGIN
  }
});

logger.info("Application start on port " + PORT);

io.on("connection", socket => {
  socket.on("join-room", (message, callback) => {
    const roomId = message.roomId;
    const user = message.user;
    
    socket.join(roomId);
    socket.to(roomId).emit("listen-room", "User " + user + " has joined");

    logger.info("User " + user + " has joined room " + roomId);

    if (callback) callback();
  });
  
  socket.on("leave-room", (message) => {
    const roomId = message.roomId;
    const user = message.user;
    
    socket.to(roomId).emit("listen-room", "User " + user + " has left");
    logger.info("User " + user + " has left room " + roomId);
  });

  socket.on("send-message", message => {
    const roomId = message.roomId;
    const user = message.user;
    socket.to(roomId).emit("listen-message", message);

    logger.info("User " + user + " send message to " + roomId + ": " + message.message);
  });
});
