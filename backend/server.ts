import * as express from 'express';
import * as cors from 'cors';
import { createServer } from "http";
import { Server, Socket } from "socket.io";

const app = express();

const port = process.env.PORT || 8000;

app.use(cors());

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

io.on("connection", (socket: Socket) => {
    console.log("connection created");

    // Join a conversation
    const { username } = socket.handshake.query;

    console.log('username999', username);

    socket.emit("me", socket.id);

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	});

    socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	});
});

app.get('/', function (req, res) {
    res.send("Backend is up and running");
});

server.listen(port, () =>
    console.log(`App running on port ${port}.`)
);