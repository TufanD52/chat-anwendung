// script.js
let socket;
let username;

document.getElementById("join-chat").onclick = () => {
    username = document.getElementById("username").value.trim();
    if (username) {
        socket = new WebSocket("ws://localhost:3000");

        socket.onopen = () => {
            console.log("Verbunden mit dem Server.");
            document.getElementById("user-info").classList.add("hidden");
            document.getElementById("chat-display").classList.remove("hidden");
            document.getElementById("message-input").classList.remove("hidden");
            document.getElementById("send-message").classList.remove("hidden");

            socket.send(JSON.stringify({ type: "join", username: username }));
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            displayMessage(message.username, message.text);
        };
    }
};

document.getElementById("send-message").onclick = sendMessage;
document.getElementById("message-input").onkeypress = (e) => {
    if (e.key === "Enter") sendMessage();
};

function sendMessage() {
    const text = document.getElementById("message-input").value.trim();
    if (text) {
        socket.send(JSON.stringify({ type: "message", username: username, text: text }));
        document.getElementById("message-input").value = "";
    }
}

function displayMessage(username, text) {
    const chatDisplay = document.getElementById("chat-display");
    const message = document.createElement("div");
    message.className = "message";
    message.innerHTML = `<span class="username">${username}:</span> <span class="text">${text}</span>`;
    chatDisplay.appendChild(message);
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
}
