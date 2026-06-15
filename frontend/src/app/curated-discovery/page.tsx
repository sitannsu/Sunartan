'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthStore } from '@/store';
import { motion, AnimatePresence } from 'framer-motion';

export default function CuratedDiscovery() {
  const { token } = useAuthStore();
  const [artisans, setArtisans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Load artisans list from local NestJS backend
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.sunartn.com/api'}/products/artisans`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setArtisans(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Could not connect to NestJS backend for artisans, loading fallbacks.', err);
        setArtisans([
          {
            id: 'artisan1',
            user: { name: 'Elena Varga' },
            bio: 'My work is a dialogue between the clay of the Carpathian mountains and the modern dining space. I believe objects should carry the weight of their origin.',
            region: 'Carpathians',
            craft: 'Ceramics & Pottery',
            avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJX_nH22T2-RjyZUMhrkltf9x0YFYXub9DwtWw2wDMpTH-C_8OcQL6zYoeTE_LWAaxi-IPIYBAAkXFjNsUtRobv_4BzloAPNt2mwRkuhsJG7qvruVpKboMvYPGMvAiOS7Ja1d1Zh-1jm0SNvG--Jlq3CZ0RQ9fRJYs0l4yeInUj0t0Kxmz_LPBsM5UCfw4hZXpel5p1R2ldSwdZ49cQU4aDBRrPKsNFAOfqU2eTfA9jqXiCB0A8kCdzPm1L0N5hOLY2FWrc2fegaI',
            rating: 4.9,
          },
          {
            id: 'artisan2',
            user: { name: 'Rameshwar Lal' },
            bio: 'The earth tells me what it wants to become. I am simply the hands that listen. রমেশ্বর has been practicing the art of Molela terracotta for 45 years.',
            region: 'Rajasthan',
            craft: 'Molela Terracotta Plaque Work',
            avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGz-nNdPOy8GhcejfvOkRg1b2O2k71vpffWzcBp2us2yOm2Y8w3PYR24ZIUK7139f7D_E3daiPt22nDslx6e7ROl7F4P41Bsrre4yBAKEmcaqa9mOh-dAnzqxg0iihOA78n1pD3pBXbGhYMXXiUhW84dRkAaWSbDkKygynAWqs_H8opUxqQX5cRBjnb4xvlD74hNWGBhwvaE7EZl6h0GG2-ksg1Nsssp0e0cgPv-lWmbSzuLhOOWCnKsptZDpfV31ZuoySkJ72nFo',
            rating: 4.8,
          },
        ]);
        setLoading(false);
      });
  }, []);

  const handleNext = () => {
    if (artisans.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % artisans.length);
  };

  const handlePrev = () => {
    if (artisans.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + artisans.length) % artisans.length);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
      </div>
    );
  }

  if (artisans.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-20 text-center">
        <span className="material-symbols-outlined text-5xl text-secondary">explore_off</span>
        <p className="mt-4 text-secondary text-sm">No artisans profiles indexed yet.</p>
      </div>
    );
  }

  const currentArtisan = artisans[currentIndex];

  return (
    <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop py-8 space-y-12">
      {/* Header Info */}
      <div className="text-center space-y-3">
        <span className="text-primary font-semibold text-xs uppercase tracking-widest block">Artisan Discovery</span>
        <h1 className="font-display text-4xl md:text-5xl font-light text-on-surface">Meet Your Circle of Artisans</h1>
        <p className="text-sm text-secondary leading-relaxed font-sans max-w-lg mx-auto">
          Travel through global ateliers and heritage workshops. Meet the minds and hands behind mindful luxury.
        </p>
      </div>

      {/* Main Artisan Carousel Card */}
      <div className="relative flex items-center justify-center min-h-[420px]">
        {/* Nav buttons */}
        <button
          onClick={handlePrev}
          className="absolute -left-6 z-10 w-12 h-12 rounded-full border bg-white flex items-center justify-center hover:bg-secondary-container/20 cursor-pointer shadow-md active:scale-95 transition-all text-primary font-bold text-lg"
        >
          chevron_left
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentArtisan.id || currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full bg-white border border-outline-variant/20 rounded-xl luxury-shadow overflow-hidden flex flex-col md:flex-row items-stretch"
          >
            {/* Visual Avatar banner */}
            <div className="md:w-1/2 min-h-[300px] relative bg-secondary-container/10">
              <Image
                alt={currentArtisan.user.name}
                fill
                className="object-cover"
                src={currentArtisan.avatarUrl || 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=400'}
              />
              <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <span className="material-symbols-outlined text-[14px] text-accent" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="text-[10px] font-bold text-secondary">{currentArtisan.rating} / 5</span>
              </div>
            </div>

            {/* Narrative Content details */}
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-accent uppercase tracking-widest block">
                    {currentArtisan.region} • {currentArtisan.craft}
                  </span>
                  <h2 className="font-display text-3xl font-light text-primary">{currentArtisan.user.name}</h2>
                </div>

                <p className="font-sans text-sm text-secondary leading-relaxed italic">
                  &ldquo;{currentArtisan.bio}&rdquo;
                </p>
                
                {currentArtisan.studioLocation && (
                  <p className="text-xs text-on-surface-variant font-medium flex items-center gap-1 font-sans">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    Atelier: {currentArtisan.studioLocation}
                  </p>
                )}
              </div>

              <div className="pt-4 flex gap-3">
                <Link
                  href={`/shop?search=${currentArtisan.user.name}`}
                  className="flex-grow bg-primary text-white py-3.5 rounded-lg text-xs uppercase tracking-widest font-semibold hover:opacity-95 text-center shadow-sm"
                >
                  View Collection Shop
                </Link>
                <Link
                  href="/concierge"
                  className="border border-primary text-primary px-4 py-3 rounded-lg text-xs font-semibold hover:bg-primary/5 flex items-center justify-center"
                >
                  <span className="material-symbols-outlined">auto_awesome</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={handleNext}
          className="absolute -right-6 z-10 w-12 h-12 rounded-full border bg-white flex items-center justify-center hover:bg-secondary-container/20 cursor-pointer shadow-md active:scale-95 transition-all text-primary font-bold text-lg"
        >
          chevron_right
        </button>
      </div>
    </div>
  );
}
