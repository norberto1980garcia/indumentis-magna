import { Product, Coupon, AppUser, WhatsAppTemplate, Order } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-jordan-1-low-td',
    sku: 'JD-01-LOW-TD',
    name: 'AIR JORDAN 1 LOW SE',
    subtitle: 'Black / White / Mint Foam Tie-Dye',
    category: 'CALZADO',
    price: 119999,
    originalPrice: 139999,
    sizes: ['40', '41', '42', '43', '44', '45'],
    stockPerSize: { '40': 1, '41': 2, '42': 2, '43': 2, '44': 1, '45': 0 },
    totalStock: 8,
    image: '/assets/images/jordan_low_tiedye.jpg',
    isFeatured: true,
    badge: 'STOCK REAL',
    description: 'Edición especial Air Jordan 1 Low en cuero blanco y negro con talón en lavado tie-dye pastel menta y suela de tracción verde menta sobre caja negra oficial.',
    tags: ['jordan', 'aj1', 'low', 'tiedye', 'sneakers'],
    createdAt: '2026-08-15T09:00:00Z'
  },
  {
    id: 'prod-jordan-1-panda',
    sku: 'JD-01-PANDA',
    name: 'AIR JORDAN 1 MID',
    subtitle: 'White / Black Panda',
    category: 'CALZADO',
    price: 124999,
    originalPrice: 142000,
    sizes: ['40', '41', '42', '43', '44', '45'],
    stockPerSize: { '40': 2, '41': 3, '42': 4, '43': 3, '44': 2, '45': 1 },
    totalStock: 15,
    image: '/assets/images/jordan_one_panda.jpg',
    isFeatured: true,
    badge: 'STOCK REAL',
    description: 'Silueta legendaria AJ1 Mid en combinación White / Black Panda sobre suela de goma con caja original de Jumpman.',
    tags: ['jordan', 'aj1', 'panda', 'calzado', 'sneakers'],
    createdAt: '2026-08-10T10:00:00Z'
  },
  {
    id: 'prod-jordan-6-aqua',
    sku: 'JD-06-AQUA',
    name: 'AIR JORDAN 6 RETRO',
    subtitle: 'Aqua (Black / Concord / Cyan)',
    category: 'CALZADO',
    price: 149999,
    originalPrice: 168000,
    sizes: ['40', '41', '42', '43', '44'],
    stockPerSize: { '40': 1, '41': 2, '42': 3, '43': 2, '44': 1 },
    totalStock: 9,
    image: '/assets/images/jordan_six_aqua.jpg',
    isFeatured: true,
    badge: 'STOCK REAL',
    description: 'Icónica silueta Air Jordan 6 en gamuza negra prémium con detalles en púrpura Concord y cyan aguamarina. Suela translúcida con Jumpman violeta, tirador trasero y caja original.',
    tags: ['jordan', 'aj6', 'aqua', 'retro', 'sneakers'],
    createdAt: '2026-08-12T11:30:00Z'
  },
  {
    id: 'prod-jordan-why-not-multi',
    sku: 'JD-WN-MULTI',
    name: 'JORDAN WHY NOT .5',
    subtitle: 'White / Pink / Multicolor Sole',
    category: 'CALZADO',
    price: 118999,
    originalPrice: 135000,
    sizes: ['41', '42', '43', '44'],
    stockPerSize: { '41': 2, '42': 3, '43': 2, '44': 1 },
    totalStock: 8,
    image: '/assets/images/jordan_whynot_multi.jpg',
    isFeatured: true,
    badge: 'STOCK REAL',
    description: 'Sneaker de básquetbol y estética urbana radical. Cuello con patrón caleidoscópico geométrico multicolor, lengüeta perforada y suela dentada en fucsia neón.',
    tags: ['jordan', 'whynot', 'cyber', 'calzado', 'basketball'],
    createdAt: '2026-08-25T10:30:00Z'
  },
  {
    id: 'prod-jordan-delta-2-react',
    sku: 'JD-DLT-REACT',
    name: 'JORDAN DELTA 2 SE',
    subtitle: 'Anthracite / Brown Suede / Sail',
    category: 'CALZADO',
    price: 112999,
    originalPrice: 129000,
    sizes: ['40', '41', '42', '43', '44'],
    stockPerSize: { '40': 2, '41': 2, '42': 3, '43': 2, '44': 1 },
    totalStock: 10,
    image: '/assets/images/jordan_delta_react.jpg',
    isFeatured: true,
    badge: 'STOCK REAL',
    description: 'Diseño deconstruido con capas de gamuza marrón, paneles ripstop antracita, pespuntes rojos y suela esculpida de espuma Nike React ultra amortiguada.',
    tags: ['jordan', 'delta', 'react', 'calzado', 'streetwear'],
    createdAt: '2026-08-25T11:00:00Z'
  },
  {
    id: 'prod-af1-ochre',
    sku: 'NK-AF1-OCHRE',
    name: 'NIKE AIR FORCE 1 07',
    subtitle: 'Monarch Ochre / White',
    category: 'CALZADO',
    price: 98999,
    originalPrice: 112000,
    sizes: ['40', '41', '42', '43', '44'],
    stockPerSize: { '40': 2, '41': 3, '42': 3, '43': 2, '44': 1 },
    totalStock: 11,
    image: '/assets/images/af_one_ochre.jpg',
    isFeatured: true,
    badge: 'STOCK REAL',
    description: 'Edición en cuero cálido tono ocre con Swoosh blanco impoluto, entresuela vulcanizada con amortiguación Air encapsulada y tag oficial.',
    tags: ['nike', 'af1', 'ochre', 'calzado', 'airforce'],
    createdAt: '2026-08-25T11:15:00Z'
  },
  {
    id: 'prod-af1-triple-white',
    sku: 'NK-AF1-WHT-07',
    name: 'NIKE AIR FORCE 1 07',
    subtitle: 'Triple White Original',
    category: 'CALZADO',
    price: 92999,
    originalPrice: 105000,
    sizes: ['39', '40', '41', '42', '43', '44', '45'],
    stockPerSize: { '39': 2, '40': 4, '41': 5, '42': 6, '43': 4, '44': 3, '45': 2 },
    totalStock: 26,
    image: '/assets/images/af_one_white.jpg',
    isFeatured: true,
    badge: 'MÁS VENDIDO',
    description: 'El clásico indiscutido en blanco puro. Cuero nítido prémium, chapa de cordones AF1 cromada, interior forrado y suela con punto de giro circular intacto.',
    tags: ['nike', 'af1', 'white', 'calzado', 'icono'],
    createdAt: '2026-08-25T11:30:00Z'
  },
  {
    id: 'prod-af1-react-volt',
    sku: 'NK-AF1-VOLT',
    name: 'NIKE AIR FORCE 1 REACT',
    subtitle: 'D/MS/X Sail / Neon Volt',
    category: 'CALZADO',
    price: 115999,
    originalPrice: 130000,
    sizes: ['40', '41', '42', '43', '44'],
    stockPerSize: { '40': 1, '41': 2, '42': 3, '43': 2, '44': 1 },
    totalStock: 9,
    image: '/assets/images/af_one_volt.jpg',
    isFeatured: true,
    badge: 'STOCK REAL',
    description: 'Evolución técnica con acentos volt neón brillante, correa de talón de liberación rápida y suela translúcida de goma helada con drop-in React.',
    tags: ['nike', 'af1', 'volt', 'react', 'calzado'],
    createdAt: '2026-08-25T11:45:00Z'
  },
  {
    id: 'prod-af1-unc',
    sku: 'NK-AF1-UNC',
    name: 'NIKE AIR FORCE 1 07',
    subtitle: 'White / University Blue (UNC)',
    category: 'CALZADO',
    price: 99999,
    originalPrice: 115000,
    sizes: ['40', '41', '42', '43', '44'],
    stockPerSize: { '40': 2, '41': 3, '42': 3, '43': 2, '44': 2 },
    totalStock: 12,
    image: '/assets/images/af_one_unc.jpg',
    isFeatured: true,
    badge: 'STOCK REAL',
    description: 'Cuero blanco inmaculado realzado con ribetes en celeste University Blue y suela exterior completa en azul cielo Carolina.',
    tags: ['nike', 'af1', 'unc', 'blue', 'calzado'],
    createdAt: '2026-08-25T12:00:00Z'
  },
  {
    id: 'prod-af1-safety-orange',
    sku: 'NK-AF1-ORANGE',
    name: 'NIKE AIR FORCE 1 07',
    subtitle: 'Safety Orange / White',
    category: 'CALZADO',
    price: 97999,
    originalPrice: 110000,
    sizes: ['40', '41', '42', '43', '44'],
    stockPerSize: { '40': 1, '41': 3, '42': 3, '43': 2, '44': 1 },
    totalStock: 10,
    image: '/assets/images/af_one_orange.jpg',
    isFeatured: false,
    badge: 'STOCK REAL',
    description: 'Cuerpo completo en cuero naranja flúor de alta visibilidad, contraste de Swoosh blanco puro y suela de tracción naranja a tono.',
    tags: ['nike', 'af1', 'orange', 'calzado', 'sneakers'],
    createdAt: '2026-08-25T12:15:00Z'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'c-1',
    code: 'MAGNA10',
    discountPercent: 10,
    active: true,
    minPurchase: 50000,
    usedCount: 48,
    maxUses: 200,
    expiresAt: '2026-12-31'
  },
  {
    id: 'c-2',
    code: 'BIENVENIDA20',
    discountPercent: 20,
    active: true,
    minPurchase: 70000,
    usedCount: 19,
    maxUses: 100,
    expiresAt: '2026-11-30'
  },
  {
    id: 'c-3',
    code: 'URBANVIP',
    discountAmount: 15000,
    active: true,
    minPurchase: 90000,
    usedCount: 8,
    maxUses: 50,
    expiresAt: '2026-10-31'
  }
];

