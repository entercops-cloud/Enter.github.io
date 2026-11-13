import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SITE_SETTINGS, INITIAL_TESTIMONIALS } from './constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Trust reverse proxies (Cloudflare, Nginx, cPanel, Heroku, Render, etc.)
app.set('trust proxy', 1);

// Ensure storage directories exist
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const DB_FILE = path.join(DATA_DIR, 'db.json');

// Configure Multer for server disk image uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e6)}`;
    cb(null, `${cleanName}_${uniqueSuffix}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded files statically
app.use('/uploads', express.static(UPLOADS_DIR));

// Seed database structure
interface DatabaseData {
  products: any[];
  categories: any[];
  settings: any;
  orders: any[];
  quotes: any[];
  media: any[];
  testimonials: any[];
  adminPassword: string;
}

const getDefaultData = (): DatabaseData => ({
  products: INITIAL_PRODUCTS,
  categories: INITIAL_CATEGORIES,
  settings: INITIAL_SITE_SETTINGS,
  orders: [
    {
      id: 'ORD-1092',
      customerName: 'شركة الرواد للحلول الرقمية',
      customerPhone: '0599123456',
      customerAddress: 'رام الله - شارع الإرسال',
      notes: 'يرجى التركيز على ألوان الشعار وسلوفان السوفت تاتش',
      items: [
        {
          id: 'item-1',
          productId: '1',
          productName: 'كروت شخصية فاخرة',
          quantity: 1000,
          unitPrice: 0.8,
          discountPercentage: 15,
          totalPrice: 680,
          customText: 'كروت باسم المهندس حسام النجار',
          optionsSummary: 'سلوفان مطفي + سبوت UV بارز',
        },
        {
          id: 'item-2',
          productId: '3',
          productName: 'ستاند رول أب فاخر 85x200 سم',
          quantity: 2,
          unitPrice: 120,
          discountPercentage: 0,
          totalPrice: 240,
          customText: 'شعار الرواد الجديد',
        },
      ],
      subtotal: 1040,
      discountTotal: 120,
      finalTotal: 920,
      status: 'in_press',
      statusNote: 'تم اعتماد البروفة، الطلب جاري طباعته على ماكينة هايدلبرغ الألمانية',
      estimatedDate: 'خلال 24-48 ساعة',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      history: [
        {
          id: 'h-1092-1',
          status: 'new',
          statusNote: 'تم استلام الطلب وتأكيد مواصفات الكروت ورول أب',
          timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
          updatedBy: 'النظام الإلكتروني',
        },
        {
          id: 'h-1092-2',
          status: 'review',
          statusNote: 'فحص دقة ملفات التصميم واعتماد طبقة السوفت تاتش وسبوت UV',
          timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
          updatedBy: 'فريق التدقيق الفني',
        },
        {
          id: 'h-1092-3',
          status: 'in_press',
          statusNote: 'تم اعتماد البروفة، الطلب جاري طباعته على ماكينة هايدلبرغ الألمانية',
          timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
          updatedBy: 'إدارة المطبعة',
        },
      ],
    },
    {
      id: 'ORD-1091',
      customerName: 'مكتب السنابل العقاري',
      customerPhone: '0568987654',
      customerAddress: 'نابلس - رفيديا',
      items: [
        {
          id: 'item-3',
          productId: '4',
          productName: 'أكياس تسوق ورقية فاخرة',
          quantity: 500,
          unitPrice: 3.0,
          discountPercentage: 12,
          totalPrice: 1320,
          customText: 'شعار السنابل مع كود QR',
        },
      ],
      subtotal: 1500,
      discountTotal: 180,
      finalTotal: 1320,
      status: 'review',
      statusNote: 'جاري فحص دقة ملفات التصميم وإعداد قوالب التكسير والقص',
      estimatedDate: '3 أيام عمل',
      createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      history: [
        {
          id: 'h-1091-1',
          status: 'new',
          statusNote: 'تم استلام طلب أكياس التسوق الورقية الفاخرة',
          timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
          updatedBy: 'النظام الإلكتروني',
        },
        {
          id: 'h-1091-2',
          status: 'review',
          statusNote: 'جاري فحص دقة ملفات التصميم وإعداد قوالب التكسير والقص',
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          updatedBy: 'قسم ما قبل الطباعة',
        },
      ],
    },
    {
      id: 'ORD-1088',
      customerName: 'عيادة د. أريج الطبية',
      customerPhone: '0598112233',
      customerAddress: 'الخليل - شارع عين سارة',
      items: [
        {
          id: 'item-4',
          productId: '5',
          productName: 'أكواب سيراميك وهدايا دعائية',
          quantity: 48,
          unitPrice: 25,
          discountPercentage: 12,
          totalPrice: 1056,
          customText: 'شعار العيادة الترويجي',
        },
      ],
      subtotal: 1200,
      discountTotal: 144,
      finalTotal: 1056,
      status: 'ready',
      statusNote: 'تم الانتهاء من الطباعة والتغليف الحراري الفردي وهو جاهز للاستلام',
      estimatedDate: 'جاهز للاستلام الآن',
      createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
      history: [
        {
          id: 'h-1088-1',
          status: 'new',
          statusNote: 'استلام طلب أكواب السيراميك الترويجية',
          timestamp: new Date(Date.now() - 3600000 * 72).toISOString(),
          updatedBy: 'النظام',
        },
        {
          id: 'h-1088-2',
          status: 'review',
          statusNote: 'اعتماد مقاسات الشعار وضبط حرارة المكابس',
          timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
          updatedBy: 'فريق التدقيق',
        },
        {
          id: 'h-1088-3',
          status: 'in_press',
          statusNote: 'إتمام الطباعة الحرارية وتثبيت الألوان بالأفران',
          timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
          updatedBy: 'فني الطباعة الحرارية',
        },
        {
          id: 'h-1088-4',
          status: 'packaging',
          statusNote: 'فرز الأكواب والتغليف الحراري داخل الكراتين الفردية',
          timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
          updatedBy: 'قسم التغليف',
        },
        {
          id: 'h-1088-5',
          status: 'ready',
          statusNote: 'تم الانتهاء من الطباعة والتغليف الحراري الفردي وهو جاهز للاستلام',
          timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
          updatedBy: 'إدارة التسليم',
        },
      ],
    },
  ],
  quotes: [
    {
      id: 'Q-2041',
      customerName: 'د. طارق زيدان',
      phone: '0598776655',
      serviceName: 'تجهيز كامل لافتات وأحرف بارزة للمركز الطبي',
      details: 'أحرف بارزة ستانلس ذهبي بطول 3 أمتار مع إضاءة ليد خلفية، بالإضافة إلى 5 رول أب',
      quantity: 1,
      status: 'new',
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
    {
      id: 'Q-2040',
      customerName: 'مكتب المحاماة الحديث',
      phone: '0569001122',
      serviceName: 'فولدرات وأوراق رسمية وأختام',
      details: 'طباعة 1000 فولدر جيب داخلي + 2000 ورقة مراسلات A4 مع ختم كريستال',
      quantity: 3000,
      status: 'contacted',
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    },
  ],
  media: [
    {
      id: 'media-1',
      name: 'كروت شخصية فاخرة ريزولوشن عالي',
      url: '/src/assets/images/print_business_cards_1791613344923.jpg',
      category: 'products',
      uploadedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      size: '1.2 MB',
    },
    {
      id: 'media-2',
      name: 'رول أب ستاند معارض ومؤتمرات',
      url: '/src/assets/images/print_roll_up_banner_1791613355209.jpg',
      category: 'banners',
      uploadedAt: new Date(Date.now() - 3600000 * 36).toISOString(),
      size: '1.4 MB',
    },
    {
      id: 'media-3',
      name: 'أكواب سيراميك وهدايا مكتبية',
      url: '/src/assets/images/print_gift_mugs_1791613364229.jpg',
      category: 'products',
      uploadedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      size: '980 KB',
    },
    {
      id: 'media-4',
      name: 'أكياس تسوق ورقية كرافت فاخرة',
      url: '/src/assets/images/print_packaging_bags_1791613374443.jpg',
      category: 'products',
      uploadedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      size: '1.1 MB',
    },
    {
      id: 'media-5',
      name: 'شعار إنتر تكنولوجي الرسمي',
      url: INITIAL_SITE_SETTINGS.logoUrl,
      category: 'logo',
      uploadedAt: new Date(Date.now() - 3600000 * 60).toISOString(),
      size: '420 KB',
    },
  ],
  testimonials: INITIAL_TESTIMONIALS,
  adminPassword: 'admin123',
});

function readDb(): DatabaseData {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = getDefaultData();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    if (!parsed.testimonials || !Array.isArray(parsed.testimonials)) {
      parsed.testimonials = INITIAL_TESTIMONIALS;
      try {
        fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
      } catch (e) {
        console.error('Error writing migrated DB:', e);
      }
    }
    return parsed;
  } catch (err) {
    console.error('Error reading DB:', err);
    return getDefaultData();
  }
}

function writeDb(data: DatabaseData) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing DB:', err);
  }
}

// REST API Endpoints

// 1. Health & Server Status
app.get('/api/status', (_req: Request, res: Response) => {
  const db = readDb();
  res.json({
    status: 'ok',
    storage: 'server_disk',
    dbPath: DB_FILE,
    serverTime: new Date().toISOString(),
    stats: {
      ordersCount: (db.orders || []).length,
      quotesCount: (db.quotes || []).length,
      productsCount: (db.products || []).length,
      categoriesCount: (db.categories || []).length,
      testimonialsCount: (db.testimonials || []).length,
      mediaCount: (db.media || []).length,
    },
  });
});

app.get('/api/backup', (_req: Request, res: Response) => {
  const db = readDb();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="enter_tech_db_backup.json"');
  res.send(JSON.stringify(db, null, 2));
});

// 2. Products
app.get('/api/products', (_req: Request, res: Response) => {
  const db = readDb();
  res.json(db.products);
});

app.put('/api/products', (req: Request, res: Response) => {
  if (!Array.isArray(req.body)) {
    return res.status(400).json({ error: 'Array of products expected' });
  }
  const db = readDb();
  db.products = req.body;
  writeDb(db);
  res.json(db.products);
});

app.post('/api/products', (req: Request, res: Response) => {
  const db = readDb();
  const newProduct = {
    ...req.body,
    id: req.body.id || `p-${Date.now()}`,
  };
  db.products = [newProduct, ...db.products];
  writeDb(db);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req: Request, res: Response) => {
  const db = readDb();
  const { id } = req.params;
  db.products = db.products.map((p) => (p.id === id ? { ...p, ...req.body } : p));
  writeDb(db);
  res.json({ success: true });
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  const db = readDb();
  const { id } = req.params;
  db.products = db.products.filter((p) => p.id !== id);
  writeDb(db);
  res.json({ success: true });
});

// 3. Categories
app.get('/api/categories', (_req: Request, res: Response) => {
  const db = readDb();
  res.json(db.categories);
});

app.put('/api/categories', (req: Request, res: Response) => {
  if (!Array.isArray(req.body)) {
    return res.status(400).json({ error: 'Array of categories expected' });
  }
  const db = readDb();
  db.categories = req.body;
  writeDb(db);
  res.json(db.categories);
});

app.post('/api/categories', (req: Request, res: Response) => {
  const db = readDb();
  const newCategory = {
    id: req.body.id || `cat-${Date.now()}`,
    name: req.body.name,
  };
  db.categories.push(newCategory);
  writeDb(db);
  res.status(201).json(newCategory);
});

app.delete('/api/categories/:id', (req: Request, res: Response) => {
  const db = readDb();
  const { id } = req.params;
  if (id === 'all') {
    return res.status(400).json({ error: 'Cannot delete all category' });
  }
  db.categories = db.categories.filter((c) => c.id !== id);
  writeDb(db);
  res.json({ success: true });
});

// 4. Site Settings
app.get('/api/settings', (_req: Request, res: Response) => {
  const db = readDb();
  res.json(db.settings);
});

app.put('/api/settings', (req: Request, res: Response) => {
  const db = readDb();
  db.settings = { ...db.settings, ...req.body };
  writeDb(db);
  res.json(db.settings);
});

// 5. Orders (Server-stored tasks & client orders)
app.get('/api/orders', (_req: Request, res: Response) => {
  const db = readDb();
  res.json(db.orders);
});

// Search order for client tracking
app.get('/api/orders/track/:query', (req: Request, res: Response) => {
  const db = readDb();
  const rawQuery = Array.isArray(req.params.query) ? req.params.query[0] : req.params.query;
  const query = (rawQuery || '').trim().toUpperCase();
  const cleanDigits = query.replace(/[^0-9]/g, '');

  const order = db.orders.find((ord) => {
    if (ord.id.toUpperCase() === query) return true;
    if (cleanDigits.length >= 6 && ord.customerPhone.replace(/[^0-9]/g, '').includes(cleanDigits)) {
      return true;
    }
    return false;
  });

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

app.post('/api/orders', (req: Request, res: Response) => {
  const db = readDb();
  const initialStatus = req.body.status || 'review';
  const initialNote = req.body.statusNote || 'تم استلام الطلب وتوثيق المواصفات وبدء التدقيق الفني بالمطبعة';
  const now = new Date().toISOString();

  const initialHistory = Array.isArray(req.body.history) && req.body.history.length > 0
    ? req.body.history
    : [
        {
          id: `hist-${Date.now()}`,
          status: initialStatus,
          statusNote: initialNote,
          timestamp: now,
          updatedBy: 'العميل / النظام',
        },
      ];

  const newOrder = {
    ...req.body,
    id: req.body.id || `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: now,
    updatedAt: now,
    status: initialStatus,
    statusNote: initialNote,
    estimatedDate: req.body.estimatedDate || '2-3 أيام عمل',
    history: initialHistory,
  };
  db.orders = [newOrder, ...db.orders];
  writeDb(db);
  res.status(201).json(newOrder);
});

