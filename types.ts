export interface DiscountTier {
  minQuantity: number;
  discountPercentage: number; // e.g. 5, 10, 15, 20
  label?: string;
}

export interface ProductOption {
  name: string;
  choices: {
    label: string;
    priceModifier: number; // additional price or percentage
  }[];
}

export type Language = 'ar' | 'en' | 'he';

export interface Product {
  id: string;
  name: string;
  name_en?: string;
  name_he?: string;
  description: string;
  description_en?: string;
  description_he?: string;
  price: number; // base price (for minQuantity batch or unit)
  unitPrice?: number; // base price per single unit
  category: string;
  image: string;
  minQuantity: number;
  discountTiers?: DiscountTier[];
  options?: ProductOption[];
  featured?: boolean;
}

export interface CategoryItem {
  id: string;
  name: string;
  name_en?: string;
  name_he?: string;
  iconName?: string;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
  customText?: string;
  files?: File[];
  fileNames?: string[];
  unitPriceCalculated?: number;
  discountPercentage?: number;
  savings?: number;
  totalPrice?: number;
  selectedOptions?: Record<string, string>;
}

export interface Testimonial {
  id: string | number;
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating?: number;
  date?: string;
  verified?: boolean;
  productName?: string;
  status?: 'approved' | 'pending';
}

export interface QuoteRequest {
  id: string;
  customerName: string;
  phone: string;
  serviceName: string;
  details: string;
  quantity?: number;
  status: 'new' | 'contacted' | 'completed' | 'cancelled';
  createdAt: string;
  offeredPrice?: number;
  adminNotes?: string;
  updatedAt?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discountPercentage: number;
  totalPrice: number;
  customText?: string;
  optionsSummary?: string;
}

export type OrderWorkflowStatus =
  | 'new'          // جديد
  | 'review'       // قيد المراجعة والتدقيق
  | 'in_press'     // في المطبعة قيد التنفيذ
  | 'packaging'    // مرحلة التغليف والتجهيز
  | 'ready'        // جاهز للاستلام والتوصيل
  | 'completed'    // تم التسليم
  | 'in_progress'  // للتوافق
  | 'cancelled';   // ملغي

export interface OrderStatusHistoryItem {
  id?: string;
  status: OrderWorkflowStatus;
  statusNote?: string;
  timestamp: string;
  updatedBy?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  discountTotal: number;
  finalTotal: number;
  status: OrderWorkflowStatus;
  statusNote?: string;
  estimatedDate?: string;
  createdAt: string;
  updatedAt?: string;
  history?: OrderStatusHistoryItem[];
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  category: 'logo' | 'products' | 'banners' | 'general';
  uploadedAt: string;
  size?: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'quote' | 'system';
  timestamp: string;
  read: boolean;
  orderId?: string;
}

export interface SiteSettings {
  companyName: string;
  tagline: string;
  logoUrl: string;
  whatsappNumber: string; // e.g. 970568204195
  displayPhone: string;
  email: string;
  address: string;
  heroBadge: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  features: {
    title: string;
    desc: string;
  }[];
  defaultDiscountTiers?: DiscountTier[];
  heroBackground?: string;
  heroOverlayOpacity?: number; // 0 to 100
  heroOverlayColor?: string;
  heroShowContent?: boolean;
  heroHeight?: 'compact' | 'medium' | 'large';
}
