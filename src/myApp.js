const express = require("express");
const socket = require("socket.io");
const config = require("./config.js").config;

// App setup
const PORT = config.port;
const publicPath = config.publicPath;
const app = express();
const server = app.listen(PORT, function () {
	console.log(`Listening on http://localhost:${PORT}`);
});

// Static files
app.use(express.static(publicPath));

// Socket setup
const io = socket(server);
const activeUsers = new Set();

io.on("connection", function(socket) {
	console.log("Socket connection was created");
	socket.on("new user", function (data) {
		socket.userId = data;
		activeUsers.add(data);
		// Assign a side to user, here size: 1->black, 2->white, 3+->viewer
		io.emit("assign side", {
			"userNum":activeUsers.size, 
			"userID":socket.userId
		});
		console.log("new user socket being called");
	});

	socket.on("place piece", function (data){
		//modify this
		if (true){
			io.emit("place piece", data);
			console.log('place piece socket being called');
		}
	});

	socket.on("disconnect", () => {
		activeUsers.delete(socket.userId);
		io.emit("user disconnected", socket.userId);
		console.log("disconnect socket being called");
	});
});