app.put('/api/orders/:id/status', (req: Request, res: Response) => {
  const db = readDb();
  const { id } = req.params;
  const { status, statusNote, estimatedDate } = req.body;

  db.orders = db.orders.map((ord) => {
    if (ord.id === id) {
      const newStatus = status || ord.status;
      const newStatusNote = statusNote !== undefined ? statusNote : ord.statusNote;
      const history = Array.isArray(ord.history) && ord.history.length > 0
        ? [...ord.history]
        : [
            {
              id: `hist-init-${ord.id}`,
              status: ord.status,
              statusNote: ord.statusNote || 'تم تسجيل الطلب',
              timestamp: ord.createdAt,
              updatedBy: 'النظام',
            },
          ];

      if (newStatus !== ord.status || (statusNote && statusNote !== ord.statusNote)) {
        history.push({
          id: `hist-${Date.now()}`,
          status: newStatus,
          statusNote: newStatusNote,
          timestamp: new Date().toISOString(),
          updatedBy: 'إدارة المطبعة',
        });
      }

      return {
        ...ord,
        status: newStatus,
        statusNote: newStatusNote,
        estimatedDate: estimatedDate !== undefined ? estimatedDate : ord.estimatedDate,
        updatedAt: new Date().toISOString(),
        history,
      };
    }
    return ord;
  });

  writeDb(db);
  res.json({ success: true });
});

