// script.js
const typingForm = document.querySelector(".typing-form");
const chatContainer = document.querySelector(".chat-list");
const suggestions = document.querySelectorAll(".suggestion");
const toggleThemeButton = document.querySelector("#theme-toggle-button");
const deleteChatButton = document.querySelector("#delete-chat-button");

// State variables
let userMessage = null;
let isResponseGenerating = false;


// API configuration
const API_KEY = "AIzaSyDJLH1nhMYLTySIsLfh9vvy1LF0sPEEFg0"; // Your API key here
//const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;


// Load theme and chat data from local storage on page load
const loadDataFromLocalstorage = () => {
  const savedChats = localStorage.getItem("saved-chats");
  const isLightMode = (localStorage.getItem("themeColor") === "light_mode");

  // Apply the stored theme
  document.body.classList.toggle("light_mode", isLightMode);
  toggleThemeButton.innerText = isLightMode ? "dark_mode" : "light_mode";

  // Restore saved chats or clear the chat container
  chatContainer.innerHTML = savedChats || '';
  document.body.classList.toggle("hide-header", savedChats);

  chatContainer.scrollTo(0, chatContainer.scrollHeight); // Scroll to the bottom
}

// Create a new message element and return it
const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
}

// Show typing effect by displaying words one by one
const showTypingEffect = (text, textElement, incomingMessageDiv) => {
  const words = text.split(' ');
  let currentWordIndex = 0;

  const typingInterval = setInterval(() => {
    // Append each word to the text element with a space
    textElement.innerText += (currentWordIndex === 0 ? '' : ' ') + words[currentWordIndex++];
    incomingMessageDiv.querySelector(".icon").classList.add("hide");

    // If all words are displayed
    if (currentWordIndex === words.length) {
      clearInterval(typingInterval);
      isResponseGenerating = false;
      incomingMessageDiv.querySelector(".icon").classList.remove("hide");
      localStorage.setItem("saved-chats", chatContainer.innerHTML); // Save chats to local storage
    }
    chatContainer.scrollTo(0, chatContainer.scrollHeight); // Scroll to the bottom
  }, 75);
}

// Fetch response from the API based on user message
const generateAPIResponse = async (incomingMessageDiv) => {
  const textElement = incomingMessageDiv.querySelector(".text"); // Getting text element

  try {
    // Send a POST request to the API with the user's message
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        contents: [{ 
          role: "user", 
          parts: [{ text: userMessage }] 
        }] 
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);

    // Get the API response text and remove asterisks from it
    const apiResponse = data?.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1');
    showTypingEffect(apiResponse, textElement, incomingMessageDiv); // Show typing effect
  } catch (error) { // Handle error
    isResponseGenerating = false;
    textElement.innerText = error.message;
    textElement.parentElement.closest(".message").classList.add("error");
  } finally {
    incomingMessageDiv.classList.remove("loading");
  }
}

// Show a loading animation while waiting for the API response
const showLoadingAnimation = () => {
  const html = `<div class="message-content">
                  <img class="avatar" src="https://pipedream.com/s.v0/app_ArhjGP/logo/orig" alt="Gemini avatar">
                  <p class="text"></p>
                  <div class="loading-indicator">
                    <div class="loading-bar"></div>
                    <div class="loading-bar"></div>
                    <div class="loading-bar"></div>
                  </div>
                </div>
                <span onClick="copyMessage(this)" class="icon material-symbols-rounded">content_copy</span>`;

  const incomingMessageDiv = createMessageElement(html, "incoming", "loading");
  chatContainer.appendChild(incomingMessageDiv);

  chatContainer.scrollTo(0, chatContainer.scrollHeight); // Scroll to the bottom
  generateAPIResponse(incomingMessageDiv);
}

// Copy message text to the clipboard
const copyMessage = (copyButton) => {
  const messageText = copyButton.parentElement.querySelector(".text").innerText;

  navigator.clipboard.writeText(messageText);
  copyButton.innerText = "done"; // Show confirmation icon
  setTimeout(() => copyButton.innerText = "content_copy", 1000); // Revert icon after 1 second
}

// Handle sending outgoing chat messages
const handleOutgoingChat = () => {
  userMessage = typingForm.querySelector(".typing-input").value.trim() || userMessage;
  if(!userMessage || isResponseGenerating) return; // Exit if there is no message or response is generating

  isResponseGenerating = true;

  const html = `<div class="message-content">
                  <img class="avatar" src="data:image/jpeg;base64,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" alt="User avatar"> 
                   <p class="text"></p>
                </div>`;

  const outgoingMessageDiv = createMessageElement(html, "outgoing");
  outgoingMessageDiv.querySelector(".text").innerText = userMessage;
  chatContainer.appendChild(outgoingMessageDiv);
  
  typingForm.reset(); // Clear input field
  document.body.classList.add("hide-header");
  chatContainer.scrollTo(0, chatContainer.scrollHeight); // Scroll to the bottom
  setTimeout(showLoadingAnimation, 500); // Show loading animation after a delay
}

// Toggle between light and dark themes
toggleThemeButton.addEventListener("click", () => {
  const isLightMode = document.body.classList.toggle("light_mode");
  localStorage.setItem("themeColor", isLightMode ? "light_mode" : "dark_mode");
  toggleThemeButton.innerText = isLightMode ? "dark_mode" : "light_mode";
});

// Delete all chats from local storage when button is clicked
deleteChatButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all the chats?")) {
    localStorage.removeItem("saved-chats");
    loadDataFromLocalstorage();
  }
});

// Set userMessage and handle outgoing chat when a suggestion is clicked
suggestions.forEach(suggestion => {
  suggestion.addEventListener("click", () => {
    userMessage = suggestion.querySelector(".text").innerText;
    handleOutgoingChat();
  });
});

// Prevent default form submission and handle outgoing chat
typingForm.addEventListener("submit", (e) => {
  e.preventDefault(); 
  handleOutgoingChat();
});

loadDataFromLocalstorage();