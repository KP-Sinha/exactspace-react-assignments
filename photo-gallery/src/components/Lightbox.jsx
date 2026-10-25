import React, { useEffect, useRef } from 'react';
import '../styles/Lightbox.css';

/**
 * Lightbox - Accessible image preview modal.
 * Traps focus, closes on Escape or backdrop click, and locks body scrolling while open.
 */
function Lightbox({ photo, onClose }) {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    // Focus the close button when opened
    closeButtonRef.current?.focus();

    // Prevent background scrolling
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Handle Escape key
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!photo) return null;

  const { id, author, download_url } = photo;
  // High quality preview dimension: 1200x800
  const previewSrc = `https://picsum.photos/id/${id}/1200/800`;

  return (
    <div
      className="lightbox-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-author"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div ref={modalRef} className="lightbox-content">
        <div className="lightbox-image-container">
          <img
            src={previewSrc}
            alt={`High resolution view by ${author}`}
            className="lightbox-image"
            onError={(e) => {
              if (e.target.src !== download_url) {
                e.target.src = download_url;
              }
            }}
          />
        </div>

        <div className="lightbox-footer">
          <h2 id="lightbox-author" className="lightbox-author">
            Photograph by {author}
          </h2>

          <div className="lightbox-actions">
            <a
              href={download_url}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="lightbox-download-link"
              title="Open or download original high-res image"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Download / Open</span>
            </a>

            <button
              ref={closeButtonRef}
              type="button"
              className="lightbox-close-btn"
              onClick={onClose}
              aria-label="Close photo preview"
            >
              &times;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Lightbox;
