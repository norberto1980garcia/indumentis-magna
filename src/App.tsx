import React, { useState, useEffect, useRef } from 'react';
import { StoreDB } from './services/storeDb';
import { Product, Order, Coupon, AppUser, NotificationItem, CartItem } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { ValueProps } from './components/ValueProps';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { AdminPanel } from './components/AdminPanel/AdminPanel';
import { InfoModals } from './components/InfoModals';
import { ArrowLeft } from 'lucide-react';

export function App() {
const [products, setProducts] = useState<Product[]>([]);
const [orders, setOrders] = useState<Order[]>([]);
const [coupons, setCoupons] = useState<Coupon[]>([]);
const [users, setUsers] = useState<AppUser[]>([]);
const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
const [notifications, setNotifications] = useState<NotificationItem[]>([]);
const [cart, setCart] = useState<CartItem[]>([]);
const [wishlist, setWishlist] = useState<string[]>(() => {
try {
const saved = localStorage.getItem('indumentis_wishlist');
return saved ? JSON.parse(saved) : [];
} catch {
return [];
}
});

// UI state
const [view, setView] = useState<'store' | 'admin'>('store');
const [activeCategory, setActiveCategory] = useState<string>('TODOS');
const [searchQuery, setSearchQuery] = useState<string>('');
const [isCartOpen, setIsCartOpen] = useState(false);
const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
const [isAuthOpen, setIsAuthOpen] = useState(false);
const [infoModal, setInfoModal] = useState<'about' | 'contact' | null>(null);

// Cart Coupon state
const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
const [couponDiscountAmount, setCouponDiscountAmount] = useState<number>(0);

const productsSectionRef = useRef<HTMLDivElement>(null);

const reloadData = () => {
setProducts(StoreDB.getProducts());
setOrders(StoreDB.getOrders());
setCoupons(StoreDB.getCoupons());
setUsers(StoreDB.getUsers());
setCurrentUser(StoreDB.getCurrentUser());
setNotifications(StoreDB.getNotifications());
setCart(StoreDB.getCart());
};

useEffect(() => {
  reloadData();

  const unsubscribe = StoreDB.subscribe(() => {
    reloadData();
  });

  return () => {
    unsubscribe();
  };
}, []);

useEffect(() => {
try {
localStorage.setItem('indumentis_wishlist', JSON.stringify(wishlist));
} catch {
// ignore
}
}, [wishlist]);

// NUEVO: abrir panel privado desde el perfil
const handleOpenAdmin = () => {
setIsAuthOpen(false);
setView('admin');
};

const handleAddToCart = (product: Product, size: string) => {
const updated = StoreDB.addToCart(product, size, 1);
setCart(updated);
setIsCartOpen(true);
};

const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
const updated = StoreDB.updateCartQuantity(cartItemId, newQty);
setCart(updated);
};

const handleRemoveFromCart = (cartItemId: string) => {
const updated = StoreDB.removeFromCart(cartItemId);
setCart(updated);
};

const handleToggleWishlist = (productId: string) => {
setWishlist(prev =>
prev.includes(productId)
? prev.filter(id => id !== productId)
: [...prev, productId]
);
};

const handleApplyCoupon = (coupon: Coupon | null, discountAmount: number) => {
setAppliedCoupon(coupon);
setCouponDiscountAmount(discountAmount);
};

const handleProceedToCheckout = () => {
setIsCartOpen(false);
setIsCheckoutOpen(true);
};

const handleOrderSuccess = (order: Order) => {
reloadData();
setCart([]);
setAppliedCoupon(null);
setCouponDiscountAmount(0);
};

const scrollToProducts = () => {
productsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
};

