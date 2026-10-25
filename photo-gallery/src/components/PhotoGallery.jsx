import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useInfinitePhotos } from '../hooks/useInfinitePhotos';
import PhotoItem from './PhotoItem';
import LoadingIndicator from './LoadingIndicator';
import Lightbox from './Lightbox';
import BackToTop from './BackToTop';
import '../styles/PhotoGallery.css';

const LOCAL_STORAGE_LIKES_KEY = 'exactspace_photo_gallery_likes_v1';

/**
 * Safely loads persisted likes from localStorage without crashing on corrupted data.
 */
function loadPersistedLikes() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_LIKES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
    return {};
  } catch (err) {
    console.warn('[PhotoGallery] Failed to read likes from localStorage:', err);
    return {};
  }
}

/**
 * Safely writes likes map to localStorage.
 */
function savePersistedLikes(likesMap) {
  try {
    localStorage.setItem(LOCAL_STORAGE_LIKES_KEY, JSON.stringify(likesMap));
  } catch (err) {
    console.warn('[PhotoGallery] Failed to save likes to localStorage:', err);
  }
}

/**
 * PhotoGallery - Main container component for the single-column photo feed,
 * infinite scroll observer, persistent likes, lightbox preview, and back-to-top button.
 */
function PhotoGallery() {
  const { photos, loading, error, hasMore, loadNextPage, retry } = useInfinitePhotos();
  const [likesMap, setLikesMap] = useState(loadPersistedLikes);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const sentinelRef = useRef(null);

  // Handle independent like counter per photo and persist to localStorage
  const handleLike = useCallback((photoId) => {
    setLikesMap((prev) => {
      const next = {
        ...prev,
        [photoId]: (prev[photoId] || 0) + 1,
      };
      savePersistedLikes(next);
      return next;
    });
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
            onPreview={setSelectedPhoto}
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

      {/* Lightbox Image Preview Modal */}
      {selectedPhoto && (
        <Lightbox
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}

      {/* Floating Back to Top Button */}
      <BackToTop />
    </section>
  );
}

export default PhotoGallery;
