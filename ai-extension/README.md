# AI Assistant Browser Extension — Setup Guide

## Step 1: Get a free Groq API key (do this at home)

1. Go to https://console.groq.com
2. Sign up for a free account
3. Go to **API Keys** → click **Create API Key**
4. Copy the key and save it somewhere (notepad, notes app, etc.)

> Groq is free and gives you access to fast AI models like LLaMA 3.

---

## Step 2: Load the extension into Chrome or Edge (school laptop — no admin needed)

1. Open Chrome or Edge
2. Go to: `chrome://extensions` (or `edge://extensions`)
3. Turn on **Developer mode** (toggle in the top right)
4. Click **"Load unpacked"**
5. Select the `extension` folder from this project
6. Done — you'll see "AI Assistant" appear in your extensions

> No install, no admin permissions needed. It just runs from the folder.

---

## Step 3: Use it

1. Click the AI Assistant icon in your browser toolbar (top right)
2. Paste your Groq API key in the box at the bottom → click **Save**
3. Start chatting!

> Your API key is saved locally in your browser — you only need to enter it once.

---

## Folder structure

```
ai-extension/
  extension/
    manifest.json   ← extension config
    popup.html      ← chat UI
    popup.js        ← logic + API calls
    style.css       ← dark theme styling
```

---

## If the API is blocked at school

If `api.groq.com` gets blocked by Linewize, the fallback plan is:
- Run Ollama on your home PC
- Use Cloudflare Tunnel to expose it with a custom URL
- Change the fetch URL in `popup.js` line 82 to your tunnel URL

That way Linewize sees traffic to a random URL it doesn't recognize.
