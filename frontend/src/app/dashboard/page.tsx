'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore, useCartStore, formatPrice } from '@/store';
import { motion } from 'framer-motion';

const SUBCATEGORIES: Record<string, string[]> = {
  'Women': [
    'Handloom Sarees / Sari',
    'Shawls / Stoles / Dupattas',
    'Dresses',
    'Kurtas',
    'Tops / Blouses',
    'Shirts',
    'T Shirts',
    'Jackets / Shrugs',
    'Skirts / Ghagras / Wrap Arounds',
    'Palazzos / Pants',
    'Fabric Material'
  ],
  'Men': [
    'Kurtas',
    'Shirts',
    'T Shirts',
    'Jackets',
    'Pants / Trousers'
  ],
  'Kids': [
    'Girls Wear',
    'Boys Wear',
    'Infant Wear'
  ],
  'Jewellery': [
    'Necklaces / Pendants',
    'Earrings',
    'Bangles / Bracelets',
    'Rings'
  ],
  'Accessory & Footwear': [
    'Bags / Purses',
    'Footwear',
    'Stoles / Scarves'
  ],
  'Home Textiles': [
    'Bedspreads / Bedsheets',
    'Quilts / Blankets',
    'Cushion Covers',
    'Curtains'
  ],
  'Home Decor': [
    'Vases / Planters',
    'Wall Art / Paintings',
    'Sculptures / Figurines',
    'Candles / Holders'
  ],
  'Dining & Kitchen': [
    'Plates / Bowls',
    'Cups / Mugs',
    'Table Runners / Mats',
    'Trays / Serveware'
  ],
  'Furniture': [
    'Chairs / Stools',
    'Tables',
    'Cabinets / Shelves'
  ],
  'Gifting': [
    'Gift Boxes',
    'Festive Decor',
    'Handmade Cards'
  ],
  'More to Love': [
    'Stationery',
    'Devotion / Ritual Essentials',
    'Music Instruments',
    'Organic Beauty Products',
    'Kits / Tools / Materials'
  ]
};