const scrollToTop = () => {
window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleOpenStoreWhatsApp = () => {
const message =
'¡Hola Indumentis Magna! 👋 Me gustaría hacerles una consulta sobre su catálogo y compras.';
const link = StoreDB.generateWhatsAppLink('+5491164956256', message);
window.open(link, '_blank');
};

return ( <div className="min-h-screen flex flex-col bg-[#09070c] relative selection:bg-purple-600 selection:text-white border-[4px] sm:border-[8px] border-[#130f1c]">

```
  {/* PANEL PRIVADO */}
  {view === 'admin' ? (
    <div className="min-h-screen bg-[#07050a] flex flex-col">

      <div className="bg-purple-950 border-b border-purple-800/60 px-4 py-2 flex items-center justify-between text-xs sticky top-0 z-50">
        <span className="font-bold text-purple-200 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          Panel Privado de Gestión (Oculto al Cliente)
        </span>

        <button
          onClick={() => setView('store')}
          className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-montserrat font-bold text-xs rounded-lg flex items-center gap-2 transition-all shadow-[0_0_12px_rgba(168,85,247,0.5)]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>VOLVER A LA TIENDA PÚBLICA</span>
        </button>
      </div>

      <AdminPanel
        onBackToStore={() => setView('store')}
        currentUser={currentUser}
        products={products}
        orders={orders}
        coupons={coupons}
        users={users}
        notifications={notifications}
        onRefreshData={reloadData}
      />
    </div>
  ) : (
    <>
      <Navbar
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenWishlist={() => {
          setActiveCategory('WISHLIST');
          scrollToProducts();
        }}
        currentUser={currentUser}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectCategory={cat => {
          setActiveCategory(cat);
          scrollToProducts();
        }}
        activeCategory={activeCategory}
        onOpenAbout={() => setInfoModal('about')}
        onOpenContact={() => setInfoModal('contact')}
        onScrollToTop={scrollToTop}
        onScrollToProducts={scrollToProducts}
      />

      <main className="flex-grow">
        <Hero
          onSelectCategory={cat => {
            setActiveCategory(cat);
            scrollToProducts();
          }}
          onScrollToProducts={scrollToProducts}
        />

        <div ref={productsSectionRef}>
          <ProductGrid
            products={
              activeCategory === 'WISHLIST'
                ? products.filter(p => wishlist.includes(p.id))
                : products
            }
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            onAddToCart={handleAddToCart}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            searchQuery={searchQuery}
          />
        </div>

        <ValueProps />
      </main>

      <Footer/>

      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={handleOpenStoreWhatsApp}
          className="group relative w-14 h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          title="Atención directa por WhatsApp"
          aria-label="Atención directa por WhatsApp"
        >
          <svg
            className="w-7 h-7 fill-white group-hover:scale-105 transition-transform"
            viewBox="0 0 24 24"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>

          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center shadow">
            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
          </span>
        </button>
      </div>
    </>
  )}

  <CartDrawer
    isOpen={isCartOpen}
    onClose={() => setIsCartOpen(false)}
    items={cart}
    onUpdateQuantity={handleUpdateQuantity}
    onRemoveItem={handleRemoveFromCart}
    onProceedToCheckout={handleProceedToCheckout}
    appliedCoupon={appliedCoupon}
    onApplyCoupon={handleApplyCoupon}
    couponDiscountAmount={couponDiscountAmount}
  />

  <CheckoutModal
    isOpen={isCheckoutOpen}
    onClose={() => setIsCheckoutOpen(false)}
    items={cart}
    appliedCoupon={appliedCoupon}
    couponDiscountAmount={couponDiscountAmount}
    onOrderSuccess={handleOrderSuccess}
  />

  <AuthModal
    isOpen={isAuthOpen}
    onClose={() => setIsAuthOpen(false)}
    currentUser={currentUser}
    onUserChange={user => {
      setCurrentUser(user);
      reloadData();
    }}
    onOpenAdmin={handleOpenAdmin}
  />

  <InfoModals
    type={infoModal}
    onClose={() => setInfoModal(null)}
  />
</div>


);
}

export default App;
