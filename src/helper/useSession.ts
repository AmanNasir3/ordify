import { useState, useEffect } from 'react';

// Original useSession hook
export default function useSession(key: string, defaultValue: any) {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.log(error);
    return defaultValue;
  }
}

// New useSessionWithState hook
export function useSessionWithState(key: string, defaultValue: any) {
  const [storedValue, setStoredValue] = useState(() => {
    return useSession(key, defaultValue);
  });

  useEffect(() => {
    function handleStorageChange() {
      setStoredValue(useSession(key, defaultValue));
    }

    // Listen for changes to localStorage
    window.addEventListener('storage', handleStorageChange);

    // Check for changes every second (as a fallback)
    const interval = setInterval(() => {
      const currentValue = useSession(key, defaultValue);
      if (JSON.stringify(currentValue) !== JSON.stringify(storedValue)) {
        setStoredValue(currentValue);
      }
    }, 1000);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [key, defaultValue]);

  // Function to update the session
  const setSession = (value: any) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setSession];
}