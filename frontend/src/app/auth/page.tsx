'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store';
import { motion, AnimatePresence } from 'framer-motion';

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSession, user } = useAuthStore();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const redirectParam = searchParams.get('redirect') || 'dashboard';

  // Core Auth States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'CUSTOMER' | 'ARTISAN'>('CUSTOMER');

  // Artisan Wizard Steps (1 to 5)
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Personal & Contact
  const [contactNumber, setContactNumber] = useState('');

  // Step 2: Store & Craft Info
  const [companyName, setCompanyName] = useState('');
  const [studioLocation, setStudioLocation] = useState('');
  const [region, setRegion] = useState('Rajasthan');
  const [craft, setCraft] = useState('Pottery');
  const [bio, setBio] = useState('');
  const [hasOrganization, setHasOrganization] = useState(false);
  const [organizationName, setOrganizationName] = useState('');
  const [incorporationNumber, setIncorporationNumber] = useState('');
  const [gstNumber, setGstNumber] = useState('');

  // Step 3: Store Location
  const [fullAddress, setFullAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('India');
  const [zone, setZone] = useState(''); // State / Province
  const [postcode, setPostcode] = useState('');

  // Step 4: SEO, Policies & Charges
  const [storeDescription, setStoreDescription] = useState('');
  const [storeAbout, setStoreAbout] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [shippingPolicy, setShippingPolicy] = useState('');
  const [returnPolicy, setReturnPolicy] = useState('');
  const [taxNumber, setTaxNumber] = useState('');
  const [shippingCharges, setShippingCharges] = useState('0');

  // Step 5: Media & Payouts
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1544816155-12df9643f363');
  const [logoUrl, setLogoUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe');
  const [bannerUrl, setBannerUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe');
  const [payoutType, setPayoutType] = useState<'PAYPAL' | 'BANK'>('BANK');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankBranch, setBankBranch] = useState('');
  const [bankSwiftCode, setBankSwiftCode] = useState('');
  const [bankAccountName, setBankAccountName] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankIfsc, setBankIfsc] = useState('');

  useEffect(() => {
    if (user) {
      router.push(`/${redirectParam}`);
    }
  }, [user]);

  const nextStep = () => {
    // Basic validation per step
    if (currentStep === 1) {
      if (!name || !email || !password || !contactNumber) {
        setErrorMessage('Please fill in all contact and account fields.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters.');
        return;
      }
    } else if (currentStep === 2) {
      if (!companyName || !studioLocation || !region || !craft || !bio) {
        setErrorMessage('Please fill in all store name, studio, craft, and bio fields.');
        return;
      }
      if (hasOrganization && (!organizationName || !incorporationNumber)) {
        setErrorMessage('Please complete registered organization details.');
        return;
      }
    } else if (currentStep === 3) {
      if (!fullAddress || !city || !country || !zone || !postcode) {
        setErrorMessage('Please complete all address location fields.');
        return;
      }
    } else if (currentStep === 4) {
      if (!storeDescription || !storeAbout || !shippingPolicy || !returnPolicy || !taxNumber) {
        setErrorMessage('Description, about, shipping/return policies, and Tax ID are required.');
        return;
      }
    }
    setErrorMessage('');
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setErrorMessage('');
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    // If registering as Customer, check basic fields
    if (!isLogin && role === 'CUSTOMER') {
      if (!name || !email || !password) {
        setErrorMessage('Please fill in Name, Email and Password.');
        setLoading(false);
        return;
      }
    }

    // If registering as Artisan on final step, validate bank/paypal
    if (!isLogin && role === 'ARTISAN' && currentStep === 5) {
      if (payoutType === 'PAYPAL' && !paypalEmail) {
        setErrorMessage('PayPal Email is required for PayPal payouts.');
        setLoading(false);
        return;
      }
      if (payoutType === 'BANK' && (!bankName || !bankBranch || !bankAccountName || !bankAccountNumber || !bankIfsc)) {
        setErrorMessage('All bank details (except SWIFT) are required for Bank Transfer.');
        setLoading(false);
        return;
      }
    }

    const url = isLogin ? 'signin' : 'signup';
    
    // Construct request body depending on role & login state
    let body: any = { email, password };
    
    if (!isLogin) {
      body.name = name;
      body.role = role;
      
      if (role === 'ARTISAN') {
        body = {
          ...body,
          bio,
          region,
          craft,
          contactNumber,
          companyName,
          fullAddress,
          city,
          country,
          zone,
          postcode,
          storeDescription,
          storeAbout,
          metaDescription,
          metaKeywords,
          shippingPolicy,
          returnPolicy,
          taxNumber,
          shippingCharges: Number(shippingCharges),
          logoUrl,
          bannerUrl,
          avatarUrl,
          payoutType,
          paypalEmail: payoutType === 'PAYPAL' ? paypalEmail : null,
          bankBranch: payoutType === 'BANK' ? bankBranch : null,
          bankSwiftCode: payoutType === 'BANK' ? bankSwiftCode : null,
          bankAccountName: payoutType === 'BANK' ? bankAccountName : null,
          bankName: payoutType === 'BANK' ? bankName : null,
          bankAccountNumber: payoutType === 'BANK' ? bankAccountNumber : null,
          bankIfsc: payoutType === 'BANK' ? bankIfsc : null,
          hasOrganization,
          organizationName: hasOrganization ? organizationName : null,
          incorporationNumber: hasOrganization ? incorporationNumber : null,
          gstNumber: hasOrganization ? gstNumber : null,
          studioLocation,
        };
      }
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.sunartn.com/api'}/auth/${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed.');
      }

      setSession(data.token, data.user);
      router.push(`/${redirectParam}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Connection to authentication service failed.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, name: 'Account' },
    { id: 2, name: 'Store Info' },
    { id: 3, name: 'Location' },
    { id: 4, name: 'Policies' },
    { id: 5, name: 'Payout' }
  ];

  return (
    <div className={`mx-auto my-12 p-8 bg-white border border-outline-variant/20 rounded-xl luxury-shadow space-y-6 transition-all duration-300 ${
      !isLogin && role === 'ARTISAN' ? 'max-w-xl' : 'max-w-md'
    }`}>
      <div className="text-center space-y-2">
        <span className="text-primary font-semibold text-xs uppercase tracking-widest block">Access Portal</span>
        <h1 className="font-display text-3xl font-light text-on-surface">
          {isLogin 
            ? 'Sign In to Sunartn' 
            : role === 'CUSTOMER' 
            ? 'Register Collector' 
            : 'Artisan Registry'}
        </h1>
      </div>

      {/* Toggle between Customer / Artisan for Signup */}
      {!isLogin && currentStep === 1 && (
        <div className="space-y-1">
          <label className="text-xs uppercase tracking-widest text-secondary font-semibold">Account Type</label>
          <div className="flex gap-6 mt-1">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="radio"
                checked={role === 'CUSTOMER'}
                onChange={() => setRole('CUSTOMER')}
                className="text-primary focus:ring-primary"
              />
              <span>Customer Collector</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="radio"
                checked={role === 'ARTISAN'}
                onChange={() => setRole('ARTISAN')}
                className="text-primary focus:ring-primary"
              />
              <span>Artisan Maker</span>
            </label>
          </div>
        </div>
      )}

      {/* Progress tracker for Artisan multi-step */}
      {!isLogin && role === 'ARTISAN' && (
        <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                  currentStep === step.id 
                    ? 'bg-primary text-white' 
                    : currentStep > step.id 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-secondary-container/50 text-secondary'
                }`}>
                  {step.id}
                </div>
                <span className="text-[9px] uppercase tracking-wider font-semibold text-secondary mt-1">{step.name}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${
                  currentStep > step.id ? 'bg-primary' : 'bg-outline-variant/30'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 font-sans text-sm">
        {/* LOGIN FORM OR CUSTOMER SIGNUP */}
        {(isLogin || role === 'CUSTOMER') && (
          <>
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-widest text-secondary font-semibold">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Sarah Williams"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-outline-variant rounded-lg bg-background outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest text-secondary font-semibold">Email Address</label>
              <input
                type="email"
                required
                placeholder="collector@sunartn.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-outline-variant rounded-lg bg-background outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest text-secondary font-semibold">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-outline-variant rounded-lg bg-background outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {errorMessage && (
              <p className="text-xs text-primary font-medium">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3.5 rounded-lg font-semibold text-xs uppercase tracking-widest hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
              ) : isLogin ? (
                'Sign In'
              ) : (
                'Register Collector'
              )}
            </button>
          </>
        )}

        {/* ARTISAN MULTI-STEP WIZARD */}
        {!isLogin && role === 'ARTISAN' && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* STEP 1: Account Login & Personal */}
              {currentStep === 1 && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-widest text-secondary font-semibold">Full Name / Display Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Elena Varga"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-3 border border-outline-variant rounded-lg bg-background outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-widest text-secondary font-semibold">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. elena@store.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 border border-outline-variant rounded-lg bg-background outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-widest text-secondary font-semibold">Contact Phone</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. +91 98765 43210"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        className="w-full p-3 border border-outline-variant rounded-lg bg-background outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-widest text-secondary font-semibold">Password</label>
                      <input
                        type="password"
                        required
                        placeholder="At least 6 chars"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border border-outline-variant rounded-lg bg-background outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Store & Craft details */}
              {currentStep === 2 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-widest text-secondary font-semibold">Store / Company Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Elena Varga Studio"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full p-3 border border-outline-variant rounded-lg bg-background outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-widest text-secondary font-semibold">Studio Location</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Studio Arhos, Brasov"
                        value={studioLocation}
                        onChange={(e) => setStudioLocation(e.target.value)}
                        className="w-full p-3 border border-outline-variant rounded-lg bg-background outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-widest text-secondary font-semibold">Studio Region</label>
                      <select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full p-3 border border-outline-variant rounded-lg bg-background outline-none">
                        <option>Andhra Pradesh</option>
                        <option>Arunachal Pradesh</option>
                        <option>Assam</option>
                        <option>Bihar</option>
                        <option>Chhattisgarh</option>
                        <option>Goa</option>
                        <option>Gujarat</option>
                        <option>Haryana</option>
                        <option>Himachal Pradesh</option>
                        <option>Jammu & Kashmir</option>
                        <option>Jharkhand</option>
                        <option>Karnataka</option>
                        <option>Kerala</option>
                        <option>Madhya Pradesh</option>
                        <option>Maharashtra</option>
                        <option>Manipur</option>
                        <option>Meghalaya</option>
                        <option>Mizoram</option>
                        <option>Nagaland</option>
                        <option>Odisha</option>
                        <option>Punjab</option>
                        <option>Rajasthan</option>
                        <option>Sikkim</option>
                        <option>Tamil Nadu</option>
                        <option>Telangana</option>
                        <option>Tripura</option>
                        <option>Uttar Pradesh</option>
                        <option>Uttarakhand</option>
                        <option>West Bengal</option>
                        <option>Carpathians</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-widest text-secondary font-semibold">Craft Technique</label>
                      <select value={craft} onChange={(e) => setCraft(e.target.value)} className="w-full p-3 border border-outline-variant rounded-lg bg-background outline-none">
                        <option>Pottery</option>
                        <option>Textiles & Weaving</option>
                        <option>Embroidery & Needlework</option>
                        <option>Woodwork & Carving</option>
                        <option>Metalwork & Filigree</option>
                        <option>Jewelry Making</option>
                        <option>Leathercraft</option>
                        <option>Miniature Painting</option>
                        <option>Stone Carving</option>
                        <option>Glass Art & Blowing</option>
                        <option>Toy Making & Puppetry</option>
                        <option>Bamboo & Cane Craft</option>
                        <option>Terracotta Art</option>
                        <option>Blue Pottery</option>
                        <option>Block Printing</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-widest text-secondary font-semibold">Artisan Heritage Bio</label>
                    <textarea
                      required
                      placeholder="My work is a dialogue between natural clay and the modern dining space..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={2}
                      className="w-full p-3 border border-outline-variant rounded-lg bg-background outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 py-1">
                    <input
                      type="checkbox"
                      id="hasOrg"
                      checked={hasOrganization}
                      onChange={(e) => setHasOrganization(e.target.checked)}
                      className="w-4 h-4 text-primary border-outline-variant rounded"
                    />
                    <label htmlFor="hasOrg" className="text-xs font-semibold text-secondary uppercase tracking-widest cursor-pointer select-none">
                      Registered Organization details
                    </label>
                  </div>

                  {hasOrganization && (
                    <div className="space-y-2 border-l-2 border-primary/20 pl-3 pt-1">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest text-secondary font-semibold">Org Name</label>
                        <input
                          type="text"
                          required={hasOrganization}
                          placeholder="Jaipur Clayworks Ltd."
                          value={organizationName}
                          onChange={(e) => setOrganizationName(e.target.value)}
                          className="w-full p-2.5 border border-outline-variant rounded bg-background outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-widest text-secondary font-semibold">Inc No.</label>
                          <input
                            type="text"
                            required={hasOrganization}
                            placeholder="U12345RJ2026PTC012345"
                            value={incorporationNumber}
                            onChange={(e) => setIncorporationNumber(e.target.value)}
                            className="w-full p-2.5 border border-outline-variant rounded bg-background outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-widest text-secondary font-semibold">GSTIN</label>
                          <input
                            type="text"
                            placeholder="08AAPCS1234F1Z1"
                            value={gstNumber}
                            onChange={(e) => setGstNumber(e.target.value)}
                            className="w-full p-2.5 border border-outline-variant rounded bg-background outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: Location / Address */}
              {currentStep === 3 && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-widest text-secondary font-semibold">Full Address</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 45 Craftsmans Lane, Molela village"
                      value={fullAddress}
                      onChange={(e) => setFullAddress(e.target.value)}
                      className="w-full p-3 border border-outline-variant rounded-lg bg-background outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-widest text-secondary font-semibold">City</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rajsamand"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full p-3 border border-outline-variant rounded-lg bg-background outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-widest text-secondary font-semibold">Country</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. India"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full p-3 border border-outline-variant rounded-lg bg-background outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-widest text-secondary font-semibold">Zone / State</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rajasthan"
                        value={zone}
                        onChange={(e) => setZone(e.target.value)}
                        className="w-full p-3 border border-outline-variant rounded-lg bg-background outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-widest text-secondary font-semibold">Postcode / ZIP</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 313324"
                        value={postcode}
                        onChange={(e) => setPostcode(e.target.value)}
                        className="w-full p-3 border border-outline-variant rounded-lg bg-background outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Store Customization, Policies & SEO */}
              {currentStep === 4 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-widest text-secondary font-semibold">Store Short Description</label>
                      <input
                        type="text"
                        required
                        placeholder="Handcrafted organic earthenware..."
                        value={storeDescription}
                        onChange={(e) => setStoreDescription(e.target.value)}
                        className="w-full p-3 border border-outline-variant rounded-lg bg-background outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-widest text-secondary font-semibold">Tax Number / Business Registry</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. TAX-9876543"
                        value={taxNumber}
                        onChange={(e) => setTaxNumber(e.target.value)}
                        className="w-full p-3 border border-outline-variant rounded-lg bg-background outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-widest text-secondary font-semibold">Store Description / About Detailed</label>
                    <textarea
                      required
                      placeholder="Detail the complete heritage, vision and processes of your studio..."
                      value={storeAbout}
                      onChange={(e) => setStoreAbout(e.target.value)}
                      rows={2}
                      className="w-full p-3 border border-outline-variant rounded-lg bg-background outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-widest text-secondary font-semibold">Meta Description (SEO)</label>
                      <input
                        type="text"
                        placeholder="Buy organic handcrafted vases from Rajasthan..."
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        className="w-full p-3 border border-outline-variant rounded-lg bg-background outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-widest text-secondary font-semibold">Meta Keywords (SEO)</label>
                      <input
                        type="text"
                        placeholder="pottery, terracotta, rajasthan, crafts"
                        value={metaKeywords}
                        onChange={(e) => setMetaKeywords(e.target.value)}
                        className="w-full p-3 border border-outline-variant rounded-lg bg-background outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-widest text-secondary font-semibold">Shipping Policy</label>
                      <textarea
                        required
                        placeholder="Dispatched in 3-5 days via insured courier..."
                        value={shippingPolicy}
                        onChange={(e) => setShippingPolicy(e.target.value)}
                        rows={2}
                        className="w-full p-3 border border-outline-variant rounded-lg bg-background outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-widest text-secondary font-semibold">Return Policy</label>
                      <textarea
                        required
                        placeholder="Accepts returns within 14 days of delivery..."
                        value={returnPolicy}
                        onChange={(e) => setReturnPolicy(e.target.value)}
                        rows={2}
                        className="w-full p-3 border border-outline-variant rounded-lg bg-background outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-widest text-secondary font-semibold">Standard Shipping Charge ($ USD)</label>
                    <input
                      type="number"
                      required
                      placeholder="15"
                      value={shippingCharges}
                      onChange={(e) => setShippingCharges(e.target.value)}
                      className="w-full p-3 border border-outline-variant rounded-lg bg-background outline-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 5: Media & Payouts */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs uppercase tracking-widest text-secondary font-semibold block">Store Identity Media</span>
                    <p className="text-[10px] text-secondary">
                      Provide URL links for your profile image, store logo, and store banner. (You will be able to upload custom files to secure S3 storage immediately inside your dashboard after completing registration).
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-secondary uppercase">Avatar URL</label>
                        <input
                          type="text"
                          value={avatarUrl}
                          onChange={(e) => setAvatarUrl(e.target.value)}
                          className="w-full p-2 border border-outline-variant rounded text-xs bg-background outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-secondary uppercase">Store Logo URL</label>
                        <input
                          type="text"
                          value={logoUrl}
                          onChange={(e) => setLogoUrl(e.target.value)}
                          className="w-full p-2 border border-outline-variant rounded text-xs bg-background outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-secondary uppercase">Banner URL</label>
                        <input
                          type="text"
                          value={bannerUrl}
                          onChange={(e) => setBannerUrl(e.target.value)}
                          className="w-full p-2 border border-outline-variant rounded text-xs bg-background outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-outline-variant/10 pt-3">
                    <label className="text-xs uppercase tracking-widest text-secondary font-semibold block">Payout Method Preferences</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer text-xs">
                        <input
                          type="radio"
                          checked={payoutType === 'BANK'}
                          onChange={() => setPayoutType('BANK')}
                          className="text-primary"
                        />
                        <span>Bank Transfer</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-xs">
                        <input
                          type="radio"
                          checked={payoutType === 'PAYPAL'}
                          onChange={() => setPayoutType('PAYPAL')}
                          className="text-primary"
                        />
                        <span>PayPal Account</span>
                      </label>
                    </div>
                  </div>

                  {payoutType === 'PAYPAL' && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-1"
                    >
                      <label className="text-xs uppercase tracking-widest text-secondary font-semibold">PayPal Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="paypal@myartisanstudio.com"
                        value={paypalEmail}
                        onChange={(e) => setPaypalEmail(e.target.value)}
                        className="w-full p-3 border border-outline-variant rounded-lg bg-background outline-none"
                      />
                    </motion.div>
                  )}

                  {payoutType === 'BANK' && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3 bg-secondary-container/10 p-3 rounded-lg border border-outline-variant/20"
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-widest text-secondary font-semibold">Account Holder Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Rameshwar Lal"
                            value={bankAccountName}
                            onChange={(e) => setBankAccountName(e.target.value)}
                            className="w-full p-2.5 border border-outline-variant rounded bg-background outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-widest text-secondary font-semibold">Bank Name</label>
                          <input
                            type="text"
                            required
                            placeholder="State Bank of India"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            className="w-full p-2.5 border border-outline-variant rounded bg-background outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1 col-span-2">
                          <label className="text-[10px] uppercase tracking-widest text-secondary font-semibold">Branch Name</label>
                          <input
                            type="text"
                            required
                            placeholder="Jaipur Main Branch"
                            value={bankBranch}
                            onChange={(e) => setBankBranch(e.target.value)}
                            className="w-full p-2.5 border border-outline-variant rounded bg-background outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-widest text-secondary font-semibold">SWIFT Code</label>
                          <input
                            type="text"
                            placeholder="SBININBBXXX"
                            value={bankSwiftCode}
                            onChange={(e) => setBankSwiftCode(e.target.value)}
                            className="w-full p-2.5 border border-outline-variant rounded bg-background outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-widest text-secondary font-semibold">Account Number</label>
                          <input
                            type="text"
                            required
                            placeholder="100200300400"
                            value={bankAccountNumber}
                            onChange={(e) => setBankAccountNumber(e.target.value)}
                            className="w-full p-2.5 border border-outline-variant rounded bg-background outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-widest text-secondary font-semibold">IFSC / Routing Code</label>
                          <input
                            type="text"
                            required
                            placeholder="SBIN0001234"
                            value={bankIfsc}
                            onChange={(e) => setBankIfsc(e.target.value)}
                            className="w-full p-2.5 border border-outline-variant rounded bg-background outline-none"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {errorMessage && (
                <p className="text-xs text-primary font-medium">{errorMessage}</p>
              )}

              {/* Back / Next Navigation Controls */}
              <div className="flex gap-4 pt-3">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 border border-outline-variant hover:bg-secondary-container/20 text-on-surface py-3 rounded-lg font-semibold text-xs uppercase tracking-widest transition-all cursor-pointer"
                  >
                    Back
                  </button>
                )}
                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold text-xs uppercase tracking-widest hover:opacity-95 transition-all cursor-pointer"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold text-xs uppercase tracking-widest hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                    ) : (
                      'Complete Registry'
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </form>

      <div className="text-center text-xs text-secondary border-t border-outline-variant/10 pt-4">
        {isLogin ? (
          <p>
            New to the movement?{' '}
            <button onClick={() => { setIsLogin(false); setCurrentStep(1); }} className="text-primary hover:underline font-semibold cursor-pointer">
              Register here
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <button onClick={() => setIsLogin(true)} className="text-primary hover:underline font-semibold cursor-pointer">
              Sign In here
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

export default function Auth() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading Access Portal...</div>}>
      <AuthForm />
    </Suspense>
  );
}