export const INITIAL_USERS: AppUser[] = [
  {
    id: 'usr-admin-01',
    name: 'Santiago Magna',
    email: 'admin@indumentismagna.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    authProvider: 'google',
    phone: '+54 9 11 5824-9120',
    createdAt: '2026-01-10T12:00:00Z',
    permissions: {
      canEditInventory: true,
      canManageOrders: true,
      canViewAnalytics: true,
      canManageCoupons: true,
      canManageUsers: true,
      canSendWhatsApp: true
    }
  },
  {
    id: 'usr-seller-01',
    name: 'Camila Rossi (Ventas)',
    email: 'ventas@indumentismagna.com',
    role: 'seller',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    authProvider: 'google',
    phone: '+54 9 11 4192-3388',
    createdAt: '2026-03-05T14:20:00Z',
    permissions: {
      canEditInventory: true,
      canManageOrders: true,
      canViewAnalytics: false,
      canManageCoupons: false,
      canManageUsers: false,
      canSendWhatsApp: true
    }
  },
  {
    id: 'usr-customer-01',
    name: 'Mateo Fernández',
    email: 'mateo.fdz@gmail.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    authProvider: 'google',
    phone: '+54 9 11 6722-1100',
    createdAt: '2026-08-01T16:00:00Z',
    permissions: {
      canEditInventory: false,
      canManageOrders: false,
      canViewAnalytics: false,
      canManageCoupons: false,
      canManageUsers: false,
      canSendWhatsApp: false
    }
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'MG-9102',
    customer: {
      name: 'Joaquín Benítez',
      email: 'joaco.benitez@gmail.com',
      phone: '+54 9 11 5521-8899',
      address: 'Av. Corrientes 3420, Piso 4B',
      city: 'Buenos Aires',
      zipCode: '1193',
      dniOrTaxId: '42.189.502',
      notes: 'Dejar en recepción si no contesto'
    },
    items: [
      {
        id: 'ci-1',
        productId: 'prod-jordan-1-panda',
        name: 'AIR JORDAN 1 MID',
        subtitle: 'White / Black Panda',
        price: 124999,
        image: '/assets/images/jordan_one_panda.jpg',
        size: '42',
        quantity: 1,
        maxAvailableStock: 4
      }
    ],
    subtotal: 124999,
    discount: 12500,
    couponCode: 'MAGNA10',
    shipping: 0,
    total: 112499,
    paymentMethod: 'mercadopago',
    paymentStatus: 'paid',
    status: 'shipped',
    trackingNumber: 'AR-OCA-948123019',
    whatsappNotified: true,
    createdAt: '2026-09-18T14:30:00Z',
    updatedAt: '2026-09-19T10:15:00Z'
  },
  {
    id: 'ord-1002',
    orderNumber: 'MG-9103',
    customer: {
      name: 'Lucía Santoro',
      email: 'lu.santoro@outlook.com',
      phone: '+54 9 11 6301-4472',
      address: 'Güemes 1422',
      city: 'Rosario',
      zipCode: '2000',
      dniOrTaxId: '39.840.112'
    },
    items: [
      {
        id: 'ci-3',
        productId: 'prod-af1-triple-white',
        name: 'NIKE AIR FORCE 1 07',
        subtitle: 'Triple White Original',
        price: 92999,
        image: '/assets/images/af_one_white.jpg',
        size: '41',
        quantity: 1,
        maxAvailableStock: 5
      }
    ],
    subtotal: 92999,
    discount: 0,
    shipping: 4500,
    total: 97499,
    paymentMethod: 'credit_card',
    paymentStatus: 'paid',
    status: 'preparing',
    trackingNumber: 'AR-ANDREANI-881920',
    whatsappNotified: true,
    createdAt: '2026-09-20T09:12:00Z',
    updatedAt: '2026-09-20T11:00:00Z'
  },
  {
    id: 'ord-1003',
    orderNumber: 'MG-9104',
    customer: {
      name: 'Facundo Morales',
      email: 'facu.morales99@gmail.com',
      phone: '+54 9 351 409-2211',
      address: 'Bv. San Juan 840',
      city: 'Córdoba',
      zipCode: '5000',
      dniOrTaxId: '41.209.873'
    },
    items: [
      {
        id: 'ci-4',
        productId: 'prod-jordan-1-low-td',
        name: 'AIR JORDAN 1 LOW SE',
        subtitle: 'Black / White / Mint Foam Tie-Dye',
        price: 119999,
        image: '/assets/images/jordan_low_tiedye.jpg',
        size: '43',
        quantity: 1,
        maxAvailableStock: 2
      }
    ],
    subtotal: 119999,
    discount: 15000,
    couponCode: 'URBANVIP',
    shipping: 0,
    total: 104999,
    paymentMethod: 'transfer',
    paymentStatus: 'paid',
    status: 'pending',
    whatsappNotified: false,
    createdAt: '2026-09-21T11:45:00Z',
    updatedAt: '2026-09-21T11:45:00Z'
  }
];

