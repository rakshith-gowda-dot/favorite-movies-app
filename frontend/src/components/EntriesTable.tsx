import { useState, useEffect, useCallback, useRef } from 'react';
import type { Entry } from '../services/api';
import { apiService } from '../services/api';
import { MovieCard } from './MovieCard';

interface EntriesTableProps {
  onEdit: (entry: Entry) => void;
  refreshTrigger: number;
  searchQuery: string;
}

export const EntriesTable: React.FC<EntriesTableProps> = ({ onEdit, refreshTrigger, searchQuery }) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  
  // Refs for stable values in scroll handler
  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);
  const searchQueryRef = useRef('');

  // Update refs when state changes
  useEffect(() => {
    pageRef.current = page;
    hasMoreRef.current = hasMore;
    searchQueryRef.current = searchQuery;
  }, [page, hasMore, searchQuery]);

  const loadEntries = useCallback(async (pageNum: number = 1, search: string = '', isNewSearch: boolean = false) => {
    if (loadingRef.current) return;
    
    loadingRef.current = true;
    setLoading(true);
    
    try {
      const response = await apiService.getEntries(pageNum, 12, search);
      
      if (isNewSearch || pageNum === 1) {
        setEntries(response.entries);
      } else {
        setEntries(prev => [...prev, ...response.entries]);
      }
      
      setHasMore(response.hasMore);
      setPage(pageNum);
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, []);

  // Load initial entries
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    loadEntries(1, searchQuery, true);
  }, [refreshTrigger, searchQuery]);

  // Scroll-based infinite scroll
  useEffect(() => {
    const checkScroll = () => {
      if (!hasMoreRef.current || loadingRef.current || !observerTarget.current) return;
      
      const rect = observerTarget.current.getBoundingClientRect();
      if (rect.top < window.innerHeight + 200) {
        loadEntries(pageRef.current + 1, searchQueryRef.current, false);
      }
    };

    const throttledCheck = throttle(checkScroll, 500);
    window.addEventListener('scroll', throttledCheck);
    window.addEventListener('resize', throttledCheck);
    
    // Check initially in case content doesn't fill the screen
    checkScroll();

    return () => {
      window.removeEventListener('scroll', throttledCheck);
      window.removeEventListener('resize', throttledCheck);
    };
  }, [loadEntries]);

  const handleDelete = async (id: number) => {
    try {
      await apiService.deleteEntry(id);
      setEntries(prev => prev.filter(entry => entry.id !== id));
    } catch (error) {
      alert('Error deleting entry: ' + (error as Error).message);
    }
  };

  return (
    <div>
      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {entries.map((entry) => (
          <MovieCard
            key={entry.id}
            entry={entry}
            onEdit={onEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Loading indicator for infinite scroll */}
      <div ref={observerTarget} className="h-20 flex justify-center items-center">
        {loading && hasMore && (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
            <span className="ml-3 text-amber-700 font-medium">Loading more movies...</span>
          </div>
        )}
      </div>

      {/* Loading Spinner for initial load */}
      {loading && entries.length === 0 && (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          <span className="ml-3 text-amber-700 font-medium">Loading movies...</span>
        </div>
      )}

      {/* No More Entries */}
      {!hasMore && entries.length > 0 && (
        <div className="text-center py-8">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 inline-block">
            <div className="text-amber-600 font-semibold">🎬 All movies loaded!</div>
            <div className="text-amber-500 text-sm mt-1">
              You've seen all {entries.length} movies in your collection
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {entries.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="text-amber-400 text-6xl mb-4">🎬</div>
          <h3 className="text-xl font-bold text-amber-800 mb-2">
            {searchQuery ? 'No movies found' : 'Your collection is empty'}
          </h3>
          <p className="text-amber-600 max-w-sm mx-auto">
            {searchQuery 
              ? 'Try different search terms or add new movies to your collection.'
              : 'Start building your movie collection by adding your first entry!'
            }
          </p>
        </div>
      )}
    </div>
  );
};

// Fixed throttle function with proper TypeScript annotations
function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): T {
  let inThrottle = false;
  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  }) as T;
}