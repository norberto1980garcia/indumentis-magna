import {
  Product,
  Order,
  Coupon,
  AppUser,
  NotificationItem,
  WhatsAppTemplate,
  CartItem,
  OrderStatus,
  PaymentStatus,
} from '../types';

import {
  INITIAL_PRODUCTS,
  INITIAL_COUPONS,
  INITIAL_USERS,
  INITIAL_ORDERS,
  INITIAL_TEMPLATES,
} from '../data/seedData';

const STORAGE_KEYS = {
  PRODUCTS: 'indumentis_magna_products_v9',
  ORDERS: 'indumentis_magna_orders_v2',
  COUPONS: 'indumentis_magna_coupons_v1',
  USERS: 'indumentis_magna_users_v1',
  CURRENT_USER: 'indumentis_magna_curr_user_v1',
  NOTIFICATIONS: 'indumentis_magna_notifications_v1',
  TEMPLATES: 'indumentis_magna_templates_v1',
  WISHLIST: 'indumentis_magna_wishlist_v1',
  CART: 'indumentis_magna_cart_v1',
};

// =====================================================
// SINCRONIZACIÓN ENTRE PESTAÑAS
// =====================================================

let syncChannel: BroadcastChannel | null = null;

try {
  if (
    typeof window !== 'undefined' &&
    'BroadcastChannel' in window
  ) {
    syncChannel = new BroadcastChannel(
      'indumentis_magna_sync_channel'
    );
  }
} catch {
  // Fallback silencioso si BroadcastChannel no está disponible
}

type SyncListener = (
  event: {
    type: string;
    payload?: any;
  }
) => void;

const listeners = new Set<SyncListener>();

export function subscribeToStoreSync(
  listener: SyncListener
) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function broadcastUpdate(
  type: string,
  payload?: any
) {
  listeners.forEach((fn) => {
    try {
      fn({
        type,
        payload,
      });
    } catch (e) {
      console.error(e);
    }
  });

  if (syncChannel) {
    try {
      syncChannel.postMessage({
        type,
        payload,
      });
    } catch {
      // Ignorado
    }
  }
}

if (syncChannel) {
  syncChannel.onmessage = (event) => {
    listeners.forEach((fn) => {
      try {
        fn(event.data);
      } catch (e) {
        console.error(e);
      }
    });
  };
}

// =====================================================
// SONIDO DE NOTIFICACIÓN
// =====================================================

function playNotificationChime() {
  if (typeof window === 'undefined') return;

  try {
    const audioCtx = new (
      window.AudioContext ||
      (window as any).webkitAudioContext
    )();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';

    osc.frequency.setValueAtTime(
      587.33,
      audioCtx.currentTime
    );

    osc.frequency.exponentialRampToValueAtTime(
      880,
      audioCtx.currentTime + 0.15
    );

    gain.gain.setValueAtTime(
      0.08,
      audioCtx.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audioCtx.currentTime + 0.35
    );

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.35);
  } catch {
    // El navegador puede requerir interacción del usuario
  }
}

// =====================================================
// STORE DB
// =====================================================

