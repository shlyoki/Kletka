import { useEffect, useRef, useState } from 'react';

type Key = string | null;

type Fetcher<Data> = (key: string) => Promise<Data>;

type Listener = () => void;

const cache = new Map<string, unknown>();
const listeners = new Map<string, Set<Listener>>();

interface SWRResponse<Data> {
  data: Data | undefined;
  error: unknown;
  isLoading: boolean;
}

interface SWROptions {
  revalidateOnFocus?: boolean;
}

function notify(key: string) {
  const subs = listeners.get(key);
  if (!subs) return;
  subs.forEach((listener) => listener());
}

export function mutate(key: string) {
  cache.delete(key);
  notify(key);
}

export default function useSWR<Data = unknown>(
  key: Key,
  fetcher: Fetcher<Data>,
  _options: SWROptions = {}
): SWRResponse<Data> {
  const [data, setData] = useState<Data | undefined>(() => {
    if (!key) return undefined;
    return cache.get(key) as Data | undefined;
  });
  const [error, setError] = useState<unknown>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (!key) return false;
    return !cache.has(key);
  });
  const latestKeyRef = useRef<Key>(key);

  useEffect(() => {
    if (!key) {
      setData(undefined);
      setIsLoading(false);
      return;
    }

    latestKeyRef.current = key;
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      try {
        const result = await fetcher(key);
        if (cancelled) return;
        cache.set(key, result);
        setData(result);
        setError(undefined);
      } catch (err) {
        if (cancelled) return;
        setError(err);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    const subscription = () => {
      if (cancelled) return;
      load();
    };

    if (!listeners.has(key)) {
      listeners.set(key, new Set());
    }
    listeners.get(key)!.add(subscription);

    if (!cache.has(key)) {
      load();
    } else {
      setData(cache.get(key) as Data);
      setIsLoading(false);
    }

    return () => {
      cancelled = true;
      listeners.get(key)?.delete(subscription);
    };
  }, [key, fetcher]);

  const response: SWRResponse<Data> = {
    data,
    error,
    isLoading,
  };

  return response;
}
