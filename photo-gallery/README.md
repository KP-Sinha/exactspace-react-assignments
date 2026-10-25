# React Photo Gallery — Exactspace Internship Assignment

A single-page, infinite-scrolling photo feed based on paginated JSON feeds from the Lorem Picsum API, built with React, Vite, FontAwesome, and plain CSS for the Exactspace Technologies Front End / UI Developer Internship assignment.

---

## 1. Project Overview

This application renders a clean 1-column photo gallery matching the provided visual mockups (`photo-gallery.jpg` / `photo-gallery.png`). As the user scrolls to the bottom of the page, it automatically fetches subsequent paginated JSON feeds from Lorem Picsum and seamlessly appends new photos to the existing feed until all pages are exhausted.

In addition to all mandatory requirements, this version includes professional user experience enhancements:
- **Skeleton Shimmer Loading:** Placeholders before images load to prevent layout shifts.
- **Lightbox Image Preview Modal:** Full-screen modal with author name and keyboard navigation (`Escape`, backdrop click).
- **Direct Download & Open Original:** Clean download action linking to the high-resolution source image (`download_url`).
- **Persistent Likes (localStorage):** Thumbs-up like counts persist across page reloads per browser.
- **Back-to-Top Floating Action Button:** Appears on scroll with smooth scrolling and `prefers-reduced-motion` support.

---

## 2. Features Implemented

### A. Mandatory Requirements
- **1-Column Responsive Feed:** Displays each photo on the left with author name and interactive thumbs-up like button on the right.
- **Picsum API Integration:** Fetches live data from `https://picsum.photos/v2/list?page=${page}` starting at page 1.
- **Infinite Scrolling:** Uses the browser `IntersectionObserver` API on a sentinel element with pre-fetch margins (`rootMargin: '250px'`) for fluid, non-blocking page loads.
- **FontAwesome Thumbs-Up Counter:** Uses `@fortawesome/react-fontawesome` with `faThumbsUp`. Each photo features its own counter initialized to `0` that increments on each click without toggling or decrementing.
- **State Preservation:** Previously loaded photos and their individual like counts are retained when new pages are fetched.
- **Duplicate & Race Condition Protection:** De-duplicates incoming photo records and blocks redundant fetch requests while a page is in flight.
- **Loading & Error Handling:** Shows an accessible loading indicator during initial and paginated loads, and an error banner with a manual **Retry** button on network failure.

### B. Professional Enhancements
- **Image Skeleton Loading:** Shimmer animation placeholder rendered while the thumbnail is loading, eliminating layout shifts and gracefully handling load errors.
- **Image Preview / Lightbox:** Clicking any photo opens a high-resolution preview modal with photographer attribution, download option, focus trapping, and `Escape` dismissal.
- **Download Original Photo:** Direct download button linking to the uncompressed `download_url`. If cross-origin download restrictions apply in certain browsers, it gracefully opens the original high-resolution image in a new tab.
- **LocalStorage Like Persistence:** Likes are stored by photo ID in `localStorage` under `exactspace_photo_gallery_likes_v1`. Counts persist after page reload, and corrupted storage data is handled gracefully with zero crashes.
- **Back-to-Top Floating Button:** Automatically appears when scrolling past 400px, smoothly returning to the top of the gallery while respecting reduced-motion system preferences.

---

## 3. Technology Stack

- **Framework:** React 19 (`react`, `react-dom`)
- **Build Tool:** Vite 8 (`@vitejs/plugin-react`)
- **Icons:** FontAwesome React (`@fortawesome/react-fontawesome`, `@fortawesome/free-solid-svg-icons`)
- **Language:** JavaScript (JSX)
- **Styling:** Plain CSS (CSS Variables, Flexbox, Animations, Media Queries)
- **Linter:** Oxlint

---

## 4. Prerequisites

- **Node.js:** v18.0.0 or higher (v20+ recommended)
- **npm:** v9.0.0 or higher

---

## 5. Installation & Local Development

### Install dependencies:
```bash
cd photo-gallery
npm install
```

### Run development server:
```bash
npm run dev
```

The application runs on port `5174` (preventing any conflict with the Chat App on port `5173`):
`http://127.0.0.1:5174/`

---

## 6. Production Build & Linting

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

## 7. Storage & Download Behavior Details

- **LocalStorage Likes:** Like counts are stored in the client browser's `localStorage`. They persist indefinitely across browser sessions and reloads for that specific browser. Likes are not shared across multiple users/devices since no backend database was required.
- **Image Download Behavior:** The download button links directly to Picsum's `download_url` with the `download` HTML attribute. Where modern browser CORS policies restrict direct forced filesystem saves of remote cross-origin assets, the link opens the original high-resolution image in a clean new tab where it can be saved directly.

---

## 8. Project Structure

```text
photo-gallery/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── PhotoGallery.jsx                  # Main feed, IntersectionObserver & localStorage
│   │   ├── PhotoItem.jsx                     # 1-column card, skeleton & thumbs-up
│   │   ├── Lightbox.jsx                      # Accessible image preview modal
│   │   ├── BackToTop.jsx                     # Floating scroll-to-top button
│   │   └── LoadingIndicator.jsx              # Loading spinner component
│   ├── hooks/
│   │   └── useInfinitePhotos.js              # Paginated fetch hook with duplicate guard
│   ├── styles/
│   │   ├── PhotoGallery.css                  # Feed layout, hover states, and responsive design
│   │   ├── Skeleton.css                      # Skeleton shimmer animation styles
│   │   ├── Lightbox.css                      # Modal backdrop, content and controls
│   │   └── BackToTop.css                     # Floating button styling and animations
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