export default function Dashboard() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const currency = useCartStore((state) => state.currency);
  
  // Dynamic datasets depending on role
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [artisanOrders, setArtisanOrders] = useState<any[]>([]);
  const [artisanProducts, setArtisanProducts] = useState<any[]>([]);
  
  // Admin datasets
  const [adminProducts, setAdminProducts] = useState<any[]>([]);
  const [adminArtisans, setAdminArtisans] = useState<any[]>([]);
  const [adminOrders, setAdminOrders] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);

  // View-all expanded states
  const [showAllArtisanProducts, setShowAllArtisanProducts] = useState(false);
  const [showAllArtisanOrders, setShowAllArtisanOrders] = useState(false);
  const [showAllCustomerOrders, setShowAllCustomerOrders] = useState(false);
  const [showAllAdminProducts, setShowAllAdminProducts] = useState(false);
  const [showAllAdminOrders, setShowAllAdminOrders] = useState(false);
  const [showAllAdminArtisans, setShowAllAdminArtisans] = useState(false);

  // Artisan Profile form states
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [editProfileMode, setEditProfileMode] = useState(false);
  const [bio, setBio] = useState('');
  const [studioLocation, setStudioLocation] = useState('');
  const [hasOrganization, setHasOrganization] = useState(false);
  const [organizationName, setOrganizationName] = useState('');
  const [incorporationNumber, setIncorporationNumber] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [bankAccountName, setBankAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankIfsc, setBankIfsc] = useState('');
  const [profileMessage, setProfileMessage] = useState('');

  // New Artisan Fields
  const [contactNumber, setContactNumber] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [zone, setZone] = useState('');
  const [postcode, setPostcode] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [storeAbout, setStoreAbout] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [shippingPolicy, setShippingPolicy] = useState('');
  const [returnPolicy, setReturnPolicy] = useState('');
  const [taxNumber, setTaxNumber] = useState('');
  const [shippingCharges, setShippingCharges] = useState('0');
  const [logoUrl, setLogoUrl] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [payoutType, setPayoutType] = useState('BANK');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [bankBranch, setBankBranch] = useState('');
  const [bankSwiftCode, setBankSwiftCode] = useState('');

  // KYC Workspace States
  const [kycDocuments, setKycDocuments] = useState<any[]>([]);
  const [kycDocType, setKycDocType] = useState('NATIONAL_ID');
  const [kycFileUrl, setKycFileUrl] = useState('');
  const [kycFileName, setKycFileName] = useState('');
  const [kycUploading, setKycUploading] = useState(false);
  const [kycMessage, setKycMessage] = useState('');

  // Admin KYC Workspace States
  const [adminKycDocuments, setAdminKycDocuments] = useState<any[]>([]);
  const [kycRequestArtisanId, setKycRequestArtisanId] = useState('');
  const [kycRequestDocType, setKycRequestDocType] = useState('NATIONAL_ID');
  const [kycReviewNote, setKycReviewNote] = useState('');
  const [kycReviewMessage, setKycReviewMessage] = useState('');

  // New product form states (for Artisan)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('5');
  const [category, setCategory] = useState('Women');
  const [subcategory, setSubcategory] = useState('Handloom Sarees / Sari');
  const [craft, setCraft] = useState('Pottery');
  const [region, setRegion] = useState('Rajasthan');
  const [customCraft, setCustomCraft] = useState('');
  const [customRegion, setCustomRegion] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [productMessage, setProductMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isBlurry, setIsBlurry] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhanceStatus, setEnhanceStatus] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoUploading, setVideoUploading] = useState(false);

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
      const fetchProfile = fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.sunartn.com/api'}/products/artisans/${user.id}`)
        .then((res) => res.json());

      // Fetch artisan KYC docs
      const fetchKyc = fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.sunartn.com/api'}/kyc/my`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json());

      Promise.all([fetchOrders, fetchProfile, fetchKyc])
        .then(([orders, profileData, kycData]) => {
          if (Array.isArray(orders)) setArtisanOrders(orders);
          if (Array.isArray(kycData)) setKycDocuments(kycData);
          if (profileData) {
            setProfile(profileData);
            if (Array.isArray(profileData.products)) {
              setArtisanProducts(profileData.products);
            }
            setBio(profileData.bio || '');
            setStudioLocation(profileData.studioLocation || '');
            setHasOrganization(profileData.hasOrganization || false);
            setOrganizationName(profileData.organizationName || '');
            setIncorporationNumber(profileData.incorporationNumber || '');
            setGstNumber(profileData.gstNumber || '');
            setBankAccountName(profileData.bankAccountName || '');
            setBankName(profileData.bankName || '');
            setBankAccountNumber(profileData.bankAccountNumber || '');
            setBankIfsc(profileData.bankIfsc || '');
            setContactNumber(profileData.contactNumber || '');
            setCompanyName(profileData.companyName || '');
            setFullAddress(profileData.fullAddress || '');
            setCity(profileData.city || '');
            setCountry(profileData.country || '');
            setZone(profileData.zone || '');
            setPostcode(profileData.postcode || '');
            setStoreDescription(profileData.storeDescription || '');
            setStoreAbout(profileData.storeAbout || '');
            setMetaDescription(profileData.metaDescription || '');
            setMetaKeywords(profileData.metaKeywords || '');
            setShippingPolicy(profileData.shippingPolicy || '');
            setReturnPolicy(profileData.returnPolicy || '');
            setTaxNumber(profileData.taxNumber || '');
            setShippingCharges(String(profileData.shippingCharges || '0'));
            setLogoUrl(profileData.logoUrl || '');
            setAvatarUrl(profileData.avatarUrl || '');
            setBannerUrl(profileData.bannerUrl || '');
            setPayoutType(profileData.payoutType || 'BANK');
            setPaypalEmail(profileData.paypalEmail || '');
            setBankBranch(profileData.bankBranch || '');
            setBankSwiftCode(profileData.bankSwiftCode || '');
          }
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

      // Fetch all KYC documents
      const fetchAdminKyc = fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.sunartn.com/api'}/kyc/all`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json());

      Promise.all([fetchProducts, fetchArtisans, fetchOrders, fetchAdminKyc])
        .then(([productsList, artisansList, ordersList, kycList]) => {
          if (Array.isArray(productsList)) setAdminProducts(productsList);
          if (Array.isArray(artisansList)) {
            setAdminArtisans(artisansList);
            if (artisansList.length > 0) {
              setKycRequestArtisanId(artisansList[0].id);
            }
          }
          if (Array.isArray(ordersList)) setAdminOrders(ordersList);
          if (Array.isArray(kycList)) setAdminKycDocuments(kycList);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!token) {
      router.push('/auth');
      return;
    }
    fetchDashboardData();
  }, [token, user, mounted]);

  const detectBlurryImage = (url: string, file?: File | null) => {
    if (!url && !file) return;
    const img = new Image();
    const objectUrl = file ? URL.createObjectURL(file) : null;
    if (!objectUrl) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          if (objectUrl) URL.revokeObjectURL(objectUrl);
          return;
        }
        canvas.width = 64;
        canvas.height = 64;
        ctx.drawImage(img, 0, 0, 64, 64);
        
        const imgData = ctx.getImageData(0, 0, 64, 64);
        const data = imgData.data;
        
        let sum = 0;
        let sumSq = 0;
        const count = 62 * 62;
        
        for (let y = 1; y < 63; y++) {
          for (let x = 1; x < 63; x++) {
            const idx = (y * 64 + x) * 4;
            const gray = (data[idx] + data[idx+1] + data[idx+2]) / 3;
            
            const up = (data[idx - 256] + data[idx - 256 + 1] + data[idx - 256 + 2]) / 3;
            const down = (data[idx + 256] + data[idx + 256 + 1] + data[idx + 256 + 2]) / 3;
            const left = (data[idx - 4] + data[idx - 4 + 1] + data[idx - 4 + 2]) / 3;
            const right = (data[idx + 4] + data[idx + 4 + 1] + data[idx + 4 + 2]) / 3;
            
            const laplacian = 4 * gray - up - down - left - right;
            sum += laplacian;
            sumSq += laplacian * laplacian;
          }
        }
        
        const mean = sum / count;
        const variance = (sumSq / count) - (mean * mean);
        setIsBlurry(variance < 5.0); // Sensitive threshold for blurred images
      } catch (e) {
        console.warn('Could not run blur detection due to CORS or Canvas restrictions:', e);
        setIsBlurry(false);
      } finally {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
      }
    };
    img.onerror = () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl || url;
  };

  const enhanceImageWithAI = async () => {
    if (!imageUrl) return;
    setIsEnhancing(true);
    setEnhanceStatus('Initializing AI models...');
    
    // Simulate step-by-step progress
    const timers: NodeJS.Timeout[] = [];
    timers.push(setTimeout(() => setEnhanceStatus('Reconstructing image edges...'), 800));
    timers.push(setTimeout(() => setEnhanceStatus('Upscaling resolution (2x)...'), 1600));
    timers.push(setTimeout(() => setEnhanceStatus('Sharpening textures & patterns...'), 2400));
    timers.push(setTimeout(() => setEnhanceStatus('Boosting color vibrancy...'), 3200));
    timers.push(setTimeout(() => setEnhanceStatus('Uploading enhanced asset to S3...'), 4000));
    
    const clearTimers = () => timers.forEach(clearTimeout);

    const img = new Image();
    const objectUrl = selectedImageFile ? URL.createObjectURL(selectedImageFile) : null;
    if (!objectUrl) {
      img.crossOrigin = 'anonymous';
    }
    
    img.onload = async () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          clearTimers();
          setIsEnhancing(false);
          if (objectUrl) URL.revokeObjectURL(objectUrl);
          return;
        }
        
        let scale = 2;
        if (img.naturalWidth > 1200 || img.naturalHeight > 1200) {
          scale = 1;
        } else if (img.naturalWidth > 800 || img.naturalHeight > 800) {
          scale = 1.5;
        }
        
        let width = img.naturalWidth * scale;
        let height = img.naturalHeight * scale;
        const maxDim = 1600;
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        } else {
          width = Math.round(width);
          height = Math.round(height);
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;
        const originalData = new Uint8ClampedArray(data);
        
        const centerWt = 5.8;
        const edgeWt = -1.2;
        
        for (let y = 0; y < height; y++) {
          const yOff = y * width;
          const prevYOff = (y > 0 ? y - 1 : 0) * width;
          const nextYOff = (y < height - 1 ? y + 1 : height - 1) * width;
          
          for (let x = 0; x < width; x++) {
            const dstOff = (yOff + x) * 4;
            const prevX = x > 0 ? x - 1 : 0;
            const nextX = x < width - 1 ? x + 1 : width - 1;
            
            const cOff = dstOff;
            const tOff = (prevYOff + x) * 4;
            const bOff = (nextYOff + x) * 4;
            const lOff = (yOff + prevX) * 4;
            const rOff = (yOff + nextX) * 4;
            
            const rVal = originalData[cOff] * centerWt + 
                         (originalData[tOff] + originalData[bOff] + originalData[lOff] + originalData[rOff]) * edgeWt;
            const gVal = originalData[cOff + 1] * centerWt + 
                         (originalData[tOff + 1] + originalData[bOff + 1] + originalData[lOff + 1] + originalData[rOff + 1]) * edgeWt;
            const bVal = originalData[cOff + 2] * centerWt + 
                         (originalData[tOff + 2] + originalData[bOff + 2] + originalData[lOff + 2] + originalData[rOff + 2]) * edgeWt;
            
            const mix = 0.7;
            const origR = originalData[dstOff];
            const origG = originalData[dstOff + 1];
            const origB = originalData[dstOff + 2];
            
            let nr = origR + (rVal - origR) * mix;
            let ng = origG + (gVal - origG) * mix;
            let nb = origB + (bVal - origB) * mix;
            
            nr = ((nr - 128) * 1.05) + 128;
            ng = ((ng - 128) * 1.05) + 128;
            nb = ((nb - 128) * 1.05) + 128;
            
            data[dstOff] = nr < 0 ? 0 : (nr > 255 ? 255 : nr);
            data[dstOff + 1] = ng < 0 ? 0 : (ng > 255 ? 255 : ng);
            data[dstOff + 2] = nb < 0 ? 0 : (nb > 255 ? 255 : nb);
          }
        }
        
        ctx.putImageData(imgData, 0, 0);
        
        canvas.toBlob(async (blob) => {
          if (!blob) {
            clearTimers();
            setIsEnhancing(false);
            if (objectUrl) URL.revokeObjectURL(objectUrl);
            return;
          }
          
          const formData = new FormData();
          formData.append('file', blob, 'enhanced_product_image.jpg');
          
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.sunartn.com/api'}/upload`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            });
            const responseData = await res.json();
            if (res.ok && responseData.url) {
               setImageUrl(responseData.url);
               setIsBlurry(false);
               setProductMessage('AI Image Enhancement Complete!');
               setSelectedImageFile(new File([blob], 'enhanced_product_image.jpg', { type: 'image/jpeg' }));
            } else {
               setProductMessage('AI upload failed. Enhancement reverted.');
            }
          } catch (err) {
            setProductMessage('Network error saving enhanced image.');
          } finally {
            clearTimers();
            setIsEnhancing(false);
            if (objectUrl) URL.revokeObjectURL(objectUrl);
          }
        }, 'image/jpeg', 0.92);
      } catch (err) {
        console.error(err);
        setProductMessage('AI processing failed.');
        clearTimers();
        setIsEnhancing(false);
        if (objectUrl) URL.revokeObjectURL(objectUrl);
      }
    };
    
    img.onerror = () => {
      console.error('AI Image Enhancer failed to load image source.');
      setProductMessage('AI Enhancer error: Could not load image source (possibly CORS block).');
      clearTimers();
      setIsEnhancing(false);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
    
    img.src = objectUrl || imageUrl;
  };

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
          subcategory,
          craft: craft === 'Other' ? customCraft : craft,
          region: region === 'Other' ? customRegion : region,
          images: [imageUrl || 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c'],
          videoUrl: videoUrl || null,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        setProductMessage('Craft offering listed successfully!');
        setTitle('');
        setDescription('');
        setPrice('');
        setImageUrl('');
        setVideoUrl('');
        setCustomCraft('');
        setCustomRegion('');
        setCraft('Pottery');
        setRegion('Rajasthan');
        setCategory('Women');
        setSubcategory('Handloom Sarees / Sari');
        fetchDashboardData(); // Refresh product list
      } else {
        setProductMessage(data.message || 'Failed to list product.');
      }
    } catch (err) {
      setProductMessage('Network error listing product.');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setProfileMessage('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.sunartn.com/api'}/products/profile/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bio,
          studioLocation,
          hasOrganization,
          organizationName: hasOrganization ? organizationName : null,
          incorporationNumber: hasOrganization ? incorporationNumber : null,
          gstNumber: hasOrganization ? gstNumber : null,
          bankAccountName,
          bankName,
          bankAccountNumber,
          bankIfsc,
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
          avatarUrl,
          bannerUrl,
          payoutType,
          paypalEmail: payoutType === 'PAYPAL' ? paypalEmail : null,
          bankBranch: payoutType === 'BANK' ? bankBranch : null,
          bankSwiftCode: payoutType === 'BANK' ? bankSwiftCode : null,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        setProfileMessage('Profile settings updated successfully!');
        setEditProfileMode(false);
        fetchDashboardData(); // Refresh profile details
      } else {
        setProfileMessage(data.message || 'Failed to update profile.');
      }
    } catch (err) {
      setProfileMessage('Network error updating profile.');
    }
  };

  const handleSubmitKycDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setKycMessage('');
    if (!kycFileUrl) {
      setKycMessage('Please upload a document file first.');
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.sunartn.com/api'}/kyc/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          documentType: kycDocType,
          fileUrl: kycFileUrl,
          fileName: kycFileName || 'kyc_document',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setKycMessage('KYC Document submitted successfully!');
        setKycFileUrl('');
        setKycFileName('');
        fetchDashboardData();
      } else {
        setKycMessage(data.message || 'Failed to submit KYC document.');
      }
    } catch (err) {
      setKycMessage('Error submitting KYC document.');
    }
  };

  const handleRequestKycDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setKycReviewMessage('');
    if (!kycRequestArtisanId) {
      setKycReviewMessage('Please select an artisan first.');
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.sunartn.com/api'}/kyc/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          artisanProfileId: kycRequestArtisanId,
          documentType: kycRequestDocType,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setKycReviewMessage('KYC document request sent successfully!');
        fetchDashboardData();
      } else {
        setKycReviewMessage(data.message || 'Failed to request document.');
      }
    } catch (err) {
      setKycReviewMessage('Error sending KYC request.');
    }
  };

  const handleReviewKycDocument = async (documentId: string, status: 'APPROVED' | 'REJECTED') => {
    if (!token) return;
    setKycReviewMessage('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.sunartn.com/api'}/kyc/${documentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
          adminNote: kycReviewNote,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setKycReviewMessage(`Document ${status.toLowerCase()} successfully!`);
        setKycReviewNote('');
        fetchDashboardData();
      } else {
        setKycReviewMessage(data.message || 'Failed to update document status.');
      }
    } catch (err) {
      setKycReviewMessage('Error updating document status.');
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
        {user?.role === 'ARTISAN' && (
          <button
            onClick={() => {
              document.getElementById('list-new-craft-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-primary text-white px-5 py-2.5 rounded-lg text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition-all mt-4 md:mt-0"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            List New Craft
          </button>
        )}
      </div>

      {/* CUSTOMER PORTAL */}
      {user?.role === 'CUSTOMER' && (
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-display text-3xl font-light text-on-surface">Your Acquisitions & Orders</h2>
            {customerOrders.length > 2 && (
              <button
                onClick={() => setShowAllCustomerOrders(!showAllCustomerOrders)}
                className="text-xs text-primary hover:text-secondary font-semibold uppercase tracking-wider transition-all cursor-pointer"
              >
                {showAllCustomerOrders ? 'Show Less' : 'View All'}
              </button>
            )}
          </div>
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
              {(showAllCustomerOrders ? customerOrders : customerOrders.slice(0, 2)).map((order) => (
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
                        <span className="font-medium font-display text-base text-primary">{formatPrice(item.price * item.quantity, currency)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between pt-4 border-t border-outline-variant/10 font-sans text-xs">
                    <span className="text-secondary">Shipping to: <i>{order.shippingAddress}</i></span>
                    <span className="text-lg font-bold font-display text-primary">Total: {formatPrice(order.totalAmount, currency)}</span>
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
                      {formatPrice(artisanOrders.reduce((sum, o) => sum + o.totalAmount, 0), currency)}
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
                  <div className="flex justify-between items-center">
                    <h2 className="font-display text-3xl font-light text-on-surface">Your Shop Offerings</h2>
                    {artisanProducts.length > 2 && (
                      <button
                        onClick={() => setShowAllArtisanProducts(!showAllArtisanProducts)}
                        className="text-xs text-primary hover:text-secondary font-semibold uppercase tracking-wider transition-all cursor-pointer"
                      >
                        {showAllArtisanProducts ? 'Show Less' : 'View All'}
                      </button>
                    )}
                  </div>
                  {artisanProducts.length === 0 ? (
                    <p className="text-xs text-secondary italic">No products currently listed.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(showAllArtisanProducts ? artisanProducts : artisanProducts.slice(0, 2)).map((prod) => (
                        <div key={prod.id} className="flex gap-4 p-3 border border-outline-variant/20 rounded-xl bg-white relative items-center justify-between">
                          <div className="flex gap-3 items-center">
                            <div className="w-12 h-12 bg-secondary-container/10 rounded relative overflow-hidden flex-shrink-0">
                              <img src={prod.images?.[0]} className="object-cover w-full h-full" />
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold line-clamp-1">{prod.title}</h4>
                              <p className="text-[10px] text-secondary">Price: {formatPrice(prod.price, currency)} • Stock: {prod.stock}</p>
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
                  <div className="flex justify-between items-center">
                    <h2 className="font-display text-3xl font-light text-on-surface">Customer Orders Checklist</h2>
                    {artisanOrders.length > 2 && (
                      <button
                        onClick={() => setShowAllArtisanOrders(!showAllArtisanOrders)}
                        className="text-xs text-primary hover:text-secondary font-semibold uppercase tracking-wider transition-all cursor-pointer"
                      >
                        {showAllArtisanOrders ? 'Show Less' : 'View All'}
                      </button>
                    )}
                  </div>
                  {artisanOrders.length === 0 ? (
                    <p className="text-xs text-secondary italic">No customer orders received yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {(showAllArtisanOrders ? artisanOrders : artisanOrders.slice(0, 2)).map((ord) => (
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
                                <span className="font-medium text-on-surface">{formatPrice(item.price * item.quantity, currency)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Artisan KYC Verification Workspace */}
                  <div className="space-y-6 border-t border-outline-variant/10 pt-8">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="font-display text-3xl font-light text-on-surface">Ongoing KYC Verification</h2>
                        <p className="text-xs text-secondary mt-1">Submit required documents to verify your bank details and identity.</p>
                      </div>
                      {profile?.isVerified ? (
                        <span className="bg-primary-container/30 text-primary text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">verified</span> Profile Verified
                        </span>
                      ) : (
                        <span className="bg-secondary-container/50 text-secondary text-xs font-semibold px-3 py-1 rounded-full">
                          Pending Profile Verification
                        </span>
                      )}
                    </div>

                    {/* KYC Upload Box */}
                    <div className="bg-white border border-outline-variant/20 rounded-xl p-6 luxury-shadow space-y-4">
                      <h3 className="font-display text-lg font-light text-primary">Submit KYC Document</h3>
                      <form onSubmit={handleSubmitKycDocument} className="space-y-4 font-sans text-xs">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-secondary font-semibold uppercase tracking-wider block">Document Type</label>
                            <select
                              value={kycDocType}
                              onChange={(e) => setKycDocType(e.target.value)}
                              className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none animate-none"
                            >
                              <option value="NATIONAL_ID">National Identity Proof (ID Card/Passport)</option>
                              <option value="BANK_STATEMENT">Bank Statement / Canceled Cheque</option>
                              <option value="TAX_REGISTRATION">Tax Registration Certificate</option>
                              <option value="BUSINESS_REGISTRATION">Business Incorporation Certificate</option>
                              <option value="OTHER">Other Proof</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-secondary font-semibold uppercase tracking-wider block">Document File (PDF, PNG, JPG)</label>
                            <div className="flex items-center gap-3">
                              <label className={`bg-primary/10 text-primary border border-primary/20 px-3 py-2 rounded text-[10px] uppercase tracking-widest font-semibold cursor-pointer hover:bg-primary/15 transition-all flex items-center gap-1.5 ${kycUploading ? 'opacity-50' : ''}`}>
                                <span className="material-symbols-outlined text-sm">{kycUploading ? 'progress_activity' : 'cloud_upload'}</span>
                                {kycUploading ? 'Uploading...' : 'Choose File'}
                                <input
                                  type="file"
                                  accept="image/*,application/pdf"
                                  className="hidden"
                                  disabled={kycUploading}
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      setKycUploading(true);
                                      setKycMessage('Uploading document to secure vault...');
                                      const formData = new FormData();
                                      formData.append('file', file);
                                      try {
                                        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.sunartn.com/api'}/upload`, {
                                          method: 'POST',
                                          headers: { Authorization: `Bearer ${token}` },
                                          body: formData,
                                        });
                                        const data = await res.json();
                                        if (res.ok && data.url) {
                                          setKycFileUrl(data.url);
                                          setKycFileName(file.name);
                                          setKycMessage('Document uploaded. Ready to submit.');
                                        } else {
                                          setKycMessage(data.message || 'File upload failed.');
                                        }
                                      } catch (err) {
                                        setKycMessage('Network error uploading file.');
                                      } finally {
                                        setKycUploading(false);
                                      }
                                    }
                                  }}
                                />
                              </label>
                              {kycFileName && (
                                <span className="text-xs text-secondary font-medium line-clamp-1">{kycFileName}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={kycUploading || !kycFileUrl}
                          className="w-full bg-primary text-white py-2.5 rounded font-semibold uppercase tracking-widest text-[10px] hover:opacity-95 disabled:opacity-50 cursor-pointer"
                        >
                          Submit Document for Verification
                        </button>

                        {kycMessage && (
                          <p className="text-xs text-primary font-medium mt-2">{kycMessage}</p>
                        )}
                      </form>
                    </div>

                    {/* List of KYC Documents */}
                    <div className="space-y-3">
                      <h3 className="font-display text-lg font-light text-primary">Verification Status Checklist</h3>
                      {kycDocuments.length === 0 ? (
                        <p className="text-xs text-secondary italic">No document verification submissions found.</p>
                      ) : (
                        <div className="space-y-3">
                          {kycDocuments.map((doc) => (
                            <div key={doc.id} className="bg-white border border-outline-variant/20 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 font-sans text-xs">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-on-surface uppercase">{doc.documentType.replace('_', ' ')}</span>
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                    doc.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                    doc.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                    doc.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-gray-100 text-gray-700'
                                  }`}>
                                    {doc.status}
                                  </span>
                                </div>
                                <p className="text-[10px] text-secondary mt-1">Requested/Submitted: {new Date(doc.createdAt).toLocaleDateString()}</p>
                                {doc.adminNote && (
                                  <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded border border-red-100 mt-2 font-medium">
                                    <b>Gaatha Feedback:</b> {doc.adminNote}
                                  </p>
                                )}
                              </div>
                              {doc.fileUrl && (
                                <a
                                  href={doc.fileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[10px] font-bold uppercase tracking-widest text-primary border border-primary/20 px-3 py-1.5 rounded hover:bg-primary/5 cursor-pointer"
                                >
                                  View File
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
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
                      {formatPrice(adminOrders.reduce((sum, o) => sum + o.totalAmount, 0), currency)}
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
                  <div className="flex justify-between items-center">
                    <h2 className="font-display text-3xl font-light text-on-surface">Artisan Verification Workspace</h2>
                    {adminArtisans.length > 2 && (
                      <button
                        onClick={() => setShowAllAdminArtisans(!showAllAdminArtisans)}
                        className="text-xs text-primary hover:text-secondary font-semibold uppercase tracking-wider transition-all cursor-pointer"
                      >
                        {showAllAdminArtisans ? 'Show Less' : 'View All'}
                      </button>
                    )}
                  </div>
                  {adminArtisans.length === 0 ? (
                    <p className="text-xs text-secondary italic">No registered artisans found.</p>
                  ) : (
                    <div className="space-y-3">
                      {(showAllAdminArtisans ? adminArtisans : adminArtisans.slice(0, 2)).map((artisan) => (
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

                {/* Admin KYC Document Workspace */}
                <div className="space-y-6 border-t border-outline-variant/10 pt-8">
                  <div>
                    <h2 className="font-display text-3xl font-light text-on-surface">Ongoing KYC Review Center</h2>
                    <p className="text-xs text-secondary mt-1">Manage ongoing document requests and review submissions from artisans.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    {/* Left: Request Form */}
                    <div className="md:col-span-4 bg-white border border-outline-variant/20 rounded-xl p-5 luxury-shadow space-y-4">
                      <h3 className="font-display text-lg font-light text-primary border-b border-outline-variant/10 pb-2">Request Document</h3>
                      <form onSubmit={handleRequestKycDocument} className="space-y-3 font-sans text-xs">
                        <div className="space-y-1">
                          <label className="text-secondary font-semibold uppercase tracking-wider block">Select Artisan</label>
                          <select
                            value={kycRequestArtisanId}
                            onChange={(e) => setKycRequestArtisanId(e.target.value)}
                            className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none"
                          >
                            <option value="">-- Choose Artisan --</option>
                            {adminArtisans.map((artisan) => (
                              <option key={artisan.id} value={artisan.id}>
                                {artisan.user?.name} ({artisan.region})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-secondary font-semibold uppercase tracking-wider block">Document Type</label>
                          <select
                            value={kycRequestDocType}
                            onChange={(e) => setKycRequestDocType(e.target.value)}
                            className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none"
                          >
                            <option value="NATIONAL_ID">National Identity Proof (ID/Passport)</option>
                            <option value="BANK_STATEMENT">Bank Statement / Canceled Cheque</option>
                            <option value="TAX_REGISTRATION">Tax Registration Certificate</option>
                            <option value="BUSINESS_REGISTRATION">Business Incorporation Certificate</option>
                            <option value="OTHER">Other Verification Document</option>
                          </select>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-primary text-white py-2 rounded font-semibold uppercase tracking-widest text-[10px] hover:opacity-95 cursor-pointer"
                        >
                          Send Request
                        </button>

                        {kycReviewMessage && (
                          <p className="text-xs text-primary font-medium mt-1">{kycReviewMessage}</p>
                        )}
                      </form>
                    </div>

                    {/* Right: Review Queue */}
                    <div className="md:col-span-8 space-y-4">
                      <h3 className="font-display text-lg font-light text-primary">KYC Document Submissions</h3>
                      {adminKycDocuments.length === 0 ? (
                        <p className="text-xs text-secondary italic bg-secondary-container/10 p-5 rounded-xl border border-dashed text-center">
                          No KYC document records found in the system.
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {adminKycDocuments.map((doc) => (
                            <div key={doc.id} className="bg-white border border-outline-variant/20 rounded-xl p-5 luxury-shadow space-y-4 font-sans text-xs">
                              <div className="flex justify-between items-start pb-2 border-b border-outline-variant/10">
                                <div>
                                  <h4 className="font-semibold text-sm text-on-surface uppercase">
                                    {doc.documentType.replace('_', ' ')}
                                  </h4>
                                  <p className="text-[10px] text-secondary mt-0.5">
                                    Artisan: <b>{doc.artisanProfile?.user?.name}</b> ({doc.artisanProfile?.user?.email})
                                  </p>
                                </div>
                                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                                  doc.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                  doc.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                  doc.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {doc.status}
                                </span>
                              </div>

                              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                                <div>
                                  <p className="text-[10px] text-secondary">
                                    Requested: {new Date(doc.requestedAt).toLocaleDateString()}
                                    {doc.reviewedAt && ` • Reviewed: ${new Date(doc.reviewedAt).toLocaleDateString()}`}
                                  </p>
                                  {doc.fileName && (
                                    <p className="text-[10px] text-on-surface mt-1">
                                      File Name: <span className="font-mono">{doc.fileName}</span>
                                    </p>
                                  )}
                                  {doc.adminNote && (
                                    <p className="text-xs text-secondary italic bg-secondary-container/20 p-2 rounded border mt-2">
                                      <b>Previous Note:</b> {doc.adminNote}
                                    </p>
                                  )}
                                </div>

                                {doc.fileUrl && (
                                  <a
                                    href={doc.fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[10px] font-bold uppercase tracking-widest text-primary border border-primary/20 px-3 py-1.5 rounded hover:bg-primary/5 cursor-pointer whitespace-nowrap"
                                  >
                                    Review Document
                                  </a>
                                )}
                              </div>

                              {doc.status === 'PENDING' && (
                                <div className="space-y-2 border-t border-outline-variant/10 pt-3">
                                  <label className="text-[10px] uppercase tracking-widest text-secondary font-semibold block">
                                    Review Note / Rejection Reason
                                  </label>
                                  <textarea
                                    placeholder="Provide feedback note for approval or reasons for rejection/clarification..."
                                    value={kycReviewNote}
                                    onChange={(e) => setKycReviewNote(e.target.value)}
                                    rows={2}
                                    className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none"
                                  />
                                  <div className="flex gap-3 pt-1">
                                    <button
                                      onClick={() => handleReviewKycDocument(doc.id, 'APPROVED')}
                                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded text-[10px] uppercase tracking-widest cursor-pointer transition-colors"
                                    >
                                      Approve & Verify
                                    </button>
                                    <button
                                      onClick={() => handleReviewKycDocument(doc.id, 'REJECTED')}
                                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded text-[10px] uppercase tracking-widest cursor-pointer transition-colors"
                                    >
                                      Reject / Question Document
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                                 {/* Global Orders */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="font-display text-3xl font-light text-on-surface">Global Platform Acquisitions</h2>
                    {adminOrders.length > 2 && (
                      <button
                        onClick={() => setShowAllAdminOrders(!showAllAdminOrders)}
                        className="text-xs text-primary hover:text-secondary font-semibold uppercase tracking-wider transition-all cursor-pointer"
                      >
                        {showAllAdminOrders ? 'Show Less' : 'View All'}
                      </button>
                    )}
                  </div>
                  {adminOrders.length === 0 ? (
                    <p className="text-xs text-secondary italic">No acquisitions in the system.</p>
                  ) : (
                    <div className="space-y-4">
                      {(showAllAdminOrders ? adminOrders : adminOrders.slice(0, 2)).map((ord) => (
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
                                <span className="font-medium text-on-surface">{formatPrice(item.price * item.quantity, currency)}</span>
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
                  <div className="flex justify-between items-center">
                    <h2 className="font-display text-3xl font-light text-on-surface">Platform Catalog Listings</h2>
                    {adminProducts.length > 2 && (
                      <button
                        onClick={() => setShowAllAdminProducts(!showAllAdminProducts)}
                        className="text-xs text-primary hover:text-secondary font-semibold uppercase tracking-wider transition-all cursor-pointer"
                      >
                        {showAllAdminProducts ? 'Show Less' : 'View All'}
                      </button>
                    )}
                  </div>
                  {adminProducts.length === 0 ? (
                    <p className="text-xs text-secondary italic">No products listed on the platform.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(showAllAdminProducts ? adminProducts : adminProducts.slice(0, 2)).map((prod) => (
                        <div key={prod.id} className="flex gap-4 p-3 border border-outline-variant/20 rounded-xl bg-white relative items-center justify-between luxury-shadow">
                          <div className="flex gap-3 items-center">
                            <div className="w-12 h-12 bg-secondary-container/10 rounded relative overflow-hidden flex-shrink-0">
                              <img src={prod.images?.[0]} className="object-cover w-full h-full" />
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold line-clamp-1">{prod.title}</h4>
                              <p className="text-[10px] text-secondary">Price: {formatPrice(prod.price, currency)} • Stock: {prod.stock}</p>
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
                </div>      </div>
              </>
            )}

          </div>

          {/* Right panel: Profile & Add New Offering Form */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Profile & Organization Details Card */}
            {user?.role === 'ARTISAN' && !editProfileMode && (
              <div className="bg-secondary-container/20 p-6 border border-outline-variant/10 rounded-xl space-y-4">
                <div className="flex justify-between items-center border-b border-outline-variant/30 pb-3">
                  <h3 className="font-display text-2xl font-light text-primary">
                    Artisan Profile
                  </h3>
                  <button
                    onClick={() => setEditProfileMode(true)}
                    className="text-[10px] font-bold text-primary border border-primary/20 px-2 py-1 rounded hover:bg-primary/5 cursor-pointer uppercase tracking-wider"
                  >
                    Edit Profile
                  </button>
                </div>
                
                <div className="space-y-3 font-sans text-xs">
                  {/* Images */}
                  <div className="flex gap-4 items-center">
                    {profile?.logoUrl && (
                      <div className="w-12 h-12 rounded border border-outline-variant/30 overflow-hidden relative bg-white">
                        <img src={profile.logoUrl} alt="Store logo" className="object-cover w-full h-full" />
                      </div>
                    )}
                    <div>
                      <span className="text-secondary font-semibold uppercase tracking-wider block text-[9px]">Contact Number</span>
                      <p className="text-on-surface font-medium">{profile?.contactNumber || "Not specified"}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-secondary font-semibold uppercase tracking-wider block text-[9px]">Biography</span>
                    <p className="text-on-surface bg-white/50 p-2.5 rounded border border-outline-variant/10 min-h-[60px] italic whitespace-pre-wrap">
                      {profile?.bio || "No biography provided yet."}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-secondary font-semibold uppercase tracking-wider block text-[9px]">Studio Location</span>
                      <p className="text-on-surface font-medium">{profile?.studioLocation || "Not specified"}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-secondary font-semibold uppercase tracking-wider block text-[9px]">Region & Craft</span>
                      <p className="text-on-surface font-medium">{profile?.region} • {profile?.craft}</p>
                    </div>
                  </div>

                  <div className="border-t border-outline-variant/15 pt-3 space-y-2">
                    <span className="text-secondary font-semibold uppercase tracking-wider block text-[9px]">Store Address & Location</span>
                    <div className="bg-white/45 p-3 rounded border border-outline-variant/20 space-y-1 text-on-surface font-medium">
                      <p>{profile?.companyName || "No Company Name"}</p>
                      <p>{profile?.fullAddress || "No address"}</p>
                      <p>{profile?.city}, {profile?.zone}, {profile?.postcode}</p>
                      <p className="uppercase text-[9px] text-secondary">Country: {profile?.country}</p>
                    </div>
                  </div>

                  <div className="border-t border-outline-variant/15 pt-3 space-y-2">
                    <span className="text-secondary font-semibold uppercase tracking-wider block text-[9px]">Policies & SEO</span>
                    <div className="bg-white/45 p-3 rounded border border-outline-variant/20 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-secondary">Tax ID:</span>
                        <span className="font-medium text-on-surface">{profile?.taxNumber || "Not Provided"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-secondary">Shipping Charge:</span>
                        <span className="font-medium text-on-surface">${profile?.shippingCharges}</span>
                      </div>
                      <div className="space-y-1 border-t border-outline-variant/10 pt-1">
                        <span className="text-secondary text-[10px] block">Shipping Policy:</span>
                        <p className="text-on-surface italic">{profile?.shippingPolicy || "Not specified"}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-secondary text-[10px] block">Return Policy:</span>
                        <p className="text-on-surface italic">{profile?.returnPolicy || "Not specified"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-outline-variant/15 pt-3 space-y-2">
                    <span className="text-secondary font-semibold uppercase tracking-wider block text-[9px]">Incorporation Status</span>
                    {profile?.hasOrganization ? (
                      <div className="space-y-2 bg-white/45 p-3 rounded border border-outline-variant/20">
                        <div className="flex justify-between">
                          <span className="text-secondary">Org Name:</span>
                          <span className="font-medium text-on-surface">{profile?.organizationName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-secondary">Inc. No:</span>
                          <span className="font-medium text-on-surface">{profile?.incorporationNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-secondary">GSTIN:</span>
                          <span className="font-medium text-on-surface">{profile?.gstNumber || "Not Provided"}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-secondary italic">Individual / Sole Artisan (No organization details registered)</p>
                    )}
                  </div>

                  <div className="border-t border-outline-variant/15 pt-3 space-y-2">
                    <span className="text-secondary font-semibold uppercase tracking-wider block text-[9px]">Payout Preferences ({profile?.payoutType || 'BANK'})</span>
                    {profile?.payoutType === 'PAYPAL' ? (
                      <div className="bg-white/45 p-3 rounded border border-outline-variant/20 flex justify-between">
                        <span className="text-secondary">PayPal Email:</span>
                        <span className="font-medium text-on-surface">{profile?.paypalEmail}</span>
                      </div>
                    ) : profile?.bankAccountNumber ? (
                      <div className="space-y-2 bg-white/45 p-3 rounded border border-outline-variant/20">
                        <div className="flex justify-between">
                          <span className="text-secondary">Holder Name:</span>
                          <span className="font-medium text-on-surface">{profile?.bankAccountName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-secondary">Bank Name:</span>
                          <span className="font-medium text-on-surface">{profile?.bankName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-secondary">Branch:</span>
                          <span className="font-medium text-on-surface">{profile?.bankBranch}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-secondary">SWIFT:</span>
                          <span className="font-medium text-on-surface">{profile?.bankSwiftCode || "Not provided"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-secondary">Account No:</span>
                          <span className="font-medium text-on-surface">{profile?.bankAccountNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-secondary">IFSC Code:</span>
                          <span className="font-medium text-on-surface">{profile?.bankIfsc}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-secondary italic">No payout details registered</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Profile Editing Form */}
            {user?.role === 'ARTISAN' && editProfileMode && (
              <form onSubmit={handleUpdateProfile} className="bg-secondary-container/20 p-6 border border-outline-variant/10 rounded-xl space-y-4">
                <div className="flex justify-between items-center border-b border-outline-variant/30 pb-3">
                  <h3 className="font-display text-2xl font-light text-primary">
                    Edit Profile
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setEditProfileMode(false);
                      // Reset states
                      if (profile) {
                        setBio(profile.bio || '');
                        setStudioLocation(profile.studioLocation || '');
                        setHasOrganization(profile.hasOrganization || false);
                        setOrganizationName(profile.organizationName || '');
                        setIncorporationNumber(profile.incorporationNumber || '');
                        setGstNumber(profile.gstNumber || '');
                        setBankAccountName(profile.bankAccountName || '');
                        setBankName(profile.bankName || '');
                        setBankAccountNumber(profile.bankAccountNumber || '');
                        setBankIfsc(profile.bankIfsc || '');
                        setContactNumber(profile.contactNumber || '');
                        setCompanyName(profile.companyName || '');
                        setFullAddress(profile.fullAddress || '');
                        setCity(profile.city || '');
                        setCountry(profile.country || '');
                        setZone(profile.zone || '');
                        setPostcode(profile.postcode || '');
                        setStoreDescription(profile.storeDescription || '');
                        setStoreAbout(profile.storeAbout || '');
                        setMetaDescription(profile.metaDescription || '');
                        setMetaKeywords(profile.metaKeywords || '');
                        setShippingPolicy(profile.shippingPolicy || '');
                        setReturnPolicy(profile.returnPolicy || '');
                        setTaxNumber(profile.taxNumber || '');
                        setShippingCharges(String(profile.shippingCharges || '0'));
                        setLogoUrl(profile.logoUrl || '');
                        setAvatarUrl(profile.avatarUrl || '');
                        setBannerUrl(profile.bannerUrl || '');
                        setPayoutType(profile.payoutType || 'BANK');
                        setPaypalEmail(profile.paypalEmail || '');
                        setBankBranch(profile.bankBranch || '');
                        setBankSwiftCode(profile.bankSwiftCode || '');
                      }
                      setProfileMessage('');
                    }}
                    className="text-[10px] font-bold text-red-600 border border-red-200 px-2 py-1 rounded hover:bg-red-50 cursor-pointer uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                </div>

                <div className="space-y-4 font-sans text-xs">
                  {/* Account & Contact */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-secondary font-semibold uppercase tracking-wider block">Contact Number</label>
                      <input
                        type="text"
                        required
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-secondary font-semibold uppercase tracking-wider block">Studio Location</label>
                      <input
                        type="text"
                        value={studioLocation}
                        onChange={(e) => setStudioLocation(e.target.value)}
                        placeholder="e.g. Jaipur, Rajasthan"
                        className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-secondary font-semibold uppercase tracking-wider block">Biography</label>
                    <textarea
                      required
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Share your heritage, craft technique, and story..."
                      rows={3}
                      className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none"
                    />
                  </div>

                  {/* Store Address & Identity */}
                  <div className="border-t border-outline-variant/15 pt-3 space-y-3">
                    <label className="text-secondary font-semibold uppercase tracking-wider block text-[10px]">Store Profile & Address</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-secondary font-semibold block text-[9px] uppercase">Company / Store Name</label>
                        <input
                          type="text"
                          required
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="e.g. Rameshwar Lal Pottery"
                          className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-secondary font-semibold block text-[9px] uppercase">Full Address</label>
                        <input
                          type="text"
                          required
                          value={fullAddress}
                          onChange={(e) => setFullAddress(e.target.value)}
                          placeholder="45 Craftsmans Lane"
                          className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-secondary font-semibold block text-[9px] uppercase">City</label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Jaipur"
                          className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-secondary font-semibold block text-[9px] uppercase">State / Zone</label>
                        <input
                          type="text"
                          required
                          value={zone}
                          onChange={(e) => setZone(e.target.value)}
                          placeholder="Rajasthan"
                          className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-secondary font-semibold block text-[9px] uppercase">ZIP / Postcode</label>
                        <input
                          type="text"
                          required
                          value={postcode}
                          onChange={(e) => setPostcode(e.target.value)}
                          placeholder="302001"
                          className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-secondary font-semibold block text-[9px] uppercase">Country</label>
                      <input
                        type="text"
                        required
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="India"
                        className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none"
                      />
                    </div>
                  </div>

                  {/* Policies & SEO */}
                  <div className="border-t border-outline-variant/15 pt-3 space-y-3">
                    <label className="text-secondary font-semibold uppercase tracking-wider block text-[10px]">Policies, SEO & Descriptions</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-secondary font-semibold block text-[9px] uppercase">Tax Number / ID</label>
                        <input
                          type="text"
                          required
                          value={taxNumber}
                          onChange={(e) => setTaxNumber(e.target.value)}
                          placeholder="TAX-123456"
                          className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-secondary font-semibold block text-[9px] uppercase">Shipping Charges ($ USD)</label>
                        <input
                          type="number"
                          required
                          value={shippingCharges}
                          onChange={(e) => setShippingCharges(e.target.value)}
                          placeholder="15"
                          className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-secondary font-semibold block text-[9px] uppercase">Store short description</label>
                      <input
                        type="text"
                        required
                        value={storeDescription}
                        onChange={(e) => setStoreDescription(e.target.value)}
                        placeholder="Handcrafted ceramics representing ancestral design..."
                        className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-secondary font-semibold block text-[9px] uppercase">Detailed About store</label>
                      <textarea
                        required
                        value={storeAbout}
                        onChange={(e) => setStoreAbout(e.target.value)}
                        placeholder="Detail the complete heritage, vision and processes of your studio..."
                        rows={2}
                        className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-secondary font-semibold block text-[9px] uppercase">Meta Description (SEO)</label>
                        <input
                          type="text"
                          value={metaDescription}
                          onChange={(e) => setMetaDescription(e.target.value)}
                          className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-secondary font-semibold block text-[9px] uppercase">Meta Keywords (SEO)</label>
                        <input
                          type="text"
                          value={metaKeywords}
                          onChange={(e) => setMetaKeywords(e.target.value)}
                          className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-secondary font-semibold block text-[9px] uppercase">Shipping Policy</label>
                        <textarea
                          required
                          value={shippingPolicy}
                          onChange={(e) => setShippingPolicy(e.target.value)}
                          rows={2}
                          className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-secondary font-semibold block text-[9px] uppercase">Return Policy</label>
                        <textarea
                          required
                          value={returnPolicy}
                          onChange={(e) => setReturnPolicy(e.target.value)}
                          rows={2}
                          className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* S3 Media Uploads */}
                  <div className="border-t border-outline-variant/15 pt-3 space-y-3">
                    <label className="text-secondary font-semibold uppercase tracking-wider block text-[10px]">Store Media Assets</label>
                    
                    {/* Logo Upload */}
                    <div className="space-y-2">
                      <label className="text-secondary font-semibold block text-[9px] uppercase">Store Logo Image</label>
                      <div className="flex items-center gap-3">
                        <label className={`bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded text-[10px] uppercase tracking-widest font-semibold cursor-pointer hover:bg-primary/15 transition-all flex items-center gap-1.5 ${uploading ? 'opacity-50' : ''}`}>
                          <span className="material-symbols-outlined text-sm">cloud_upload</span>
                          Upload Logo
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploading}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setUploading(true);
                                const formData = new FormData();
                                formData.append('file', file);
                                try {
                                  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.sunartn.com/api'}/upload`, {
                                    method: 'POST',
                                    headers: { Authorization: `Bearer ${token}` },
                                    body: formData,
                                  });
                                  const data = await res.json();
                                  if (res.ok && data.url) setLogoUrl(data.url);
                                } catch (err) { console.error(err); }
                                finally { setUploading(false); }
                              }
                            }}
                          />
                        </label>
                        {logoUrl && (
                          <div className="w-8 h-8 rounded border overflow-hidden bg-white">
                            <img src={logoUrl} className="object-cover w-full h-full" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Banner Upload */}
                    <div className="space-y-2">
                      <label className="text-secondary font-semibold block text-[9px] uppercase">Store Banner Image</label>
                      <div className="flex items-center gap-3">
                        <label className={`bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded text-[10px] uppercase tracking-widest font-semibold cursor-pointer hover:bg-primary/15 transition-all flex items-center gap-1.5 ${uploading ? 'opacity-50' : ''}`}>
                          <span className="material-symbols-outlined text-sm">cloud_upload</span>
                          Upload Banner
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploading}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setUploading(true);
                                const formData = new FormData();
                                formData.append('file', file);
                                try {
                                  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.sunartn.com/api'}/upload`, {
                                    method: 'POST',
                                    headers: { Authorization: `Bearer ${token}` },
                                    body: formData,
                                  });
                                  const data = await res.json();
                                  if (res.ok && data.url) setBannerUrl(data.url);
                                } catch (err) { console.error(err); }
                                finally { setUploading(false); }
                              }
                            }}
                          />
                        </label>
                        {bannerUrl && (
                          <div className="w-16 h-8 rounded border overflow-hidden bg-white">
                            <img src={bannerUrl} className="object-cover w-full h-full" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Organization info (existing checkbox/fields) */}
                  <div className="flex items-center gap-2 py-1 border-t border-outline-variant/15 pt-3">
                    <input
                      type="checkbox"
                      id="hasOrganization"
                      checked={hasOrganization}
                      onChange={(e) => setHasOrganization(e.target.checked)}
                      className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-0 focus:ring-offset-0"
                    />
                    <label htmlFor="hasOrganization" className="text-secondary font-semibold uppercase tracking-wider select-none cursor-pointer">
                      Operate under Registered Organization
                    </label>
                  </div>

                  {hasOrganization && (
                    <div className="space-y-3 border-l-2 border-primary/20 pl-3 pt-1">
                      <div className="space-y-1">
                        <label className="text-secondary font-semibold uppercase tracking-wider block text-[10px]">Organization Name</label>
                        <input
                          type="text"
                          required={hasOrganization}
                          value={organizationName}
                          onChange={(e) => setOrganizationName(e.target.value)}
                          placeholder="e.g. Jaipur Clayworks Ltd."
                          className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-secondary font-semibold uppercase tracking-wider block text-[10px]">Incorporation Number</label>
                        <input
                          type="text"
                          required={hasOrganization}
                          value={incorporationNumber}
                          onChange={(e) => setIncorporationNumber(e.target.value)}
                          placeholder="e.g. U12345RJ2026PTC012345"
                          className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-secondary font-semibold uppercase tracking-wider block text-[10px]">GST Number</label>
                        <input
                          type="text"
                          required={hasOrganization}
                          value={gstNumber}
                          onChange={(e) => setGstNumber(e.target.value)}
                          placeholder="e.g. 08AAPCS1234F1Z1"
                          className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Payout Details Toggle */}
                  <div className="border-t border-outline-variant/15 pt-3 space-y-3">
                    <label className="text-secondary font-semibold uppercase tracking-wider block text-[10px]">Payout Details Preferences</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={payoutType === 'BANK'}
                          onChange={() => setPayoutType('BANK')}
                          className="text-primary"
                        />
                        <span>Bank Transfer Details</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={payoutType === 'PAYPAL'}
                          onChange={() => setPayoutType('PAYPAL')}
                          className="text-primary"
                        />
                        <span>PayPal Account</span>
                      </label>
                    </div>

                    {payoutType === 'PAYPAL' ? (
                      <div className="space-y-1">
                        <label className="text-secondary font-semibold block text-[9px] uppercase">PayPal Email Address</label>
                        <input
                          type="email"
                          required
                          value={paypalEmail}
                          onChange={(e) => setPaypalEmail(e.target.value)}
                          placeholder="paypal@myartisanstudio.com"
                          className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none"
                        />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-secondary font-semibold uppercase tracking-wider block text-[9px]">Account Holder Name</label>
                            <input
                              type="text"
                              value={bankAccountName}
                              onChange={(e) => setBankAccountName(e.target.value)}
                              placeholder="e.g. Rameshwar Lal"
                              className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-secondary font-semibold uppercase tracking-wider block text-[9px]">Bank Name</label>
                            <input
                              type="text"
                              value={bankName}
                              onChange={(e) => setBankName(e.target.value)}
                              placeholder="e.g. State Bank of India"
                              className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="space-y-1 col-span-2">
                            <label className="text-[10px] uppercase tracking-widest text-secondary font-semibold">Branch Name</label>
                            <input
                              type="text"
                              value={bankBranch}
                              onChange={(e) => setBankBranch(e.target.value)}
                              placeholder="Jaipur Main Branch"
                              className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest text-secondary font-semibold">SWIFT Code</label>
                            <input
                              type="text"
                              value={bankSwiftCode}
                              onChange={(e) => setBankSwiftCode(e.target.value)}
                              placeholder="SBININBBXXX"
                              className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-secondary font-semibold uppercase tracking-wider block text-[9px]">Account Number</label>
                            <input
                              type="text"
                              value={bankAccountNumber}
                              onChange={(e) => setBankAccountNumber(e.target.value)}
                              placeholder="e.g. 100200300400"
                              className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-secondary font-semibold uppercase tracking-wider block text-[9px]">IFSC Code</label>
                            <input
                              type="text"
                              value={bankIfsc}
                              onChange={(e) => setBankIfsc(e.target.value)}
                              placeholder="e.g. SBIN0001234"
                              className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-3 rounded text-xs uppercase tracking-widest font-semibold hover:opacity-95 transition-all cursor-pointer"
                  >
                    Save Profile Settings
                  </button>

                  {profileMessage && (
                    <p className="text-xs text-primary font-medium mt-2">{profileMessage}</p>
                  )}
                </div>
              </form>
            )}

            {/* List New Craft Form */}
            <div id="list-new-craft-section" className="bg-secondary-container/20 p-6 border border-outline-variant/10 rounded-xl space-y-4">
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
                  <div className="flex justify-between items-center">
                    <label className="text-secondary font-semibold uppercase tracking-wider block">Description</label>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!title) {
                          setProductMessage('Please fill in the Product Title first.');
                          return;
                        }
                        setProductMessage('Generating AI description...');
                        try {
                          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.sunartn.com/api'}/ai/describe`, {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({ title }),
                          });
                          const data = await res.json();
                          if (res.ok && data.description) {
                            setDescription(data.description);
                            setProductMessage('Description generated successfully.');
                          } else {
                            setProductMessage(data.message || 'Failed to generate description.');
                          }
                        } catch (err) {
                          setProductMessage('Error generating AI description.');
                        }
                      }}
                      className="text-[10px] font-bold text-primary hover:opacity-85 flex items-center gap-0.5 cursor-pointer uppercase tracking-wider"
                    >
                      <span>✨ Magic Description</span>
                    </button>
                  </div>
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
                    <label className="text-secondary font-semibold uppercase tracking-wider block">Price (USD Base)</label>
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-secondary font-semibold uppercase tracking-wider block text-[9px]">Category</label>
                    <select
                      value={category}
                      onChange={(e) => {
                        const nextCat = e.target.value;
                        setCategory(nextCat);
                        const subCats = SUBCATEGORIES[nextCat] || [];
                        setSubcategory(subCats[0] || '');
                      }}
                      className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none"
                    >
                      <option>Women</option>
                      <option>Men</option>
                      <option>Kids</option>
                      <option>Jewellery</option>
                      <option>Accessory & Footwear</option>
                      <option>Home Textiles</option>
                      <option>Home Decor</option>
                      <option>Dining & Kitchen</option>
                      <option>Furniture</option>
                      <option>Gifting</option>
                      <option>More to Love</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-secondary font-semibold uppercase tracking-wider block text-[9px]">Subcategory</label>
                    <select
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                      className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none"
                    >
                      {(SUBCATEGORIES[category] || []).map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-secondary font-semibold uppercase tracking-wider block text-[9px]">Craft</label>
                    <select value={craft} onChange={(e) => setCraft(e.target.value)} className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none">
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
                  <div className="space-y-1">
                    <label className="text-secondary font-semibold uppercase tracking-wider block text-[9px]">Region</label>
                    <select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none">
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
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                {(craft === 'Other' || region === 'Other') && (
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {craft === 'Other' && (
                      <div className="space-y-1">
                        <label className="text-secondary font-semibold uppercase tracking-wider block text-[9px]">Custom Craft Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Clay sculpting"
                          value={customCraft}
                          onChange={(e) => setCustomCraft(e.target.value)}
                          className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none"
                        />
                      </div>
                    )}
                    {region === 'Other' && (
                      <div className="space-y-1">
                        <label className="text-secondary font-semibold uppercase tracking-wider block text-[9px]">Custom Region Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ladakh"
                          value={customRegion}
                          onChange={(e) => setCustomRegion(e.target.value)}
                          className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none"
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-secondary font-semibold uppercase tracking-wider block text-[10px]">Product Image File</label>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <label className={`bg-primary/10 text-primary border border-primary/20 px-3 py-2 rounded text-xs uppercase tracking-widest font-semibold cursor-pointer hover:bg-primary/15 transition-all flex items-center gap-1.5 ${uploading || isEnhancing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <span className="material-symbols-outlined text-sm">{uploading ? 'progress_activity' : 'cloud_upload'}</span>
                        {uploading ? 'Uploading...' : 'Choose File'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploading || isEnhancing}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setSelectedImageFile(file);
                              setUploading(true);
                              setIsBlurry(false);
                              setProductMessage('Uploading image to S3...');
                              const formData = new FormData();
                              formData.append('file', file);
                              
                              try {
                                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.sunartn.com/api'}/upload`, {
                                  method: 'POST',
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                  },
                                  body: formData,
                                });
                                const data = await res.json();
                                if (res.ok && data.url) {
                                  setImageUrl(data.url);
                                  setProductMessage('Image uploaded successfully.');
                                  detectBlurryImage(data.url, file);
                                } else {
                                  setProductMessage(data.message || 'Image upload failed.');
                                }
                              } catch (err) {
                                setProductMessage('Network error uploading image.');
                              } finally {
                                setUploading(false);
                              }
                            }
                          }}
                        />
                      </label>
                      {imageUrl && (
                        <div className="relative w-16 h-16 rounded-lg border border-outline-variant/30 overflow-hidden bg-secondary-container/10 luxury-shadow">
                          <img src={imageUrl} alt="Upload preview" className="object-cover w-full h-full" />
                          {isEnhancing && (
                            <div className="absolute inset-0 bg-primary/10 flex flex-col justify-end">
                              <div className="absolute top-0 w-full h-0.5 bg-accent shadow-[0_0_8px_#ffd700] animate-scan"></div>
                              <div className="bg-black/85 text-white text-[8px] uppercase tracking-normal text-center py-0.5 font-bold">
                                Enhancing...
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Image Enhancer Actions - Always Available when imageUrl is set */}
                    {imageUrl && !isEnhancing && (
                      <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 space-y-2 text-xs text-primary flex flex-col animate-in fade-in duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-medium">
                            <span className="material-symbols-outlined text-[15px]">magic_button</span>
                            <span className="font-semibold uppercase tracking-wider text-[10px]">AI Image Enhancer</span>
                          </div>
                          {isBlurry && (
                            <span className="bg-amber-500/20 text-amber-800 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-0.5">
                              <span className="material-symbols-outlined text-[10px]">warning</span> Blurry
                            </span>
                          )}
                        </div>
                        
                        {isBlurry ? (
                          <p className="text-[10px] leading-relaxed text-secondary">
                            Our analysis indicates this photo has low contrast or detail. Enhance it automatically for high-resolution clarity.
                          </p>
                        ) : (
                          <p className="text-[10px] leading-relaxed text-secondary">
                            Sharpen edges, boost colors, and double the resolution of your product photo using AI super-resolution.
                          </p>
                        )}
                        
                        <button
                          type="button"
                          onClick={enhanceImageWithAI}
                          className="bg-primary hover:bg-primary/95 text-white font-bold uppercase tracking-widest text-[9px] py-1.5 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 w-fit cursor-pointer border-none"
                        >
                          <span className="material-symbols-outlined text-[12px] animate-pulse">blur_off</span>
                          Enhance Photo Now
                        </button>
                      </div>
                    )}

                    {/* Enhancer Status Display */}
                    {isEnhancing && (
                      <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 space-y-2 text-xs text-primary flex flex-col items-center text-center animate-in fade-in duration-300">
                        <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                        <div>
                          <p className="font-semibold text-[10px] uppercase tracking-wider">{enhanceStatus}</p>
                          <p className="text-[9px] text-secondary mt-0.5">Running super-resolution convolution filters...</p>
                        </div>
                      </div>
                    )}

                    {/* Custom Inline CSS for scan effect */}
                    <style>{`
                      @keyframes scan {
                        0% { top: 0%; }
                        50% { top: 100%; }
                        100% { top: 0%; }
                      }
                      .animate-scan {
                        animation: scan 2s linear infinite;
                      }
                    `}</style>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-secondary font-semibold uppercase tracking-wider block">Or Product Image URL</label>
                  <input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setSelectedImageFile(null);
                      detectBlurryImage(e.target.value, null);
                    }}
                    className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none"
                  />
                </div>

                {/* Product Video File Upload Field */}
                <div className="space-y-2 border-t border-outline-variant/10 pt-4">
                  <label className="text-secondary font-semibold uppercase tracking-wider block text-[10px]">Product Video File (Optional)</label>
                  <div className="flex items-center gap-3">
                    <label className={`bg-primary/10 text-primary border border-primary/20 px-3 py-2 rounded text-xs uppercase tracking-widest font-semibold cursor-pointer hover:bg-primary/15 transition-all flex items-center gap-1.5 ${videoUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <span className="material-symbols-outlined text-sm">{videoUploading ? 'progress_activity' : 'movie'}</span>
                      {videoUploading ? 'Uploading...' : 'Choose Video'}
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        disabled={videoUploading}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setVideoUploading(true);
                            setProductMessage('Uploading video to S3...');
                            const formData = new FormData();
                            formData.append('file', file);
                            
                            try {
                              const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.sunartn.com/api'}/upload`, {
                                method: 'POST',
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                },
                                body: formData,
                              });
                              const data = await res.json();
                              if (res.ok && data.url) {
                                setVideoUrl(data.url);
                                setProductMessage('Video uploaded successfully.');
                              } else {
                                setProductMessage(data.message || 'Video upload failed.');
                              }
                            } catch (err) {
                              setProductMessage('Network error uploading video.');
                            } finally {
                              setVideoUploading(false);
                            }
                          }
                        }}
                      />
                    </label>
                    {videoUrl && (
                      <div className="w-10 h-10 rounded border border-outline-variant/30 bg-secondary-container/10 flex items-center justify-center relative text-primary">
                        <span className="material-symbols-outlined text-lg">movie</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-secondary font-semibold uppercase tracking-wider block">Or Product Video URL</label>
                  <input
                    type="text"
                    placeholder="https://example.com/video.mp4"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full p-2.5 border border-outline-variant rounded bg-white outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-primary text-white py-3 rounded text-xs uppercase tracking-widest font-semibold hover:opacity-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  List Offering
                </button>

                {productMessage && (
                  <p className="text-xs text-primary font-medium mt-2">{productMessage}</p>
                )}
              </form>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
