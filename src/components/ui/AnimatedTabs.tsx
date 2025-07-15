
"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";

interface AnimatedTab {
  value: string;
  label: string;
}

interface AnimatedTabsProps {
  tabs: AnimatedTab[];
  activeTab: string;
  onTabChange: (value: string) => void;
  className?: string;
}

export function AnimatedTabs({ tabs, activeTab, onTabChange, className = "" }: AnimatedTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

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

  return (
    <div className={`relative bg-transparent border border-black mx-auto flex w-fit flex-col items-center rounded-full py-2 px-4 ${className}`}>
      <div
        ref={containerRef}
        className="absolute z-10 w-full overflow-hidden [clip-path:inset(0px_75%_0px_0%_round_17px)] [transition:clip-path_0.25s_ease]"
      >
        <div className="relative flex w-full justify-center bg-black">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onTabChange(tab.value)}
              className="flex h-8 items-center rounded-full px-3 py-2 text-sm font-medium text-white whitespace-nowrap"
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
              data-tab={tab.value}
              className="flex h-8 items-center cursor-pointer rounded-full px-3 py-2 text-sm font-medium text-gray-700 whitespace-nowrap"
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
