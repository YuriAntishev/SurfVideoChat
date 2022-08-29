import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { Server, Socket } from "socket.io";
import { addUser, removeUser, getUsersInRoom } from "./actions";

const app = fastify();

const port = process.env.PORT || 8000;

app.register(fastifyCors, {
  origin: "*",
});

const io = new Server(app.server, {
  path: "/videochat/",
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket: Socket) => {
  console.log("connection created");

  // Join a conversation
  const { username, room } = socket.handshake.query;

  const { user } = addUser({ id: socket.id, name: username, room: room });

    socket.join(user?.room);

    io.in(user?.room).emit("allUsersData", {
      room: user?.room,
      users: getUsersInRoom(user?.room),
    });

  console.log("getUsersInRoom", getUsersInRoom(user?.room));
  console.log("user999", user?.name);
  console.log("socket.id", socket.id);
  console.log("room", room);

  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("callUser", { signal: signalData, from, name });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} left chat!`);
    removeUser(socket.id);
    io.in(user?.room).emit("user leave chat", user);
    socket.leave(user?.room);
  });
});

app.get("/", (req, res) => {
  res.send("Backend is up and running");
});

app.listen({ port: Number(port), host: "0.0.0.0" }, () =>
  console.log(`App running on port ${port}.`)
);
