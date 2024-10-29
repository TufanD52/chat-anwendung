// server.js
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 3000 });

let clients = [];

wss.on("connection", (ws) => {
    ws.on("message", (message) => {
        const data = JSON.parse(message);

        if (data.type === "join") {
            ws.username = data.username;
            clients.push(ws);
            console.log(`${ws.username} hat den Chat betreten.`);
            broadcast({ username: "System", text: `${ws.username} hat den Chat betreten.` });
        } else if (data.type === "message") {
            broadcast({ username: ws.username, text: data.text });
        }
    });

    ws.on("close", () => {
        clients = clients.filter(client => client !== ws);
        broadcast({ username: "System", text: `${ws.username} hat den Chat verlassen.` });
    });
});

function broadcast(message) {
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

console.log("WebSocket-Server läuft auf ws://localhost:3000");
