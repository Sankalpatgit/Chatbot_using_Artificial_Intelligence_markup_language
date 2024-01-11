document.addEventListener("DOMContentLoaded", function () {
    const openChatBtn = document.getElementById("openChatBtn");
    const closeChatBtn = document.getElementById("closeChatBtn");
    const chatbotPopup = document.getElementById("chatbotPopup");
    const userInput = document.getElementById("userInput");
    const sendMessageBtn = document.getElementById("sendMessageBtn");
    const chatBody = document.getElementById("chatBody");

    // Initialize SocketIO
    const socket = io.connect('http://localhost:5000'); // Change the URL based on your Flask server address

    // Open chatbot popup
    openChatBtn.addEventListener("click", function () {
        chatbotPopup.style.display = "block";
    });

    // Close chatbot popup
    closeChatBtn.addEventListener("click", function () {
        chatbotPopup.style.display = "none";
    });

    // Send user message
    function sendMessage() {
        const userMessage = userInput.value.trim();
        if (userMessage !== "") {
            appendMessage("user", userMessage);
            // Emit the user message to the Flask server
            socket.emit('message', { message: userMessage });
            userInput.value = "";
        }
    }

    sendMessageBtn.addEventListener("click", sendMessage);

    // Listen for bot responses from the Flask server
    socket.on('recv_message', function (response) {
        appendMessage("bot", response);
    });

    // Process user message and generate bot response on Enter key press
    userInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    // Append a message to the chat body
    function appendMessage(sender, message) {
        const messageElement = document.createElement("div");
        messageElement.classList.add(sender);
        messageElement.textContent = message;
        chatBody.appendChild(messageElement);
        // Scroll to the bottom of the chat body
        chatBody.scrollTop = chatBody.scrollHeight;
    }
});
