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

server.listen(port, "0.0.0.0", () => {
	console.log(`Server is listening on 0.0.0.0:${port}`);
});