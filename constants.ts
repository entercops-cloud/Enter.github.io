import { Product, Testimonial, CategoryItem, SiteSettings, DiscountTier, Language } from './types';
import { LayoutGrid, ScrollText, Image as ImageIcon, Gift, Package, Printer } from 'lucide-react';
import { UI_TRANSLATIONS, LANGUAGES } from './translations';

export { UI_TRANSLATIONS, LANGUAGES };

// Default Tiered Discounts for bulk orders
export const DEFAULT_DISCOUNT_TIERS: DiscountTier[] = [
  { minQuantity: 250, discountPercentage: 5, label: 'خصم 5% عند طلب 250+' },
  { minQuantity: 500, discountPercentage: 10, label: 'خصم 10% عند طلب 500+' },
  { minQuantity: 1000, discountPercentage: 15, label: 'خصم 15% عند طلب 1000+' },
  { minQuantity: 2500, discountPercentage: 20, label: 'خصم 20% عند طلب 2500+' },
];

export const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: 'all',
    name: 'الكل',
    name_en: 'All Categories',
    name_he: 'הכל',
    iconName: 'LayoutGrid',
    description: 'جميع الخدمات والمنتجات',
  },
  {
    id: 'business-cards',
    name: 'كروت شخصية',
    name_en: 'Business Cards',
    name_he: 'כרטיסי ביקור',
    iconName: 'ScrollText',
    description: 'كروت بزنس فاخرة وسلوفان',
  },
  {
    id: 'marketing',
    name: 'مطبوعات وبروشورات',
    name_en: 'Brochures & Flyers',
    name_he: 'ברושורים ופליירים',
    iconName: 'Printer',
    description: 'فلايرات وبروشورات وفولدرات',
  },
  {
    id: 'large-format',
    name: 'لافتات وبنرات',
    name_en: 'Banners & Signs',
    name_he: 'שלטים ובאנרים',
    iconName: 'Image',
    description: 'رول أب وبنرات وأحرف بارزة',
  },
  {
    id: 'gifts',
    name: 'هدايا دعائية',
    name_en: 'Promotional Gifts',
    name_he: 'מוצרי קד״מ ומתנות',
    iconName: 'Gift',
    description: 'أكواب، أقلام، ومجموعات ترويجية',
  },
  {
    id: 'packaging',
    name: 'تغليف وعلب',
    name_en: 'Packaging & Bags',
    name_he: 'אריזות ושקיות',
    iconName: 'Package',
    description: 'أكياس ورقية وعلب كرتونية',
  },
];