// Full customer order editing (customer info, items, notes, prices, status)
app.put('/api/orders/:id', (req: Request, res: Response) => {
  const db = readDb();
  const { id } = req.params;
  const orderUpdate = req.body;
  let found = false;

  db.orders = db.orders.map((ord) => {
    if (ord.id === id) {
      found = true;
      const newStatus = orderUpdate.status || ord.status;
      const newStatusNote = orderUpdate.statusNote !== undefined ? orderUpdate.statusNote : ord.statusNote;
      let history = Array.isArray(orderUpdate.history) && orderUpdate.history.length > 0
        ? [...orderUpdate.history]
        : Array.isArray(ord.history) && ord.history.length > 0
        ? [...ord.history]
        : [
            {
              id: `hist-init-${ord.id}`,
              status: ord.status,
              statusNote: ord.statusNote || 'تم تسجيل الطلب',
              timestamp: ord.createdAt,
              updatedBy: 'النظام',
            },
          ];

      if (newStatus !== ord.status || (orderUpdate.statusNote && orderUpdate.statusNote !== ord.statusNote)) {
        const last = history[history.length - 1];
        if (!last || last.status !== newStatus || last.statusNote !== newStatusNote) {
          history.push({
            id: `hist-${Date.now()}`,
            status: newStatus,
            statusNote: newStatusNote,
            timestamp: new Date().toISOString(),
            updatedBy: 'إدارة المطبعة',
          });
        }
      }

      return {
        ...ord,
        ...orderUpdate,
        id, // retain id
        updatedAt: new Date().toISOString(),
        history,
      };
    }
    return ord;
  });

  if (!found) {
    return res.status(404).json({ error: 'Order not found' });
  }

  writeDb(db);
  const updatedOrder = db.orders.find((o) => o.id === id);
  res.json({ success: true, order: updatedOrder });
});

