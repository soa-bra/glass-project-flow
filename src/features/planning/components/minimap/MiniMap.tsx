
import React from 'react';

export default function MiniMap() {
  return (
    <div className="absolute bottom-4 right-4 w-32 h-24 border rounded bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="p-2 text-xs text-gray-500 text-center">
        خريطة مصغرة
      </div>
    </div>
  );
}
