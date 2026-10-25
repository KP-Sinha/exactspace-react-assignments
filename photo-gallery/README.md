# React Photo Gallery — Exactspace Internship Assignment

A single-page, infinite-scrolling photo feed based on paginated JSON feeds from the Lorem Picsum API, built with React, Vite, FontAwesome, and plain CSS for the Exactspace Technologies Front End / UI Developer Internship assignment.

---

## 1. Project Overview

This application renders a clean 1-column photo gallery matching the provided visual mockup (`photo-gallery.jpg` / `photo-gallery.png`). As the user scrolls to the bottom of the page, it automatically fetches subsequent paginated JSON feeds and appends new photos to the existing feed until all pages are exhausted.

---

## 2. Features Implemented

- **1-Column Responsive Feed:** Displays each photo on the left with author name and interactive thumbs-up like button on the right.
- **Picsum API Integration:** Fetches live data from `https://picsum.photos/v2/list?page=${page}` starting at page 1.
- **Infinite Scrolling:** Uses the browser `IntersectionObserver` API on a sentinel element with pre-fetch margins (`rootMargin: '250px'`) for fluid, non-blocking page loads.
- **FontAwesome Thumbs-Up Counter:** Uses `@fortawesome/react-fontawesome` with `faThumbsUp`. Each photo features its own counter initialized to `0` that increments on each click without toggling or decrementing.
- **State Preservation:** Previously loaded photos and their individual like counts are retained when new pages are fetched.
- **Duplicate & Race Condition Protection:** De-duplicates incoming photo records and blocks redundant fetch requests while a page is in flight.
- **Loading & Error Handling:** Shows an accessible loading indicator during initial and paginated loads, and an error banner with a manual **Retry** button on network failure.
- **Performance Optimization:** Images use `loading="lazy"` with fallback handling on error.

---

## 3. Technology Stack

- **Framework:** React 19 (`react`, `react-dom`)
- **Build Tool:** Vite 8 (`@vitejs/plugin-react`)
- **Icons:** FontAwesome React (`@fortawesome/react-fontawesome`, `@fortawesome/free-solid-svg-icons`)
- **Language:** JavaScript (JSX)
- **Styling:** Plain CSS (CSS Variables, Flexbox, Media Queries)
- **Linter:** Oxlint

---

## 4. Prerequisites

- **Node.js:** v18.0.0 or higher (v20+ recommended)
- **npm:** v9.0.0 or higher

---

## 5. Installation Instructions

Navigate to the `photo-gallery` directory and install dependencies:

```bash
cd photo-gallery
npm install
```

---

## 6. Local Development

Start the Vite development server:

```bash
npm run dev
```

The application runs on port `5174` (to avoid conflicting with the Chat App on port `5173`):
`http://127.0.0.1:5174/`

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
photo-gallery/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── PhotoGallery.jsx                  # Main container & IntersectionObserver controller
│   │   ├── PhotoItem.jsx                     # 1-column photo card & FontAwesome thumbs-up
│   │   └── LoadingIndicator.jsx              # Loading spinner component
│   ├── hooks/
│   │   └── useInfinitePhotos.js              # Paginated fetch hook with duplicate guard
│   ├── styles/
│   │   └── PhotoGallery.css                  # Feed layout, hover states, and responsive design
│   ├── App.jsx                               # Root application component
│   ├── index.css                             # Global reset and typography variables
│   └── main.jsx                              # React DOM mount entry
├── .gitignore
├── .oxlintrc.json
├── index.html
├── package.json
├── package-lock.json
├── photo-gallery.jpg                         # Original reference mockup
├── photo-gallery.png                         # Original reference mockup
├── reactjs_photo_gallery_assignment.md       # Original assignment brief
└── vite.config.js                            # Vite config (configured for port 5174)
```

---

## 9. Assignment Requirements Covered

| Requirement | Status | Notes |
| :--- | :---: | :--- |
| Single Page Application | ✅ Covered | Built with React functional components and hooks |
| Infinite scroll from paginated feed | ✅ Covered | `https://picsum.photos/v2/list?page=${n}` |
| 1-Column view matching mockup | ✅ Covered | Photo on left, author & thumbs-up on right |
| Display `download_url` and `author` | ✅ Covered | Responsive image with lazy loading |
| Append new data on reaching bottom | ✅ Covered | Seamless append without resetting previous items |
| Stop when feed has no more data | ✅ Covered | Renders end-of-feed message on empty array |
| Thumbs-up icon with counter | ✅ Covered | FontAwesome `faThumbsUp` initialized to 0 |
| Unlimited counter increments | ✅ Covered | Increment on every click, isolated per photo |
| CSS styling similar to image | ✅ Covered | White background, clean typography, blue thumbs-up |
