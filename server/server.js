const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN.split(",");

const io = require("socket.io")(PORT, {
  cors: {
    origin: ALLOWED_ORIGIN
  }
});

io.on("connection", socket => {
  // console.log(socket);

  socket.on("join-room", (message, callback) => {
    const room_id = message.room_id;
    const user = message.user;
    
    socket.join(room_id);
    socket.to(room_id).emit("listen-room", "User " + user + " has joined");

    if (callback) callback();
  });
  
  socket.on("leave-room", (message) => {
    const room_id = message.room_id;
    const user = message.user;
    
    socket.to(room_id).emit("listen-room", "User " + user + " has left");
  });

  socket.on("send-message", message => {
    const room_id = message.room_id;
    socket.to(room_id).emit("listen-message", message);
  });
});
