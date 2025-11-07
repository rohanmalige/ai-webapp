# AI Chat Website

A lightweight React app that lets users enter a prompt, sends it to an AI API (Gemini), and displays the response with loading and error states. Includes a local chat history and a clean, animated UI.

---

## Features

* Prompt input + submit button
* Fetch from AI API (Google Gemini via `@google/generative-ai`)
* Dynamic results display (stream-like placeholder + Markdown rendering)
* Loading state (spinner from `ldrs`)
* Error handling (graceful fallback message)
* Show chat history (localStorage) and Clear button
* Polish: Animated background, auto-resizing chat container

---

## Tech Stack

* **React** (Vite)
* **Google Gemini** (`@google/generative-ai`)
* **React Markdown** (`react-markdown`)
* **Loader** (`ldrs`)
* **Three.js** (animated background)

---

## Quick Start

### 1) Clone & install

```bash
git clone <your-repo-url>
cd <your-repo>
npm install
```

### 2) Add your API key

Create a `.env` file in the project root:

Edit `.env` and set:

```env
VITE_API_KEY=YOUR_GOOGLE_GEMINI_API_KEY
```

> **Note:** Please add the .env file to .gitignore to prevent exposing your API Key.

### 3) Run the dev server

```bash
npm run dev
```

Vite will print a local URL (**Example**: [http://localhost:5174](http://localhost:5174)).

### 4) Build for production

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## Project Structure

```
src/
  api/
    gemini.js        # askGemini(prompt) → string (handles errors)
  components/
    ChatBox.jsx      # chat UI, loading/error states, history, clear chat implementation
    ColorBends.jsx   # animated background (Three.js shader)
    TextType.jsx     # typing heading animation
  App.jsx
  index.css          # global styles (glassmorphism, layout)
```

---

## Configuration

* API client: `src/api/gemini.js`

  * Uses `VITE_API_KEY` from `.env`
  * Model: `gemini-2.5-flash` (adjust if needed)
* History: `localStorage` key: `chatHistory`
* Loading: `ldrs` spinner (leapfrog)
* Markdown: `react-markdown` to render AI replies

---

## Manual Test Checklist

* Type a prompt → **Send** → see **spinner**, then **AI reply**
* Bad/empty key → shows **error fallback** (“Sorry, something went wrong…”)
* **Enter** key sends (disabled while loading)
* **Clear Chat** collapses the box to a smaller height
* **History** button shows last saved messages (if any)

---

## Environment & Security

* Never commit `.env` (already gitignored).
* Use separate keys for dev/prod.
* Rate limits/errors are surfaced as user-friendly messages.

---

## Troubleshooting

* **Blank response or 401**: Check `VITE_API_KEY` and that the Gemini API is enabled for your project.
* **CORS issues**: Ensure you’re using the official client; Vite dev server should proxy fine locally.
* **Build fails**: Delete `node_modules` and lockfile, then reinstall.

---

## 📄 License

MIT License

---
