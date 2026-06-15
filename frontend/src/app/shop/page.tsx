'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCartStore } from '@/store';
import { motion } from 'framer-motion';

function ShopCatalog() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  
  // Filters state
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedRegion, setSelectedRegion] = useState(searchParams.get('region') || '');
  const [selectedCraft, setSelectedCraft] = useState(searchParams.get('craft') || '');
  
  const categories = ['Vases', 'Textiles', 'Woodwork', 'Metal Crafts', 'Gift Boxes'];
  const regions = ['Rajasthan', 'Kashmir', 'Gujarat', 'West Bengal', 'Carpathians'];
  const crafts = ['Pottery', 'Textiles', 'Woodwork', 'Metal Crafts'];

  const fetchFilteredProducts = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (selectedCategory) params.append('category', selectedCategory);
    if (selectedRegion) params.append('region', selectedRegion);
    if (selectedCraft) params.append('craft', selectedCraft);

    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.sunartn.com/api'}/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFilteredProducts();
  }, [selectedCategory, selectedRegion, selectedCraft, searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery) {
      params.set('search', searchQuery);
    } else {
      params.delete('search');
    }
    router.push(`/shop?${params.toString()}`);
    fetchFilteredProducts();
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedRegion('');
    setSelectedCraft('');
    setSearchQuery('');
    router.push('/shop');
  };

  return (
    <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-8">
      {/* Catalog Header */}
      <div className="mb-12 text-center">
        <span className="text-primary font-semibold text-xs uppercase tracking-widest block">Collection Archive</span>
        <h1 className="font-display text-4xl md:text-5xl mt-2 font-light text-on-background">Shop Handcrafted Treasures</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-3 space-y-8 bg-secondary-container/20 p-6 rounded-xl border border-outline-variant/10 h-fit">
          <div className="flex justify-between items-center pb-4 border-b border-outline-variant/30">
            <h3 className="font-semibold text-xs uppercase tracking-widest text-primary">Filters</h3>
            <button onClick={clearFilters} className="text-xs text-secondary hover:text-primary transition-all underline">
              Clear All
            </button>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-secondary font-semibold">Search Catalog</label>
            <div className="relative flex items-center bg-white border border-outline-variant rounded-lg overflow-hidden px-3">
              <span className="material-symbols-outlined text-secondary text-lg">search</span>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none py-2.5 pl-2 text-sm focus:ring-0 outline-none font-sans"
              />
            </div>
          </form>

          {/* Category Filter */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-secondary font-semibold">Category</h4>
            <div className="flex flex-col space-y-2">
              {categories.map((cat) => (
                <label key={cat} className="flex items-center space-x-2.5 text-sm cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={selectedCategory === cat}
                    onChange={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
                    className="rounded border-outline text-primary focus:ring-primary w-4 h-4"
                  />
                  <span className={selectedCategory === cat ? 'text-primary font-medium' : 'text-on-surface-variant'}>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Region Filter */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-secondary font-semibold">Region</h4>
            <div className="flex flex-col space-y-2">
              {regions.map((reg) => (
                <label key={reg} className="flex items-center space-x-2.5 text-sm cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={selectedRegion === reg}
                    onChange={() => setSelectedRegion(selectedRegion === reg ? '' : reg)}
                    className="rounded border-outline text-primary focus:ring-primary w-4 h-4"
                  />
                  <span className={selectedRegion === reg ? 'text-primary font-medium' : 'text-on-surface-variant'}>{reg}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Craft Filter */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-secondary font-semibold">Craft Technique</h4>
            <div className="flex flex-col space-y-2">
              {crafts.map((cr) => (
                <label key={cr} className="flex items-center space-x-2.5 text-sm cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={selectedCraft === cr}
                    onChange={() => setSelectedCraft(selectedCraft === cr ? '' : cr)}
                    className="rounded border-outline text-primary focus:ring-primary w-4 h-4"
                  />
                  <span className={selectedCraft === cr ? 'text-primary font-medium' : 'text-on-surface-variant'}>{cr}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Catalog Grid */}
        <section className="lg:col-span-9">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-secondary-container/10 rounded-xl border border-dashed border-outline-variant/30">
              <span className="material-symbols-outlined text-5xl text-secondary">database_off</span>
              <p className="mt-4 text-secondary text-sm font-sans">No products found matching your search filters.</p>
              <button onClick={clearFilters} className="mt-4 bg-primary text-white px-6 py-2.5 rounded-lg text-xs uppercase tracking-widest font-semibold hover:opacity-90 transition-all">
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((product, idx) => (
                <motion.article
                  key={product.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="group bg-white p-4 rounded-xl shadow-[0px_4px_20px_rgba(85,107,47,0.04)] border border-outline-variant/10 hover:border-accent/30 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-secondary-container/10 mb-4">
                      <Image
                        alt={product.title}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-103 transition-transform duration-700"
                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c'}
                      />
                      {product.rating >= 4.9 && (
                        <div className="absolute top-3 right-3 bg-background/95 backdrop-blur-sm px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                          <span className="material-symbols-outlined text-[12px] text-accent" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          <span className="text-[9px] font-bold text-secondary">{product.rating}</span>
                        </div>
                      )}
                    </div>
                    
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-secondary block">
                      {product.artisan?.user?.name || product.artisanName || 'Elena Varga'}
                    </span>
                    <Link href={`/shop/${product.id}`} className="block mt-1">
                      <h3 className="font-display text-xl text-on-surface group-hover:text-primary transition-colors line-clamp-1 font-medium">
                        {product.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-on-surface-variant line-clamp-2 mt-1 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-outline-variant/10">
                    <span className="font-display text-lg font-medium">${product.price}</span>
                    <button
                      onClick={() => addItem(product)}
                      className="bg-primary/5 hover:bg-primary text-primary hover:text-white px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-widest font-semibold flex items-center transition-all cursor-pointer border border-primary/10"
                    >
                      Add +
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={<div className="text-center py-20 font-display text-lg">Loading Shop Catalog...</div>}>
      <ShopCatalog />
    </Suspense>
  );
}
