'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore, useCartStore } from '@/store';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  
  const { user, logout } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Avoid hydration mismatch by syncing state in useEffect
    const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalCount);
  }, [cartItems]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md shadow-sm border-b border-outline-variant/10">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-7xl mx-auto">
        <Link href="/" className="font-display text-3xl md:text-4xl text-primary tracking-tight font-medium hover:opacity-85 transition-opacity">
          Sunartn
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-8">
          <Link
            href="/shop"
            className={`font-medium tracking-wide text-xs uppercase ${
              pathname === '/shop' ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary transition-colors'
            }`}
          >
            Shop
          </Link>
          <Link
            href="/concierge"
            className={`font-medium tracking-wide text-xs uppercase ${
              pathname === '/concierge' ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary transition-colors'
            }`}
          >
            AI Concierge
          </Link>
          <Link
            href="/studio"
            className={`font-medium tracking-wide text-xs uppercase ${
              pathname === '/studio' ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary transition-colors'
            }`}
          >
            AI Studio
          </Link>
          <Link
            href="/curated-discovery"
            className={`font-medium tracking-wide text-xs uppercase ${
              pathname === '/curated-discovery' ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary transition-colors'
            }`}
          >
            Matchmaker
          </Link>
        </nav>

        {/* User States & Cart Actions */}
        <div className="flex items-center space-x-6">
          {/* Shopping Cart Link */}
          <Link href="/cart" className="relative text-on-surface-variant hover:text-primary transition-all active:scale-95 flex items-center">
            <span className="material-symbols-outlined text-2xl">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold font-sans">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Profile / Access */}
          {user ? (
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/dashboard" className="text-xs font-semibold tracking-widest uppercase text-on-surface-variant hover:text-primary transition-all">
                {user.name} ({user.role})
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs font-semibold tracking-widest uppercase text-primary hover:text-secondary cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="hidden md:block text-xs font-semibold tracking-widest uppercase text-on-surface-variant hover:text-primary transition-all"
            >
              Access
            </Link>
          )}

          {/* Hamburger Menu Mobile */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-on-surface-variant">
            <span className="material-symbols-outlined text-3xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-background border-t border-outline-variant/20 px-margin-mobile py-6 flex flex-col space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <Link
            onClick={() => setMobileMenuOpen(false)}
            href="/shop"
            className="font-medium text-sm text-on-surface-variant hover:text-primary py-2 border-b border-outline-variant/10"
          >
            Shop Collections
          </Link>
          <Link
            onClick={() => setMobileMenuOpen(false)}
            href="/concierge"
            className="font-medium text-sm text-on-surface-variant hover:text-primary py-2 border-b border-outline-variant/10"
          >
            AI Concierge Consultation
          </Link>
          <Link
            onClick={() => setMobileMenuOpen(false)}
            href="/studio"
            className="font-medium text-sm text-on-surface-variant hover:text-primary py-2 border-b border-outline-variant/10"
          >
            AI Studio Planner
          </Link>
          <Link
            onClick={() => setMobileMenuOpen(false)}
            href="/curated-discovery"
            className="font-medium text-sm text-on-surface-variant hover:text-primary py-2 border-b border-outline-variant/10"
          >
            Matchmaker discovery
          </Link>

          {user ? (
            <>
              <Link
                onClick={() => setMobileMenuOpen(false)}
                href="/dashboard"
                className="font-medium text-sm text-primary py-2 border-b border-outline-variant/10"
              >
                Go to Dashboard ({user.name})
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="font-medium text-sm text-secondary text-left py-2"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              onClick={() => setMobileMenuOpen(false)}
              href="/auth"
              className="font-medium text-sm text-on-surface-variant hover:text-primary py-2"
            >
              Sign In / Access Portal
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
