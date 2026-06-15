'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  
  // Dynamic datasets depending on role
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [artisanOrders, setArtisanOrders] = useState<any[]>([]);
  const [artisanProducts, setArtisanProducts] = useState<any[]>([]);
  
  // Admin datasets
  const [adminProducts, setAdminProducts] = useState<any[]>([]);
  const [adminArtisans, setAdminArtisans] = useState<any[]>([]);
  const [adminOrders, setAdminOrders] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);

  // New product form states (for Artisan)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('5');
  const [category, setCategory] = useState('Vases');
  const [craft, setCraft] = useState('Pottery');
  const [region, setRegion] = useState('Rajasthan');
  const [imageUrl, setImageUrl] = useState('');
  const [productMessage, setProductMessage] = useState('');

  const fetchDashboardData = () => {
    if (!token) return;
    setLoading(true);

    if (user?.role === 'CUSTOMER') {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.sunartn.com/api'}/orders/customer`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setCustomerOrders(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else if (user?.role === 'ARTISAN') {
      // Fetch artisan orders
      const fetchOrders = fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.sunartn.com/api'}/orders/artisan`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json());

      // Fetch artisan profile/products
      const fetchProducts = fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.sunartn.com/api'}/products/artisans/${user.id}`)
        .then((res) => res.json())
        .then((profile) => profile.products || []);

      Promise.all([fetchOrders, fetchProducts])
        .then(([orders, products]) => {
          if (Array.isArray(orders)) setArtisanOrders(orders);
          if (Array.isArray(products)) setArtisanProducts(products);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else if (user?.role === 'ADMIN') {
      // Fetch all products
      const fetchProducts = fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.sunartn.com/api'}/products`)
        .then((res) => res.json());

      // Fetch all artisans
      const fetchArtisans = fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.sunartn.com/api'}/products/artisans`)
        .then((res) => res.json());

      // Fetch all orders
      const fetchOrders = fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.sunartn.com/api'}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json());

      Promise.all([fetchProducts, fetchArtisans, fetchOrders])
        .then(([productsList, artisansList, ordersList]) => {
          if (Array.isArray(productsList)) setAdminProducts(productsList);
          if (Array.isArray(artisansList)) setAdminArtisans(artisansList);
          if (Array.isArray(ordersList)) setAdminOrders(ordersList);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      router.push('/auth');
      return;
    }
    fetchDashboardData();
  }, [token, user]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setProductMessage('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.sunartn.com/api'}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          price: Number(price),
          stock: Number(stock),
          category,
          craft,
          region,
          images: [imageUrl || 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c'],
        }),
      });
      const data = await response.json();

      if (response.ok) {
        setProductMessage('Craft offering listed successfully!');
        setTitle('');
        setDescription('');
        setPrice('');
        setImageUrl('');
        fetchDashboardData(); // Refresh product list
      } else {
        setProductMessage(data.message || 'Failed to list product.');
      }
    } catch (err) {
      setProductMessage('Network error listing product.');
    }
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    if (!token) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.sunartn.com/api'}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        fetchDashboardData(); // Refresh order status
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!token) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.sunartn.com/api'}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerifyArtisan = async (artisanId: string, isVerified: boolean) => {
    if (!token) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.sunartn.com/api'}/products/artisans/${artisanId}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isVerified }),
      });
      if (response.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-8 space-y-12">
      {/* Profile Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-outline-variant/20 pb-6">
        <div>
          <span className="text-accent font-semibold text-xs uppercase tracking-widest block">Dashboard Workspace</span>
          <h1 className="font-display text-4xl mt-1 font-light text-on-surface">Welcome Back, {user?.name}</h1>
          <p className="text-xs text-secondary mt-1 font-sans">Role Account: {user?.role}</p>
        </div>
      </div>

      {/* CUSTOMER PORTAL */}
      {user?.role === 'CUSTOMER' && (
        <section className="space-y-6">
          <h2 className="font-display text-3xl font-light text-on-surface">Your Acquisitions & Orders</h2>
          {customerOrders.length === 0 ? (
            <div className="text-center py-16 bg-secondary-container/10 border border-dashed rounded-xl">
              <span className="material-symbols-outlined text-4xl text-secondary">orders</span>
              <p className="text-sm text-secondary font-sans mt-3">You have not completed any acquisitions yet.</p>
              <Link href="/shop" className="mt-4 inline-block bg-primary text-white px-6 py-2.5 rounded-lg text-xs uppercase tracking-widest font-semibold">
                Browse Collection Archive
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {customerOrders.map((order) => (
                <div key={order.id} className="bg-white border border-outline-variant/20 rounded-xl p-6 luxury-shadow space-y-4 font-sans text-sm">
                  <div className="flex flex-col md:flex-row justify-between pb-3 border-b border-outline-variant/10 text-xs text-secondary space-y-2 md:space-y-0">
                    <div>
                      <span className="font-semibold text-on-surface">ORDER ID:</span> {order.id}
                      <span className="ml-4 font-semibold text-on-surface">PLACED:</span> {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-4">
                      <span>STATUS: <b className="text-primary uppercase">{order.status}</b></span>
                      <span>PAYMENT: <b className="text-primary uppercase">{order.paymentStatus}</b></span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {order.items?.map((item: any) => (
                      <div key={item.id} className="flex gap-4 items-center justify-between">
                        <div className="flex gap-4 items-center">
                          <span className="text-xs bg-secondary-container/30 px-2.5 py-1 rounded font-semibold text-primary">
                            Qty {item.quantity}
                          </span>
                          <div>
                            <h4 className="font-semibold text-on-surface">{item.product.title}</h4>
                            <p className="text-[10px] text-secondary">Craft Technique: {item.product.craft}</p>
                          </div>
                        </div>
                        <span className="font-medium font-display text-base text-primary">${item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between pt-4 border-t border-outline-variant/10 font-sans text-xs">
                    <span className="text-secondary">Shipping to: <i>{order.shippingAddress}</i></span>
                    <span className="text-lg font-bold font-display text-primary">Total: ${order.totalAmount}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ARTISAN & ADMIN PORTAL */}
      {(user?.role === 'ARTISAN' || user?.role === 'ADMIN') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left panel: Telemetries & Lists */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* If ARTISAN, show Artisan metrics & products */}
            {user?.role === 'ARTISAN' && (
              <>
                {/* Telemetry metrics cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white border border-outline-variant/20 p-6 rounded-xl luxury-shadow space-y-2">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block">Total Earnings</span>
                    <span className="text-3xl font-display text-primary font-semibold">
                      ${artisanOrders.reduce((sum, o) => sum + o.totalAmount, 0)}
                    </span>
                  </div>
                  <div className="bg-white border border-outline-variant/20 p-6 rounded-xl luxury-shadow space-y-2">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block">Active Orders</span>
                    <span className="text-3xl font-display text-primary font-semibold">
                      {artisanOrders.filter(o => o.status !== 'DELIVERED').length}
                    </span>
                  </div>
                  <div className="bg-white border border-outline-variant/20 p-6 rounded-xl luxury-shadow space-y-2">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block">Listed Offerings</span>
                    <span className="text-3xl font-display text-primary font-semibold">
                      {artisanProducts.length}
                    </span>
                  </div>
                </div>

                {/* List products offerings */}
                <div className="space-y-4">
                  <h2 className="font-display text-3xl font-light text-on-surface">Your Shop Offerings</h2>
                  {artisanProducts.length === 0 ? (
                    <p className="text-xs text-secondary italic">No products currently listed.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {artisanProducts.map((prod) => (
                        <div key={prod.id} className="flex gap-4 p-3 border border-outline-variant/20 rounded-xl bg-white relative items-center justify-between">
                          <div className="flex gap-3 items-center">
                            <div className="w-12 h-12 bg-secondary-container/10 rounded relative overflow-hidden flex-shrink-0">
                              <img src={prod.images?.[0]} className="object-cover w-full h-full" />
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold line-clamp-1">{prod.title}</h4>
                              <p className="text-[10px] text-secondary">Price: ${prod.price} • Stock: {prod.stock}</p>
                            </div>
                          </div>
                          <Link href={`/shop/${prod.id}`} className="text-[10px] font-bold uppercase tracking-widest text-primary border border-primary/20 px-2 py-1 rounded">
                            View
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Orders list containing this artisan's items */}
                <div className="space-y-4">
                  <h2 className="font-display text-3xl font-light text-on-surface">Customer Orders Checklist</h2>
                  {artisanOrders.length === 0 ? (
                    <p className="text-xs text-secondary italic">No customer orders received yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {artisanOrders.map((ord) => (
                        <div key={ord.id} className="bg-white border border-outline-variant/10 p-5 rounded-xl space-y-3 font-sans text-xs">
                          <div className="flex justify-between items-center pb-2 border-b border-outline-variant/10">
                            <div>
                              <b>ORDER:</b> {ord.id.substring(0, 8)} • <b>CUSTOMER:</b> {ord.user?.name}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold uppercase text-primary">{ord.status}</span>
                              {ord.status === 'PENDING' && (
                                <button onClick={() => handleUpdateStatus(ord.id, 'SHIPPED')} className="bg-primary text-white px-2 py-1 rounded hover:opacity-90 font-bold uppercase text-[9px] tracking-wide cursor-pointer">
                                  Mark Shipped
                                </button>
                              )}
                              {ord.status === 'SHIPPED' && (
                                <button onClick={() => handleUpdateStatus(ord.id, 'DELIVERED')} className="bg-accent text-primary px-2 py-1 rounded hover:opacity-90 font-bold uppercase text-[9px] tracking-wide cursor-pointer">
                                  Mark Delivered
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            {ord.items?.map((item: any) => (
                              <div key={item.id} className="flex justify-between items-center text-secondary">
                                <span>{item.product.title} (x{item.quantity})</span>
                                <span className="font-medium text-on-surface">${item.price * item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* If ADMIN, show Admin metrics, Verifications, and all listings */}
            {user?.role === 'ADMIN' && (
              <>
                {/* Admin Telemetry metrics cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white border border-outline-variant/20 p-6 rounded-xl luxury-shadow space-y-2">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block">Total Sales Volume</span>
                    <span className="text-3xl font-display text-primary font-semibold">
                      ${adminOrders.reduce((sum, o) => sum + o.totalAmount, 0)}
                    </span>
                  </div>
                  <div className="bg-white border border-outline-variant/20 p-6 rounded-xl luxury-shadow space-y-2">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block">Registered Artisans</span>
                    <span className="text-3xl font-display text-primary font-semibold">
                      {adminArtisans.length}
                    </span>
                  </div>
                  <div className="bg-white border border-outline-variant/20 p-6 rounded-xl luxury-shadow space-y-2">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block">Platform Offerings</span>
                    <span className="text-3xl font-display text-primary font-semibold">
                      {adminProducts.length}
                    </span>
                  </div>
                </div>

                {/* Artisan Verification Queue */}
                <div className="space-y-4">
                  <h2 className="font-display text-3xl font-light text-on-surface">Artisan Verification Workspace</h2>
                  {adminArtisans.length === 0 ? (
                    <p className="text-xs text-secondary italic">No registered artisans found.</p>
                  ) : (
                    <div className="space-y-3">
                      {adminArtisans.map((artisan) => (
                        <div key={artisan.id} className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white border border-outline-variant/20 rounded-xl p-4 gap-4 luxury-shadow">
                          <div className="flex gap-4 items-center">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary-container/10 relative flex-shrink-0">
                              <img src={artisan.avatarUrl || 'https://images.unsplash.com/photo-1544816155-12df9643f363'} className="object-cover w-full h-full" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm">{artisan.user?.name}</h4>
                              <p className="text-[10px] text-secondary">Region: {artisan.region} • Craft: {artisan.craft}</p>
                            </div>
                          </div>
                          <div className="flex gap-3 items-center">
                            {artisan.isVerified ? (
                              <span className="bg-primary-container/30 text-primary text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1">
                                <span className="material-symbols-outlined text-[12px]">verified</span> Verified
                              </span>
                            ) : (
                              <span className="bg-secondary-container/30 text-secondary text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                                Unverified
                              </span>
                            )}
                            <button
                              onClick={() => handleVerifyArtisan(artisan.id, !artisan.isVerified)}
                              className="text-[10px] font-bold uppercase tracking-widest bg-primary text-white hover:opacity-90 px-3 py-1.5 rounded cursor-pointer transition-all"
                            >
                              {artisan.isVerified ? 'Revoke' : 'Approve'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Global Orders */}
                <div className="space-y-4">
                  <h2 className="font-display text-3xl font-light text-on-surface">Global Platform Acquisitions</h2>
                  {adminOrders.length === 0 ? (
                    <p className="text-xs text-secondary italic">No acquisitions in the system.</p>
                  ) : (
                    <div className="space-y-4">
                      {adminOrders.map((ord) => (
                        <div key={ord.id} className="bg-white border border-outline-variant/10 p-5 rounded-xl space-y-3 font-sans text-xs">
                          <div className="flex justify-between items-center pb-2 border-b border-outline-variant/10">
                            <div>
                              <b>ORDER ID:</b> {ord.id.substring(0, 8)} • <b>COLLECTOR:</b> {ord.user?.name}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold uppercase text-primary">{ord.status}</span>
                              {ord.status === 'PENDING' && (
                                <button onClick={() => handleUpdateStatus(ord.id, 'SHIPPED')} className="bg-primary text-white px-2 py-1 rounded hover:opacity-90 font-bold uppercase text-[9px] tracking-wide cursor-pointer">
                                  Mark Shipped
                                </button>
                              )}
                              {ord.status === 'SHIPPED' && (
                                <button onClick={() => handleUpdateStatus(ord.id, 'DELIVERED')} className="bg-accent text-primary px-2 py-1 rounded hover:opacity-90 font-bold uppercase text-[9px] tracking-wide cursor-pointer">
                                  Mark Delivered
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="space-y-2">
                            {ord.items?.map((item: any) => (
                              <div key={item.id} className="flex justify-between items-center text-secondary">
                                <span>{item.product.title} (x{item.quantity})</span>
                                <span className="font-medium text-on-surface">${item.price * item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Global Listings Management */}
                <div className="space-y-4">
                  <h2 className="font-display text-3xl font-light text-on-surface">Platform Catalog Listings</h2>
                  {adminProducts.length === 0 ? (
                    <p className="text-xs text-secondary italic">No products listed on the platform.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {adminProducts.map((prod) => (
                        <div key={prod.id} className="flex gap-4 p-3 border border-outline-variant/20 rounded-xl bg-white relative items-center justify-between luxury-shadow">
                          <div className="flex gap-3 items-center">
                            <div className="w-12 h-12 bg-secondary-container/10 rounded relative overflow-hidden flex-shrink-0">
                              <img src={prod.images?.[0]} className="object-cover w-full h-full" />
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold line-clamp-1">{prod.title}</h4>
                              <p className="text-[10px] text-secondary">Price: ${prod.price} • Stock: {prod.stock}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="text-[10px] font-bold uppercase tracking-widest text-red-600 border border-red-200 hover:bg-red-50 px-2.5 py-1.5 rounded cursor-pointer transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

          </div>

          {/* Right panel: Add New Offering Form */}
          <aside className="lg:col-span-4 bg-secondary-container/20 p-6 border border-outline-variant/10 rounded-xl space-y-4">
            <h3 className="font-display text-2xl font-light text-primary border-b border-outline-variant/30 pb-3">
              List New Craft
            </h3>

            <form onSubmit={handleCreateProduct} className="space-y-4 font-sans text-xs">
              <div className="space-y-1">
                <label className="text-secondary font-semibold uppercase tracking-wider block">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ochre Horizon Vessel"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-secondary font-semibold uppercase tracking-wider block">Description</label>
                <textarea
                  required
                  placeholder="The concept and material heritage behind this craft..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-secondary font-semibold uppercase tracking-wider block">Price ($)</label>
                  <input
                    type="number"
                    required
                    placeholder="340"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-secondary font-semibold uppercase tracking-wider block">Stock Qty</label>
                  <input
                    type="number"
                    required
                    placeholder="5"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-secondary font-semibold uppercase tracking-wider block text-[9px]">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none">
                    <option>Vases</option>
                    <option>Textiles</option>
                    <option>Woodwork</option>
                    <option>Metal Crafts</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-secondary font-semibold uppercase tracking-wider block text-[9px]">Craft</label>
                  <select value={craft} onChange={(e) => setCraft(e.target.value)} className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none">
                    <option>Pottery</option>
                    <option>Textiles</option>
                    <option>Woodwork</option>
                    <option>Metal Crafts</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-secondary font-semibold uppercase tracking-wider block text-[9px]">Region</label>
                  <select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none">
                    <option>Rajasthan</option>
                    <option>Kashmir</option>
                    <option>Gujarat</option>
                    <option>West Bengal</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-secondary font-semibold uppercase tracking-wider block text-[10px]">Product Image File</label>
                <div className="flex items-center gap-3">
                  <label className="bg-primary/10 text-primary border border-primary/20 px-3 py-2 rounded text-xs uppercase tracking-widest font-semibold cursor-pointer hover:bg-primary/15 transition-all flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">cloud_upload</span>
                    Choose File
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setImageUrl(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  {imageUrl && (
                    <div className="w-10 h-10 rounded border border-outline-variant/30 overflow-hidden relative bg-secondary-container/10">
                      <img src={imageUrl} alt="Upload preview" className="object-cover w-full h-full" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-secondary font-semibold uppercase tracking-wider block">Or Product Image URL</label>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded text-xs uppercase tracking-widest font-semibold hover:opacity-95 transition-all cursor-pointer"
              >
                List Offering
              </button>

              {productMessage && (
                <p className="text-xs text-primary font-medium mt-2">{productMessage}</p>
              )}
            </form>
          </aside>
        </div>
      )}
    </div>
  );
}
