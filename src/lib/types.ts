export interface StoreBranch {
  id: string;
  name: string;
  address: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  mapUrl?: string;
  isMain?: boolean;
  timings?: string;
}

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
  branchesJson?: string;
  invoiceTerms?: string;
  invoiceBankDetails?: string;
  invoiceHsnCode?: string;
  invoiceNotes?: string;
}

export interface ReviewItem {
  id: string;
  productId: string;
  userId?: string | null;
  customerName: string;
  customerPhone?: string | null;
  rating: number;
  title: string;
  comment: string;
  isVerifiedBuyer: boolean;
  isApproved: boolean;
  createdAt: string | Date;
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
