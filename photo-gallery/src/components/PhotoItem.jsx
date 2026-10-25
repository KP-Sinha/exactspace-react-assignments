import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import '../styles/Skeleton.css';

/**
 * PhotoItem - Renders a single photo card with:
 * 1. Image on the left with skeleton loading placeholder
 * 2. Click-to-preview lightbox modal trigger
 * 3. Author name and FontAwesome thumbs-up like button on the right
 * 4. Subtle original photo download/open action
 */
function PhotoItem({ photo, likes, onLike, onPreview }) {
  const { id, author, download_url } = photo;
  const count = likes || 0;

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Optimized thumbnail format: 500x350
  const thumbnailSrc = `https://picsum.photos/id/${id}/500/350`;

  return (
    <li className="photo-item" aria-labelledby={`photo-author-${id}`}>
      {/* Clickable Image Thumbnail with Skeleton Placeholder */}
      <div
        className="photo-image-wrapper"
        onClick={() => onPreview(photo)}
        role="button"
        tabIndex={0}
        aria-label={`Open photo preview by ${author}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onPreview(photo);
          }
        }}
        title="Click to view full preview"
      >
        {/* Skeleton Shimmer displayed until image is loaded */}
        {!imageLoaded && !imageError && (
          <div className="photo-skeleton" aria-hidden="true" />
        )}

        <img
          src={thumbnailSrc}
          alt={`Photograph by ${author}`}
          loading="lazy"
          className="photo-image"
          style={{ opacity: imageLoaded ? 1 : 0 }}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            // Fallback to original download_url if resized thumbnail fails
            if (e.target.src !== download_url) {
              e.target.src = download_url;
            } else {
              setImageError(true);
              setImageLoaded(true);
            }
          }}
        />

        {/* Hover preview zoom badge */}
        <span className="photo-preview-hint" aria-hidden="true">
          🔍
        </span>
      </div>

      <div className="photo-details">
        <h2 id={`photo-author-${id}`} className="photo-author">
          {author}
        </h2>

        <div className="photo-actions">
          {/* Mandatory thumbs-up like button */}
          <button
            type="button"
            className="like-button"
            onClick={() => onLike(id)}
            aria-label={`Like photograph by ${author}. Currently ${count} likes`}
          >
            <FontAwesomeIcon icon={faThumbsUp} className="like-icon" />
            <span className="like-count">{count}</span>
          </button>

          {/* Download/Open original image link */}
          <a
            href={download_url}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="photo-download-btn"
            title={`Download or view original image by ${author}`}
            aria-label={`Download image by ${author}`}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </a>
        </div>
      </div>
    </li>
  );
}

export default React.memo(PhotoItem);
