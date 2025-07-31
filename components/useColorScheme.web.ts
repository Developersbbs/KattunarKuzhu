import { useEffect, useState } from 'react';

export function useColorScheme() {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(() => {
    // Check if window is defined (for SSR)
    if (typeof window !== 'undefined') {
      // Check for user preference in localStorage
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
      
      // Check for media query preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    
    // Default to light
    return 'light';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Listen for changes in system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if we don't have a saved preference
      if (!localStorage.getItem('theme')) {
        setColorScheme(e.matches ? 'dark' : 'light');
      }
    };
    
    // Use the correct event listener method based on browser support
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // For older browsers
      mediaQuery.addListener(handleChange);
    }
    
    return () => {
      // Clean up listener
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // For older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);
  
  return colorScheme;
}
