import { useEffect, useState } from 'react';

export default function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches
  );
  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    try {
      mediaQuery.addEventListener('change', handler);
    } catch (e) {
      console.error('Error adding event listener', e);
      try {
        mediaQuery.addListener(handler);
      } catch (e2) {
        console.error('Error adding event listener', e2);
      }
    }
    setMatches(mediaQuery.matches);
    return () => {
      try {
        mediaQuery.removeEventListener('change', handler);
      } catch (e) {
        console.error('Error removing event listener', e);
        try {
          mediaQuery.removeListener(handler);
        } catch (e2) {
          console.error('Error removing listener', e2);
        }
      }
    };
  }, [query]);
  return matches;
}
