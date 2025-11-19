'use client';
import { useState, useEffect, useCallback, ChangeEvent } from 'react';

interface UseSearchBarOptions {
  initialValue?: string;
  debounceMs?: number;
  onSearchChange?: (value: string) => void;
  emitGlobal?: boolean;
}

export default function useSearchBar({
  initialValue = '',
  debounceMs = 200,
  onSearchChange = () => {},
  emitGlobal = true,
}: UseSearchBarOptions = {}) {
  const [search, setSearch] = useState(initialValue);

  useEffect(() => {
    setSearch(initialValue ?? '');
  }, [initialValue]);

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(search);
      if (emitGlobal) {
        window.dispatchEvent(new CustomEvent('globalSearch', { detail: search }));
      }
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [search, debounceMs, emitGlobal, onSearchChange]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  return { search, setSearch, handleChange };
}
