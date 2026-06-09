const express = require("express");
const { createServer } = require("http");
const WebSocket = require("ws");

const app = express();
const server = createServer(app);
const port = process.env.PORT || 10000;


const wss = new WebSocket.Server({ server, path: "/ws" });

// a http server just for Render's port scanner
app.get("/", (req, res) => {
	res.status(200).send("Server is running");
});

// WebSocket
wss.on("connection", (ws) => {
	console.log("client connected");

	ws.on("message", (msg) => {
		for (const client of wss.clients) {
			if (client !== ws && client.readyState === WebSocket.OPEN) {
				client.send(msg.toString());
			}
		}
	});
	
	ws.on("close", () => {
		console.log("client disconnected");
	});
});

server.listen(port, () => {
	console.log(`Server listening on port ${port}`)
});