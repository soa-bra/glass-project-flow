export const env = {
  NODE_ENV: import.meta.env.MODE || "development",
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL as string | undefined,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined,
  VITE_WS_URL: import.meta.env.VITE_WS_URL as string | undefined,
};