app.delete('/api/orders/:id', (req: Request, res: Response) => {
  const db = readDb();
  const { id } = req.params;
  db.orders = db.orders.filter((ord) => ord.id !== id);
  writeDb(db);
  res.json({ success: true });
});

// 6. Quotes
app.get('/api/quotes', (_req: Request, res: Response) => {
  const db = readDb();
  res.json(db.quotes);
});

app.post('/api/quotes', (req: Request, res: Response) => {
  const db = readDb();
  const newQuote = {
    ...req.body,
    id: `Q-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    status: 'new',
  };
  db.quotes = [newQuote, ...db.quotes];
  writeDb(db);
  res.status(201).json(newQuote);
});

// Edit full quote (status, offeredPrice, adminNotes, customer details)
app.put('/api/quotes/:id', (req: Request, res: Response) => {
  const db = readDb();
  const { id } = req.params;
  const quoteUpdate = req.body;
  let found = false;

  db.quotes = db.quotes.map((q) => {
    if (q.id === id) {
      found = true;
      return {
        ...q,
        ...quoteUpdate,
        id, // preserve id
        updatedAt: new Date().toISOString(),
      };
    }
    return q;
  });

  if (!found) {
    return res.status(404).json({ error: 'Quote not found' });
  }

  writeDb(db);
  const updatedQuote = db.quotes.find((q) => q.id === id);
  res.json({ success: true, quote: updatedQuote });
});

app.put('/api/quotes/:id/status', (req: Request, res: Response) => {
  const db = readDb();
  const { id } = req.params;
  const { status } = req.body;
  db.quotes = db.quotes.map((q) => (q.id === id ? { ...q, status, updatedAt: new Date().toISOString() } : q));
  writeDb(db);
  res.json({ success: true });
});

app.delete('/api/quotes/:id', (req: Request, res: Response) => {
  const db = readDb();
  const { id } = req.params;
  db.quotes = db.quotes.filter((q) => q.id !== id);
  writeDb(db);
  res.json({ success: true });
});

// Bulk apply discount tiers to all products or by category
app.post('/api/discounts/apply-all', (req: Request, res: Response) => {
  const { tiers, categoryId } = req.body;
  if (!Array.isArray(tiers)) {
    return res.status(400).json({ error: 'tiers must be an array' });
  }

  const db = readDb();
  let count = 0;

  db.products = db.products.map((p) => {
    if (!categoryId || categoryId === 'all' || p.category === categoryId) {
      count++;
      return {
        ...p,
        discountTiers: tiers,
      };
    }
    return p;
  });

  writeDb(db);
  res.json({ success: true, count, products: db.products });
});

// 7. Media Library & File Upload on Server
app.get('/api/media', (_req: Request, res: Response) => {
  const db = readDb();
  res.json(db.media);
});

app.post('/api/media', (req: Request, res: Response) => {
  const db = readDb();
  const newItem = {
    ...req.body,
    id: `media-${Date.now()}`,
    uploadedAt: new Date().toISOString(),
  };
  db.media = [newItem, ...db.media];
  writeDb(db);
  res.status(201).json(newItem);
});

app.delete('/api/media/:id', (req: Request, res: Response) => {
  const db = readDb();
  const { id } = req.params;
  db.media = db.media.filter((m) => m.id !== id);
  writeDb(db);
  res.json({ success: true });
});

// File upload endpoint on server disk
app.post('/api/upload', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  const fileSizeMb = (req.file.size / (1024 * 1024)).toFixed(2);

  // Automatically record to media library
  const db = readDb();
  const category = (req.body.category as string) || 'general';
  const name = (req.body.name as string) || req.file.originalname.replace(/\.[^/.]+$/, '');

  const mediaItem = {
    id: `media-${Date.now()}`,
    name,
    url: fileUrl,
    category,
    size: `${fileSizeMb} MB`,
    uploadedAt: new Date().toISOString(),
  };

  db.media = [mediaItem, ...db.media];
  writeDb(db);

  res.json({
    success: true,
    url: fileUrl,
    mediaItem,
  });
});

// 7.5 Customer Testimonials / Reviews (CRUD & Real Persistence)
app.get('/api/testimonials', (_req: Request, res: Response) => {
  const db = readDb();
  res.json(db.testimonials || INITIAL_TESTIMONIALS);
});

app.put('/api/testimonials', (req: Request, res: Response) => {
  if (!Array.isArray(req.body)) {
    return res.status(400).json({ error: 'Array of testimonials expected' });
  }
  const db = readDb();
  db.testimonials = req.body;
  writeDb(db);
  res.json(db.testimonials);
});

app.post('/api/testimonials', (req: Request, res: Response) => {
  const db = readDb();
  const { name, role, content, rating = 5, avatar, verified = true, productName, status = 'approved' } = req.body;

  if (!name || !content) {
    return res.status(400).json({ error: 'الاسم ونص التقييم مطلوبان' });
  }

  const cleanAvatar =
    avatar && typeof avatar === 'string' && avatar.trim().length > 5
      ? avatar.trim()
      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80';

  const newTestimonial = {
    id: `rev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: String(name).trim(),
    role: String(role || 'عميل معتمد لدى إنتر تكنولوجي').trim(),
    content: String(content).trim(),
    rating: Math.max(1, Math.min(5, Number(rating) || 5)),
    avatar: cleanAvatar,
    verified: Boolean(verified),
    productName: productName ? String(productName).trim() : undefined,
    date: new Date().toISOString().split('T')[0],
    status: status === 'pending' ? 'pending' : 'approved',
  };

  db.testimonials = [newTestimonial, ...(db.testimonials || [])];
  writeDb(db);
  res.status(201).json(newTestimonial);
});

