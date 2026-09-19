import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: { default: 'VYBEON', template: '%s | VYBEON' },
  description: 'Where Every Vibe Comes Alive. Discover, stream, and share music.',
  keywords: ['music', 'streaming', 'playlist', 'discover', 'vybeon'],
  authors: [{ name: 'VYBEON' }],
  creator: 'VYBEON',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXTAUTH_URL ?? 'https://vybeon.onrender.com',
    title: 'VYBEON — Where Every Vibe Comes Alive',
    description: 'Discover music that matches your mood, your moment, and your world.',
    siteName: 'VYBEON',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VYBEON',
    description: 'Where Every Vibe Comes Alive.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#B8FF00',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
      <body className="bg-[#050505] text-[#F5F5F5] antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
