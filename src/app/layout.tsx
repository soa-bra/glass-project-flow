// src/app/layout.tsx
import './globals.css';
import '../styles/tokens.css';
import '../styles/index.css';
import { RootProviders } from '@/store/RootProviders';
import { metadata as site } from './page';

export const metadata = {
  title: site.title,
  description: 'SoaBra Planning — Collaborative canvas',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
