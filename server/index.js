const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const CHATBOT = "ChatBot";
let chatRoom = "";
let allUsers = [];

app.use(cors());
const server = http.createServer(app);

app.get("/", (req, res) => {
	res.send("Server is running");
});

const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
});

io.on("connection", (socket) => {
	console.log(`User connected ${socket.id}`);

	socket.on("join_room", (data) => {
		const { username, room } = data;
		socket.join(room);

		let currentTime = Date.now();
		socket.to(room).emit("receive_message", {
			message: `${username} has joined the room`,
			username: CHATBOT,
			currentTime,
		});

		socket.emit("receive_message", {
			message: `Welcome ${username}`,
			username: CHATBOT,
			currentTime,
		});

		chatRoom = room;
		allUsers.push({
			id: socket.id,
			username,
			room,
		});
		chatRoomUsers = allUsers.filter((user) => user.room === room);
		socket.to(room).emit("chatroom_users", chatRoomUsers);
		socket.emit("chatroom_users", chatRoomUsers);
	});
});

server.listen(8000, () => console.log(`Server is running on port 8000`));
