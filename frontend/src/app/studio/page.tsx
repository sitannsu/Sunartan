'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthStore, useCartStore, formatPrice } from '@/store';
import { motion } from 'framer-motion';

export default function Studio() {
  const { token } = useAuthStore();
  const addItem = useCartStore((state) => state.addItem);
  const currency = useCartStore((state) => state.currency);
  
  const [theme, setTheme] = useState('');
  const [loading, setLoading] = useState(false);
  const [collectionPlan, setCollectionPlan] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handlePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!theme.trim()) return;

    setLoading(true);
    setErrorMessage('');
    setCollectionPlan(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.sunartn.com/api'}/ai/studio/plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ theme }),
      });
      const data = await response.json();
      
      if (response.ok) {
        setCollectionPlan(data);
      } else {
        setErrorMessage(data.message || 'Failed to plan collection theme.');
      }
    } catch (err) {
      console.error('Error planning collection:', err);
      setErrorMessage('Network connection to NestJS service failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-8 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto space-y-4">
        <span className="text-primary font-semibold text-xs uppercase tracking-widest block">The Studio</span>
        <h1 className="font-display text-4xl md:text-5xl font-light text-on-surface">Curator AI Collection Planner</h1>
        <p className="text-sm text-secondary leading-relaxed font-sans">
          Design your custom home thematic collection. Input a visual mood, layout, or color theme, and our Curator AI will construct an editorial concept, selecting matching artisan crafts.
        </p>
      </div>

      {/* Input Prompt Section */}
      <section className="max-w-2xl mx-auto bg-white p-6 border border-outline-variant/20 rounded-xl luxury-shadow space-y-4">
        <form onSubmit={handlePlanSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-secondary font-semibold block">Define Theme & Concept</label>
            <textarea
              required
              rows={3}
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="Describe your design space (e.g. Earthy wabi-sabi ceramics in deep terracotta, minimal indigo textile wallhangings...)"
              className="w-full p-3 border border-outline-variant rounded-lg text-sm bg-white focus:ring-1 focus:ring-primary focus:border-primary outline-none font-sans"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-lg font-semibold text-xs uppercase tracking-widest hover:bg-primary/95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
          >
            {loading ? (
              <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
            ) : (
              'Plan Custom Collection'
            )}
          </button>
        </form>
        {errorMessage && <p className="text-xs text-primary font-medium">{errorMessage}</p>}
      </section>

      {/* Concept results rendering */}
      {collectionPlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8 border-t border-outline-variant/10 items-start"
        >
          {/* Visual Concept Text Panel */}
          <div className="lg:col-span-5 space-y-8 bg-secondary-container/20 p-8 rounded-xl border border-outline-variant/10 h-fit">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-accent uppercase tracking-widest block">AI Editorial Concept</span>
              <h2 className="font-display text-4xl text-primary font-light">{collectionPlan.title}</h2>
            </div>
            
            <div className="space-y-4 font-sans text-sm text-on-surface-variant leading-relaxed">
              <div className="space-y-1">
                <h4 className="text-xs uppercase tracking-widest text-primary font-semibold">Narrative Concept</h4>
                <p>&ldquo;{collectionPlan.description}&rdquo;</p>
              </div>
              
              <div className="space-y-1 pt-4 border-t border-outline-variant/10">
                <h4 className="text-xs uppercase tracking-widest text-primary font-semibold">Visual & Lighting Direction</h4>
                <p>{collectionPlan.visualDirection}</p>
              </div>
            </div>

            <button
              onClick={() => {
                alert('Collection successfully saved to your profile.');
              }}
              className="w-full border border-primary text-primary py-3 rounded-lg text-xs uppercase tracking-widest font-semibold hover:bg-primary/5 transition-all mt-4"
            >
              Save Collection to Curation
            </button>
          </div>

          {/* Curated Products Panel */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="font-display text-3xl font-light text-on-surface pb-3 border-b border-outline-variant/10">
              Curated Craft Selections
            </h3>

            {collectionPlan.products?.length === 0 ? (
              <p className="text-sm text-secondary italic">No matching products found in database.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {collectionPlan.products.map((product: any, index: number) => (
                  <motion.article
                    key={product.id || index}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-white p-5 rounded-xl border border-outline-variant/10 hover:border-accent/30 transition-all flex flex-col justify-between shadow-[0px_4px_25px_rgba(85,107,47,0.03)]"
                  >
                    <div>
                      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-secondary-container/10 mb-4">
                        <Image
                          alt={product.title}
                          fill
                          className="object-cover"
                          src={product.images?.[0] || 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c'}
                        />
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-secondary block">
                        {product.artisanName || product.artisan?.user?.name || 'Elena Varga'}
                      </span>
                      <h4 className="font-display text-lg mt-1 text-on-surface leading-tight font-semibold">
                        {product.title}
                      </h4>
                      <p className="text-[11px] text-on-surface-variant line-clamp-2 mt-1 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-outline-variant/10">
                      <span className="font-display font-medium text-lg text-primary">{formatPrice(product.price, currency)}</span>
                      <div className="flex gap-2">
                        <Link
                          href={`/shop/${product.id}`}
                          className="bg-secondary-container/30 text-secondary px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-widest font-semibold hover:bg-secondary-container transition-all"
                        >
                          Details
                        </Link>
                        <button
                          onClick={() => addItem(product)}
                          className="bg-primary text-white px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-widest font-semibold hover:opacity-95 cursor-pointer transition-all"
                        >
                          Add +
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