export const INITIAL_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: 'tpl-1',
    name: 'Confirmación de Pedido',
    category: 'order_confirmed',
    content: '¡Hola {cliente}! 👋 Gracias por tu compra en *Indumentis Magna* ⚡.\n\nRecibimos tu pedido *{numero_pedido}* por un total de *${total}*.\n📦 Estamos preparando tus prendas urbanas.\n\nPodés consultar el estado cuando quieras por este chat.'
  },
  {
    id: 'tpl-2',
    name: 'Aviso de Despacho / Envío',
    category: 'order_shipped',
    content: '¡Buenas noticias {cliente}! 🚀 Tu pedido *{numero_pedido}* ya fue despachado.\n\n🚚 Seguimiento: *{tracking}*\nDirección de entrega: {direccion}\n\n¡Que disfrutes tu estilo urbano! Cualquier consulta estamos online.'
  },
  {
    id: 'tpl-3',
    name: 'Recordatorio / Validación de Pago',
    category: 'payment_reminder',
    content: 'Hola {cliente}, ¿cómo estás? Te escribimos de *Indumentis Magna* por tu pedido *{numero_pedido}*.\n\nRecordá que reservamos tu stock por 24hs. Nuestro Alias para transferencia es: *MAGNA.URBANO*.\nEnvíanos el comprobante por acá para prepararlo de inmediato 👟🔥.'
  },
  {
    id: 'tpl-4',
    name: 'Consulta de Talle o Asesoramiento',
    category: 'custom',
    content: '¡Hola! Vi que te interesó el producto *{producto}* en talle *{talle}*. ¿Querés que te asesore con las medidas exactas de plantilla o fit antes de comprar?'
  }
];
