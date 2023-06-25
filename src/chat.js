
// populate UI from local storage message history so reload shows messages


document.addEventListener("DOMContentLoaded", function() {
  const chatWindow = document.getElementById("chat-window");
  const messageHistory = localStorage.getItem("messageHistory");

  if (messageHistory) {
    const messages = JSON.parse(messageHistory);
    messages.forEach(function(message) {
      const messageElement = document.createElement("p");
      messageElement.innerText = `${message.role}: ${message.content}`;
      chatWindow.appendChild(messageElement);
    });
  }
});




document.getElementById("clear-history").addEventListener("click", () => {
  localStorage.removeItem("messageHistory");
  const chatWindow = document.getElementById("chat-window");
  chatWindow.innerHTML = '';
});


document.getElementById("chat-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const reqUrl = "https://www.grocerygardens.com/_hcms/api/chat/completion";

  const userInput = document.getElementById("user-input").value;
  const maxTokens = 2000;

  const errorMessage = document.getElementById("error-message");
  errorMessage.textContent = "";

  if (userInput.trim() === '') {
    errorMessage.innerText = "Please enter a message.";
    return;
  }

  if (userInput.length > maxTokens) {
    errorMessage.innerText = "Message exceeds the character limit.";
    return;
  }

  const message = {"role": "user", "content": userInput};

  const chatWindow = document.getElementById("chat-window");
  const userMessage = document.createElement("p");
  userMessage.innerText = `User: ${userInput}`;
  chatWindow.appendChild(userMessage);


  const messageHistory = JSON.parse(localStorage.getItem("messageHistory")) || [];

  messageHistory.push(message);

  const payload = {
    messages: messageHistory
  };

  fetch(reqUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then(response => response.json())
    .then(data => {
      const botMessage = document.createElement("p");
      botMessage.innerText = `Assistant: ${data.response}`;

      chatWindow.appendChild(botMessage);

      const updatedMessageHistory = [...payload.messages, {"role": "assistant", "content": data.response}]

      localStorage.setItem("messageHistory", JSON.stringify(updatedMessageHistory));

    })
    .catch(error => {
      console.error("Error:", error);
    });

  document.getElementById("user-input").value = "";
});

