const express = require("express");
const WebSocket = require("ws");

const port = process.env.PORT || 10000;

const app = express();

// a http server just for Render's port scanner
app.get("/", (req, res) => {
	res.status(200).send("Server is running");
});

const server = app.listen(port, "0.0.0.0", () => {
	console.log(`Server is listening on 0.0.0.0:${port}`);
});

const wss = new WebSocket.Server({ server });

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