export const CATEGORIES = [
  { id: 'all', name: 'الكل', name_en: 'All', name_he: 'הכל', icon: LayoutGrid },
  { id: 'business-cards', name: 'كروت شخصية', name_en: 'Business Cards', name_he: 'כרטיסי ביקור', icon: ScrollText },
  { id: 'marketing', name: 'ورقيات وبروشورات', name_en: 'Flyers & Prints', name_he: 'דפוס שיווקי', icon: Printer },
  { id: 'large-format', name: 'لافتات وبنرات', name_en: 'Banners & Signs', name_he: 'שלטים ורול-אפ', icon: ImageIcon },
  { id: 'gifts', name: 'هدايا دعائية', name_en: 'Gifts & Merchandise', name_he: 'מתנות ממותגות', icon: Gift },
  { id: 'packaging', name: 'تغليف وعلب', name_en: 'Packaging & Bags', name_he: 'אריזות ושקיות', icon: Package },
];

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  companyName: 'Enter Technology | إنتر تكنولوجي',
  tagline: 'للدعاية والإعلان والطباعة الرقمية والأوفست',
  logoUrl: 'https://placehold.co/400x150/5D2E8E/FBE122?text=Enter+Technology&font=montserrat',
  whatsappNumber: '970568204195',
  displayPhone: '0568 204 195',
  email: 'enter.co.ps@gmail.com',
  address: 'فلسطين - الضفة الغربية',
  heroBadge: 'شريكك الأول في التميز الإعلاني',
  heroTitle: 'نحول أفكارك إلى',
  heroHighlight: 'واقع ملموس',
  heroSubtitle: 'نقدم حلولاً متكاملة للطباعة الرقمية والأوفست، الهدايا الترويجية واللافتات بأعلى المعايير وأسعار تنافسية.',
  features: [
    { title: 'جودة طباعة عالية', desc: 'أحدث ماكينات الطباعة الرقمية والأوفست الألمانية' },
    { title: 'تصميم احترافي', desc: 'فريق مصممين مبدعين لتجسيد هويتك البصرية' },
    { title: 'سرعة في التنفيذ', desc: 'التزام تام بالمواعيد وتسليم فوري' },
    { title: 'خصومات تصاعدية', desc: 'أسعار منافسة وباقات توفير كلما زادت الكمية' },
  ],
  heroBackground: 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&w=1920&q=80',
  heroOverlayOpacity: 60,
  heroOverlayColor: '#5D2E8E',
  heroShowContent: true,
  heroHeight: 'medium',
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'كروت شخصية فاخرة',
    name_en: 'Luxury Business Cards',
    name_he: 'כרטיסי ביקור יוקרתיים',
    description: 'طباعة كروت شخصية عالية الجودة 350 غم كوشيه مع خيارات السلوفان المات واللامع وزوايا دائرية.',
    description_en: 'Premium 350gsm coated business cards with matte or glossy lamination, soft touch velvet, and rounded corners.',
    description_he: 'כרטיסי ביקור מובחרים 350 גרם כרומו עם אפשרויות למינציה מט, מבריק, סופט-טאץ׳ קטיפתי ופינות מעוגלות.',
    price: 80, // Price for minQuantity (100)
    unitPrice: 0.8,
    category: 'business-cards',
    image: '/src/assets/images/print_business_cards_1791613344923.jpg',
    minQuantity: 100,
    discountTiers: [
      { minQuantity: 250, discountPercentage: 5, label: 'خصم 5%' },
      { minQuantity: 500, discountPercentage: 10, label: 'خصم 10%' },
      { minQuantity: 1000, discountPercentage: 15, label: 'خصم 15%' },
      { minQuantity: 2500, discountPercentage: 20, label: 'خصم 20%' },
    ],
    options: [
      {
        name: 'نوع السلوفان',
        choices: [
          { label: 'سلوفان مطفي (مات) / Matte', priceModifier: 0 },
          { label: 'سلوفان لامع (جلوس) / Gloss', priceModifier: 0 },
          { label: 'سلوفان مخملي سوفت تاتش / Soft Touch', priceModifier: 15 },
          { label: 'سلوفان مطفي + سبوت UV بارز / Spot UV', priceModifier: 30 },
        ],
      },
      {
        name: 'شكل الحواف',
        choices: [
          { label: 'زوايا قائمة عادية / Standard Square', priceModifier: 0 },
          { label: 'قص زوايا دائرية فاخرة / Rounded Corners', priceModifier: 10 },
        ],
      },
    ],
    featured: true,
  },
  {
    id: '2',
    name: 'فلاير إعلاني A5 ملون',
    name_en: 'Full-Color A5 Advertising Flyers',
    name_he: 'פלייר פרסומי A5 בצבע מלא',
    description: 'طباعة فلايرات إعلانية تسويقية وجهين ملونين على ورق كوشيه 170 غم بألوان حية فائقة الدقة.',
    description_en: 'Double-sided full-color promotional flyers on 170gsm coated art paper with vibrant high-definition colors.',
    description_he: 'הדפסת פליירים שיווקיים דו-צדדיים בצבע מלא על נייר כרומו 170 גרם באיכות צבע חדה ועשירה.',
    price: 150,
    unitPrice: 0.3,
    category: 'marketing',
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80',
    minQuantity: 500,
    discountTiers: [
      { minQuantity: 1000, discountPercentage: 10, label: 'خصم 10%' },
      { minQuantity: 2000, discountPercentage: 15, label: 'خصم 15%' },
      { minQuantity: 5000, discountPercentage: 25, label: 'خصم 25%' },
    ],
    options: [
      {
        name: 'سماكة الورق',
        choices: [
          { label: 'كوشيه 135 غم / 135gsm Coated', priceModifier: 0 },
          { label: 'كوشيه 170 غم (الموصى به) / 170gsm Recommended', priceModifier: 20 },
          { label: 'كوشيه 250 غم سميك / 250gsm Heavy Art Paper', priceModifier: 40 },
        ],
      },
    ],
    featured: true,
  },
  {
    id: '3',
    name: 'ستاند رول أب فاخر 85x200 سم',
    name_en: 'Premium Roll-Up Banner Stand (85x200cm)',
    name_he: 'סטנד רול-אפ פרימיום (85x200 ס״מ)',
    description: 'ستاند رول أب للأجنحة والمعارض والمؤتمرات مع طباعة هاي ريزولوشن وبانر مقاوم للتمزق وحقيبة نقل.',
    description_en: 'Retractable rollup stand for exhibitions and corporate booths with high-res tear-resistant vinyl and carry case.',
    description_he: 'מתקן רול-אפ נגלל לכנסים ותערוכות עם הדפסת היי-רזולוציה עמידה לקריעה ותיק נשיאה מרופד.',
    price: 120,
    unitPrice: 120,
    category: 'large-format',
    image: '/src/assets/images/print_roll_up_banner_1791613355209.jpg',
    minQuantity: 1,
    discountTiers: [
      { minQuantity: 3, discountPercentage: 5, label: 'خصم 5%' },
      { minQuantity: 5, discountPercentage: 10, label: 'خصم 10%' },
      { minQuantity: 10, discountPercentage: 15, label: 'خصم 15%' },
      { minQuantity: 20, discountPercentage: 20, label: 'خصم 20%' },
    ],
    options: [
      {
        name: 'نوع الهيكل',
        choices: [
          { label: 'هيكل ألمنيوم قياسي / Standard Aluminum Base', priceModifier: 0 },
          { label: 'هيكل عريض فاخر ثقيل / Wide Heavy-Duty Luxury Base', priceModifier: 25 },
        ],
      },
    ],
    featured: true,
  },
  {
    id: '4',
    name: 'أكياس تسوق ورقية فاخرة',
    name_en: 'Luxury Paper Shopping Bags',
    name_he: 'שקיות נייר ממותגות יוקרתיות',
    description: 'أكياس كرافت وأكياس كوشيه سميكة مع يد حبل قطني وطباعة هويتك التجارية بجودة فائقة.',
    description_en: 'Durable kraft and laminated art paper shopping bags with cotton rope handles and custom branded print.',
    description_he: 'שקיות קראפט וכרומו איכותיות עם ידיות שרוך כותנה והדפסת מיתוג עסקי בגימור יוקרתי.',
    price: 300,
    unitPrice: 3.0,
    category: 'packaging',
    image: '/src/assets/images/print_packaging_bags_1791613374443.jpg',
    minQuantity: 100,
    discountTiers: [
      { minQuantity: 250, discountPercentage: 7, label: 'خصم 7%' },
      { minQuantity: 500, discountPercentage: 12, label: 'خصم 12%' },
      { minQuantity: 1000, discountPercentage: 18, label: 'خصم 18%' },
      { minQuantity: 2500, discountPercentage: 25, label: 'خصم 25%' },
    ],
    options: [
      {
        name: 'خامة الكيس',
        choices: [
          { label: 'ورق كرافت بيئي بني / Brown Eco Kraft', priceModifier: 0 },
          { label: 'ورق كرافت أبيض ناصع / Pure White Kraft', priceModifier: 15 },
          { label: 'ورق كوشيه فاخر مع سلوفان مطفي / Luxury Matte Coated', priceModifier: 40 },
        ],
      },
    ],
    featured: true,
  },
  {
    id: '5',
    name: 'أكواب سيراميك وهدايا دعائية',
    name_en: 'Custom Ceramic Mugs & Merchandise',
    name_he: 'ספלי קרמיקה ממותגים ומתנות קד״מ',
    description: 'طباعة حرارية متينة بألوان كاملة على أكواب السيراميك والمعدن مع تغليف كرتوني فردي.',
    description_en: 'Durable full-color sublimation print on premium ceramic and enamel mugs with individual protective boxes.',
    description_he: 'הדפסה סובלימציה עמידה בצבע מלא על ספלי קרמיקה איכותיים עם אריזת קרטון אישית.',
    price: 25,
    unitPrice: 25,
    category: 'gifts',
    image: '/src/assets/images/print_gift_mugs_1791613364229.jpg',
    minQuantity: 12,
    discountTiers: [
      { minQuantity: 24, discountPercentage: 8, label: 'خصم 8%' },
      { minQuantity: 48, discountPercentage: 12, label: 'خصم 12%' },
      { minQuantity: 100, discountPercentage: 20, label: 'خصم 20%' },
      { minQuantity: 250, discountPercentage: 28, label: 'خصم 28%' },
    ],
    options: [
      {
        name: 'نوع الكوب',
        choices: [
          { label: 'كوب سيراميك أبيض كلاسيك / Classic White Mug', priceModifier: 0 },
          { label: 'كوب سيراميك ملون من الداخل واليد / Two-Tone Color Handle', priceModifier: 3 },
          { label: 'كوب سحري أسود يكشف الطباعة بالحرارة / Heat Magic Mug', priceModifier: 7 },
        ],
      },
    ],
    featured: true,
  },
  {
    id: '6',
    name: 'بروشور 3 طيات (مطوية تعريفية)',
    name_en: 'Tri-Fold Company Brochures (A4)',
    name_he: 'ברושור תלת-כנפי (מתקפל A4)',
    description: 'مطوية تعريفية للشركات مقاس A4 مقسمة إلى 3 طيات، ورق كوشيه 170 غم مع سلفنة وحزوز دقيقة.',
    description_en: 'A4 corporate tri-fold brochures on 170gsm art paper with precision scoring, folding, and optional lamination.',
    description_he: 'פרוספקט עסקי מתקפל A4 לשלושה חלקים, נייר כרומו 170 גרם עם ביגים מדויקים ולמינציה.',
    price: 200,
    unitPrice: 0.8,
    category: 'marketing',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    minQuantity: 250,
    discountTiers: [
      { minQuantity: 500, discountPercentage: 10, label: 'خصم 10%' },
      { minQuantity: 1000, discountPercentage: 15, label: 'خصم 15%' },
      { minQuantity: 2500, discountPercentage: 22, label: 'خصم 22%' },
    ],
    options: [
      {
        name: 'نوع السلوفان',
        choices: [
          { label: 'بدون سلوفان / Unlaminated', priceModifier: 0 },
          { label: 'سلوفان مطفي وجهين / Double-Sided Matte', priceModifier: 25 },
          { label: 'سلوفان لامع وجهين / Double-Sided Gloss', priceModifier: 25 },
        ],
      },
    ],
    featured: false,
  },
  {
    id: '7',
    name: 'لافتات وأحرف بارزة ثلاثية الأبعاد',
    name_en: '3D Illuminated Channel Letters & Signage',
    name_he: 'אותיות תלת-ממד ושילוט מואר',
    description: 'تصميم وتنفيذ أحرف بارزة 3D للواجهات والشركات من الاكريليك والاستانلس مع إضاءة LED خلفية أو أمامية.',
    description_en: 'Custom 3D acrylic and stainless steel illuminated signage for building facades and interior receptions with premium LEDs.',
    description_he: 'עיצוב וייצור אותיות בולטות 3D לחזיתות ומשרדים מאקריל ונירוסטה עם תאורת לד אחורית או קדמית.',
    price: 450,
    unitPrice: 450,
    category: 'large-format',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
    minQuantity: 1,
    discountTiers: [
      { minQuantity: 2, discountPercentage: 5, label: 'خصم 5%' },
      { minQuantity: 4, discountPercentage: 10, label: 'خصم 10%' },
      { minQuantity: 8, discountPercentage: 15, label: 'خصم 15%' },
    ],
    options: [
      {
        name: 'نوع الخامة',
        choices: [
          { label: 'اكريليك مضيء بالكامل / Fully Lit Acrylic', priceModifier: 0 },
          { label: 'ستانلس ستيل مع إضاءة خلفية / Stainless Halo Lit', priceModifier: 80 },
          { label: 'نيون ليد فليكس مرن / Flexible Neon LED', priceModifier: -30 },
        ],
      },
    ],
    featured: false,
  },
];

