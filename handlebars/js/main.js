const socket = io();

socket.on("connect", () => {
    console.log("Conectado al servidor");
});

socket.on("UPDATE_MESSAGES", (msg, allMessages) => {
    document.getElementById("messages").innerHTML = "";
    allMessages
        .sort((a, b) => a.date - b.date)
        .forEach((msg) => appendMessage(msg));
});

socket.on("NEW_MESSAGE", (msg) => {
    appendMessage(msg);
});

function appendMessage(msg) {
    document.getElementById("messages").innerHTML += `
    <div class="post ui card">
      <div class="content">
        <b class="text-primary">${msg.email} </b> 
        <b class="text-secondary">${msg.date}</b>
        <p class="text-success">${msg.message}</p>
        <hr/>
      </div>
    </div>
  `;
}

function sendMessages() {
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    socket.emit("POST_MESSAGE", { email, message });
}

function likeMessage(msgId) {
    socket.emit("LIKE_MESSAGE", msgId);
}
