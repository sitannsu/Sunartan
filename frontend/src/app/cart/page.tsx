'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store';
import { motion } from 'framer-motion';

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotalAmount } = useCartStore();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Avoid hydration mismatch by syncing total on client mount
    setTotal(getTotalAmount());
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-20 text-center space-y-6">
        <span className="material-symbols-outlined text-6xl text-secondary">shopping_cart_off</span>
        <h1 className="font-display text-3xl font-light text-on-surface">Your Collection is Empty</h1>
        <p className="text-secondary text-sm max-w-sm mx-auto font-sans">
          You haven&apos;t added any handcrafted acquisitions to your basket yet. Explore our curated collections to start your journey.
        </p>
        <div>
          <Link href="/shop" className="bg-primary text-white px-8 py-3.5 rounded-lg text-xs uppercase tracking-widest font-semibold inline-block hover:opacity-95 transition-all">
            Browse Crafts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-8">
      <div className="mb-12">
        <span className="text-primary font-semibold text-xs uppercase tracking-widest block">Acquisition Cart</span>
        <h1 className="font-display text-4xl mt-2 font-light text-on-background">Your Collection Basket</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-6">
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              className="flex flex-col md:flex-row gap-6 p-4 bg-white border border-outline-variant/20 rounded-xl luxury-shadow relative items-center justify-between"
            >
              <div className="flex flex-col md:flex-row gap-4 items-center w-full">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-secondary-container/10">
                  <Image
                    alt={item.title}
                    fill
                    className="object-cover"
                    src={item.image}
                  />
                </div>
                
                <div className="space-y-1 text-center md:text-left">
                  <span className="text-[10px] font-bold text-accent uppercase tracking-widest block">
                    {item.artisanName}
                  </span>
                  <Link href={`/shop/${item.id}`} className="font-display text-lg text-on-surface font-semibold hover:text-primary transition-colors">
                    {item.title}
                  </Link>
                  <p className="text-sm font-medium text-primary">${item.price}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 justify-between w-full md:w-auto pt-4 md:pt-0 border-t border-outline-variant/10 md:border-none">
                {/* Quantity Controller */}
                <div className="flex items-center border border-outline-variant rounded-lg bg-background overflow-hidden">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-3 py-1.5 hover:bg-secondary-container/20 text-on-surface-variant font-bold text-xs"
                  >
                    -
                  </button>
                  <span className="px-4 text-xs font-semibold font-sans">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1.5 hover:bg-secondary-container/20 text-on-surface-variant font-bold text-xs"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal */}
                <span className="font-display font-medium text-lg text-on-surface w-20 text-right">
                  ${item.price * item.quantity}
                </span>

                {/* Remove item button */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Order Summary Block */}
        <div className="lg:col-span-4 bg-secondary-container/20 p-6 rounded-xl border border-outline-variant/10 space-y-6">
          <h3 className="font-semibold text-xs uppercase tracking-widest text-primary pb-3 border-b border-outline-variant/30">
            Order Summary
          </h3>
          
          <div className="space-y-4 font-sans text-sm">
            <div className="flex justify-between text-secondary">
              <span>Subtotal</span>
              <span className="font-medium text-on-surface">${total}</span>
            </div>
            <div className="flex justify-between text-secondary">
              <span>Shipping</span>
              <span className="text-primary font-medium">Complimentary</span>
            </div>
            <div className="border-t border-outline-variant/20 pt-4 flex justify-between font-display text-xl font-bold">
              <span className="text-on-surface">Total</span>
              <span className="text-primary">${total}</span>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <Link
              href="/checkout"
              className="w-full bg-primary text-white py-4 rounded-lg font-medium hover:bg-primary/95 transition-all text-xs uppercase tracking-widest font-semibold shadow-md inline-block text-center cursor-pointer"
            >
              Complete Your Acquisition
            </Link>
            <Link
              href="/shop"
              className="w-full border border-primary text-primary py-3.5 rounded-lg font-medium hover:bg-primary/5 transition-all text-xs uppercase tracking-widest font-semibold inline-block text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
