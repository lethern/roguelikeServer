const express = require("express");
const { createServer } = require("http");
const { WebSocketServer } = require("ws");

const app = express();
const server = createServer(app);
const port = process.env.PORT || 10000;

const wss = new WebSocketServer({ server });

app.get("/", (req, res) => {
	res.status(200).send("server is running");
});

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

server.listen(port, '0.0.0.0', () => {
	console.log(`server listening on port ${port}`);
});