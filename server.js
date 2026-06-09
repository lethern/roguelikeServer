const WebSocket = require("ws");

const port = process.env.PORT || 10000;
const server = require("http").createServer();
const wss = new WebSocket.Server({ server });

wss.on("connection", ws => {
	console.log("client connected");
	ws.on("message", msg => {
		for (const client of wss.clients) {
			if (client !== ws && client.readyState === WebSocket.OPEN) {
				client.send(msg.toString());
			}
		}
	});
});

server.listen(port, () => {
	console.log("running on", port);
});