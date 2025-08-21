import React from "react";

export function RootProviders({ children }: { children: React.ReactNode }) {
  // حط هنا أي Providers لاحقًا (Theme/Zustand/Query)
  return <>{children}</>;
}