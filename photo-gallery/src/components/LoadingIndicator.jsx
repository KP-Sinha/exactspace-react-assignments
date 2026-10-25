import React from 'react';

/**
 * LoadingIndicator - Visual spinner shown during initial load or while fetching next pages.
 */
function LoadingIndicator({ text = 'Loading more photos...' }) {
  return (
    <div className="loading-wrapper" role="status" aria-live="polite">
      <div className="loading-spinner" aria-hidden="true"></div>
      <p className="loading-text">{text}</p>
    </div>
  );
}

export default LoadingIndicator;
