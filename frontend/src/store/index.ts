import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'CUSTOMER' | 'ARTISAN' | 'ADMIN';
  } | null;
  setSession: (token: string | null, user: any | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setSession: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'sunartn-auth-storage',
    }
  )
);

export const CURRENCIES = [
  { code: 'USD', name: 'US DOLLAR', symbol: '$', rate: 1.0 },
  { code: 'AUD', name: 'AUSTRALIAN DOLLAR', symbol: '$', rate: 1.50 },
  { code: 'CAD', name: 'CANADA DOLLAR', symbol: '$', rate: 1.37 },
  { code: 'AED', name: 'AED DIRHAM', symbol: 'د.إ ', rate: 3.67 },
  { code: 'EUR', name: 'EURO', symbol: '€', rate: 0.92 },
  { code: 'JPY', name: 'JAPANESE YEN', symbol: '¥', rate: 157.5 },
  { code: 'GBP', name: 'POUND STERLING', symbol: '£', rate: 0.78 },
  { code: 'INR', name: 'RS. RUPEES', symbol: '₹', rate: 83.5 },
  { code: 'SGD', name: 'SINGAPORE DOLLAR', symbol: '$', rate: 1.35 },
];

export const formatPrice = (priceInUsd: number, currencyCode: string) => {
  const currency = CURRENCIES.find((c) => c.code === currencyCode) || CURRENCIES[0];
  const converted = priceInUsd * currency.rate;
  const dec = ['INR', 'JPY', 'AED'].includes(currencyCode) ? 0 : 2;
  
  return `${currency.symbol}${converted.toLocaleString(undefined, {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  })}`;
};

interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  artisanName: string;
}

interface CartState {
  items: CartItem[];
  currency: string;
  setCurrency: (code: string) => void;
  addItem: (product: any, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      currency: 'USD',
      setCurrency: (code) => set({ currency: code }),
      addItem: (product, quantity = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === product.id);

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...currentItems,
              {
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.images?.[0] || 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=300',
                quantity,
                artisanName: product.artisan?.user?.name || product.artisanName || 'Elena Varga',
              },
            ],
          });
        }
      },
      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.id !== productId),
        });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotalAmount: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'sunartn-cart-storage',
    }
  )
);
