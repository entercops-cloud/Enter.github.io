import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductModal from './components/ProductModal';
import QuoteModal from './components/QuoteModal';
import Footer from './components/Footer';
import WhatsAppFAB from './components/WhatsAppFAB';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import OrderTracking from './components/OrderTracking';
import { getLocalizedProductName, getLocalizedProductDesc, getLocalizedCategoryName } from './constants';
import { Product, CartItem, CategoryItem, SiteSettings, Language, Testimonial } from './types';
import { store } from './services/store';
import { UI_TRANSLATIONS, LANGUAGES } from './translations';
import {
  Star,
  CheckCircle,
  Trash2,
  Search,
  FileText,
  TrendingDown,
  ShoppingCart,
  Calculator,
  ArrowRight,
  ArrowLeft,
  Shield,
  Sparkles,
  Truck,
  BellRing,
  X,
  MessageCircle,
} from 'lucide-react';

function App() {
  // Navigation View State: 'home' or 'track'
  const [currentView, setCurrentView] = useState<'home' | 'track'>('home');
  const [trackingOrderId, setTrackingOrderId] = useState<string>('');

  // Multilingual State ('ar' | 'en' | 'he')
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('enter_tech_language');
      if (saved === 'en' || saved === 'he' || saved === 'ar') return saved;
      return 'ar';
    } catch {
      return 'ar';
    }
  });

  const t = UI_TRANSLATIONS[currentLang] || UI_TRANSLATIONS.ar;
  const isRtl = LANGUAGES[currentLang]?.dir === 'rtl';

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    localStorage.setItem('enter_tech_language', lang);
    const rtl = lang === 'ar' || lang === 'he';
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    const rtl = currentLang === 'ar' || currentLang === 'he';
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  // Persistent dynamic states
  const [products, setProducts] = useState<Product[]>(() => store.getProducts());
  const [categories, setCategories] = useState<CategoryItem[]>(() => store.getCategories());
  const [settings, setSettings] = useState<SiteSettings>(() => store.getSettings());
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => store.getTestimonials());

  // UI States
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Quote Modal State
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteProduct, setQuoteProduct] = useState<string>('');

  // Customer Review Modal State (Real customer reviews)
  const [isCustomerReviewModalOpen, setIsCustomerReviewModalOpen] = useState(false);
  const [customerReviewForm, setCustomerReviewForm] = useState({
    name: '',
    role: '',
    content: '',
    rating: 5,
    productName: '',
  });
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState(false);

  // Admin States
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => store.isAdminLoggedIn());
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState<boolean>(false);

  // Live in-app toast notification for new orders
  const [liveToast, setLiveToast] = useState<{ title: string; body: string } | null>(null);

  // Customer Checkout Modal inside cart
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [lastCreatedOrderId, setLastCreatedOrderId] = useState<string>('');
  const [orderSuccessMessage, setOrderSuccessMessage] = useState('');
  const [completedOrderData, setCompletedOrderData] = useState<{ id: string; waUrl: string } | null>(null);

  // Listen for real-time notification events
  useEffect(() => {
    const handleNewOrderAlert = (e: Event) => {
      const custom = e as CustomEvent<{ title: string; body: string }>;
      if (custom.detail) {
        setLiveToast(custom.detail);
        setTimeout(() => setLiveToast(null), 8000);
      }
    };
    window.addEventListener('app_new_order_notification', handleNewOrderAlert);
    return () => window.removeEventListener('app_new_order_notification', handleNewOrderAlert);
  }, []);

  // Sync all store data from backend server on startup
  useEffect(() => {
    store.syncFromServer().then((data) => {
      setProducts(data.products);
      setCategories(data.categories);
      setSettings(data.settings);
      if (data.testimonials) setTestimonials(data.testimonials);
    });
  }, []);

  // Staff Secure Portal Gateway: Shortcut (Ctrl+Shift+A or Alt+A) & URL Hash (#admin)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') ||
        (e.altKey && e.key.toLowerCase() === 'a')
      ) {
        e.preventDefault();
        if (isAdminLoggedIn) {
          setIsAdminDashboardOpen(true);
        } else {
          setIsAdminLoginOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    if (window.location.hash === '#admin' || window.location.search.includes('admin=true')) {
      if (isAdminLoggedIn) {
        setIsAdminDashboardOpen(true);
      } else {
        setIsAdminLoginOpen(true);
      }
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminLoggedIn]);

  // Keep state synchronized with server database
  const handleUpdateProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    store.saveProducts(newProducts);
  };

  const handleUpdateCategories = (newCats: CategoryItem[]) => {
    setCategories(newCats);
    store.saveCategories(newCats);
  };

  const handleUpdateSettings = (newSettings: SiteSettings) => {
    setSettings(newSettings);
    store.saveSettings(newSettings);
  };

  const handleUpdateTestimonials = (newTestimonials: Testimonial[]) => {
    setTestimonials(newTestimonials);
    store.saveTestimonials(newTestimonials);
  };

  const handleCustomerReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerReviewForm.name.trim() || !customerReviewForm.content.trim()) return;

    const newRev = await store.addTestimonial({
      name: customerReviewForm.name.trim(),
      role: customerReviewForm.role.trim() || 'عميل لدى إنتر تكنولوجي',
      content: customerReviewForm.content.trim(),
      rating: customerReviewForm.rating || 5,
      productName: customerReviewForm.productName || undefined,
      verified: true,
      status: 'approved',
    });

    setTestimonials((prev) => [newRev, ...prev.filter((t) => String(t.id) !== String(newRev.id))]);
    setReviewSuccessMsg(true);
    setTimeout(() => {
      setReviewSuccessMsg(false);
      setIsCustomerReviewModalOpen(false);
      setCustomerReviewForm({ name: '', role: '', content: '', rating: 5, productName: '' });
    }, 2000);
  };

  // Filter products by category & search across multiple languages
  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const nameAr = product.name?.toLowerCase() || '';
    const nameEn = product.name_en?.toLowerCase() || '';
    const nameHe = product.name_he?.toLowerCase() || '';
    const descAr = product.description?.toLowerCase() || '';
    const descEn = product.description_en?.toLowerCase() || '';
    const descHe = product.description_he?.toLowerCase() || '';

    const matchesSearch =
      nameAr.includes(query) ||
      nameEn.includes(query) ||
      nameHe.includes(query) ||
      descAr.includes(query) ||
      descEn.includes(query) ||
      descHe.includes(query);

    return matchesCategory && matchesSearch;
  });

  // Add to cart from interactive calculator modal
  const handleAddToCart = (
    product: Product,
    quantity: number,
    customText: string,
    files: File[],
    calculatedPrice: {
      unitPrice: number;
      discountPercent: number;
      savings: number;
      finalTotal: number;
      selectedOptions: Record<string, string>;
    }
  ) => {
    const newItem: CartItem = {
      ...product,
      quantity,
      customText,
      files,
      fileNames: files.map((f) => f.name),
      unitPriceCalculated: calculatedPrice.unitPrice,
      discountPercentage: calculatedPrice.discountPercent,
      savings: calculatedPrice.savings,
      totalPrice: calculatedPrice.finalTotal,
      selectedOptions: calculatedPrice.selectedOptions,
    };
    setCart((prev) => [...prev, newItem]);
    setIsCartOpen(true);
  };

  const handleBuyNow = (
    product: Product,
    quantity: number,
    customText: string,
    files: File[],
    calculatedPrice: {
      unitPrice: number;
      discountPercent: number;
      savings: number;
      finalTotal: number;
      selectedOptions: Record<string, string>;
    }
  ) => {
    handleAddToCart(product, quantity, customText, files, calculatedPrice);
    setIsCheckingOut(true);
    setIsCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleOpenQuote = (productName: string = '') => {
    setQuoteProduct(productName);
    setIsQuoteModalOpen(true);
  };

  // Admin access handler
  const handleAdminClick = () => {
    if (isAdminLoggedIn) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setIsAdminLoginOpen(false);
    setIsAdminDashboardOpen(true);
  };

  const handleAdminLogout = () => {
    store.setAdminLoggedIn(false);
    setIsAdminLoggedIn(false);
    setIsAdminDashboardOpen(false);
  };

  // Switch to Track Order Page
  const handleNavigateToTrack = (orderId: string = '') => {
    setTrackingOrderId(orderId);
    setCurrentView('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate cart totals
  const cartSubtotal = cart.reduce(
    (acc, item) =>
      acc + (item.totalPrice ? item.totalPrice + (item.savings || 0) : item.price),
    0
  );
  const cartSavings = cart.reduce((acc, item) => acc + (item.savings || 0), 0);
  const cartFinalTotal = cart.reduce(
    (acc, item) => acc + (item.totalPrice || item.price),
    0
  );

  // Submit cart order via WhatsApp, trigger Admin browser alert, and save to server storage
  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    // Save on server (this automatically triggers the browser alert and audio chime!)
    const savedOrder = await store.addOrder({
      customerName,
      customerPhone,
      customerAddress,
      notes: orderNotes,
      status: 'review',
      statusNote:
        currentLang === 'en'
          ? 'Order received and queued for technical pre-press inspection.'
          : currentLang === 'he'
          ? 'ההזמנה נקלטה ומועברת לבדיקה טכנית ראשונית לפני הדפסה.'
          : 'تم استلام الطلب وبدء مرحلة الفحص والتدقيق الفني قبل تشغيل الماكينات',
      estimatedDate: currentLang === 'en' ? '2-3 Business Days' : currentLang === 'he' ? '2-3 ימי עסקים' : '2-3 أيام عمل',
      items: cart.map((c) => ({
        id: `item-${Date.now()}-${Math.random()}`,
        productId: c.id,
        productName: getLocalizedProductName(c, currentLang),
        quantity: c.quantity,
        unitPrice: c.unitPriceCalculated || c.price,
        discountPercentage: c.discountPercentage || 0,
        totalPrice: c.totalPrice || c.price,
        customText: c.customText,
        optionsSummary: c.selectedOptions
          ? Object.entries(c.selectedOptions).map(([k, v]) => `${k}: ${v}`).join(' | ')
          : undefined,
      })),
      subtotal: cartSubtotal,
      discountTotal: cartSavings,
      finalTotal: cartFinalTotal,
    });

    setLastCreatedOrderId(savedOrder.id);

    // Build WhatsApp message
    let waMsg = `📦 *New Print Order / طلب جديد / הזמנה חדשה - Enter Technology*\n`;
    waMsg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    waMsg += `👤 *Customer / العميل / לקוח:* ${customerName}\n`;
    waMsg += `📱 *Phone / الهاتف / טלפון:* ${customerPhone}\n`;
    if (customerAddress) waMsg += `📍 *Address / العنوان / כתובת:* ${customerAddress}\n`;
    if (orderNotes) waMsg += `📝 *Notes / ملاحظات / הערות:* ${orderNotes}\n`;
    waMsg += `🔖 *Tracking ID / رقم التتبع / מספר מעקב:* ${savedOrder.id}\n`;
    waMsg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    waMsg += `🛒 *Items / المنتجات / פריטים:*\n`;

    cart.forEach((item, i) => {
      const pName = getLocalizedProductName(item, currentLang);
      waMsg += `\n${i + 1}) *${pName}*\n`;
      waMsg += `   • Qty: ${item.quantity} ${t.unitPiece}\n`;
      waMsg += `   • Total: ${item.totalPrice} ₪`;
      if (item.discountPercentage && item.discountPercentage > 0) {
        waMsg += ` (${item.discountPercentage}% OFF)\n`;
      } else {
        waMsg += `\n`;
      }
      if (item.selectedOptions) {
        waMsg += `   • Specs: ${Object.values(item.selectedOptions).join(', ')}\n`;
      }
      if (item.customText) {
        waMsg += `   • Notes: "${item.customText}"\n`;
      }
    });

    waMsg += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
    if (cartSavings > 0) waMsg += `💰 *Discount Savings / وفر الخصم:* ${cartSavings} ₪\n`;
    waMsg += `💵 *Final Total / المجموع النهائي:* ${cartFinalTotal} ₪\n`;
    waMsg += `Track Order Status / تتبع الطلب: ${savedOrder.id}`;

    const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '') || '970568204195';
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMsg)}`;
    setCompletedOrderData({ id: savedOrder.id, waUrl: url });
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      // Direct <a> button provides guaranteed unblockable action
    }

    setOrderSuccessMessage(`${t.orderCreatedSuccess} ${savedOrder.id}`);
    setCart([]);
    setIsCheckingOut(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 text-gray-800" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Live Admin Alert Toast */}
      {liveToast && (
        <div className={`fixed top-20 ${isRtl ? 'left-4 sm:left-8' : 'right-4 sm:right-8'} z-60 max-w-sm bg-gray-900 text-white p-4 rounded-2xl shadow-2xl border-2 border-brand-yellow flex items-start gap-3 animate-in slide-in-from-top-4 duration-300`}>
          <div className="p-2 bg-brand-yellow text-brand-purple rounded-xl shrink-0">
            <BellRing size={20} className="animate-bounce" />
          </div>
          <div className="flex-grow space-y-0.5">
            <h4 className="font-black text-xs text-brand-yellow">{liveToast.title}</h4>
            <p className="text-xs text-gray-300">{liveToast.body}</p>
            {isAdminLoggedIn && (
              <button
                onClick={() => {
                  setIsAdminDashboardOpen(true);
                  setLiveToast(null);
                }}
                className="text-[11px] font-bold text-brand-yellow hover:underline block pt-1 cursor-pointer"
              >
                {t.navAdmin} ←
              </button>
            )}
          </div>
          <button onClick={() => setLiveToast(null)} className="text-gray-400 hover:text-white p-0.5 cursor-pointer">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Navbar with Multilingual Switcher */}
      <Navbar
        cartCount={cart.length}
        onCartClick={() => setIsCartOpen(!isCartOpen)}
        onHomeClick={() => {
          setCurrentView('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onAdminClick={handleAdminClick}
        onTrackClick={() => handleNavigateToTrack()}
        isAdminLoggedIn={isAdminLoggedIn}
        settings={settings}
        onOpenQuote={() => handleOpenQuote()}
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
      />

      {/* Main Content Router */}
      {currentView === 'track' ? (
        /* Dedicated Order Tracking Page */
        <OrderTracking
          initialOrderId={trackingOrderId}
          onBackToHome={() => setCurrentView('home')}
          whatsappNumber={settings.whatsappNumber}
          currentLang={currentLang}
        />
      ) : (
        /* Standard Home & Store Page */
        <>
          {/* Hero Banner with Dynamic SiteSettings & Language Switcher */}
          <Hero
            onCtaClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            onRequestQuote={() => handleOpenQuote()}
            settings={settings}
            currentLang={currentLang}
            onWhatsAppClick={() => {
              const greeting =
                currentLang === 'en'
                  ? 'Hello, I would like to inquire about printing services and bulk packages'
                  : currentLang === 'he'
                  ? 'שלום, ברצוני לברר לגבי שירותי דפוס וחבילות בהנחה'
                  : 'مرحباً، أود الاستفسار عن عروض وخصومات الطباعة والدعاية';
              const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(greeting)}`;
              window.open(url, '_blank', 'noopener,noreferrer');
            }}
          />

          {/* Quick Track Order Callout Strip */}
          <section className="bg-brand-dark/95 text-white py-4 border-b border-brand-yellow/30">
            <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Truck size={18} className="text-brand-yellow shrink-0" />
                <span>{t.trackCalloutText}</span>
              </div>
              <button
                onClick={() => handleNavigateToTrack()}
                className="bg-brand-yellow text-brand-purple hover:bg-yellow-300 px-4 py-1.5 rounded-xl font-bold transition-transform active:scale-95 shrink-0 cursor-pointer"
              >
                {t.trackCalloutBtn}
              </button>
            </div>
          </section>

          {/* Services Features Section */}
          <section id="features" className="py-12 bg-white border-b border-gray-100">
            <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-center">
              {[
                { title: t.feat1Title, desc: t.feat1Desc },
                { title: t.feat2Title, desc: t.feat2Desc },
                { title: t.feat3Title, desc: t.feat3Desc },
                { title: t.feat4Title, desc: t.feat4Desc },
              ].map((feat, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow group"
                >
                  <div className="w-12 h-12 mx-auto bg-brand-yellow/20 text-brand-purple rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <CheckCircle size={22} className="text-brand-purple" />
                  </div>
                  <h3 className="font-bold text-base text-gray-900 mb-1">{feat.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Products & Cost Calculator Showcase Section */}
          <main id="products" className="container mx-auto px-4 py-16 flex-grow">
            <div className="text-center mb-10 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-purple/10 text-brand-purple rounded-full text-xs font-bold mb-2">
                <Calculator size={14} />
                <span>{t.productsBadge}</span>
              </div>
              <h2 className="text-3xl font-black text-brand-dark mb-3">{t.productsTitle}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {t.productsSubtitle}
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-8 relative">
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full ${isRtl ? 'pl-4 pr-12' : 'pr-4 pl-12'} py-3 rounded-2xl border border-gray-200 focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/10 outline-none shadow-xs text-sm text-gray-800 transition-all bg-white`}
              />
              <Search className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400`} size={19} />
            </div>

            {/* Categories Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                const catName = getLocalizedCategoryName(cat, currentLang);
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                      isActive
                        ? 'bg-brand-purple text-white shadow-md scale-105'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span>{catName}</span>
                  </button>
                );
              })}
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                  const maxDiscount =
                    product.discountTiers && product.discountTiers.length > 0
                      ? Math.max(...product.discountTiers.map((tier) => tier.discountPercentage))
                      : 20;

                  const pName = getLocalizedProductName(product, currentLang);
                  const pDesc = getLocalizedProductDesc(product, currentLang);

                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-xs hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
                    >
                      {/* Image & Badges */}
                      <div>
                        <div className="h-60 overflow-hidden relative shrink-0 bg-gray-100">
                          <img
                            src={product.image}
                            alt={pName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />

                          {/* Discount Badge */}
                          <div className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-md flex items-center gap-1`}>
                            <TrendingDown size={14} />
                            <span>{maxDiscount}% {currentLang === 'en' ? 'OFF' : currentLang === 'he' ? 'הנחה' : 'خصم'}</span>
                          </div>

                          <div className={`absolute bottom-3 ${isRtl ? 'left-3' : 'right-3'} bg-brand-dark/80 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-md font-semibold`}>
                            {t.minQuantityLabel}: {product.minQuantity} {t.unitPiece}
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-5 space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-black text-gray-900 group-hover:text-brand-purple transition-colors">
                              {pName}
                            </h3>
                          </div>
                          <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">
                            {pDesc}
                          </p>

                          {/* Tiered discounts strip */}
                          {product.discountTiers && product.discountTiers.length > 0 && (
                            <div className="pt-2 flex flex-wrap gap-1">
                              {product.discountTiers.slice(0, 3).map((tier, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-md border border-emerald-100"
                                >
                                  {tier.minQuantity}+: {tier.discountPercentage}% {currentLang === 'en' ? 'off' : currentLang === 'he' ? 'הנחה' : 'خصم'}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Pricing & Actions */}
                      <div className="p-5 pt-0 space-y-3 border-t border-gray-100 mt-3">
                        <div className="flex items-baseline justify-between pt-3">
                          <div>
                            <span className="font-black text-xl text-brand-purple">{product.price} ₪</span>
                            <span className={`text-[11px] text-gray-400 ${isRtl ? 'mr-1' : 'ml-1'}`}>
                              {product.unitPrice ? `(${product.unitPrice} ₪ / ${t.unitPiece})` : ''}
                            </span>
                          </div>
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            {currentLang === 'en' ? 'Live Calculator' : currentLang === 'he' ? 'חישוב מיידי' : 'توفير فوري'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setSelectedProduct(product)}
                            className="w-full flex items-center justify-center gap-1.5 bg-brand-yellow hover:bg-yellow-400 text-brand-purple text-xs font-black py-2.5 rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer"
                          >
                            <Calculator size={15} />
                            <span>{t.viewAndCalculate}</span>
                          </button>

                          <button
                            onClick={() => handleOpenQuote(pName)}
                            className="w-full flex items-center justify-center gap-1 text-xs font-bold text-brand-purple border border-brand-purple/20 rounded-xl py-2.5 hover:bg-brand-purple hover:text-white transition-colors cursor-pointer"
                          >
                            <FileText size={14} />
                            <span>{t.requestCustomQuoteBtn}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-gray-100 p-8">
                  <Search size={40} className="mx-auto text-gray-300 mb-3" />
                  <h3 className="text-lg font-bold text-gray-700">{t.noProductsFound}</h3>
                  <p className="text-gray-400 text-xs mt-1">{t.searchPlaceholder}</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('all');
                    }}
                    className="mt-4 text-xs font-bold text-brand-purple underline cursor-pointer"
                  >
                    {t.resetFilter}
                  </button>
                </div>
              )}
            </div>
          </main>

          {/* Customer Testimonials - Real Reviews with Admin Management & User Submission */}
          <section className="bg-brand-purple/5 py-16 border-t border-brand-purple/10">
            <div className="container mx-auto px-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 max-w-5xl mx-auto">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-yellow/20 text-brand-purple rounded-full text-xs font-black border border-brand-yellow/30 mb-2">
                    <Star size={13} className="text-brand-yellow fill-brand-yellow" />
                    <span>تقييمات واقعية لعملاء معتمدين</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-brand-dark mb-1">{t.testimonialsTitle}</h2>
                  <p className="text-gray-600 text-xs sm:text-sm">{t.testimonialsSubtitle}</p>
                </div>

                <button
                  onClick={() => setIsCustomerReviewModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-purple hover:bg-[#4d2377] text-white rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer self-start sm:self-auto shrink-0"
                >
                  <Star size={14} className="text-brand-yellow fill-brand-yellow" />
                  <span>شاركنا تجربتك ورأيك</span>
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {testimonials
                  .filter((item) => (item.status || 'approved') === 'approved')
                  .slice(0, 9)
                  .map((testimonial) => {
                    const rating = testimonial.rating || 5;
                    return (
                      <div
                        key={testimonial.id}
                        className="bg-white p-6 rounded-2xl shadow-xs hover:shadow-md transition-shadow border border-gray-100 flex flex-col justify-between relative group"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={testimonial.avatar}
                                alt={testimonial.name}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80';
                                }}
                                className="w-12 h-12 rounded-full object-cover border-2 border-brand-yellow shadow-xs shrink-0"
                              />
                              <div>
                                <h4 className="font-bold text-sm text-brand-dark leading-snug">{testimonial.name}</h4>
                                <span className="text-[11px] text-brand-purple font-semibold block">{testimonial.role}</span>
                              </div>
                            </div>

                            {testimonial.verified && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200 shrink-0">
                                <CheckCircle size={10} />
                                <span>موثق</span>
                              </span>
                            )}
                          </div>

                          {/* Star Rating */}
                          <div className="flex items-center gap-1 text-amber-400 mb-2.5">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <Star
                                key={i}
                                size={14}
                                fill={i <= rating ? 'currentColor' : 'none'}
                                className={i <= rating ? 'text-amber-400' : 'text-gray-300'}
                              />
                            ))}
                            <span className="text-[11px] font-mono font-bold text-gray-500 mr-1.5">{rating}/5</span>
                          </div>

                          {/* Product Badge if available */}
                          {testimonial.productName && (
                            <div className="mb-2.5">
                              <span className="text-[10px] font-bold text-brand-purple bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100 inline-block">
                                طلب: {testimonial.productName}
                              </span>
                            </div>
                          )}

                          <p className="text-gray-600 text-xs leading-relaxed italic">"{testimonial.content}"</p>
                        </div>

                        {testimonial.date && (
                          <div className="pt-3 mt-3 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400 font-mono">
                            <span>تاريخ التقييم</span>
                            <span>{testimonial.date}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Footer */}
      <Footer
        settings={settings}
        onAdminClick={handleAdminClick}
        onOpenQuote={() => handleOpenQuote()}
        onTrackClick={() => handleNavigateToTrack()}
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
      />

      {/* WhatsApp Floating Action Button (FAB) */}
      <WhatsAppFAB
        phoneNumber={settings.whatsappNumber}
        companyName={settings.companyName}
        currentLang={currentLang}
      />

      {/* Product Calculator Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          onRequestQuote={(name) => handleOpenQuote(name)}
          currentLang={currentLang}
        />
      )}

      {/* Quote Modal */}
      {isQuoteModalOpen && (
        <QuoteModal
          initialProduct={quoteProduct}
          onClose={() => setIsQuoteModalOpen(false)}
          whatsappNumber={settings.whatsappNumber}
          currentLang={currentLang}
        />
      )}

      {/* Customer Review / Testimonial Submission Modal */}
      {isCustomerReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 border border-amber-200 flex items-center justify-center">
                  <Star size={20} fill="currentColor" />
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg text-gray-900">
                    {currentLang === 'ar' ? 'شاركنا رأيك وتجربتك' : 'Share Your Review'}
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    {currentLang === 'ar' ? 'رأيك يهمنا ويسعدنا نشره ضمن قصص نجاح شركائنا' : 'We appreciate your genuine feedback'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCustomerReviewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {reviewSuccessMsg ? (
              <div className="p-6 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <CheckCircle size={36} className="mx-auto text-emerald-600 animate-bounce" />
                <h4 className="font-black text-base text-emerald-900">شكراً لمشاركتنا رأيك القيم!</h4>
                <p className="text-xs text-emerald-700">
                  تم إضافة تقييمك بنجاح وأصبح ظاهراً الآن في قسم آراء وشركاء النجاح.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCustomerReviewSubmit} className="space-y-4">
                {/* Star Rating Selector */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">تقييمك العام لتجربتك</label>
                  <div className="flex items-center justify-between p-3 bg-amber-50/50 rounded-2xl border border-amber-200/80">
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setCustomerReviewForm({ ...customerReviewForm, rating: star })}
                          className="p-1 hover:scale-125 transition-transform cursor-pointer"
                        >
                          <Star
                            size={26}
                            fill={star <= customerReviewForm.rating ? 'currentColor' : 'none'}
                            className={star <= customerReviewForm.rating ? 'text-amber-400' : 'text-gray-300'}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-black text-amber-800 bg-white px-2.5 py-1 rounded-xl border border-amber-200 font-mono shadow-2xs">
                      {customerReviewForm.rating} من 5 نجوم
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      الاسم الكريم <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customerReviewForm.name}
                      onChange={(e) => setCustomerReviewForm({ ...customerReviewForm, name: e.target.value })}
                      placeholder="مثال: أحمد القدومي"
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      المسمى الوظيفي / المدينة والنشاط
                    </label>
                    <input
                      type="text"
                      value={customerReviewForm.role}
                      onChange={(e) => setCustomerReviewForm({ ...customerReviewForm, role: e.target.value })}
                      placeholder="مثال: مدير التسويق - شركة آفاق"
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/20 outline-none"
                    />
                  </div>
                </div>

                {/* Product Ordered */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">المنتج أو الخدمة التي طلبتها</label>
                  <select
                    value={customerReviewForm.productName}
                    onChange={(e) => setCustomerReviewForm({ ...customerReviewForm, productName: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/20 outline-none bg-white text-gray-800"
                  >
                    <option value="">حدد المنتج الذي قمت بطلبه...</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                    <option value="كروت شخصية فاخرة + رول أب">كروت شخصية فاخرة + رول أب</option>
                    <option value="هدايا دعائية ومطبوعات مخصصة">هدايا دعائية ومطبوعات مخصصة</option>
                  </select>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    رأيك وتجربتك في المطبوعات والخدمة <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={customerReviewForm.content}
                    onChange={(e) => setCustomerReviewForm({ ...customerReviewForm, content: e.target.value })}
                    placeholder="شاركنا رأيك في جودة الألوان والورق، دقة المواعيد، والتواصل مع فريقنا..."
                    className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/20 outline-none leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCustomerReviewModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-brand-purple bg-brand-yellow hover:bg-yellow-300 transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
                  >
                    <Star size={14} fill="currentColor" />
                    <span>إرسال التقييم الآن</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Admin Login Modal */}
      <AdminLogin
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={handleAdminLoginSuccess}
      />

      {/* Admin Dashboard */}
      <AdminDashboard
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        onLogout={handleAdminLogout}
        products={products}
        categories={categories}
        settings={settings}
        testimonials={testimonials}
        onUpdateProducts={handleUpdateProducts}
        onUpdateCategories={handleUpdateCategories}
        onUpdateSettings={handleUpdateSettings}
        onUpdateTestimonials={handleUpdateTestimonials}
      />

      {/* Cart Drawer & Direct WhatsApp Order Confirmation */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsCartOpen(false)}></div>

          <div className={`relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in ${isRtl ? 'slide-in-from-left' : 'slide-in-from-right'} duration-300`}>
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between bg-brand-purple text-white">
              <h2 className="text-lg font-black flex items-center gap-2">
                <span className="bg-brand-yellow text-brand-purple text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {cart.length}
                </span>
                <span>{t.cartTitle}</span>
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="text-white hover:text-gray-200 p-1 cursor-pointer">
                <span className="text-2xl font-bold">&times;</span>
              </button>
            </div>

            {/* Cart Items List or Checkout Form */}
            <div className="flex-grow overflow-y-auto p-4 space-y-3">
              {orderSuccessMessage && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs space-y-3 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black shrink-0">✓</span>
                    <div>
                      <span className="font-black block text-sm">🎉 {orderSuccessMessage}</span>
                      <p className="text-[11px] text-emerald-700">
                        {currentLang === 'en' ? 'Your live tracking code is:' : currentLang === 'he' ? 'קוד המעקב שלך הוא:' : 'تم تسجيل طلبك وتخزينه برقم تتبع:'} <strong className="font-mono text-xs">{lastCreatedOrderId}</strong>
                      </p>
                    </div>
                  </div>

                  {completedOrderData && (
                    <a
                      href={completedOrderData.waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      <MessageCircle size={17} />
                      <span>
                        {currentLang === 'en'
                          ? 'Send Order to WhatsApp Now 📱'
                          : currentLang === 'he'
                          ? 'אשר ושלח הזמנה לוואטסאפ של המנהל 📱'
                          : 'إرسال وتأكيد الطلب مع الإدارة عبر واتساب 📱'}
                      </span>
                    </a>
                  )}

                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      handleNavigateToTrack(lastCreatedOrderId);
                    }}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Truck size={14} />
                    <span>{t.goToTrackingBtn}</span>
                  </button>
                </div>
              )}

              {cart.length === 0 ? (
                <div className="text-center text-gray-400 my-20 space-y-3">
                  <ShoppingCart size={48} className="mx-auto text-gray-300" />
                  <p className="text-sm font-semibold">{t.cartEmpty}</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-xs font-bold text-brand-purple underline cursor-pointer"
                  >
                    {t.browseProducts}
                  </button>
                </div>
              ) : isCheckingOut ? (
                <form id="checkout-form" onSubmit={handleCompleteOrder} className="space-y-3 pt-1">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <h3 className="font-black text-sm text-gray-900">{t.checkoutFormTitle}</h3>
                    <button
                      type="button"
                      onClick={() => setIsCheckingOut(false)}
                      className="text-xs text-brand-purple underline font-semibold cursor-pointer"
                    >
                      {t.backToCartBtn}
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">{t.clientNameInput}</label>
                    <input
                      required
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder={currentLang === 'en' ? 'Your Name or Company' : currentLang === 'he' ? 'שם מלא או שם חברה' : 'اسمك أو اسم مؤسستك'}
                      className="w-full text-xs p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-brand-purple"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">{t.clientPhoneInput}</label>
                    <input
                      required
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="059xxxxxxx"
                      className="w-full text-xs p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-brand-purple font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">{t.clientAddressInput}</label>
                    <input
                      type="text"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder={currentLang === 'en' ? 'City, Street' : currentLang === 'he' ? 'עיר ורחוב' : 'المدينة والشارع'}
                      className="w-full text-xs p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-brand-purple"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">{t.clientNotesInput}</label>
                    <textarea
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder={currentLang === 'en' ? 'Urgent delivery or special requests...' : currentLang === 'he' ? 'דגשים מיוחדים לדפוס...' : 'أي متطلبات مستعجلة أو تعليمات خاصة...'}
                      className="w-full text-xs p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-brand-purple h-16 resize-none"
                    />
                  </div>
                </form>
              ) : (
                cart.map((item, idx) => {
                  const pName = getLocalizedProductName(item, currentLang);
                  return (
                    <div
                      key={idx}
                      className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs"
                    >
                      <img
                        src={item.image}
                        alt={pName}
                        className="w-16 h-16 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-grow">
                        <h4 className="font-bold text-gray-900">{pName}</h4>
                        <div className="text-gray-500 mt-0.5 space-y-0.5">
                          <div>
                            {currentLang === 'en' ? 'Quantity' : currentLang === 'he' ? 'כמות' : 'الكمية'}: <strong className="text-gray-800">{item.quantity}</strong> {t.unitPiece}
                          </div>
                          <div className="font-black text-brand-purple">
                            {currentLang === 'en' ? 'Price' : currentLang === 'he' ? 'מחיר' : 'السعر'}: {item.totalPrice} ₪
                            {item.discountPercentage && item.discountPercentage > 0 ? (
                              <span className={`text-[10px] text-emerald-600 ${isRtl ? 'mr-1.5' : 'ml-1.5'} font-bold`}>
                                ({item.discountPercentage}% OFF)
                              </span>
                            ) : null}
                          </div>
                          {item.customText && (
                            <div className="text-[11px] text-gray-600 truncate max-w-[200px]">
                              {item.customText}
                            </div>
                          )}
                          {item.fileNames && item.fileNames.length > 0 && (
                            <div className="text-[10px] text-blue-600 font-medium">
                              {t.filesAttached} {item.fileNames.length} {t.filesCount}
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(idx)}
                        className="text-red-400 hover:text-red-600 p-1.5 self-start cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="p-4 border-t bg-gray-50 space-y-3">
                <div className="space-y-1 text-xs">
                  {cartSavings > 0 && (
                    <div className="flex justify-between items-center text-emerald-700 font-bold">
                      <span>{t.cartVolumeSavings}</span>
                      <span>-{cartSavings} ₪</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center font-bold text-gray-600">
                    <span>{t.cartSubtotal}</span>
                    <span className="font-black text-2xl text-brand-purple">{cartFinalTotal} ₪</span>
                  </div>
                </div>

                {isCheckingOut ? (
                  <button
                    form="checkout-form"
                    type="submit"
                    className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-md active:scale-95 cursor-pointer"
                  >
                    <span>{t.confirmViaWhatsAppBtn}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsCheckingOut(true)}
                    className="w-full bg-brand-yellow hover:bg-yellow-400 text-brand-purple py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-md active:scale-95 cursor-pointer"
                  >
                    <span>{t.checkoutBtn}</span>
                    {isRtl ? <ArrowRight size={17} /> : <ArrowLeft size={17} />}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Sticky Quick App Bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-30 px-3 py-2 flex items-center justify-around text-[10px] font-bold text-gray-600 shadow-lg">
        <button
          onClick={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 ${currentView === 'home' ? 'text-brand-purple' : 'hover:text-brand-purple'}`}
        >
          <Sparkles size={18} />
          <span>{t.mobileHome}</span>
        </button>

        <button
          onClick={() => {
            if (currentView !== 'home') setCurrentView('home');
            setTimeout(() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }), 50);
          }}
          className="flex flex-col items-center gap-1 hover:text-brand-purple"
        >
          <Calculator size={18} />
          <span>{t.mobilePrices}</span>
        </button>

        <button
          onClick={() => handleNavigateToTrack()}
          className={`flex flex-col items-center gap-1 ${currentView === 'track' ? 'text-brand-purple' : 'hover:text-brand-purple'}`}
        >
          <Truck size={18} />
          <span>{t.mobileTrack}</span>
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center gap-1 hover:text-brand-purple relative"
        >
          <ShoppingCart size={18} />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
              {cart.length}
            </span>
          )}
          <span>{t.mobileCart}</span>
        </button>

        {isAdminLoggedIn ? (
          <button
            onClick={handleAdminClick}
            className="flex flex-col items-center gap-1 text-emerald-600 font-bold"
          >
            <Shield size={18} />
            <span>{t.mobileAdmin}</span>
          </button>
        ) : (
          <button
            onClick={() => handleOpenQuote()}
            className="flex flex-col items-center gap-1 hover:text-brand-purple"
          >
            <FileText size={18} />
            <span>{t.mobileQuote}</span>
          </button>
        )}
      </div>

    </div>
  );
}

export default App;