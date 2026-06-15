import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-display',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Sunartn | Every Handmade Piece Carries a Story',
  description: 'Discover premium handcrafted collections, meet worldwide artisans, and customize design themes with Curator AI.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} h-full antialiased`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-surface font-sans min-h-screen flex flex-col selection:bg-primary-container/20 selection:text-primary">
        <Providers>
          <Navigation />
          <main className="flex-grow pt-28">{children}</main>
          
          {/* Global Premium Footer */}
          <footer className="bg-secondary-container mt-12 w-full border-t border-outline-variant/30">
            <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                <div>
                  <Link href="/" className="font-display text-3xl text-primary tracking-tight font-medium">
                    Sunartn
                  </Link>
                  <p className="mt-4 text-secondary text-sm leading-relaxed max-w-xs">
                    Honoring tradition, supporting livelihoods, and bringing handcrafted beauty to modern homes.
                  </p>
                </div>
                <div className="flex flex-col space-y-3">
                  <h5 className="text-primary font-bold text-xs uppercase tracking-widest">Shop</h5>
                  <Link href="/shop" className="text-secondary hover:text-primary transition-all text-sm">All Crafts</Link>
                  <Link href="/shop?category=Vases" className="text-secondary hover:text-primary transition-all text-sm">Ceramic Pottery</Link>
                  <Link href="/shop?category=Textiles" className="text-secondary hover:text-primary transition-all text-sm">Intricate Textiles</Link>
                  <Link href="/shop" className="text-secondary hover:text-primary transition-all text-sm">Gift Collections</Link>
                </div>
                <div className="flex flex-col space-y-3">
                  <h5 className="text-primary font-bold text-xs uppercase tracking-widest">AI Services</h5>
                  <Link href="/concierge" className="text-secondary hover:text-primary transition-all text-sm">AI Concierge Chat</Link>
                  <Link href="/studio" className="text-secondary hover:text-primary transition-all text-sm">AI Studio Planner</Link>
                  <Link href="/curated-discovery" className="text-secondary hover:text-primary transition-all text-sm">Curated Matchmaking</Link>
                </div>
                <div className="flex flex-col space-y-3">
                  <h5 className="text-primary font-bold text-xs uppercase tracking-widest">Workspace</h5>
                  <Link href="/dashboard" className="text-secondary hover:text-primary transition-all text-sm">Artisan Dashboard</Link>
                  <Link href="/dashboard" className="text-secondary hover:text-primary transition-all text-sm">Customer Profile</Link>
                  <Link href="/auth" className="text-secondary hover:text-primary transition-all text-sm">Access Portal</Link>
                </div>
              </div>
              <div className="border-t border-outline-variant/30 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-secondary space-y-4 md:space-y-0">
                <p>© 2026 Sunartn. Crafted for heritage preservation.</p>
                <div className="flex space-x-6">
                  <a href="#" className="hover:text-primary">Privacy Policy</a>
                  <a href="#" className="hover:text-primary">Terms of Service</a>
                </div>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