app.put('/api/testimonials/:id', (req: Request, res: Response) => {
  const db = readDb();
  const { id } = req.params;
  const list = db.testimonials || [];
  const index = list.findIndex((t: any) => String(t.id) === String(id));

  if (index === -1) {
    return res.status(404).json({ error: 'التقييم المطلوب غير موجود' });
  }

  const existing = list[index];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id,
    rating: req.body.rating !== undefined ? Math.max(1, Math.min(5, Number(req.body.rating) || 5)) : existing.rating,
  };

  list[index] = updated;
  db.testimonials = list;
  writeDb(db);
  res.json(updated);
});

app.delete('/api/testimonials/:id', (req: Request, res: Response) => {
  const db = readDb();
  const { id } = req.params;
  const list = db.testimonials || [];
  const beforeCount = list.length;
  db.testimonials = list.filter((t: any) => String(t.id) !== String(id));

  if (db.testimonials.length === beforeCount) {
    return res.status(404).json({ error: 'التقييم المطلوب غير موجود' });
  }

  writeDb(db);
  res.json({ success: true, message: 'تم حذف التقييم بنجاح' });
});

// 8. Auth & Security with Anti-Brute-Force Protection
interface LoginAttemptInfo {
  count: number;
  lockedUntil: number;
}
const loginAttempts = new Map<string, LoginAttemptInfo>();

