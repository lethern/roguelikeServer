const WebSocket = require("ws");

const port = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port });

wss.on("connection", ws => {
	ws.on("message", msg => {
		for (const client of wss.clients) {
			if (client !== ws && client.readyState === WebSocket.OPEN) {
				client.send(msg.toString());
			}
		}
	});
});
