// https://blog.logrocket.com/using-localstorage-react-hooks/

import { useEffect, useState } from 'react';

const useLocalStorage = <T extends unknown>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem(key);
    try {
      const parsed = saved ? JSON.parse(saved) : initialValue;
      return parsed ?? initialValue;
    } catch (err) {
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;
