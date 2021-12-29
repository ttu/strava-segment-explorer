// https://usehooks.com/useLocalStorage/

const useLocalStorageNoState = <T extends unknown>(key: string, initialValue: T): [T, (value: T) => void] => {
  const getValue = () => {
    if (typeof window === 'undefined') return undefined;
    const saved = localStorage.getItem(key);
    const initial = JSON.parse(saved || '');
    return initial ?? initialValue;
  };

  const value: T = getValue();

  const setValue = (value: T) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, JSON.stringify(value));
  };

  return [value, setValue];
};

export default useLocalStorageNoState;
