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
    const room_id = message.room_id;
    const user = message.user;
    
    socket.join(room_id);
    socket.to(room_id).emit("listen-room", "User " + user + " has joined");

    logger.info("User " + user + " has joined room " + room_id);

    if (callback) callback();
  });
  
  socket.on("leave-room", (message) => {
    const room_id = message.room_id;
    const user = message.user;
    
    socket.to(room_id).emit("listen-room", "User " + user + " has left");
    logger.info("User " + user + " has left room " + room_id);
  });

  socket.on("send-message", message => {
    const room_id = message.room_id;
    const user = message.user;
    socket.to(room_id).emit("listen-message", message);

    logger.info("User " + user + " send message to " + room_id + ": " + message.message);
  });
});
