import { useEffect, useRef, useState } from 'react';

type Key = string | null;

type Fetcher<Data> = (key: string) => Promise<Data>;

type Listener = () => void;

const cache = new Map<string, unknown>();
const listeners = new Map<string, Set<Listener>>();

type Mutator<Data> = Data | ((current: Data | undefined) => Data);

interface SWRResponse<Data> {
  data: Data | undefined;
  error: unknown;
  isLoading: boolean;
  mutate: (value?: Mutator<Data>, options?: { revalidate?: boolean }) => Promise<Data | undefined>;
}

interface SWROptions {
  revalidateOnFocus?: boolean;
  refreshInterval?: number;
}

function notify(key: string) {
  const subs = listeners.get(key);
  if (!subs) return;
  subs.forEach((listener) => listener());
}

export async function mutate<Data = unknown>(
  key: string,
  value?: Mutator<Data>,
  _options: { revalidate?: boolean } = {},
): Promise<Data | undefined> {
  if (!key) return undefined;
  if (typeof value === 'function') {
    const current = cache.get(key) as Data | undefined;
    const next = (value as (current: Data | undefined) => Data)(current);
    cache.set(key, next);
    notify(key);
    return next;
  }
  if (value !== undefined) {
    cache.set(key, value);
    notify(key);
    return value;
  }
  cache.delete(key);
  notify(key);
  return undefined;
}

export default function useSWR<Data = unknown>(
  key: Key,
  fetcher: Fetcher<Data>,
  _options: SWROptions = {},
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

  return {
    data,
    error,
    isLoading,
    mutate: async (value?: Mutator<Data>, options: { revalidate?: boolean } = {}) => {
      if (!key) return undefined;
      if (typeof value === 'function') {
        const current = cache.get(key) as Data | undefined;
        const next = (value as (current: Data | undefined) => Data)(current);
        cache.set(key, next);
        notify(key);
        return next;
      }
      if (value !== undefined) {
        cache.set(key, value);
        notify(key);
        return value;
      }
      cache.delete(key);
      notify(key);
      if (options.revalidate !== false) {
        // Trigger listeners to refetch by leaving cache empty.
      }
      return undefined;
    },
  };
}

export function useSWRConfig() {
  return {
    mutate: <Data = unknown>(
      key: string,
      value?: Mutator<Data>,
      revalidate?: boolean | { revalidate?: boolean },
    ) => {
      const options =
        typeof revalidate === 'object'
          ? revalidate
          : revalidate === undefined
            ? {}
            : { revalidate };
      return mutate<Data>(key, value, options);
    },
  };
}
