"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ProductItem } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useSettings } from "@/context/SettingsContext";
import { formatPrice, calculateDiscount, generateWhatsAppUrl, formatDisplayPhone } from "@/lib/utils";
import {
  ShoppingCart,
  Heart,
  MessageCircle,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  FileText,
  Sparkles,
  Zap,
  Info,
  CheckCircle2,
  Play,
  Video,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import ProductReviewsSection from "@/components/products/ProductReviewsSection";

function getYouTubeEmbedUrl(url?: string | null): string | null {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0`;
  }
  return null;
}

export default function ProductDetailClient({
  product,
}: {
  product: ProductItem;
}) {
  const router = useRouter();
  const { addToCart, setIsCartOpen } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { settings } = useSettings();

  const [selectedMedia, setSelectedMedia] = useState<number | string>(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeTabVideoIndex, setActiveTabVideoIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<"specs" | "desc" | "video">("specs");
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteFormData, setQuoteFormData] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    quantity: "1",
    message: "",
  });
  const [submittingQuote, setSubmittingQuote] = useState(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  // Swipe Gesture Handling
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const price = product.salePrice ?? product.price;
  const originalPrice = product.price;
  const discount = calculateDiscount(originalPrice, price);
  const inWish = isInWishlist(product.id);

  const images = product.images && product.images.length > 0
    ? product.images
    : [{ id: "1", url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800", isPrimary: true, order: 0, productId: product.id }];

  // Multi-Video List Parser (YouTube & Instagram Reel Links)
  const videoList = useMemo(() => {
    if (!product.videoUrl) return [];
    const urls = product.videoUrl.split(/[\n,]+/).map((u) => u.trim()).filter(Boolean);
    return urls.map((url, i) => {
      const embed = getYouTubeEmbedUrl(url);
      const isInsta = url.includes("instagram.com") || url.includes("instagr.am");
      return {
        id: `video-${i}`,
        url,
        title: embed ? `YouTube Demo ${urls.length > 1 ? `#${i + 1}` : ""}` : isInsta ? `Instagram Reel ${urls.length > 1 ? `#${i + 1}` : ""}` : `Video Review ${urls.length > 1 ? `#${i + 1}` : ""}`,
        embedUrl: embed,
        isInsta,
      };
    });
  }, [product.videoUrl]);

  // Auto-Slider Timer (Customizable by admin; default 5s; pauses on hover or video)
  const sliderSeconds = (product as any).sliderSeconds || (settings as any)?.sliderInterval || 5;

  useEffect(() => {
    if (typeof selectedMedia !== "number" || isPaused || images.length <= 1) return;
    const timer = setInterval(() => {
      setSelectedMedia((prev) => {
        if (typeof prev === "number") {
          return (prev + 1) % images.length;
        }
        return 0;
      });
    }, sliderSeconds * 1000);
    return () => clearInterval(timer);
  }, [selectedMedia, isPaused, images.length, sliderSeconds]);

  const handlePrevSlide = () => {
    if (typeof selectedMedia === "number") {
      setSelectedMedia((prev) => (typeof prev === "number" ? (prev - 1 + images.length) % images.length : 0));
    } else {
      setSelectedMedia(images.length - 1);
    }
  };

  const handleNextSlide = () => {
    if (typeof selectedMedia === "number") {
      setSelectedMedia((prev) => (typeof prev === "number" ? (prev + 1) % images.length : 0));
    } else {
      setSelectedMedia(0);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 40;
    if (distance > minSwipeDistance) {
      handleNextSlide();
    } else if (distance < -minSwipeDistance) {
      handlePrevSlide();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  let specsMap: Record<string, string> = {};
  if (product.specsJson && typeof product.specsJson === "string") {
    const trimmed = product.specsJson.trim();
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      try {
        specsMap = JSON.parse(trimmed);
      } catch {
        // Silently fallback if not valid JSON
      }
    }
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    window.location.href = "/checkout";
  };

  const handleWhatsApp = () => {
    const storeNumber = settings.whatsapp || "918805607908";
    const productUrl = typeof window !== "undefined" ? window.location.href : "";
    const msg = `*Order / Buy on WhatsApp*\n\nProduct: *${product.name}*\nPrice: *${formatPrice(
      price
    )}*\nQuantity: *${quantity}*\nLink: ${productUrl}\n\nHi Jijau Computers (+91 ${settings.whatsapp || "8805607908"}), I want to buy this product directly on WhatsApp. Please guide me through payment & delivery!`;
    window.open(generateWhatsAppUrl(storeNumber, msg), "_blank");
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmittingQuote(true);
      const res = await fetch("/api/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...quoteFormData,
          productId: product.id,
          productName: product.name,
        }),
      });

      if (res.ok) {
        setQuoteSubmitted(true);
        setTimeout(() => {
          setIsQuoteModalOpen(false);
          setQuoteSubmitted(false);
          setSubmittingQuote(false);
        }, 2000);
      }
    } catch (e) {
      console.error(e);
      setSubmittingQuote(false);
    }
  };

  const currentActiveVideo = typeof selectedMedia === "string" 
    ? videoList.find((v: any) => v.id === selectedMedia) 
    : null;

  return (
    <div>
      {/* 2-Column Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200 shadow-sm">
        {/* Left Column: Image & Video Gallery (Flipkart Style Media Stack) */}
        <div 
          className="lg:col-span-6 space-y-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Main Selected Media Viewport */}
          {currentActiveVideo ? (
            <div className="relative aspect-square rounded-2xl bg-black border border-slate-900 overflow-hidden shadow-inner flex items-center justify-center">
              {currentActiveVideo.embedUrl ? (
                <iframe
                  src={currentActiveVideo.embedUrl}
                  title={currentActiveVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : (
                <div className="p-6 text-center text-white space-y-3">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center mx-auto shadow-lg">
                    <Play className="w-6 h-6 fill-white ml-1" />
                  </div>
                  <h4 className="text-sm font-bold">{currentActiveVideo.title}</h4>
                  <p className="text-xs text-slate-300">Watch hands-on performance test and unboxing</p>
                  <a
                    href={currentActiveVideo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md"
                  >
                    <span>Open in Instagram / Reel</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div 
              className="relative aspect-square rounded-2xl bg-slate-50 border border-slate-100 p-8 flex items-center justify-center overflow-hidden group select-none"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={images[typeof selectedMedia === "number" ? selectedMedia : 0]?.url || images[0].url}
                alt={product.name}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 pointer-events-none"
              />
              {discount > 0 && (
                <span className="absolute top-4 left-4 tech-badge bg-rose-600 text-white shadow-md">
                  {discount}% OFF
                </span>
              )}

              {/* Left & Right Swipe Arrow Buttons */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevSlide();
                    }}
                    aria-label="Previous Image"
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-md border border-slate-200/80 flex items-center justify-center transition-all z-20 hover:scale-110 active:scale-90 cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5 text-slate-700" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextSlide();
                    }}
                    aria-label="Next Image"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-md border border-slate-200/80 flex items-center justify-center transition-all z-20 hover:scale-110 active:scale-90 cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5 text-slate-700" />
                  </button>
                </>
              )}

              {/* Slider Dots Indicator on Mobile */}
              {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-slate-900/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-800 z-20">
                  {images.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => setSelectedMedia(dotIdx)}
                      className={`transition-all rounded-full ${
                        selectedMedia === dotIdx ? "w-5 h-1.5 bg-blue-500" : "w-1.5 h-1.5 bg-slate-400"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Flipkart Style Thumbnail Strip (Images + Multi-Video Thumbnails) */}
          {(images.length > 1 || videoList.length > 0) && (
            <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
              {images.map((img, i) => (
                <button
                  key={img.id || i}
                  type="button"
                  onClick={() => setSelectedMedia(i)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-50 border-2 p-1.5 shrink-0 transition-all cursor-pointer ${
                    selectedMedia === i
                      ? "border-blue-600 ring-2 ring-blue-100 shadow-sm"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}

              {/* Multi-Video Thumbnails (Flipkart style) */}
              {videoList.map((video: any) => (
                <button
                  key={video.id}
                  type="button"
                  onClick={() => setSelectedMedia(video.id)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-900 border-2 p-1.5 shrink-0 transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden group ${
                    selectedMedia === video.id
                      ? "border-rose-600 ring-2 ring-rose-100 shadow-md"
                      : "border-slate-700 hover:border-rose-500"
                  }`}
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-black text-white mt-1 uppercase tracking-wider text-center line-clamp-1">
                    {video.isInsta ? "Reel" : "Video"}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Title, Price, WhatsApp & Cart CTA */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div>
            {/* Brand, Category & SKU */}
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
              <span>{product.brand?.name || "Jijau Certified"}</span>
              <span>•</span>
              <span>{product.category?.name}</span>
              {product.sku && (
                <>
                  <span>•</span>
                  <span className="text-slate-400 font-mono">SKU: {product.sku}</span>
                </>
              )}
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {product.name}
            </h1>

            {/* Quick Star Rating Pill */}
            <a
              href="#reviews-section"
              className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200/80 text-amber-900 text-xs font-bold transition-colors w-fit"
            >
              <div className="flex items-center gap-0.5 text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-extrabold text-amber-800">4.9</span>
              <span className="text-slate-400">•</span>
              <span className="text-blue-600 hover:underline">Verified Customer Reviews</span>
            </a>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 my-4">
              <span className="text-3xl sm:text-4xl font-black text-slate-900">
                {formatPrice(price)}
              </span>
              {product.salePrice && product.salePrice < product.price && (
                <>
                  <span className="text-lg text-slate-400 line-through">
                    {formatPrice(originalPrice)}
                  </span>
                  <span className="tech-badge bg-rose-600 text-white">
                    Save {formatPrice(originalPrice - price)}
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-slate-500 mb-6">
              *All prices are inclusive of GST with official manufacturer warranty invoice
            </p>

            {/* Short Description Highlights */}
            {product.shortDesc && (
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 mb-6 text-xs text-slate-700 leading-relaxed font-medium">
                {product.shortDesc}
              </div>
            )}

            {/* Stock & Warranty Badges */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 block">Availability</span>
                  <span className="text-emerald-600 font-semibold">
                    {product.inStock ? "Ready in Store / Dispatch" : "Currently Out of Stock"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 block">Warranty</span>
                  <span className="text-slate-600 truncate block">
                    {product.warranty || "1 Year Brand Warranty"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quantity Modifier */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Quantity:
              </span>
              <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-1.5 rounded-lg hover:bg-white text-slate-700 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-sm text-slate-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-1.5 rounded-lg hover:bg-white text-slate-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main CTAs */}
            <div className="space-y-3 relative z-20">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50 cursor-pointer"
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  className="py-3.5 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Buy on WhatsApp & Wishlist / Quote Trigger */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="sm:col-span-2 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 cursor-pointer"
                  title={`Direct purchase via Jijau Computers WhatsApp (${formatDisplayPhone(settings.whatsapp)})`}
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.07-2.125-.522-1.829-.759-3.003-2.628-3.094-2.75-.09-.12-0.749-.998-.749-1.905 0-.907.474-1.353.643-1.537.17-.184.372-.23.496-.23.125 0 .25.002.359.006.115.006.27-.044.422.321.157.38.536 1.309.584 1.405.048.096.08.209.016.337-.064.128-.096.208-.192.32-.096.112-.204.25-.291.336-.098.096-.2.201-.086.397.114.195.508.839 1.09 1.357.75.669 1.383.876 1.579.972.196.096.312.08.428-.052.116-.133.496-.578.628-.777.133-.2.266-.167.449-.099.183.068 1.164.549 1.365.65.201.101.335.151.384.234.049.083.049.48-.095.885z" />
                  </svg>
                  <span>Buy on WhatsApp ({formatDisplayPhone(settings.whatsapp)})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsQuoteModalOpen(true)}
                  className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Get Quote</span>
                </button>
              </div>
            </div>
          </div>

          {/* Reassurance Footer */}
          <div className="pt-6 mt-6 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-blue-600" /> Fast Delivery in Pune
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Original Bill
            </span>
            <span className="flex items-center gap-1">
              <RotateCcw className="w-3.5 h-3.5 text-amber-500" /> 7 Days Replacement
            </span>
          </div>
        </div>
      </div>

      {/* Tabs: Specifications & Description */}
      <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex border-b border-slate-200 gap-8 mb-6">
          <button
            onClick={() => setActiveTab("specs")}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === "specs"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab("desc")}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === "desc"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Product Overview & Description
          </button>
          {product.videoUrl && (
            <button
              onClick={() => setActiveTab("video")}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === "video"
                  ? "border-rose-600 text-rose-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
              <span>Video Review / Reel</span>
            </button>
          )}
        </div>

        {activeTab === "specs" && (
          <div>
            {Object.keys(specsMap).length > 0 ? (
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <table className="w-full text-xs text-left">
                  <tbody>
                    {Object.entries(specsMap).map(([key, val], idx) => (
                      <tr
                        key={key}
                        className={idx % 2 === 0 ? "bg-slate-50" : "bg-white"}
                      >
                        <td className="py-3 px-4 font-bold text-slate-700 w-1/3 border-r border-slate-200">
                          {key}
                        </td>
                        <td className="py-3 px-4 text-slate-800 font-medium">
                          {val}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Detailed technical specifications will be provided upon inquiry.
              </p>
            )}
          </div>
        )}

        {activeTab === "desc" && (
          <div className="prose prose-sm max-w-none text-xs text-slate-700 leading-relaxed space-y-4">
            <p>{product.description}</p>
          </div>
        )}

        {activeTab === "video" && videoList.length > 0 && (
          <div className="space-y-6">
            {/* Multi-Video Selector Pills */}
            {videoList.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {videoList.map((vid: any, vIdx: number) => (
                  <button
                    key={vid.id}
                    type="button"
                    onClick={() => setActiveTabVideoIndex(vIdx)}
                    className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                      activeTabVideoIndex === vIdx
                        ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{vid.title}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Active Selected Tab Video */}
            {videoList[activeTabVideoIndex] && (
              <div>
                {videoList[activeTabVideoIndex].embedUrl ? (
                  <div className="space-y-4">
                    <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-black">
                      <iframe
                        src={videoList[activeTabVideoIndex].embedUrl!}
                        title={videoList[activeTabVideoIndex].title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                    <p className="text-xs text-slate-500 text-center font-medium">
                      Official hands-on demo and performance review for {product.name}
                    </p>
                  </div>
                ) : (
                  <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 border border-pink-200 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-pink-500/20">
                      <Video className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-lg">Watch {videoList[activeTabVideoIndex].title}</h4>
                      <p className="text-xs text-slate-600 max-w-md mt-1 font-medium">
                        Check out live unboxing, gaming performance, and benchmark tests for <span className="font-bold text-slate-900">{product.name}</span> on our official channel.
                      </p>
                    </div>
                    <a
                      href={videoList[activeTabVideoIndex].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:opacity-90 text-white font-bold text-xs shadow-lg transition-all hover:scale-105"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Open in Instagram / Reel</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Product Reviews & Star Ratings Section */}
        <ProductReviewsSection productId={product.id} productName={product.name} />
      </div>

      {/* Request Quote Modal */}
      {isQuoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsQuoteModalOpen(false)}
          />
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl z-10 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-black text-slate-900 mb-1">
              Request Official Quotation
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Get an official quotation with GST breakup and corporate bulk pricing for <span className="font-bold text-slate-800">{product.name}</span>.
            </p>

            {quoteSubmitted ? (
              <div className="p-6 text-center bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-base">Quotation Request Received!</h4>
                <p className="text-xs">
                  Our sales team will contact you via WhatsApp / Email with the quotation within 1 hour.
                </p>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={quoteFormData.name}
                    onChange={(e) => setQuoteFormData({ ...quoteFormData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-blue-600"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={quoteFormData.phone}
                      onChange={(e) => setQuoteFormData({ ...quoteFormData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-blue-600"
                      placeholder="e.g. 9876543210"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={quoteFormData.email}
                      onChange={(e) => setQuoteFormData({ ...quoteFormData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-blue-600"
                      placeholder="name@company.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Quantity Needed</label>
                    <input
                      type="number"
                      min="1"
                      value={quoteFormData.quantity}
                      onChange={(e) => setQuoteFormData({ ...quoteFormData, quantity: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Company / GSTIN</label>
                    <input
                      type="text"
                      value={quoteFormData.company}
                      onChange={(e) => setQuoteFormData({ ...quoteFormData, company: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-blue-600"
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Special Requirements / Notes</label>
                  <textarea
                    rows={2}
                    value={quoteFormData.message}
                    onChange={(e) => setQuoteFormData({ ...quoteFormData, message: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-blue-600"
                    placeholder="Specific delivery timeline, onsite setup, etc."
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsQuoteModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