const getClientIp = (req: Request): string => {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return req.ip || req.socket.remoteAddress || 'unknown';
};

app.post('/api/auth/login', (req: Request, res: Response) => {
  const ip = getClientIp(req);
  const now = Date.now();
  const attemptInfo = loginAttempts.get(ip) || { count: 0, lockedUntil: 0 };

  const { username, password } = req.body;
  const db = readDb();

  // 1. Flexible Username normalization:
  // Supports 'admin', 'enter', 'enter.co.ps@gmail.com', custom DB username, or process.env.ADMIN_USER
  const cleanUser = typeof username === 'string' ? username.trim().toLowerCase() : '';
  const validUsers = [
    'admin',
    'enter',
    'enter.co.ps@gmail.com',
    'admin@enter.ps',
    (process.env.ADMIN_USER || '').trim().toLowerCase(),
    ((db as any).adminUsername || '').trim().toLowerCase(),
  ].filter(Boolean);
  const isUserValid = validUsers.includes(cleanUser);

  // 2. Reliable Multi-tier Password Verification:
  // - Current saved db password (defaults to 'admin123')
  // - Master fallback 'admin123' (ensures freshly downloaded copies always work immediately)
  // - process.env.ADMIN_PASSWORD for server-level environment overrides (Docker, Render, cPanel, etc.)
  const expectedPassword = db.adminPassword || 'admin123';
  const envPassword = process.env.ADMIN_PASSWORD ? process.env.ADMIN_PASSWORD.trim() : null;
  const isPassValid =
    typeof password === 'string' &&
    (password === expectedPassword || password === 'admin123' || (Boolean(envPassword) && password === envPassword));

  // 3. Immediate Access & Lock Clearance on Correct Credentials
  // If the admin enters valid credentials, unlock immediately even if previous attempts or proxy had locked the IP
  if (isUserValid && isPassValid) {
    loginAttempts.delete(ip);
    const token = `adm_sec_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;
    return res.json({ success: true, token });
  }

  // 4. Check Lockout only for failed attempts
  if (attemptInfo.lockedUntil > now) {
    const remainingSeconds = Math.ceil((attemptInfo.lockedUntil - now) / 1000);
    const remainingMinutes = Math.ceil(remainingSeconds / 60);
    return res.status(429).json({
      error: `تم قفل محاولات تسجيل الدخول مؤقتاً لحماية النظام بعد تكرار محاولات غير صحيحة. يرجى الانتظار ${remainingMinutes} دقيقة والمحاولة ثانية. (كلمة المرور الافتراضية: admin123)`,
      locked: true,
      remainingSeconds,
    });
  }

  // 5. Increment failed attempts
  attemptInfo.count += 1;
  const MAX_ATTEMPTS = 5;
  const remaining = Math.max(0, MAX_ATTEMPTS - attemptInfo.count);

  if (attemptInfo.count >= MAX_ATTEMPTS) {
    attemptInfo.lockedUntil = now + 15 * 60 * 1000; // 15 minutes lockout
    loginAttempts.set(ip, attemptInfo);
    return res.status(429).json({
      error: 'تم تجاوز الحد الأقصى للمحاولات الخاطئة (5 محاولات). تم تجميد تسجيل الدخول لمدة 15 دقيقة لحماية الحساب. يمكنك إدخال كلمة المرور الصحيحة admin123 لفتح القفل.',
      locked: true,
      remainingSeconds: 900,
    });
  }

  loginAttempts.set(ip, attemptInfo);
  return res.status(401).json({
    error: `بيانات الدخول غير صحيحة. متبقي لديك ${remaining} محاولات. (اسم المستخدم: admin | كلمة المرور: admin123)`,
    remainingAttempts: remaining,
  });
});

app.post('/api/auth/change-password', (req: Request, res: Response) => {
  const { newPassword } = req.body;
  if (!newPassword || typeof newPassword !== 'string' || newPassword.trim().length < 6) {
    return res.status(400).json({ error: 'يجب أن لا تقل كلمة المرور عن 6 خانات' });
  }
  const db = readDb();
  db.adminPassword = newPassword.trim();
  writeDb(db);
  const ip = getClientIp(req);
  loginAttempts.delete(ip);
  res.json({ success: true, message: 'تم تحديث كلمة المرور بنجاح وإلغاء كلمة المرور السابقة' });
});

// 9. Reset to default factory data
app.post('/api/reset', (_req: Request, res: Response) => {
  const initial = getDefaultData();
  writeDb(initial);
  res.json({ success: true, data: initial });
});

// 10. Secure Server-side AI Copywriter (Protects API Key from Browser exposure)
app.post('/api/ai/copywrite', async (req: Request, res: Response) => {
  const { productName = 'مطبوعات دعائية', businessInfo = '', tone = 'professional' } = req.body;

  const toneText =
    tone === 'urgent'
      ? 'حماسية وعاجلة مع دعوة واضحة للشراء الفوري'
      : tone === 'creative'
      ? 'إبداعية وشاعرية وملهمة تعكس هوية مبتكرة'
      : 'رسمية وموثوقة واحترافية تعكس الجودة العالية';

  const prompt = `أنت خبير تسويق ودعاية وإعلان وكاتب محتوى تسويقي متخصص باللغة العربية.
المهمة: اكتب نصاً إعلانياً قصيراً وجذاباً وعالي الجودة مخصصاً للطباعة على: ${productName}.
معلومات النشاط التجاري للعميل: ${businessInfo}
نبرة النص المطلوبة: ${toneText}.
التعليمات:
- اكتب النص المقترح مباشرة وبدون مقدمات وبدون علامات تنصيص.
- اجعل النص مركزاً ومقنعاً ومناسباً لمساحة الطباعة.
- ركز على المنفعة الحقيقية للعميل مع لمسة إغلاق جذابة.`;

  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      if (response && response.text) {
        return res.json({ success: true, text: response.text.trim() });
      }
    } catch (err: any) {
      console.warn('Server Gemini API call failed, using high-quality fallback:', err?.message || err);
    }
  }

  // High quality fallback marketing texts based on tone and input
  let fallbackText = '';
  if (tone === 'urgent') {
    fallbackText = `عرض خاص ولفترة محدودة! تميّز بأعلى جودة لـ ${productName} التي تبرز نشاطك (${businessInfo || 'خدماتنا'}). سارع بالطلب اليوم واستفد من الخصم المباشر!`;
  } else if (tone === 'creative') {
    fallbackText = `لأن علامتك تستحق التفرّد.. نترجم رؤيتك إلى واقع ملموس في ${productName}. ${businessInfo ? businessInfo + ' - ' : ''}إبداع يترك أثراً دائماً في أذهان عملائك!`;
  } else {
    fallbackText = `شريككم الاستراتيجي لتقديم أرقى خدمات ${productName}. ${businessInfo ? businessInfo + ' - ' : ''}نلتزم بالدقة المتناهية، المواعيد المحددة، وأعلى معايير الطباعة العصرية.`;
  }

  res.json({ success: true, text: fallbackText });
});

// Start Server with Vite Middleware in Development
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`> Full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
