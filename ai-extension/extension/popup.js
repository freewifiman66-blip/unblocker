const STORAGE_KEY = "groq_api_key";
const MODEL = "llama3-8b-8192";

let apiKey = "";
let messages = []; // conversation history

// --- DOM refs ---
const messagesDiv = document.getElementById("messages");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");
const apiKeyInput = document.getElementById("apiKey");
const saveKeyBtn = document.getElementById("saveKey");
const keyStatus = document.getElementById("keyStatus");

// --- Load saved key ---
chrome.storage.local.get([STORAGE_KEY], (result) => {
  if (result[STORAGE_KEY]) {
    apiKey = result[STORAGE_KEY];
    apiKeyInput.value = "••••••••••••••••";
    keyStatus.textContent = "✅ Key saved";
    keyStatus.style.color = "green";
  }
});

// --- Save key ---
saveKeyBtn.addEventListener("click", () => {
  const val = apiKeyInput.value.trim();
  if (!val || val.startsWith("•")) return;
  apiKey = val;
  chrome.storage.local.set({ [STORAGE_KEY]: val });
  apiKeyInput.value = "••••••••••••••••";
  keyStatus.textContent = "✅ Key saved";
  keyStatus.style.color = "green";
});

// --- Clear chat ---
clearBtn.addEventListener("click", () => {
  messages = [];
  messagesDiv.innerHTML = "";
});

// --- Send on Enter (Shift+Enter for newline) ---
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

sendBtn.addEventListener("click", sendMessage);

function addMessage(role, text) {
  const div = document.createElement("div");
  div.className = "message " + role;
  div.textContent = text;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function setLoading(on) {
  sendBtn.disabled = on;
  sendBtn.textContent = on ? "..." : "Send";
}

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  if (!apiKey) {
    keyStatus.textContent = "⚠️ Enter your API key first!";
    keyStatus.style.color = "orange";
    return;
  }

  userInput.value = "";
  addMessage("user", text);
  messages.push({ role: "user", content: text });
  setLoading(true);

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content: "You are a helpful AI assistant. Be concise and clear."
          },
          ...messages
        ]
      })
    });

    const data = await res.json();

    if (!res.ok) {
      const errMsg = data.error?.message ?? "Unknown error from API.";
      addMessage("assistant", "❌ Error: " + errMsg);
      messages.pop(); // remove the user message that failed
      return;
    }

    const reply = data.choices?.[0]?.message?.content ?? "No response.";
    messages.push({ role: "assistant", content: reply });
    addMessage("assistant", reply);

  } catch (e) {
    addMessage("assistant", "❌ Could not reach API. Check your connection.");
    messages.pop();
  } finally {
    setLoading(false);
  }
}
