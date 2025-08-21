// تجميع أي مزوّدات جذرية (مثلاً Zustand/Query/Theme) — placeholder بسيط
import React from "react";

export function RootProviders({ children }: { children: React.ReactNode }){
  return <>{children}</>;
}