export const StoreDB = {

  // ===================================================
  // PRODUCTOS
  // ===================================================

  getProducts(): Product[] {
    if (typeof window === 'undefined') {
      return INITIAL_PRODUCTS;
    }

    const raw = localStorage.getItem(
      STORAGE_KEYS.PRODUCTS
    );

    // Primera carga de la versión actual
    if (!raw) {
      localStorage.setItem(
        STORAGE_KEYS.PRODUCTS,
        JSON.stringify(INITIAL_PRODUCTS)
      );

      return INITIAL_PRODUCTS;
    }

    try {
      const parsed: Product[] = JSON.parse(raw);

      return parsed;
    } catch {
      return INITIAL_PRODUCTS;
    }
  },

  saveProducts(products: Product[]) {
    localStorage.setItem(
      STORAGE_KEYS.PRODUCTS,
      JSON.stringify(products)
    );

    broadcastUpdate(
      'PRODUCTS_UPDATED',
      products
    );
  },

  updateProductStock(
    productId: string,
    size: string,
    newStockForSize: number
  ) {
    const products = this.getProducts();

    const index = products.findIndex(
      (p) => p.id === productId
    );

    if (index === -1) return;

    const product = {
      ...products[index],
    };

    const stockPerSize = {
      ...product.stockPerSize,
      [size]: Math.max(
        0,
        newStockForSize
      ),
    };

    const totalStock = Object.values(
      stockPerSize
    ).reduce(
      (a, b) => a + b,
      0
    );

    product.stockPerSize = stockPerSize;
    product.totalStock = totalStock;

    products[index] = product;

    this.saveProducts(products);

    if (totalStock <= 3) {
      this.addNotification({
        title: '⚠️ Alerta de Stock Bajo',
        message:
          `El producto ${product.name} tiene solo ${totalStock} unidades totales disponibles.`,
        type: 'stock',
      });
    }
  },

  updateProduct(
    updatedProduct: Product
  ) {
    const products = this.getProducts();

    const index = products.findIndex(
      (p) => p.id === updatedProduct.id
    );

    const totalStock = Object.values(
      updatedProduct.stockPerSize || {}
    ).reduce(
      (a, b) => a + b,
      0
    );

    const productToSave = {
      ...updatedProduct,
      totalStock,
    };

    if (index !== -1) {
      products[index] = productToSave;
    } else {
      products.unshift(productToSave);
    }

    this.saveProducts(products);
  },

  deleteProduct(productId: string) {
    const products = this
      .getProducts()
      .filter(
        (p) => p.id !== productId
      );

    this.saveProducts(products);
  },

  // ===================================================
  // PEDIDOS
  // ===================================================

  getOrders(): Order[] {
    if (typeof window === 'undefined') {
      return INITIAL_ORDERS;
    }

    const raw = localStorage.getItem(
      STORAGE_KEYS.ORDERS
    );

    if (!raw) {
      localStorage.setItem(
        STORAGE_KEYS.ORDERS,
        JSON.stringify(INITIAL_ORDERS)
      );

      return INITIAL_ORDERS;
    }

    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_ORDERS;
    }
  },

  saveOrders(orders: Order[]) {
    localStorage.setItem(
      STORAGE_KEYS.ORDERS,
      JSON.stringify(orders)
    );

    broadcastUpdate(
      'ORDERS_UPDATED',
      orders
    );
  },

  createOrder(
    orderData: Omit<
      Order,
      'id' |
      'orderNumber' |
      'createdAt' |
      'updatedAt'
    >
  ): Order {

    const randomNum = Math.floor(
      1000 + Math.random() * 9000
    );

    const orderNumber =
      `MG-${randomNum}`;

    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt:
        new Date().toISOString(),
      updatedAt:
        new Date().toISOString(),
    };

    // Guardar pedido
    const orders = this.getOrders();

    orders.unshift(newOrder);

    this.saveOrders(orders);

    // Descontar stock
    const products = this.getProducts();

    let inventoryUpdated = false;

    newOrder.items.forEach((item) => {
      const pIndex =
        products.findIndex(
          (p) =>
            p.id === item.productId
        );

      if (pIndex !== -1) {
        const prod =
          products[pIndex];

        const currentSizeStock =
          prod.stockPerSize[
            item.size
          ] || 0;

        const newSizeStock =
          Math.max(
            0,
            currentSizeStock -
              item.quantity
          );

        prod.stockPerSize[
          item.size
        ] = newSizeStock;

        prod.totalStock =
          Object.values(
            prod.stockPerSize
          ).reduce(
            (a, b) => a + b,
            0
          );

        inventoryUpdated = true;
      }
    });

    if (inventoryUpdated) {
      this.saveProducts(products);
    }

    // Actualizar cupón
    if (newOrder.couponCode) {
      const coupons =
        this.getCoupons();

      const coupon =
        coupons.find(
          (item) =>
            item.code.toUpperCase() ===
            newOrder.couponCode?.toUpperCase()
        );

      if (coupon) {
        coupon.usedCount =
          (coupon.usedCount || 0) + 1;

        this.saveCoupons(
          coupons
        );
      }
    }

    // Notificación
    this.addNotification({
      title:
        `⚡ Nuevo Pedido #${newOrder.orderNumber}`,
      message:
        `${newOrder.customer.name} realizó un pedido por $${newOrder.total.toLocaleString('es-AR')}.`,
      type: 'order',
      link: '/admin/orders',
    });

    playNotificationChime();

    return newOrder;
  },

  updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    trackingNumber?: string
  ) {
    const orders =
      this.getOrders();

    const order =
      orders.find(
        (o) => o.id === orderId
      );

    if (!order) return;

    order.status = status;

    if (
      trackingNumber !== undefined
    ) {
      order.trackingNumber =
        trackingNumber;
    }

    order.updatedAt =
      new Date().toISOString();

    this.saveOrders(orders);

    this.addNotification({
      title:
        `📦 Pedido #${order.orderNumber} Actualizado`,
      message:
        `El estado cambió a "${status.toUpperCase()}".`,
      type: 'order',
    });
  },

  updateOrderPayment(
    orderId: string,
    paymentStatus: PaymentStatus
  ) {
    const orders =
      this.getOrders();

    const order =
      orders.find(
        (o) => o.id === orderId
      );

    if (!order) return;

    order.paymentStatus =
      paymentStatus;

    order.updatedAt =
      new Date().toISOString();

    this.saveOrders(orders);
  },

  markWhatsAppNotified(
    orderId: string
  ) {
    const orders =
      this.getOrders();

    const order =
      orders.find(
        (o) => o.id === orderId
      );

    if (order) {
      order.whatsappNotified =
        true;

      this.saveOrders(orders);
    }
  },

  // ===================================================
  // CUPONES
  // ===================================================

  getCoupons(): Coupon[] {
    if (typeof window === 'undefined') {
      return INITIAL_COUPONS;
    }

    const raw =
      localStorage.getItem(
        STORAGE_KEYS.COUPONS
      );

    if (!raw) {
      localStorage.setItem(
        STORAGE_KEYS.COUPONS,
        JSON.stringify(
          INITIAL_COUPONS
        )
      );

      return INITIAL_COUPONS;
    }

    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_COUPONS;
    }
  },

  saveCoupons(
    coupons: Coupon[]
  ) {
    localStorage.setItem(
      STORAGE_KEYS.COUPONS,
      JSON.stringify(coupons)
    );

    broadcastUpdate(
      'COUPONS_UPDATED',
      coupons
    );
  },

  addCoupon(
    coupon: Omit<
      Coupon,
      'id' | 'usedCount'
    >
  ) {
    const coupons =
      this.getCoupons();

    const newCoupon: Coupon = {
      ...coupon,
      id: `cpn-${Date.now()}`,
      usedCount: 0,
    };

    coupons.unshift(
      newCoupon
    );

    this.saveCoupons(
      coupons
    );

    return newCoupon;
  },

  toggleCouponActive(
    couponId: string
  ) {
    const coupons =
      this.getCoupons();

    const coupon =
      coupons.find(
        (x) => x.id === couponId
      );

    if (coupon) {
      coupon.active =
        !coupon.active;

      this.saveCoupons(
        coupons
      );
    }
  },

  deleteCoupon(
    couponId: string
  ) {
    const coupons =
      this
        .getCoupons()
        .filter(
          (c) => c.id !== couponId
        );

    this.saveCoupons(
      coupons
    );
  },

  validateCoupon(
    code: string,
    subtotal: number
  ): {
    valid: boolean;
    coupon?: Coupon;
    error?: string;
    discountAmount: number;
  } {

    const normalized =
      code
        .trim()
        .toUpperCase();

    const coupons =
      this.getCoupons();

    const found =
      coupons.find(
        (c) =>
          c.code.toUpperCase() ===
          normalized
      );

    if (!found) {
      return {
        valid: false,
        error: 'Cupón no válido',
        discountAmount: 0,
      };
    }

    if (!found.active) {
      return {
        valid: false,
        error:
          'Este cupón ya no está activo',
        discountAmount: 0,
      };
    }

    if (
      found.minPurchase &&
      subtotal < found.minPurchase
    ) {
      return {
        valid: false,
        error:
          `Monto mínimo de compra para este cupón: $${found.minPurchase.toLocaleString('es-AR')}`,
        discountAmount: 0,
      };
    }

    if (
      found.maxUses &&
      found.usedCount >=
        found.maxUses
    ) {
      return {
        valid: false,
        error:
          'El cupón alcanzó el límite máximo de canjes',
        discountAmount: 0,
      };
    }

    let discount = 0;

    if (found.discountPercent) {
      discount = Math.round(
        (subtotal *
          found.discountPercent) /
          100
      );
    } else if (
      found.discountAmount
    ) {
      discount = Math.min(
        subtotal,
        found.discountAmount
      );
    }

    return {
      valid: true,
      coupon: found,
      discountAmount:
        discount,
    };
  },

  // ===================================================
  // USUARIOS
  // ===================================================

  getUsers(): AppUser[] {
    if (typeof window === 'undefined') {
      return INITIAL_USERS;
    }

    const raw =
      localStorage.getItem(
        STORAGE_KEYS.USERS
      );

    if (!raw) {
      localStorage.setItem(
        STORAGE_KEYS.USERS,
        JSON.stringify(
          INITIAL_USERS
        )
      );

      return INITIAL_USERS;
    }

    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_USERS;
    }
  },

  saveUsers(
    users: AppUser[]
  ) {
    localStorage.setItem(
      STORAGE_KEYS.USERS,
      JSON.stringify(users)
    );

    broadcastUpdate(
      'USERS_UPDATED',
      users
    );
  },

  getCurrentUser(): AppUser {
    if (typeof window === 'undefined') {
      return INITIAL_USERS[0];
    }

    const raw =
      localStorage.getItem(
        STORAGE_KEYS.CURRENT_USER
      );

    if (!raw) {
      localStorage.setItem(
        STORAGE_KEYS.CURRENT_USER,
        JSON.stringify(
          INITIAL_USERS[0]
        )
      );

      return INITIAL_USERS[0];
    }

    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_USERS[0];
    }
  },

  setCurrentUser(
    user: AppUser | null
  ) {
    if (!user) {
      localStorage.removeItem(
        STORAGE_KEYS.CURRENT_USER
      );
    } else {
      localStorage.setItem(
        STORAGE_KEYS.CURRENT_USER,
        JSON.stringify(user)
      );
    }

    broadcastUpdate(
      'AUTH_STATE_CHANGED',
      user
    );
  },

  updateUserRole(
    userId: string,
    newRole: AppUser['role'],
    newPermissions?: AppUser['permissions']
  ) {
    const users =
      this.getUsers();

    const user =
      users.find(
        (u) => u.id === userId
      );

    if (!user) return;

    user.role = newRole;

    if (newPermissions) {
      user.permissions =
        newPermissions;
    } else {
      user.permissions = {
        canEditInventory:
          newRole === 'admin' ||
          newRole === 'seller',

        canManageOrders:
          newRole === 'admin' ||
          newRole === 'seller',

        canViewAnalytics:
          newRole === 'admin',

        canManageCoupons:
          newRole === 'admin',

        canManageUsers:
          newRole === 'admin',

        canSendWhatsApp:
          true,
      };
    }

    this.saveUsers(
      users
    );

    const currentUser =
      this.getCurrentUser();

    if (
      currentUser &&
      currentUser.id === userId
    ) {
      this.setCurrentUser(
        user
      );
    }
  },

  // ===================================================
  // NOTIFICACIONES
  // ===================================================

  getNotifications(): NotificationItem[] {
    if (
      typeof window ===
      'undefined'
    ) {
      return [];
    }

    const raw =
      localStorage.getItem(
        STORAGE_KEYS.NOTIFICATIONS
      );

    if (!raw) return [];

    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  addNotification(
    notif: Omit<
      NotificationItem,
      'id' |
      'timestamp' |
      'read'
    >
  ) {
    const notifications =
      this.getNotifications();

    const newItem: NotificationItem = {
      ...notif,
      id:
        `notif-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 5)}`,
      timestamp:
        new Date().toISOString(),
      read: false,
    };

    notifications.unshift(
      newItem
    );

    if (
      notifications.length >
      30
    ) {
      notifications.pop();
    }

    localStorage.setItem(
      STORAGE_KEYS.NOTIFICATIONS,
      JSON.stringify(
        notifications
      )
    );

    broadcastUpdate(
      'NOTIFICATION_ADDED',
      newItem
    );

    return newItem;
  },

  markNotificationsAsRead() {
    const notifications =
      this
        .getNotifications()
        .map((n) => ({
          ...n,
          read: true,
        }));

    localStorage.setItem(
      STORAGE_KEYS.NOTIFICATIONS,
      JSON.stringify(
        notifications
      )
    );

    broadcastUpdate(
      'NOTIFICATIONS_READ'
    );
  },

  // ===================================================
  // PLANTILLAS WHATSAPP
  // ===================================================

  getTemplates(): WhatsAppTemplate[] {
    if (typeof window === 'undefined') {
      return INITIAL_TEMPLATES;
    }

    const raw =
      localStorage.getItem(
        STORAGE_KEYS.TEMPLATES
      );

    if (!raw) {
      localStorage.setItem(
        STORAGE_KEYS.TEMPLATES,
        JSON.stringify(
          INITIAL_TEMPLATES
        )
      );

      return INITIAL_TEMPLATES;
    }

    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_TEMPLATES;
    }
  },

  saveTemplates(
    templates: WhatsAppTemplate[]
  ) {
    localStorage.setItem(
      STORAGE_KEYS.TEMPLATES,
      JSON.stringify(
        templates
      )
    );

    broadcastUpdate(
      'TEMPLATES_UPDATED',
      templates
    );
  },

  // ===================================================
  // WISHLIST
  // ===================================================

  getWishlist(): string[] {
    if (
      typeof window ===
      'undefined'
    ) {
      return [];
    }

    const raw =
      localStorage.getItem(
        STORAGE_KEYS.WISHLIST
      );

    if (!raw) return [];

    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  toggleWishlist(
    productId: string
  ): boolean {

    const list =
      this.getWishlist();

    const index =
      list.indexOf(productId);

    let isAdded = false;

    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(productId);
      isAdded = true;
    }

    localStorage.setItem(
      STORAGE_KEYS.WISHLIST,
      JSON.stringify(list)
    );

    broadcastUpdate(
      'WISHLIST_UPDATED',
      list
    );

    return isAdded;
  },

  // ===================================================
  // WHATSAPP
  // ===================================================

  generateWhatsAppLink(
    phone: string,
    message: string
  ): string {

    const cleaned =
      phone.replace(
        /[^0-9]/g,
        ''
      );

    const encoded =
      encodeURIComponent(
        message
      );

    return `https://wa.me/${cleaned}?text=${encoded}`;
  },

  formatWhatsAppOrderMessage(
    order: Order,
    templateContent: string
  ): string {

    let msg =
      templateContent;

    msg = msg.replace(
      /{cliente}/g,
      order.customer.name
    );

    msg = msg.replace(
      /{numero_pedido}/g,
      order.orderNumber
    );

    msg = msg.replace(
      /{total}/g,
      order.total.toLocaleString(
        'es-AR'
      )
    );

    msg = msg.replace(
      /{tracking}/g,
      order.trackingNumber ||
        'En preparación'
    );

    msg = msg.replace(
      /{direccion}/g,
      `${order.customer.address}, ${order.customer.city}`
    );

    return msg;
  },

  // ===================================================
  // CARRITO
  // ===================================================

  getCart(): CartItem[] {
    if (
      typeof window ===
      'undefined'
    ) {
      return [];
    }

    const raw =
      localStorage.getItem(
        STORAGE_KEYS.CART
      );

    if (!raw) return [];

    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  saveCart(
    cart: CartItem[]
  ): void {

    if (
      typeof window ===
      'undefined'
    ) {
      return;
    }

    localStorage.setItem(
      STORAGE_KEYS.CART,
      JSON.stringify(cart)
    );

    broadcastUpdate(
      'CART_UPDATED',
      cart
    );
  },

  addToCart(
    product: Product,
    size: string,
    quantity = 1
  ): CartItem[] {

    const cart =
      this.getCart();

    const existingIndex =
      cart.findIndex(
        (item) =>
          item.productId ===
            product.id &&
          item.size === size
      );

    const maxStock =
      product.stockPerSize[
        size
      ] ??
      product.totalStock;

    if (
      existingIndex > -1
    ) {
      const currentQty =
        cart[
          existingIndex
        ].quantity;

      const newQty =
        Math.min(
          maxStock,
          currentQty +
            quantity
        );

      cart[
        existingIndex
      ].quantity = newQty;

    } else {

      cart.push({
        id:
          `ci-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 5)}`,

        productId:
          product.id,

        name:
          product.name,

        subtitle:
          product.subtitle,

        price:
          product.price,

        image:
          product.image,

        size,

        quantity:
          Math.min(
            maxStock,
            quantity
          ),

        maxAvailableStock:
          maxStock,
      });
    }

    this.saveCart(cart);

    return cart;
  },

  updateCartQuantity(
    cartItemId: string,
    newQty: number
  ): CartItem[] {

    let cart =
      this.getCart();

    if (newQty <= 0) {

      cart =
        cart.filter(
          (i) =>
            i.id !==
            cartItemId
        );

    } else {

      const item =
        cart.find(
          (i) =>
            i.id ===
            cartItemId
        );

      if (item) {
        item.quantity =
          Math.min(
            item.maxAvailableStock,
            newQty
          );
      }
    }

    this.saveCart(cart);

    return cart;
  },

  removeFromCart(
    cartItemId: string
  ): CartItem[] {

    const cart =
      this
        .getCart()
        .filter(
          (i) =>
            i.id !==
            cartItemId
        );

    this.saveCart(cart);

    return cart;
  },

  // ===================================================
  // SUSCRIPCIÓN
  // ===================================================

  subscribe(
    listener: SyncListener
  ) {
    return subscribeToStoreSync(
      listener
    );
  },
};