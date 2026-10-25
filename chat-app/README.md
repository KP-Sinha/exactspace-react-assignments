# React Chat App — Exactspace Internship Assignment

A clean, responsive, real-time Team Chat application built with React, Vite, Express.js, Socket.io, and plain CSS for the Exactspace Technologies Front End / UI Developer Internship assignment.

---

## 1. Project Overview

The application simulates an interactive team messaging feed with random author assignment and per-message like counters. In addition to the mandatory assignment requirements, this application implements **ALL THREE optional stretch goals**:
1. **Interactive Emoji Picker**
2. **@User Mentions Autocomplete & Stylized Rendering**
3. **Real-Time Client-Server Communication via Express.js & Socket.io**

---

## 2. Features Implemented

### A. Mandatory Features
- **Random Author Assignment:** Every newly sent message is assigned a random author from the predefined team list: `["Alan", "Bob", "Carol", "Dean", "Elin"]`.
- **Dynamic Avatars & Colors:** Each author is assigned a distinct avatar color and display initial.
- **Message Composer:** Supports sending via the **Send** button or pressing the **Enter** key.
- **Input Validation:** Whitespace is trimmed, and empty or whitespace-only messages are blocked.
- **Independent Like Counters:** Every message includes a Like button on the right edge with a counter initialized to `0`. Repeated clicks increment only that specific message's count indefinitely.
- **Auto-Scrolling:** The message thread automatically scrolls to the newest message upon submission.
- **Initial Empty State:** Displays a friendly placeholder illustration when no messages exist.
- **Responsive Layout:** Adaptive layout styled with plain CSS for mobile, tablet, and desktop viewports.
- **Accessibility:** Semantic HTML elements (`<header>`, `<main>`, `<article>`, `<time>`, `<form>`), ARIA labels, and visible focus rings.

### B. Completed Stretch Goals
1. **Emoji Picker:**
   - Interactive popover with curated categories (Smileys, Gestures, Reactions & Symbols).
   - Inserts selected emojis at the cursor position without prematurely sending the message.
   - Close on outside click or pressing `Escape`.
   - Fully accessible and responsive on mobile devices.
2. **@User Mentions:**
   - Typing `@` triggers an autocomplete dropdown filtering the team list (`Alan`, `Bob`, `Carol`, `Dean`, `Elin`).
   - Supports keyboard navigation (`ArrowUp`, `ArrowDown`), `Enter`/`Tab` selection, and mouse click.
   - Preserves surrounding text and restores input focus seamlessly.
   - Renders mentions as distinct stylized pills (`.chat-mention-badge`) safely as React elements without `dangerouslySetInnerHTML`.
3. **Real-Time Communication (Express.js + Socket.io):**
   - Express HTTP server running Socket.io on port `4000`.
   - Real-time broadcast: messages sent from one client/tab instantly appear across all connected clients.
   - Synchronized like counters: liking a message instantly updates the counter for all connected participants.
   - Live connection badge in the header (`Live Server`, `Connecting...`, `Offline`).
   - Clean reconnection handling and duplicate message prevention.
   - Graceful offline fallback: if the backend server is stopped, the client continues functioning seamlessly in local mode.

---

## 3. Technology Stack

- **Frontend:**
  - React 19 (`react`, `react-dom`)
  - Vite 8 (`@vitejs/plugin-react`)
  - Socket.io Client (`socket.io-client`)
  - Plain CSS (CSS Variables, Flexbox, Animations)
  - Oxlint
- **Backend:**
  - Node.js (ES Modules)
  - Express.js 4 (`express`)
  - Socket.io 4 (`socket.io`)
  - CORS (`cors`)

---

## 4. Prerequisites

- **Node.js:** v18.0.0 or higher (v20+ recommended)
- **npm:** v9.0.0 or higher

---

## 5. Running the Application

### Step 1: Install Dependencies

#### Install frontend dependencies:
```bash
cd chat-app
npm install
```

#### Install backend dependencies:
```bash
cd server
npm install
cd ..
```

---

### Step 2: Start the Backend Server

From inside `chat-app/`:
```bash
cd server
npm start
```
The server will run on `http://127.0.0.1:4000` (health check: `http://127.0.0.1:4000/health`).

---

### Step 3: Start the Frontend Application

In a separate terminal window, from `chat-app/`:
```bash
npm run dev
```
The client will start at:
`http://127.0.0.1:5173/`

The header will display a green **"Live Server"** badge once connected.

---

## 6. Production Build & Linting

### Build frontend for production:
```bash
npm run build
```

### Run code linter:
```bash
npm run lint
```

---

## 7. Socket.io Event Architecture & Data Flow

```text
[ React Client A ]                [ Express + Socket.io Server ]              [ React Client B ]
        |                                       |                                      |
        |--- emit('send_message', payload) ---->|                                      |
        |                                       |--- emit('new_message', message) ---->|
        |                                       |<-- emit('like_message', msgId) ------|
        |<-- emit('message_liked', update) -----|--- emit('message_liked', update) --->|
```

- **`init_messages`**: Sent to newly connected clients with recent message history.
- **`send_message`**: Dispatched by a client upon submitting a message.
- **`new_message`**: Broadcast by the server to all clients with author and unique ID.
- **`like_message`**: Dispatched when any client clicks like on a message.
- **`message_liked`**: Broadcast by the server to synchronize like counts across all clients.

> **Note on Storage:** Messages are stored in an in-memory queue on the server to keep active sessions synchronized. Chat history is non-persistent and will reset if the backend server process restarts.

---

## 8. Project Structure

```text
chat-app/
├── assets/
│   └── 20221208_203258_team-chat-intro.gif   # Original reference asset
├── public/
│   └── vite.svg
├── server/
│   ├── index.js                              # Express + Socket.io server
│   ├── package.json                          # Backend dependencies
│   └── package-lock.json
├── src/
│   ├── components/
│   │   ├── ChatApp.jsx                       # Controller, Socket.io connection & fallback
│   │   ├── ChatHeader.jsx                    # Header with live connection indicator
│   │   ├── EmojiPicker.jsx                   # Popover emoji picker component
│   │   ├── MentionDropdown.jsx               # @Mention autocomplete suggestions
│   │   ├── MessageList.jsx                   # Message thread & empty state
│   │   ├── MessageItem.jsx                   # Message bubble & safe mention rendering
│   │   └── MessageInput.jsx                  # Composer with emoji & mention handling
│   ├── styles/
│   │   ├── ChatApp.css
│   │   ├── ChatHeader.css
│   │   ├── EmojiPicker.css
│   │   ├── MentionDropdown.css
│   │   ├── MessageList.css
│   │   └── MessageInput.css
│   ├── emojiData.js                          # Curated emoji library
│   ├── utils.js                              # User theme colors & time formatting
│   ├── App.jsx                               # Root application component
│   ├── index.css                             # Global reset and CSS custom properties
│   └── main.jsx                              # React DOM mount entry
├── .gitignore
├── .oxlintrc.json
├── index.html
├── package.json
├── package-lock.json
├── reactjs_chat_assignment.md                # Original assignment brief
├── team-chat-intro.gif                       # Original reference asset
└── vite.config.js
```
