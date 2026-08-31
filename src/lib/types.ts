export interface WebsiteSettingsData {
  id: string;
  storeName: string;
  tagline: string;
  logoUrl: string;
  darkLogoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  googleMapsUrl: string;
  openingHours: string;
  gstin: string;
  upiId: string;
  upiName: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  linkedinUrl: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  sku?: string | null;
  description: string;
  shortDesc?: string | null;
  price: number;
  salePrice?: number | null;
  stock: number;
  inStock: boolean;
  warranty?: string | null;
  isFeatured: boolean;
  isBestseller: boolean;
  isNewArrival: boolean;
  isTrending: boolean;
  isGamingDeal: boolean;
  videoUrl?: string | null;
  sliderSeconds?: number | null;
  specsJson?: string | null;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  brandId?: string | null;
  brand?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  images: {
    id: string;
    url: string;
    isPrimary: boolean;
    order: number;
  }[];
  createdAt?: string | Date;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
}
