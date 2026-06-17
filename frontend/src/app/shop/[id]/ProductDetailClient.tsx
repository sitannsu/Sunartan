'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore, useCartStore, formatPrice } from '@/store';
import { motion } from 'framer-motion';

export default function ProductDetailClient({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const currency = useCartStore((state) => state.currency);
  const { user, token } = useAuthStore();
  
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(null);
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewMessage, setReviewMessage] = useState('');

  useEffect(() => {
    params.then((res) => {
      let productId = res.id;
      if (productId === 'placeholder' && typeof window !== 'undefined') {
        const parts = window.location.pathname.split('/');
        const lastPart = parts[parts.length - 1];
        if (lastPart && lastPart !== 'placeholder') {
          productId = lastPart;
        }
      }
      setUnwrappedParams({ id: productId });
    });
  }, [params]);

  const fetchProduct = () => {
    if (!unwrappedParams) return;
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.sunartn.com/api'}/products/${unwrappedParams.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.id) {
          setProduct(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching product detail:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProduct();
  }, [unwrappedParams]);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unwrappedParams || !token) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.sunartn.com/api'}/products/${unwrappedParams.id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });
      const data = await response.json();
      if (response.ok) {
        setReviewMessage('Thank you! Review added successfully.');
        setComment('');
        fetchProduct(); // Reload product reviews
      } else {
        setReviewMessage(data.message || 'Failed to submit review.');
      }
    } catch (err) {
      setReviewMessage('Network error submitting review.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-20 text-center">
        <span className="material-symbols-outlined text-5xl text-secondary">error</span>
        <p className="mt-4 text-secondary text-sm">Product details could not be found or connection failed.</p>
        <Link href="/shop" className="mt-6 inline-block bg-primary text-white px-8 py-3 rounded-lg text-xs uppercase tracking-widest font-semibold">
          Back to Shop Catalog
        </Link>
      </div>
    );
  }

  const mainImage = product.images?.[0] || 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c';

  return (
    <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-8 space-y-16">
      {/* Product Information block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Gallery */}
        <div className="lg:col-span-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative aspect-[4/5] rounded-xl overflow-hidden luxury-shadow bg-secondary-container/10"
          >
            <Image
              alt={product.title}
              fill
              unoptimized
              className="object-cover"
              src={mainImage}
              priority
            />
          </motion.div>
        </div>

        {/* Text descriptions */}
        <div className="lg:col-span-6 space-y-6 lg:pl-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-primary font-semibold text-xs uppercase tracking-widest">
                {product.region} • {product.craft}
              </span>
              {product.rating > 0 && (
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-accent" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="text-sm font-semibold text-on-surface">{product.rating} / 5</span>
                </div>
              )}
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-light text-on-surface leading-tight">
              {product.title}
            </h1>
            <p className="text-xs uppercase tracking-widest text-secondary font-semibold">
              Crafted by <Link href={`/shop?search=${product.artisan?.user?.name}`} className="text-primary hover:underline">{product.artisan?.user?.name || 'Elena Varga'}</Link>
            </p>
          </div>

          <div className="border-y border-outline-variant/30 py-4">
             <span className="font-display text-3xl font-medium text-primary">{formatPrice(product.price, currency)}</span>
            <p className="text-xs text-secondary mt-1">Free global shipping, secure checkout options.</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-secondary font-semibold">The Story Behind the Creation</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed font-sans">
              {product.description}
            </p>
          </div>

          <div className="pt-4 flex flex-col gap-4">
            <button
              onClick={() => addItem(product)}
              className="w-full bg-primary text-white py-4 rounded-lg font-medium hover:bg-primary/95 transition-all text-xs uppercase tracking-widest font-semibold shadow-md active:scale-[0.98] cursor-pointer"
            >
              Add to Shopping Bag
            </button>
            <Link
              href="/concierge"
              className="w-full border border-primary text-primary py-4 rounded-lg font-medium hover:bg-primary/5 transition-all text-xs uppercase tracking-widest font-semibold flex justify-center items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">auto_awesome</span> Ask AI Concierge about sizing
            </Link>
          </div>
        </div>
      </div>

      {/* Artisan Profile Details */}
      {product.artisan && (
        <div className="bg-secondary-container/20 p-8 rounded-xl border border-outline-variant/10 flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-6 items-center text-center md:text-left">
            <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-primary ring-offset-4 ring-offset-background relative">
              <Image
                alt={product.artisan.user.name}
                fill
                className="object-cover"
                src={product.artisan.avatarUrl || 'https://images.unsplash.com/photo-1544816155-12df9643f363'}
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Master Artisan</span>
              <h3 className="font-display text-2xl text-on-surface">{product.artisan.user.name}</h3>
              <p className="text-xs text-secondary font-sans leading-relaxed max-w-lg">
                &ldquo;{product.artisan.bio}&rdquo;
              </p>
            </div>
          </div>
          <Link
            href={`/shop?region=${product.artisan.region}`}
            className="px-6 py-3 border border-primary text-primary hover:bg-primary/5 font-semibold text-xs uppercase tracking-widest whitespace-nowrap rounded-lg transition-all"
          >
            Explore Studio
          </Link>
        </div>
      )}

      {/* Reviews Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8 border-t border-outline-variant/20">
        {/* Reviews List */}
        <div className="lg:col-span-7 space-y-8">
          <h3 className="font-display text-3xl font-light text-on-surface">Collector Reviews</h3>
          {(!product.reviews || product.reviews.length === 0) ? (
            <p className="text-sm text-secondary italic">No reviews have been written for this craft yet.</p>
          ) : (
            <div className="space-y-6">
              {product.reviews.map((rev: any) => (
                <div key={rev.id} className="border-b border-outline-variant/10 pb-6 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-semibold text-on-surface">{rev.user.name}</h4>
                    <div className="flex gap-0.5">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <span key={i} className="material-symbols-outlined text-accent text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-secondary leading-relaxed italic">&ldquo;{rev.comment}&rdquo;</p>
                  <p className="text-[10px] text-on-surface-variant font-medium">
                    {new Date(rev.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Review Form */}
        <div className="lg:col-span-5 bg-background p-6 rounded-xl border border-outline-variant/20 h-fit space-y-4">
          <h3 className="font-display text-2xl text-on-surface">Write a Review</h3>
          {user && user.role === 'CUSTOMER' ? (
            <form onSubmit={handleAddReview} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-secondary font-semibold block">Select Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform active:scale-95"
                    >
                      <span
                        className="material-symbols-outlined text-2xl cursor-pointer"
                        style={{
                          color: star <= rating ? '#D4AF37' : '#c5c8b8',
                          fontVariationSettings: star <= rating ? "'FILL' 1" : "'FILL' 0",
                        }}
                      >
                        star
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-secondary font-semibold block">Your Comment</label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details of your acquisition..."
                  className="w-full p-3 border border-outline-variant rounded-lg text-sm bg-white focus:ring-1 focus:ring-primary focus:border-primary outline-none font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-lg text-xs uppercase tracking-widest font-semibold hover:opacity-90 transition-all cursor-pointer"
              >
                Submit Review
              </button>

              {reviewMessage && (
                <p className="text-xs text-primary font-medium mt-2">{reviewMessage}</p>
              )}
            </form>
          ) : user ? (
            <p className="text-xs text-secondary italic">Only customer collector accounts can write reviews.</p>
          ) : (
            <p className="text-xs text-secondary italic">
              Please <Link href="/auth" className="text-primary underline font-semibold">Sign In</Link> to write a collector review.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
