import type { RefObject } from 'react';
import { useEffect } from 'react';

type UseClickOutsideProps<T> = {
  ref: RefObject<T | null>;
  handler: () => void;
  enabled?: boolean;
};

export const useClickOutside = <T extends HTMLElement>(props: UseClickOutsideProps<T>) => {
  const { ref, handler, enabled = true } = props;

  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, handler, enabled]);
};
