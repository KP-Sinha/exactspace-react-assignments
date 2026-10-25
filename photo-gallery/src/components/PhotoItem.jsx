import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';

/**
 * PhotoItem - Renders a single photo card with image on the left,
 * author name, and FontAwesome thumbs-up like button on the right.
 */
function PhotoItem({ photo, likes, onLike }) {
  const { id, author, download_url } = photo;
  const count = likes || 0;

  // Use a sensible thumbnail size from Picsum for optimal loading performance
  // Format: https://picsum.photos/id/{id}/440/300
  const thumbnailSrc = `https://picsum.photos/id/${id}/500/350`;

  return (
    <li className="photo-item" aria-labelledby={`photo-author-${id}`}>
      <div className="photo-image-wrapper">
        <img
          src={thumbnailSrc}
          alt={`Photograph by ${author}`}
          loading="lazy"
          className="photo-image"
          onError={(e) => {
            // Fallback to original download_url if thumbnail URL is not reachable
            if (e.target.src !== download_url) {
              e.target.src = download_url;
            }
          }}
        />
      </div>

      <div className="photo-details">
        <h2 id={`photo-author-${id}`} className="photo-author">
          {author}
        </h2>

        <div className="photo-actions">
          <button
            type="button"
            className="like-button"
            onClick={() => onLike(id)}
            aria-label={`Like photograph by ${author}. Currently ${count} likes`}
          >
            <FontAwesomeIcon icon={faThumbsUp} className="like-icon" />
            <span className="like-count">{count}</span>
          </button>
        </div>
      </div>
    </li>
  );
}

export default React.memo(PhotoItem);
