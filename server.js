const express = require("express");
const { createServer } = require("http");
const { WebSocketServer, WebSocket } = require("ws");

const app = express();
const server = createServer(app);
const port = process.env.PORT || 10000;

const wss = new WebSocketServer({ noServer: true });

// HTTP endpoint just for Render's port scanner
app.get("/", (req, res) => {
	res.status(200).send("server is running");
});

server.on("upgrade", (request, socket, head) => {
	const pathname = request.url.split("?")[0];
	console.log(`upgrade request for path: ${pathname}`);

	if (pathname === "/ws" || pathname === "/ws/") {
		wss.handleUpgrade(request, socket, head, (ws) => {
			wss.emit("connection", ws, request);
		});
	} else {
		socket.destroy();
	}
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

server.listen(port, () => {
	console.log(`server listening on port ${port}`);
});