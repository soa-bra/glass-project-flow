"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AnimatedTab {
  value: string;
  label: string;
}

interface ScrollableAnimatedTabsProps {
  tabs: AnimatedTab[];
  activeTab: string;
  onTabChange: (value: string) => void;
  className?: string;
}

export function ScrollableAnimatedTabs({ tabs, activeTab, onTabChange, className = "" }: ScrollableAnimatedTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = React.useState(false);
  const [showRightScroll, setShowRightScroll] = React.useState(false);

  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftScroll(scrollLeft > 0);
    setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 1);
  };

  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const container = containerRef.current;

    if (container && activeTab) {
      const activeTabElement = activeTabRef.current;

      if (activeTabElement) {
        const { offsetLeft, offsetWidth } = activeTabElement;

        const clipLeft = offsetLeft + 16;
        const clipRight = offsetLeft + offsetWidth + 16;

        container.style.clipPath = `inset(0 ${Number(
          100 - (clipRight / container.offsetWidth) * 100,
        ).toFixed()}% 0 ${Number(
          (clipLeft / container.offsetWidth) * 100,
        ).toFixed()}% round 17px)`;
      }
    }
  }, [activeTab]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    checkScrollPosition();
    container.addEventListener('scroll', checkScrollPosition);
    window.addEventListener('resize', checkScrollPosition);

    return () => {
      container.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, [tabs]);

  useEffect(() => {
    // Scroll active tab into view
    if (activeTabRef.current && scrollContainerRef.current) {
      const activeTab = activeTabRef.current;
      const container = scrollContainerRef.current;
      
      const tabRect = activeTab.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
        activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeTab]);

  return (
    <div className={`relative flex items-center gap-2 ${className}`}>
      {/* Left scroll button */}
      {showLeftScroll && (
        <button
          onClick={scrollLeft}
          className="w-8 h-8 rounded-full bg-white/90 border border-black/20 flex items-center justify-center hover:bg-white shadow-sm z-20"
        >
          <ChevronLeft className="w-4 h-4 text-gray-700" />
        </button>
      )}

      {/* Scrollable tabs container */}
      <div 
        ref={scrollContainerRef}
        className="relative bg-transparent border border-black flex items-center rounded-full py-2 px-4 overflow-x-auto min-w-0 flex-1"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        onScroll={checkScrollPosition}
      >
        <div
          ref={containerRef}
          className="absolute z-10 w-full overflow-hidden [clip-path:inset(0px_75%_0px_0%_round_17px)] [transition:clip-path_0.25s_ease]"
        >
          <div className="relative flex w-full justify-center bg-black">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => onTabChange(tab.value)}
                className="flex h-8 items-center rounded-full px-3 py-2 text-sm font-medium text-white whitespace-nowrap flex-shrink-0"
                tabIndex={-1}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative flex w-full justify-center">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.value;

            return (
              <button
                key={tab.value}
                ref={isActive ? activeTabRef : null}
                onClick={() => onTabChange(tab.value)}
                className="flex h-8 items-center cursor-pointer rounded-full px-3 py-2 text-sm font-medium text-gray-700 whitespace-nowrap flex-shrink-0"
              >
                {tab.label}
              </button>
            );
          })}
        </div>

      </div>

      {/* Right scroll button */}
      {showRightScroll && (
        <button
          onClick={scrollRight}
          className="w-8 h-8 rounded-full bg-white/90 border border-black/20 flex items-center justify-center hover:bg-white shadow-sm z-20"
        >
          <ChevronRight className="w-4 h-4 text-gray-700" />
        </button>
      )}
    </div>
  );
}