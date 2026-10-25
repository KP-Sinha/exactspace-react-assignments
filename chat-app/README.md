# React Chat App — Exactspace Internship Assignment

A clean, responsive, single-page Team Chat application built with React, Vite, and plain CSS for the Exactspace Technologies Front End / UI Developer Internship assignment.

---

## 1. Project Overview

The application simulates an interactive team messaging feed with random author assignment and per-message like counters. Following the assignment instructions, it focuses strictly on the chat input box and the scrollable message thread without unnecessary sidebars or dashboards.

---

## 2. Features Implemented

- **Random Author Assignment:** Every newly sent message is assigned a random author from the predefined team list: `["Alan", "Bob", "Carol", "Dean", "Elin"]`.
- **Dynamic Avatars & Colors:** Each author is assigned a distinct avatar color and display initial.
- **Message Composer:** Supports sending via the **Send** button or pressing the **Enter** key.
- **Input Validation:** Whitespace is trimmed, and empty or whitespace-only messages are blocked.
- **Independent Like Counters:** Every message includes a Like button on the right edge with a counter initialized to `0`. Repeated clicks increment only that specific message's count indefinitely.
- **Auto-Scrolling:** The message thread automatically scrolls to the newest message upon submission.
- **Initial Empty State:** Displays a friendly placeholder illustration when no messages exist.
- **Responsive Layout:** Adaptive layout styled with plain CSS for mobile, tablet, and desktop viewports.
- **Accessibility:** Semantic HTML elements (`<header>`, `<main>`, `<article>`, `<time>`, `<form>`), ARIA labels, and visible focus rings.

---

## 3. Technology Stack

- **Framework:** React 19 (`react`, `react-dom`)
- **Build Tool:** Vite 8 (`@vitejs/plugin-react`)
- **Language:** JavaScript (JSX)
- **Styling:** Plain CSS (CSS Variables, Flexbox, Media Queries)
- **Linter:** Oxlint

---

## 4. Prerequisites

- **Node.js:** v18.0.0 or higher (v20+ recommended)
- **npm:** v9.0.0 or higher

---

## 5. Installation Instructions

Navigate to the `chat-app` directory and install dependencies:

```bash
cd chat-app
npm install
```

---

## 6. Local Development

Start the Vite development server:

```bash
npm run dev
```

The application will be available at:
`http://127.0.0.1:5173/`

---

## 7. Production Build & Linting

### Build for production:
```bash
npm run build
```
Generates optimized static assets in the `dist/` directory.

### Run code linter:
```bash
npm run lint
```

### Preview production build:
```bash
npm run preview
```

---

## 8. Project Structure

```text
chat-app/
├── assets/
│   └── 20221208_203258_team-chat-intro.gif   # Original reference asset
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── ChatApp.jsx                       # Main controller & state manager
│   │   ├── ChatHeader.jsx                    # Channel header
│   │   ├── MessageList.jsx                   # Scrollable message feed & empty state
│   │   ├── MessageItem.jsx                   # Individual message card & like button
│   │   └── MessageInput.jsx                  # Message composer & send button
│   ├── styles/
│   │   ├── ChatApp.css
│   │   ├── ChatHeader.css
│   │   ├── MessageList.css
│   │   └── MessageInput.css
│   ├── utils.js                              # Avatar color mapping & time formatting
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

---

## 9. Assignment Requirements Covered

| Requirement | Status | Notes |
| :--- | :---: | :--- |
| Single Page Application | ✅ Covered | Implemented with React functional components |
| Textbox and Send button | ✅ Covered | MessageInput component with Enter key support |
| Render chat thread above input | ✅ Covered | MessageList with auto-scroll ref |
| Omit sidebar from reference image | ✅ Covered | Excluded per explicit instructions |
| Random user assignment from list | ✅ Covered | Selects from `["Alan", "Bob", "Carol", "Dean", "Elin"]` |
| Like button at the right end | ✅ Covered | Right-aligned in message bubble with live counter |
| Independent, unlimited like count | ✅ Covered | Initialized to 0, immutable updates per message |
| Clean UI matching mockup | ✅ Covered | Light gray background, white bubbles, colored avatars |

---

## 10. Optional Stretch Goals Status

- **Emoji options:** Not implemented (kept focus strictly on rock-solid mandatory functionality).
- **Mentions (`@`):** Not implemented.
- **Socket.io / Express server:** Not implemented (assignment is self-contained client-side SPA).
