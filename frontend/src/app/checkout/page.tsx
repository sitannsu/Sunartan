'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore, useCartStore } from '@/store';
import { motion } from 'framer-motion';

export default function Checkout() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const { items, getTotalAmount, clearCart } = useCartStore();
  
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'STRIPE' | 'RAZORPAY' | 'MOCK'>('MOCK');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(getTotalAmount());
    
    // Redirect if no items in cart
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items]);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setErrorMessage('You must be signed in to complete an acquisition.');
      router.push('/auth?redirect=checkout');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const orderItems = items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      const response = await fetch('http://localhost:4000/api/orders/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shippingAddress,
          paymentMethod,
          items: orderItems,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Checkout failed.');
      }

      // Handle payment redirection
      if (paymentMethod === 'STRIPE' && data.paymentDetails?.url) {
        clearCart();
        window.location.href = data.paymentDetails.url;
      } else if (paymentMethod === 'RAZORPAY') {
        // Trigger simulated Razorpay flow
        clearCart();
        router.push(`/checkout/success?order_id=${data.order.id}&payment_id=${data.paymentDetails.id}`);
      } else {
        // Mock payment flow
        clearCart();
        router.push(`/checkout/success?order_id=${data.order.id}`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to initialize payment.');
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-outline-variant/30 rounded-xl luxury-shadow text-center space-y-6">
        <span className="material-symbols-outlined text-5xl text-primary">account_circle</span>
        <h2 className="font-display text-2xl font-light">Sign In Required</h2>
        <p className="text-secondary text-sm font-sans">
          To complete your artisan acquisitions, please sign in or register a collector profile.
        </p>
        <Link
          href="/auth?redirect=checkout"
          className="w-full bg-primary text-white py-3.5 rounded-lg text-xs uppercase tracking-widest font-semibold block hover:opacity-95 transition-all"
        >
          Sign In / Register
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-8">
      <div className="mb-12">
        <span className="text-primary font-semibold text-xs uppercase tracking-widest block">Checkout Portal</span>
        <h1 className="font-display text-4xl mt-2 font-light text-on-background">Complete Your Acquisition</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Shipping Form */}
        <form onSubmit={handleCheckoutSubmit} className="lg:col-span-7 space-y-8 bg-white p-8 border border-outline-variant/10 rounded-xl luxury-shadow">
          <h3 className="font-display text-2xl font-light text-on-surface">Acquisition Details</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-secondary font-semibold block">Shipping Address</label>
              <textarea
                required
                rows={3}
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Enter complete shipping destination address..."
                className="w-full p-3 border border-outline-variant rounded-lg text-sm bg-white focus:ring-1 focus:ring-primary focus:border-primary outline-none font-sans"
              />
            </div>

            {/* Payment Selection */}
            <div className="space-y-3 pt-4">
              <label className="text-xs uppercase tracking-widest text-secondary font-semibold block">Payment Provider</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer select-none transition-all ${
                  paymentMethod === 'MOCK' ? 'border-primary bg-primary-container/5' : 'border-outline-variant hover:border-primary/50'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="MOCK"
                    checked={paymentMethod === 'MOCK'}
                    onChange={() => setPaymentMethod('MOCK')}
                    className="sr-only"
                  />
                  <span className="material-symbols-outlined text-2xl text-primary">payments</span>
                  <span className="text-xs font-semibold uppercase tracking-widest mt-2">Mock Pay</span>
                  <span className="text-[10px] text-secondary mt-1">Simulated flow</span>
                </label>

                <label className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer select-none transition-all ${
                  paymentMethod === 'STRIPE' ? 'border-primary bg-primary-container/5' : 'border-outline-variant hover:border-primary/50'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="STRIPE"
                    checked={paymentMethod === 'STRIPE'}
                    onChange={() => setPaymentMethod('STRIPE')}
                    className="sr-only"
                  />
                  <span className="material-symbols-outlined text-2xl text-primary">credit_card</span>
                  <span className="text-xs font-semibold uppercase tracking-widest mt-2">Stripe</span>
                  <span className="text-[10px] text-secondary mt-1">Cards & Wallets</span>
                </label>

                <label className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer select-none transition-all ${
                  paymentMethod === 'RAZORPAY' ? 'border-primary bg-primary-container/5' : 'border-outline-variant hover:border-primary/50'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="RAZORPAY"
                    checked={paymentMethod === 'RAZORPAY'}
                    onChange={() => setPaymentMethod('RAZORPAY')}
                    className="sr-only"
                  />
                  <span className="material-symbols-outlined text-2xl text-primary">currency_rupee</span>
                  <span className="text-xs font-semibold uppercase tracking-widest mt-2">Razorpay</span>
                  <span className="text-[10px] text-secondary mt-1">India Payments</span>
                </label>
              </div>
            </div>
          </div>

          {errorMessage && (
            <p className="text-xs text-primary font-medium">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-lg font-medium hover:bg-primary/95 transition-all text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
          >
            {loading ? (
              <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
            ) : (
              'Confirm Order & Pay'
            )}
          </button>
        </form>

        {/* Cart Item Summary */}
        <div className="lg:col-span-5 bg-secondary-container/20 p-8 rounded-xl border border-outline-variant/10 space-y-6">
          <h3 className="font-semibold text-xs uppercase tracking-widest text-primary pb-3 border-b border-outline-variant/30">
            Acquisition Summary
          </h3>

          <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 items-center">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white border">
                  <Image
                    alt={item.title}
                    fill
                    className="object-cover"
                    src={item.image}
                  />
                </div>
                <div className="flex-grow">
                  <h4 className="font-display text-sm font-semibold leading-tight">{item.title}</h4>
                  <p className="text-[10px] text-secondary mt-0.5">Qty: {item.quantity}</p>
                </div>
                <span className="font-display font-medium text-sm text-primary">
                  ${item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-outline-variant/20 pt-4 space-y-4">
            <div className="flex justify-between text-sm text-secondary font-sans">
              <span>Delivery Cost</span>
              <span className="text-primary font-medium">Complimentary</span>
            </div>
            <div className="flex justify-between font-display text-xl font-bold border-t border-outline-variant/10 pt-4">
              <span>Total Price</span>
              <span className="text-primary">${total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
