import { useState, useEffect, useRef, useCallback } from 'react';

const BASE_URL = 'https://picsum.photos/v2/list';

/**
 * useInfinitePhotos - Custom hook managing paginated fetching,
 * request de-duplication, React 18/19 StrictMode resilience, and error handling.
 */
export function useInfinitePhotos() {
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Tracks ongoing fetch and fetched pages to prevent duplicate requests
  const fetchingRef = useRef(false);
  const fetchedPagesRef = useRef(new Set());

  // Fetch whenever page changes or retry is called
  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    async function load() {
      if (fetchedPagesRef.current.has(page)) {
        return;
      }

      fetchingRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${BASE_URL}?page=${page}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to load photos: HTTP ${response.status}`);
        }

        const data = await response.json();

        if (ignore) return;

        if (!Array.isArray(data) || data.length === 0) {
          setHasMore(false);
        } else {
          fetchedPagesRef.current.add(page);

          setPhotos((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const uniqueNewPhotos = data.filter((p) => !existingIds.has(p.id));
            return [...prev, ...uniqueNewPhotos];
          });
        }
      } catch (err) {
        if (!ignore && err.name !== 'AbortError') {
          setError(err.message || 'An error occurred while fetching photos.');
        }
      } finally {
        if (!ignore) {
          fetchingRef.current = false;
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [page]);

  // Request next page
  const loadNextPage = useCallback(() => {
    if (!loading && hasMore && !fetchingRef.current && !error) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [loading, hasMore, error]);

  // Retry the current page after failure
  const retry = useCallback(() => {
    fetchedPagesRef.current.delete(page);
    setError(null);
    setPage((prev) => prev); // re-trigger fetch
  }, [page]);

  return {
    photos,
    loading,
    error,
    hasMore,
    loadNextPage,
    retry,
  };
}
