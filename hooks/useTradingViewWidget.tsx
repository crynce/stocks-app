"use client";
import { useRef, useEffect } from "react";
const useTradingViewWidget = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  return containerRef;
};

export default useTradingViewWidget;
