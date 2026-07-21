const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Last 10 messages store karenge
let messages = [];

function addMessage(text, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender);

    const bubble = document.createElement("div");
    bubble.classList.add("bubble");
    bubble.innerText = text;

    messageDiv.appendChild(bubble);
    chatBox.appendChild(messageDiv);

    chatBox.scrollTop = chatBox.scrollHeight;
}

function showLoading() {
    const loadingDiv = document.createElement("div");
    loadingDiv.classList.add("message", "bot");
    loadingDiv.id = "loading";

    const bubble = document.createElement("div");
    bubble.classList.add("bubble", "loading");
    bubble.innerText = "Thinking...";

    loadingDiv.appendChild(bubble);
    chatBox.appendChild(loadingDiv);

    chatBox.scrollTop = chatBox.scrollHeight;
}

function removeLoading() {
    const loading = document.getElementById("loading");
    if (loading) loading.remove();
}

async function sendMessage() {

    const text = userInput.value.trim();

    if (text === "") return;

    addMessage(text, "user");

    messages.push({
        role: "user",
        content: text
    });

    // sirf last 10 messages rakhenge
    if (messages.length > 10)
        messages.shift();

    userInput.value = "";

    showLoading();

    try {

        const response = await fetch("/api/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                messages: messages
            })

        });

        const data = await response.json();

        removeLoading();

        addMessage(data.reply, "bot");

        messages.push({
            role: "assistant",
            content: data.reply
        });

        if (messages.length > 10)
            messages.shift();

    }

    catch (error) {

        removeLoading();

        addMessage("Something went wrong. Please try again.", "bot");

        console.log(error);

    }

}

sendBtn.addEventListener("click", sendMessage);

userInput.addEventListener("keydown", function(e) {

    if (e.key === "Enter")
        sendMessage();

});

// First message
addMessage(
    "Hello 👋 I'm your Health Chatbot. Ask me any health related question.",
    "bot"
);