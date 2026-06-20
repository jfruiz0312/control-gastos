import { useCallback, useEffect, useState } from 'react';

export default function useAsyncData(asyncFn, { immediate = true, initialData = null } = {}) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);

      try {
        const result = await asyncFn(...args);
        setData(result);
        return result;
      } catch (requestError) {
        setError(requestError);
        throw requestError;
      } finally {
        setLoading(false);
      }
    },
    [asyncFn],
  );

  useEffect(() => {
    if (!immediate) {
      return undefined;
    }

    execute().catch(() => undefined);
    return undefined;
  }, [execute, immediate]);

  return {
    data,
    setData,
    loading,
    error,
    execute,
    reload: execute,
  };
}
