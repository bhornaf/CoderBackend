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
    <div class="row">
        <b class="text-primary">${msg.email} </b> 
        <b class="text-secondary">${msg.date}</b>
        <b class="text-success">${msg.message}</b>
    </div>
  `;
}

function sendMessages() {
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    socket.emit("POST_MESSAGE", { email, message });
}

socket.on("UPDATE_LIST", (data, allProducts) => {
    document.getElementById("productsList").innerHTML = "";
    allProducts
        .sort((a, b) => a.id - b.id)
        .forEach((data) => appendProduct(data));
});

socket.on("NEW_PRODUCT", (data) => {
    appendProduct(data);
});

function appendProduct(data) {
    document.getElementById("productsList").innerHTML += `
  <tr>
    <td>${data.id}</td>
    <td>${data.title}</td>
    <td>${data.price}</td>
    <td> <img src="${data.thumbnail}" alt="${data.title}" /></td>
  </tr>
  `;
}

function sendProduct() {
    const title = document.getElementById("title").value;
    const price = document.getElementById("price").value;
    const thumbnail = document.getElementById("thumbnail").value;
    socket.emit("POST_PRODUCT", { title, price, thumbnail });
}
