import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useInfinitePhotos } from '../hooks/useInfinitePhotos';
import PhotoItem from './PhotoItem';
import LoadingIndicator from './LoadingIndicator';
import '../styles/PhotoGallery.css';

/**
 * PhotoGallery - Main container component for the single-column photo feed,
 * infinite scroll observer, and independent like state management.
 */
function PhotoGallery() {
  const { photos, loading, error, hasMore, loadNextPage, retry } = useInfinitePhotos();
  const [likesMap, setLikesMap] = useState({});
  const sentinelRef = useRef(null);

  // Handle independent like counter per photo
  const handleLike = useCallback((photoId) => {
    setLikesMap((prev) => ({
      ...prev,
      [photoId]: (prev[photoId] || 0) + 1,
    }));
  }, []);

  // Set up IntersectionObserver for the sentinel element
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [first] = entries;
        if (first.isIntersecting && hasMore && !loading && !error) {
          loadNextPage();
        }
      },
      {
        root: null,
        rootMargin: '250px', // Pre-fetch slightly before the user reaches bottom
        threshold: 0,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, loading, error, loadNextPage]);

  return (
    <section className="photo-gallery-page" aria-label="Photo Gallery Application">
      <h1 className="gallery-title">Photo gallery</h1>

      <ul className="photo-list" aria-label="Photos list">
        {photos.map((photo) => (
          <PhotoItem
            key={photo.id}
            photo={photo}
            likes={likesMap[photo.id]}
            onLike={handleLike}
          />
        ))}
      </ul>

      {/* Sentinel element to trigger next page load */}
      <div ref={sentinelRef} className="sentinel" aria-hidden="true" />

      {/* Loading state indicator */}
      {loading && (
        <LoadingIndicator
          text={photos.length === 0 ? 'Loading photos...' : 'Loading more photos...'}
        />
      )}

      {/* Error state and retry button */}
      {error && (
        <div className="error-banner" role="alert">
          <p className="error-message">{error}</p>
          <button type="button" className="retry-button" onClick={retry}>
            Retry
          </button>
        </div>
      )}

      {/* End of feed notification */}
      {!hasMore && photos.length > 0 && (
        <p className="end-message">You have reached the end of the gallery.</p>
      )}
    </section>
  );
}

export default PhotoGallery;
