'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore, useCartStore, formatPrice } from '@/store';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  sender: 'USER' | 'AI';
  text: string;
  recommendedProducts?: any[];
  createdAt: Date;
}

export default function Concierge() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const addItem = useCartStore((state) => state.addItem);
  const currency = useCartStore((state) => state.currency);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendedSideList, setRecommendedSideList] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize conversation and fetch history
  useEffect(() => {
    if (!token) {
      // Direct unauthorized users to auth
      router.push('/auth?redirect=concierge');
      return;
    }

    // Load initial conversation from NestJS backend
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.sunartn.com/api'}/ai/conversation`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.messages)) {
          if (data.messages.length === 0) {
            // Empty conversation from backend, initialize with greeting matching Screens mockup
            const greeting: Message = {
              id: 'g1',
              sender: 'AI',
              text: 'Welcome to the Sunartn Digital Concierge. A dining room is the heart of slow living. For earth tones that bridge the gap between soil and stone, I recommend looking towards the textured stoneware and hand-fired vessels. I\'ve curated a few pieces that speak to that raw, organic silhouette you\'re describing.',
              recommendedProducts: [
                {
                  id: 'p1',
                  title: 'Umber Earth Bowl',
                  description: 'Hand-fired terracotta centerpiece bowl with a matte reduction glaze.',
                  price: 340,
                  images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuB8KWwq2AoBngRwk0_31NrPEIiFH2tJCh-Pmmp7aO7dnUw0Q8rswFDGoaPsg-I6-09Xhl50ia5iIcq6eg-n0iRMyrCdRs3YqYhFvwjqZw2mG19qReD6UPRa6BtDoIkhqrTQ-NaEDjA3I0LPsJyf7jpa2M8mWMl4ZGVr90frlrSitTagGUViuwAZaQrcSU1KnmESKGRD4ScGWEpjoRZCFgpJBsEp1OHIriCd5C1ibtF5uAzN0B-VWvGAoboGuzc2_8-7nYPvjsgRomo'],
                  artisanName: 'Elena Varga',
                },
                {
                  id: 'p2',
                  title: 'Ochre Horizon Vessel',
                  description: 'Sculptural minimal clay vessel featuring sand-infused gradient finish.',
                  price: 520,
                  images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuApLdVRWT91TBj3t1ixezSR9uU0G2vRG4w-Bx_ISZNnBHUb8ytjGcTvT6MwMNSqD7_Xqvn0vcijv_4YyQkeMkA6ptoQ-bDi930jZi1atDZJkUxlvmNhlc4eGmDsBdHfFJLm8E-D7vYB4Kn8etTzTt-CNENr3RhFPxqars1WIpIBiQAPONV_9mhIZXe-TTRhlzsiDYCDPKk1_S2CM89N-t-9HfPnsd9cqdR-RqYBZAVoXK9WkkxMpM9d9y6z2xLnVL2NEZ_X5KToIGI'],
                  artisanName: 'Studio Arhos',
                },
              ],
              createdAt: new Date(),
            };
            setMessages([greeting]);
            setRecommendedSideList(greeting.recommendedProducts || []);
          } else {
            const formatted = data.messages.map((m: any) => ({
              id: m.id,
              sender: m.sender as 'USER' | 'AI',
              text: m.text,
              recommendedProducts: m.recommendedJson ? JSON.parse(m.recommendedJson) : undefined,
              createdAt: new Date(m.createdAt),
            }));
            setMessages(formatted);
            
            // Set side recommended list to the latest AI recommendations
            const aiMsgs = formatted.filter((m: any) => m.sender === 'AI' && m.recommendedProducts);
            if (aiMsgs.length > 0) {
              setRecommendedSideList(aiMsgs[aiMsgs.length - 1].recommendedProducts);
            }
          }
        }
      })
      .catch((err) => {
        console.warn('Could not load chat history from backend, initializing empty conversation.', err);
        // Fallback initial chat greeting matching Screens mockup
        const greeting: Message = {
          id: 'g1',
          sender: 'AI',
          text: 'Welcome to the Sunartn Digital Concierge. A dining room is the heart of slow living. For earth tones that bridge the gap between soil and stone, I recommend looking towards the textured stoneware and hand-fired vessels. I\'ve curated a few pieces that speak to that raw, organic silhouette you\'re describing.',
          recommendedProducts: [
            {
              id: 'p1',
              title: 'Umber Earth Bowl',
              description: 'Hand-fired terracotta centerpiece bowl with a matte reduction glaze.',
              price: 340,
              images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuB8KWwq2AoBngRwk0_31NrPEIiFH2tJCh-Pmmp7aO7dnUw0Q8rswFDGoaPsg-I6-09Xhl50ia5iIcq6eg-n0iRMyrCdRs3YqYhFvwjqZw2mG19qReD6UPRa6BtDoIkhqrTQ-NaEDjA3I0LPsJyf7jpa2M8mWMl4ZGVr90frlrSitTagGUViuwAZaQrcSU1KnmESKGRD4ScGWEpjoRZCFgpJBsEp1OHIriCd5C1ibtF5uAzN0B-VWvGAoboGuzc2_8-7nYPvjsgRomo'],
              artisanName: 'Elena Varga',
            },
            {
              id: 'p2',
              title: 'Ochre Horizon Vessel',
              description: 'Sculptural minimal clay vessel featuring sand-infused gradient finish.',
              price: 520,
              images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuApLdVRWT91TBj3t1ixezSR9uU0G2vRG4w-Bx_ISZNnBHUb8ytjGcTvT6MwMNSqD7_Xqvn0vcijv_4YyQkeMkA6ptoQ-bDi930jZi1atDZJkUxlvmNhlc4eGmDsBdHfFJLm8E-D7vYB4Kn8etTzTt-CNENr3RhFPxqars1WIpIBiQAPONV_9mhIZXe-TTRhlzsiDYCDPKk1_S2CM89N-t-9HfPnsd9cqdR-RqYBZAVoXK9WkkxMpM9d9y6z2xLnVL2NEZ_X5KToIGI'],
              artisanName: 'Studio Arhos',
            },
          ],
          createdAt: new Date(),
        };
        setMessages([greeting]);
        setRecommendedSideList(greeting.recommendedProducts || []);
      });
  }, [token]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !token) return;
    
    // Add user message locally
    const userMsg: Message = {
      id: `u_${Date.now()}`,
      sender: 'USER',
      text,
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.sunartn.com/api'}/ai/consult`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      
      if (response.ok) {
        const aiMsg: Message = {
          id: `ai_${Date.now()}`,
          sender: 'AI',
          text: data.text,
          recommendedProducts: data.products,
          createdAt: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
        if (Array.isArray(data.products) && data.products.length > 0) {
          setRecommendedSideList(data.products);
        }
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-6 h-[calc(100vh-160px)] flex flex-col justify-between">
      {/* Header telemetry info */}
      <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20 mb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-2xl font-light text-primary">Artisan Concierge</h1>
          <div className="flex items-center gap-1.5 bg-primary-container/10 px-3 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
            <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Consultation Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow overflow-hidden min-h-0">
        {/* Chat Thread Panel */}
        <section className="lg:col-span-5 flex flex-col justify-between h-full bg-white rounded-xl border border-outline-variant/10 luxury-shadow p-6 overflow-hidden min-h-0">
          <div className="flex-grow overflow-y-auto no-scrollbar pr-2 space-y-6 min-h-0">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'USER' ? 'items-end' : 'items-start'}`}
              >
                {msg.sender === 'USER' ? (
                  <div className="bg-secondary-container/30 p-5 rounded-lg max-w-[90%] shadow-sm border border-outline-variant/5">
                    <p className="text-sm text-on-surface font-sans leading-relaxed">{msg.text}</p>
                  </div>
                ) : (
                  <div className="concierge-border pl-5 py-1 max-w-[95%]">
                    <p className="font-display text-lg text-primary italic leading-relaxed">
                      {msg.text}
                    </p>
                  </div>
                )}
                <span className="text-[9px] uppercase tracking-widest text-secondary mt-1.5 font-semibold">
                  {msg.sender === 'USER' ? 'You' : 'Concierge AI'} • {msg.createdAt.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 pl-5">
                <span className="material-symbols-outlined text-primary text-xl animate-spin">progress_activity</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Concierge is writing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick chip links & Form Input */}
          <div className="border-t border-outline-variant/20 pt-4 flex-shrink-0 space-y-4">
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              <button
                onClick={() => handleSuggestionClick('Show me hand-woven indigo textiles')}
                className="px-3.5 py-1.5 rounded-full border border-outline-variant text-[10px] font-bold uppercase tracking-wider text-secondary hover:border-primary hover:text-primary transition-all whitespace-nowrap bg-background cursor-pointer"
              >
                Indigo Textiles
              </button>
              <button
                onClick={() => handleSuggestionClick('Are there Kashmiri Pashmina stoles?')}
                className="px-3.5 py-1.5 rounded-full border border-outline-variant text-[10px] font-bold uppercase tracking-wider text-secondary hover:border-primary hover:text-primary transition-all whitespace-nowrap bg-background cursor-pointer"
              >
                Kashmir Pashminas
              </button>
              <button
                onClick={() => handleSuggestionClick('What shipping options do we have?')}
                className="px-3.5 py-1.5 rounded-full border border-outline-variant text-[10px] font-bold uppercase tracking-wider text-secondary hover:border-primary hover:text-primary transition-all whitespace-nowrap bg-background cursor-pointer"
              >
                Shipping Policy
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="relative flex items-center w-full"
            >
              <input
                type="text"
                placeholder="Ask the Concierge..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full bg-transparent border-t-0 border-x-0 border-b border-primary/50 py-3.5 px-2 focus:ring-0 focus:border-primary font-display text-sm italic placeholder:text-secondary/50 outline-none transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 material-symbols-outlined text-primary hover:text-accent transition-colors cursor-pointer bg-primary-container/10 p-1.5 rounded-full"
              >
                arrow_upward
              </button>
            </form>
          </div>
        </section>

        {/* Product Recommendations Grid Panel */}
        <section className="lg:col-span-7 flex flex-col justify-between h-full bg-secondary-container/10 border border-outline-variant/10 rounded-xl p-6 overflow-hidden min-h-0">
          <div className="pb-3 border-b border-outline-variant/20 flex justify-between items-center flex-shrink-0">
            <h3 className="font-display text-xl text-primary font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-accent text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              Recommended Acquisitions
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">
              {recommendedSideList.length} items curated
            </span>
          </div>

          <div className="flex-grow overflow-y-auto no-scrollbar pr-1 py-4 min-h-0">
            {recommendedSideList.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-secondary">
                <span className="material-symbols-outlined text-4xl mb-2">curator</span>
                <p className="text-xs font-sans">AI Concierge has not selected any items yet. Type a query like &ldquo;ceramics&rdquo; to begin.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendedSideList.map((item, idx) => (
                  <motion.article
                    key={item.id || idx}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white p-5 rounded-xl border border-outline-variant/10 hover:border-accent/30 transition-all flex flex-col justify-between shadow-[0px_4px_25px_rgba(85,107,47,0.03)]"
                  >
                    <div>
                      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-secondary-container/10 mb-4">
                        <Image
                          alt={item.title}
                          fill
                          className="object-cover"
                          src={item.images?.[0] || item.image || 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c'}
                        />
                        <div className="absolute top-3 right-3 bg-background/95 backdrop-blur-sm px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                          <span className="material-symbols-outlined text-[12px] text-accent" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                          <span className="text-[9px] font-bold uppercase text-secondary">Choice</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-secondary block">
                        {item.artisanName || item.artisan?.user?.name || 'Elena Varga'}
                      </span>
                      <h4 className="font-display text-xl mt-1 text-on-surface leading-tight font-semibold">
                        {item.title}
                      </h4>
                      <p className="text-xs text-on-surface-variant line-clamp-2 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-outline-variant/10">
                      <span className="font-display font-medium text-lg text-primary">{formatPrice(item.price, currency)}</span>
                      <div className="flex gap-2">
                        <Link
                          href={`/shop/${item.id}`}
                          className="bg-secondary-container/30 text-secondary px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-widest font-semibold hover:bg-secondary-container transition-all"
                        >
                          Story
                        </Link>
                        <button
                          onClick={() => addItem(item)}
                          className="bg-primary text-white px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-widest font-semibold hover:opacity-95 cursor-pointer transition-all"
                        >
                          Buy
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
