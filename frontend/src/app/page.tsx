'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store';

export default function Home() {
  const addItem = useCartStore((state) => state.addItem);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    // Fetch seed products from local NestJS backend
    fetch('http://localhost:4000/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        }
      })
      .catch((err) => {
        console.warn('Could not connect to NestJS backend, displaying fallback products.', err);
        // Fallback mockup products matching screens
        setProducts([
          {
            id: 'p1',
            title: 'Sienna Earth Vessel',
            description: 'Matte-finish pottery vessel shaped by Master Potter Kaviraj.',
            price: 150,
            images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuABcubTNztmfQLwaV9a0DHCTHAHeV48--PL01ObXgk0zE9VJtV3-GDe4m1Qb4MFK5fpo8JAm3f8NsAeiRClrvbWmldVB2eFzKHDg2BSNoHqoOUNLKj2pox36b6DGotHjILKI5Q3BO3qZlsM-kW2LOOvP2jClI9CawGaBtfLkZq5gQfF_dYbx2cvYDQD-tiJNnz3rLjNQF1KqZYjkDrclbbK20eQrfO25urHynErrY6NJnvZ_jZHmci9aEn4PawJL_dRP0bpO2jXtpc'],
            category: 'Vases',
            region: 'Rajasthan',
            craft: 'Pottery',
            artisanName: 'Master Potter Kaviraj',
          },
          {
            id: 'p2',
            title: 'Engraved Heirloom Box',
            description: 'Intricately hand-engraved brass storage container with a golden finish.',
            price: 240,
            images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuDigWYsguELBsQ0LWVQ7bKpDSZR7GQ-nFpPP6xjOn7hSyyUHheT9nQ_tvVQweJ4per136tPe-BQeK6K6kBJPXC0meWLU_4kvU6NHfjxJwBsjTdI293bpZpBhGEFbc8PidVddv-GljkwkLZfTNYgKDq90VXIHKzObOXrQ084pQwes6da2-RjDmXo83CfOiBzAQJFaeCZyMPM2cEc9oxBo3zM5E83BUC7e14oIMEyYmN_m0WsH5UYvMSgkbaBj4PIfTq_g1KcRR5bgm4'],
            category: 'Metal Crafts',
            region: 'Rajasthan',
            craft: 'Metal Crafts',
            artisanName: 'Heritage Brass Works',
          },
        ]);
      });
  }, []);

  return (
    <div className="space-y-24 pb-16">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop flex flex-col lg:flex-row items-center gap-12 pt-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:w-1/2 space-y-8"
        >
          <h1 className="font-display text-5xl md:text-7xl text-on-surface leading-tight font-light">
            Every Handmade Piece <br />
            Carries a <span className="italic text-primary font-serif">Story</span>
          </h1>
          <p className="font-sans text-secondary text-lg max-w-lg leading-relaxed">
            Discover authentic handcrafted treasures made by skilled artisans across the globe. Each creation is a testament to heritage, slow craftsmanship, and mindful luxury.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link href="/shop" className="bg-primary text-white px-8 py-4 rounded-lg font-medium hover:bg-primary/95 transition-all shadow-md active:scale-95 text-sm uppercase tracking-wider">
              Shop Collections
            </Link>
            <Link href="/concierge" className="border border-primary text-primary px-8 py-4 rounded-lg font-medium hover:bg-primary/5 transition-all active:scale-95 text-sm uppercase tracking-wider">
              Meet AI Concierge
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:w-1/2 relative grid grid-cols-12 grid-rows-6 gap-4 h-[450px] md:h-[600px] w-full"
        >
          <div className="col-span-7 row-span-4 rounded-xl overflow-hidden luxury-shadow relative">
            <Image
              alt="Artisan shaping clay"
              fill
              className="object-cover"
              src="https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=600"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          <div className="col-span-5 row-span-3 rounded-xl overflow-hidden luxury-shadow relative self-end h-[85%]">
            <Image
              alt="Indian textiles"
              fill
              className="object-cover"
              src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=400"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
          <div className="col-span-5 row-span-3 rounded-xl overflow-hidden luxury-shadow relative mt-4 h-[85%]">
            <Image
              alt="Handcrafted jewelry"
              fill
              className="object-cover"
              src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        </motion.div>
      </section>

      {/* Trust Badges */}
      <section className="bg-secondary-container/30 py-12 border-y border-outline-variant/20 w-full">
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
          <div className="flex flex-col items-center space-y-2">
            <span className="material-symbols-outlined text-primary text-3xl">verified</span>
            <p className="font-semibold text-xs uppercase tracking-widest text-on-surface">Handmade Verified</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <span className="material-symbols-outlined text-primary text-3xl">payments</span>
            <p className="font-semibold text-xs uppercase tracking-widest text-on-surface">Direct Earnings</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <span className="material-symbols-outlined text-primary text-3xl">public</span>
            <p className="font-semibold text-xs uppercase tracking-widest text-on-surface">Worldwide Shipping</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <span className="material-symbols-outlined text-primary text-3xl">lock</span>
            <p className="font-semibold text-xs uppercase tracking-widest text-on-surface">Secure Transactions</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <span className="material-symbols-outlined text-primary text-3xl">package_2</span>
            <p className="font-semibold text-xs uppercase tracking-widest text-on-surface">Eco-Friendly Pack</p>
          </div>
        </div>
      </section>

      {/* Browse by Craft */}
      <section className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-primary font-semibold text-xs uppercase tracking-widest block">Collections</span>
            <h2 className="font-display text-4xl mt-2 text-on-surface font-light">Browse by Craft</h2>
          </div>
          <Link href="/shop" className="text-primary font-semibold text-xs uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Link href="/shop?craft=Pottery" className="group text-center">
            <div className="aspect-square rounded-xl overflow-hidden mb-4 luxury-shadow bg-secondary-container/20 relative">
              <Image
                alt="Pottery"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                src="https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=300"
              />
            </div>
            <h3 className="font-display text-xl group-hover:text-primary transition-colors">Ceramic Pottery</h3>
          </Link>
          <Link href="/shop?craft=Textiles" className="group text-center">
            <div className="aspect-square rounded-xl overflow-hidden mb-4 luxury-shadow bg-secondary-container/20 relative">
              <Image
                alt="Textiles"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                src="https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=300"
              />
            </div>
            <h3 className="font-display text-xl group-hover:text-primary transition-colors">Textiles & Weaves</h3>
          </Link>
          <Link href="/shop?craft=Woodwork" className="group text-center">
            <div className="aspect-square rounded-xl overflow-hidden mb-4 luxury-shadow bg-secondary-container/20 relative">
              <Image
                alt="Woodwork"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                src="https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=300"
              />
            </div>
            <h3 className="font-display text-xl group-hover:text-primary transition-colors">Sculptural Wood</h3>
          </Link>
          <Link href="/shop?craft=Metal" className="group text-center">
            <div className="aspect-square rounded-xl overflow-hidden mb-4 luxury-shadow bg-secondary-container/20 relative">
              <Image
                alt="Metal crafts"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                src="https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=300"
              />
            </div>
            <h3 className="font-display text-xl group-hover:text-primary transition-colors">Heirloom Metal</h3>
          </Link>
        </div>
      </section>

      {/* Bento Grid Heritage Regions */}
      <section className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="mb-12 text-center">
          <span className="text-primary font-semibold text-xs uppercase tracking-widest block">Heritage Journeys</span>
          <h2 className="font-display text-4xl mt-2 text-on-surface font-light">Explore by Region</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-[850px] md:h-[600px]">
          <Link href="/shop?region=Rajasthan" className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-xl luxury-shadow">
            <Image
              alt="Rajasthan"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              src="https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=600"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
            <div className="absolute bottom-8 left-8">
              <h3 className="text-white font-display text-3xl font-light">Rajasthan</h3>
              <p className="text-white/80 font-sans text-xs uppercase tracking-widest mt-1">Earthy Pottery & Block Prints</p>
            </div>
          </Link>
          <Link href="/shop?region=Kashmir" className="md:col-span-2 relative group overflow-hidden rounded-xl luxury-shadow">
            <Image
              alt="Kashmir"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              src="https://images.unsplash.com/photo-1566228015668-4c45dbc4e2f5?q=80&w=600"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
            <div className="absolute bottom-6 left-6">
              <h3 className="text-white font-display text-2xl font-light">Kashmir</h3>
              <p className="text-white/80 font-sans text-xs uppercase tracking-widest mt-1">Pure Pashminas & Woodcarving</p>
            </div>
          </Link>
          <Link href="/shop?region=Gujarat" className="relative group overflow-hidden rounded-xl luxury-shadow">
            <Image
              alt="Gujarat"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              src="https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
            <div className="absolute bottom-6 left-6">
              <h3 className="text-white font-display text-2xl font-light">Gujarat</h3>
              <p className="text-white/80 font-sans text-xs uppercase tracking-widest mt-1">Intricate Needlework</p>
            </div>
          </Link>
          <Link href="/shop?region=West Bengal" className="relative group overflow-hidden rounded-xl luxury-shadow">
            <Image
              alt="West Bengal"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              src="https://images.unsplash.com/photo-1590055531615-f16d36ffa8ec?q=80&w=300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
            <div className="absolute bottom-6 left-6">
              <h3 className="text-white font-display text-2xl font-light">West Bengal</h3>
              <p className="text-white/80 font-sans text-xs uppercase tracking-widest mt-1">Terracotta & Handlooms</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Trending Catalog items */}
      <section className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="flex justify-between items-end mb-12">
          <h2 className="font-display text-4xl text-on-surface font-light">Trending Catalog</h2>
          <Link href="/shop" className="text-primary font-semibold text-xs uppercase tracking-widest">
            Shop Catalog
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.slice(0, 2).map((product) => (
            <div key={product.id} className="bg-white border border-outline-variant/20 rounded-xl overflow-hidden group luxury-shadow flex flex-col">
              <div className="relative h-72 overflow-hidden bg-secondary-container/10">
                <Image
                  alt={product.title}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-102 transition-transform duration-700"
                  src={product.images?.[0] || 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c'}
                />
                <span className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary rounded-full">
                  {product.region}
                </span>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <span className="text-xs uppercase tracking-widest text-secondary font-semibold">
                    {product.artisanName || 'Elena Varga'}
                  </span>
                  <Link href={`/shop/${product.id}`} className="block mt-1">
                    <h3 className="font-display text-2xl text-on-surface group-hover:text-primary transition-colors font-medium">
                      {product.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-secondary line-clamp-2 mt-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-outline-variant/10">
                  <span className="text-lg font-medium text-on-surface font-display">${product.price}</span>
                  <button
                    onClick={() => addItem(product)}
                    className="text-primary font-bold text-xs uppercase tracking-widest flex items-center hover:text-secondary cursor-pointer border border-primary/20 px-3 py-1.5 rounded-lg hover:border-primary transition-all"
                  >
                    Add to Bag <span className="material-symbols-outlined ml-1 text-sm">add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Artisan Spotlight Banner */}
      <section className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="bg-primary-container rounded-xl overflow-hidden flex flex-col lg:flex-row items-stretch">
          <div className="lg:w-1/2 p-12 md:p-20 space-y-8 flex flex-col justify-center text-white">
            <span className="text-accent font-semibold text-xs uppercase tracking-widest">Artisan Spotlight</span>
            <h2 className="font-display text-4xl md:text-5xl leading-tight font-light italic">
              Rameshwar Lal: <br />The Soul of Terracotta
            </h2>
            <p className="text-white/80 text-sm leading-relaxed max-w-md">
              &ldquo;The earth tells me what it wants to become. I am simply the hands that listen.&rdquo; Rameshwar has been practicing the traditional art of Molela terracotta plaques for over 45 years in rural Rajasthan, molding tales of folklore and mythology.
            </p>
            <div>
              <Link href="/shop?region=Rajasthan" className="inline-block bg-accent text-primary-container px-8 py-3.5 rounded-lg font-semibold text-xs uppercase tracking-widest hover:opacity-90 transition-all">
                Explore His Crafts
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 min-h-[350px] relative">
            <Image
              alt="Elderly artisan portrait"
              fill
              className="object-cover"
              src="https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600"
            />
          </div>
        </div>
      </section>

      {/* Stories in Motion (Cinematic Section) */}
      <section className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop text-center">
        <div className="mb-12">
          <h2 className="font-display text-4xl text-on-surface font-light">Stories in Motion</h2>
          <p className="text-secondary text-sm max-w-xl mx-auto mt-3">
            Witness the meticulous process behind your favorite pieces through our cinematic artisan documentary shorts.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group relative aspect-video rounded-xl overflow-hidden luxury-shadow cursor-pointer">
            <Image
              alt="Loom weaving film"
              fill
              className="object-cover"
              src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=350"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-5xl opacity-80 group-hover:scale-110 transition-transform">
                play_circle
              </span>
            </div>
            <div className="absolute bottom-6 left-6 text-left text-white">
              <p className="font-semibold text-xs uppercase tracking-widest text-accent">The Loom&apos;s Song</p>
              <p className="text-[10px] opacity-75 mt-0.5">Rajasthan • 4:20 mins</p>
            </div>
          </div>
          <div className="group relative aspect-video rounded-xl overflow-hidden luxury-shadow cursor-pointer">
            <Image
              alt="Pottery spinning wheel"
              fill
              className="object-cover"
              src="https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=350"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-5xl opacity-80 group-hover:scale-110 transition-transform">
                play_circle
              </span>
            </div>
            <div className="absolute bottom-6 left-6 text-left text-white">
              <p className="font-semibold text-xs uppercase tracking-widest text-accent">Echoes of Earth</p>
              <p className="text-[10px] opacity-75 mt-0.5">Gujarat • 3:15 mins</p>
            </div>
          </div>
          <div className="group relative aspect-video rounded-xl overflow-hidden luxury-shadow cursor-pointer">
            <Image
              alt="Metal engraving desk"
              fill
              className="object-cover"
              src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=350"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-5xl opacity-80 group-hover:scale-110 transition-transform">
                play_circle
              </span>
            </div>
            <div className="absolute bottom-6 left-6 text-left text-white">
              <p className="font-semibold text-xs uppercase tracking-widest text-accent">Golden Threads</p>
              <p className="text-[10px] opacity-75 mt-0.5">Kashmir • 5:45 mins</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
