"use client";

import { useEffect, useRef, useCallback } from "react";

export const useDebounce = (callBack: () => void, delay: number) => {
  const timer = useRef<NodeJS.Timeout | null>(null);
  return useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      callBack();
    }, delay);
  }, [callBack, delay]);
};
