import { Product, Category } from '../../types/catalog';
import { Order } from '../../types/order';

// Local SVG placeholder generator to avoid flaky external hotlinking
function createSvgPlaceholder(title: string, bg: string, text: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
    <rect width="600" height="600" fill="${bg}"/>
    <circle cx="300" cy="260" r="120" fill="${text}" fill-opacity="0.08"/>
    <path d="M260 260 L300 220 L340 260 M300 220 L300 310" stroke="${text}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.3"/>
    <text x="300" y="440" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="700" fill="${text}" text-anchor="middle">${title}</text>
    <text x="300" y="475" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="500" fill="${text}" fill-opacity="0.6" text-anchor="middle">MiniStore Official</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const MOCK_CATEGORIES: Category[] = [
  { _id: 'cat-1', name: 'Electronics', description: 'Smart audio, gadgets, and next-gen peripherals', productCount: 12 },
  { _id: 'cat-2', name: 'Audio & Acoustics', description: 'Studio headphones and wireless acoustics', productCount: 8 },
  { _id: 'cat-3', name: 'Wearables & Gear', description: 'Smartwatches, fitness bands, and daily EDC', productCount: 6 },
  { _id: 'cat-4', name: 'Home & Workspace', description: 'Ergonomic workspace accessories and smart lamps', productCount: 9 },
  { _id: 'cat-5', name: 'Footwear & Apparel', description: 'Minimalist activewear and urban running shoes', productCount: 5 },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    _id: 'prod-1',
    name: 'AeroPulse Wireless Active Noise-Cancelling Over-Ear Headphones (Studio Black Edition)',
    description: 'Custom 45mm titanium drivers engineered for ultra-low distortion and high-fidelity acoustics. Features 42-hour battery life, hybrid active noise cancellation, ambient passthrough mode, and ultra-plush memory foam earcups.',
    price: 14999,
    compareAtPrice: 19999,
    image: createSvgPlaceholder('AeroPulse ANC Headphones', '#F3F4F6', '#1F2937'),
    images: [
      createSvgPlaceholder('AeroPulse - Front View', '#F3F4F6', '#1F2937'),
      createSvgPlaceholder('AeroPulse - Angle Profile', '#E5E7EB', '#111827'),
      createSvgPlaceholder('AeroPulse - Case & Cable', '#EEF2FF', '#312E81'),
    ],
    category: MOCK_CATEGORIES[1],
    stock: 14,
    rating: 4.8,
    reviewCount: 128,
    featured: true,
    tags: ['Best Seller', 'Noise Cancelling', 'Wireless'],
    variants: [
      { id: 'v-color', name: 'Finish', type: 'color', options: ['Matte Black', 'Silver Frost', 'Midnight Blue'] },
    ],
  },
  {
    _id: 'prod-2',
    name: 'Horizon Minimalist Mechanical Keyboard 75% Layout with Gateron Pro Yellow Switches',
    description: 'Precision CNC-machined aluminum chassis with sound-dampening silicone gasket mount. Hot-swappable PCB, per-key RGB backlighting, seamless Bluetooth 5.2/2.4GHz wireless connectivity, and PBT double-shot keycaps.',
    price: 8499,
    compareAtPrice: 10999,
    image: createSvgPlaceholder('Horizon 75% Mechanical Keyboard', '#EEF2FF', '#3730A3'),
    images: [
      createSvgPlaceholder('Horizon Keyboard - Top View', '#EEF2FF', '#3730A3'),
      createSvgPlaceholder('Horizon Keyboard - Side Profile', '#F8FAFC', '#0F172A'),
    ],
    category: MOCK_CATEGORIES[0],
    stock: 8,
    rating: 4.9,
    reviewCount: 84,
    featured: true,
    tags: ['Featured', 'Mechanical', 'Gasket Mount'],
    variants: [
      { id: 'v-switch', name: 'Switch Type', type: 'size', options: ['Linear Yellow', 'Tactile Brown', 'Clicky Blue'] },
    ],
  },
  {
    _id: 'prod-3',
    name: 'UltraGlide Pro Wireless Ergonomic Laser Mouse with 8000Hz Hyper-Polling',
    description: 'Flawless 26,000 DPI optical sensor with optical mouse switches rated for 90 million clicks. Featherlight 58g construction with pure PTFE glides.',
    price: 4299,
    compareAtPrice: 5999,
    image: createSvgPlaceholder('UltraGlide Pro Mouse', '#FEF3C7', '#92400E'),
    images: [
      createSvgPlaceholder('UltraGlide Mouse - Isometric', '#FEF3C7', '#92400E'),
    ],
    category: MOCK_CATEGORIES[0],
    stock: 3, // Low stock
    rating: 4.7,
    reviewCount: 62,
    featured: true,
    tags: ['Low Stock', 'Wireless'],
  },
  {
    _id: 'prod-4',
    name: 'QuantumSync OLED Smart Watch with Continuous SpO2, ECG & Sapphire Crystal Display',
    description: 'Military-grade titanium bezel with brilliant 1.43-inch AMOLED retina display. Comprehensive sleep stages tracker, VO2 max estimation, 14-day battery reserve, and 5ATM water resistance.',
    price: 18999,
    compareAtPrice: 22999,
    image: createSvgPlaceholder('QuantumSync Smart Watch', '#ECFDF5', '#065F46'),
    images: [
      createSvgPlaceholder('QuantumSync Watch - Wrist', '#ECFDF5', '#065F46'),
      createSvgPlaceholder('QuantumSync Watch - Sensors', '#F0FDF4', '#166534'),
    ],
    category: MOCK_CATEGORIES[2],
    stock: 0, // OUT OF STOCK test case
    rating: 4.6,
    reviewCount: 95,
    featured: false,
    tags: ['Out of Stock', 'Titanium'],
  },
  {
    _id: 'prod-5',
    name: 'Lumina Arch Ergonomic Balanced Desk Lamp with Auto-Dimming Ambient Sensor',
    description: 'Full-spectrum glare-free LED architecture with 98+ CRI color accuracy. Touch slider brightness control, dual color-temperature adjustments (2700K - 6500K), and integrated fast wireless charging pad base.',
    price: 5999,
    compareAtPrice: 7499,
    image: createSvgPlaceholder('Lumina Arch Desk Lamp', '#FFF1F2', '#9F1239'),
    images: [
      createSvgPlaceholder('Lumina Lamp - Desk Setup', '#FFF1F2', '#9F1239'),
    ],
    category: MOCK_CATEGORIES[3],
    stock: 19,
    rating: 4.8,
    reviewCount: 41,
    featured: true,
    tags: ['Workspace', 'Eye-Care LED'],
  },
  {
    _id: 'prod-6',
    name: 'Strata Cloudknit Ultra-Lightweight Breathable Running Shoes',
    description: 'Engineered zero-gravity responsive supercritical foam midsole delivering 78% energy return. Seamless 3D woven upper with anti-slip rubber compound traction outsole.',
    price: 6499,
    compareAtPrice: 8999,
    image: createSvgPlaceholder('Strata Cloudknit Shoes', '#F0F9FF', '#075985'),
    images: [
      createSvgPlaceholder('Strata Cloudknit - Lateral', '#F0F9FF', '#075985'),
      createSvgPlaceholder('Strata Cloudknit - Sole Grip', '#E0F2FE', '#0369A1'),
    ],
    category: MOCK_CATEGORIES[4],
    stock: 7,
    rating: 4.7,
    reviewCount: 110,
    featured: false,
    tags: ['Running', 'Superfoam'],
    variants: [
      { id: 'v-size', name: 'UK Size', type: 'size', options: ['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'] },
      { id: 'v-color', name: 'Colorway', type: 'color', options: ['Cloud White', 'Stealth Grey', 'Solar Orange'] },
    ],
  },
  {
    _id: 'prod-7',
    name: 'VoltStream 100W GaN Fast Wall Charger with Dual USB-C & USB-A Power Delivery',
    description: 'Compact next-generation Gallium Nitride (GaN III) architecture. Charges laptops, tablets, and phones simultaneously with intelligent power allocation and surge protection.',
    price: 2999,
    compareAtPrice: 3999,
    image: createSvgPlaceholder('VoltStream 100W GaN Charger', '#FDF4FF', '#86198F'),
    category: MOCK_CATEGORIES[0],
    stock: 25,
    rating: 4.9,
    reviewCount: 204,
    featured: true,
    tags: ['GaN Charger', '100W PD'],
  },
  {
    _id: 'prod-8',
    name: 'SoundCanvas Hi-Res Portable Bluetooth Speaker with Quad Radiators & 24h Playtime',
    description: 'Dual silk dome tweeters and passive bass radiators tuned for deep 40Hz acoustic punch. IP67 waterproof & dustproof rugged aluminum housing with stereo party pairing.',
    price: 7999,
    compareAtPrice: 9999,
    image: createSvgPlaceholder('SoundCanvas Hi-Res Speaker', '#EFF6FF', '#1E40AF'),
    category: MOCK_CATEGORIES[1],
    stock: 11,
    rating: 4.5,
    reviewCount: 38,
    featured: false,
    tags: ['IP67 Waterproof', 'Hi-Res Audio'],
  },
];

export const MOCK_ORDERS: Order[] = [
  {
    _id: 'ORD-78901',
    user: 'usr-demo-1',
    products: [
      {
        product: 'prod-1',
        name: 'AeroPulse Wireless Active Noise-Cancelling Over-Ear Headphones',
        price: 14999,
        quantity: 1,
        image: createSvgPlaceholder('AeroPulse ANC', '#F3F4F6', '#1F2937'),
      },
      {
        product: 'prod-7',
        name: 'VoltStream 100W GaN Fast Wall Charger',
        price: 2999,
        quantity: 1,
        image: createSvgPlaceholder('VoltStream 100W', '#FDF4FF', '#86198F'),
      },
    ],
    shippingAddress: {
      name: 'Shivam Ubarhande',
      phone: '+91 9876543210',
      address: 'Flat 402, Skyline Residency, Link Road',
      city: 'Pune',
      pincode: '411045',
    },
    paymentMethod: 'Cash on Delivery',
    totalAmount: 17998,
    status: 'Confirmed',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];
