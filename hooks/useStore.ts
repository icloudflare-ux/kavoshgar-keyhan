import { useState, useEffect } from 'react';

// FIX: Corrected generic types for the useStore hook. The previous signature
// was too complex and caused TypeScript to fail to infer the state type,
// resulting in `unknown`. This simpler signature correctly infers the types.
const useStore = <T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F,
) => {
  // This hook is designed to be safe for server-side rendering (SSR) by
  // returning `undefined` on the initial render and the actual store value
  // only after the component has mounted on the client. This prevents
  // hydration mismatch errors.
  const result = store(callback) as F;
  const [data, setData] = useState<F>();

  useEffect(() => {
    setData(result);
  }, [result]);

  return data;
};

export default useStore;