export const PRODUCTS = INITIAL_PRODUCTS;
export const LOGO_URL = INITIAL_SITE_SETTINGS.logoUrl;

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'rev-1',
    name: 'م. حسام النجار',
    role: 'مدير العمليات - شركة الرواد للحلول الرقمية (رام الله)',
    content: 'طلبنا 1000 كارت شخصي بسلوفان سوفت تاتش وسبوت UV وستاندات رول أب لمؤتمرنا التقني. دقة الألوان وتفاصيل الشعار وجودة الورق فاقت التوقعات، وسرعة التسليم خلال 24 ساعة كانت استثنائية.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
    rating: 5,
    verified: true,
    productName: 'كروت شخصية فاخرة + رول أب',
    date: '2026-11-08',
    status: 'approved',
  },
  {
    id: 'rev-2',
    name: 'سارة التميمي',
    role: 'مؤسسة متجر إشراقة للعطور والأزياء (نابلس)',
    content: 'طباعة أكياس التسوق الورقية الفاخرة وعلب التغليف أحدثت فارقاً كبيراً في رضا عملائنا. التغليف أنيق جداً وخامة الكرافت متينة وفخمة، شكراً لفريق إنتر تكنولوجي على دقتهم المتناهية.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
    rating: 5,
    verified: true,
    productName: 'أكياس تسوق ورقية فاخرة',
    date: '2026-11-05',
    status: 'approved',
  },
  {
    id: 'rev-3',
    name: 'د. أريج الطبية',
    role: 'مديرة مجمع الرعاية التخصصي (الخليل)',
    content: 'أكواب السيراميك الترويجية المطبوعة حرارياً والبروشورات المتقنة ساهمت بنجاح فعاليتنا السنوية. الخصم التصاعدي على الكمية كان ممتازاً ووفر لنا الكثير، ودعم الواتساب متجاوب دائماً.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80',
    rating: 5,
    verified: true,
    productName: 'أكواب سيراميك وهدايا دعائية',
    date: '2026-11-02',
    status: 'approved',
  },
  {
    id: 'rev-4',
    name: 'طارق كنعان',
    role: 'المدير التنفيذي - مطعم وكافيه بيسان (جنين)',
    content: 'طباعة قوائم الطعام (المنيو) بسلوفان مطفي متين ومقاوم للاستخدام اليومي، بالإضافة للافتة الاكريليك المضيئة للمدخل. جودة ألمانية حقيقية والتزام لا يضاهى بمواعيد التسليم.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
    rating: 5,
    verified: true,
    productName: 'لافتات ولوحات إعلانية',
    date: '2026-10-28',
    status: 'approved',
  },
  {
    id: 'rev-5',
    name: 'م. إبراهيم ناصر',
    role: 'منسق فعاليات ومؤتمرات - شركة آفاق (بيت لحم)',
    content: 'خدمة احترافية بكل ما تعنيه الكلمة. نظام تتبع الطلب برقم التتبع ومراحل الطباعة في المطبعة أراحنا كثيراً وضمن وصول كل شيء لموقع المؤتمر في الوقت المناسب.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&h=120&q=80',
    rating: 5,
    verified: true,
    productName: 'ستاند رول أب فاخر',
    date: '2026-10-24',
    status: 'approved',
  },
];

export const TESTIMONIALS: Testimonial[] = INITIAL_TESTIMONIALS;

// Helper localization functions
export const getLocalizedCategoryName = (
  cat: CategoryItem | { id: string; name: string; name_en?: string; name_he?: string },
  lang?: Language | string
): string => {
  if (lang === 'en' && cat.name_en) return cat.name_en;
  if (lang === 'he' && cat.name_he) return cat.name_he;
  return cat.name;
};

export const getLocalizedProductName = (product: Product, lang?: Language | string): string => {
  if (lang === 'en' && product.name_en) return product.name_en;
  if (lang === 'he' && product.name_he) return product.name_he;
  return product.name;
};

export const getLocalizedProductDesc = (product: Product, lang?: Language | string): string => {
  if (lang === 'en' && product.description_en) return product.description_en;
  if (lang === 'he' && product.description_he) return product.description_he;
  return product.description;
};