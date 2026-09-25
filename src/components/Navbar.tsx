import React, { useState } from 'react';
import { Search, ShoppingBag, User, Heart, Menu, X } from 'lucide-react';
import { AppUser } from '../types';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onOpenWishlist: () => void;
  currentUser: AppUser | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectCategory: (cat: string) => void;
  activeCategory: string;
  onOpenAbout?: () => void;
  onOpenContact?: () => void;
  onScrollToTop?: () => void;
  onScrollToProducts?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenAuth,
  onOpenWishlist,
  currentUser,
  searchQuery,
  onSearchChange,
  onSelectCategory,
  onOpenAbout,
  onOpenContact,
  onScrollToTop,
  onScrollToProducts,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#09070c]/95 backdrop-blur-md border-b border-purple-900/30">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-black text-center py-1 px-4 text-xs font-montserrat tracking-widest text-purple-200 border-b border-purple-800/40 flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
        <span>ENVÍOS A TODO EL PAÍS • 3 Y 6 CUOTAS SIN INTERÉS CON MERCADO PAGO • STOCK EN TIEMPO REAL</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo matching reference */}
          <div className="flex items-center">
            <button
              onClick={() => {
                onSelectCategory('TODOS');
                if (onScrollToTop) onScrollToTop();
              }}
              className="flex flex-col text-left group transition-transform hover:scale-105"
            >
              <span className="text-[10px] tracking-[0.4em] text-purple-400 font-montserrat font-bold -mb-1">
                — INDUMENTIS —
              </span>
              <span className="text-3xl sm:text-4xl font-bebas tracking-wider text-white group-hover:text-purple-300 transition-colors drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                MAGNA
              </span>
            </button>
          </div>

          {/* Center Navigation Links: INICIO | TIENDA | NOSOTROS | CONTACTO */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-montserrat font-bold tracking-[0.2em] text-zinc-300">
            <button
              onClick={() => {
                onSelectCategory('TODOS');
                if (onScrollToTop) onScrollToTop();
              }}
              className="hover:text-purple-400 transition-colors py-1 hover:border-b-2 hover:border-purple-500 uppercase"
            >
              INICIO
            </button>
            <button
              onClick={() => {
                if (onScrollToProducts) onScrollToProducts();
              }}
              className="hover:text-purple-400 transition-colors py-1 hover:border-b-2 hover:border-purple-500 uppercase"
            >
              TIENDA
            </button>
            <button
              onClick={() => {
                if (onOpenAbout) onOpenAbout();
              }}
              className="hover:text-purple-400 transition-colors py-1 hover:border-b-2 hover:border-purple-500 uppercase"
            >
              NOSOTROS
            </button>
            <button
              onClick={() => {
                if (onOpenContact) onOpenContact();
              }}
              className="hover:text-purple-400 transition-colors py-1 hover:border-b-2 hover:border-purple-500 uppercase"
            >
              CONTACTO
            </button>
          </nav>

          {/* Right Header Icons matching mockup: Search, User, Cart (and Wishlist) */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Search Input / Trigger */}
            <div className="relative">
              {searchOpen ? (
                <div className="flex items-center bg-zinc-900 border border-purple-500 rounded-full px-3 py-1 text-sm">
                  <Search className="w-4 h-4 text-purple-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Buscar zapatillas..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    autoFocus
                    className="bg-transparent border-none text-white focus:outline-none w-36 sm:w-48 text-xs font-montserrat"
                  />
                  <button
                    onClick={() => {
                      setSearchOpen(false);
                      onSearchChange('');
                    }}
                    className="text-zinc-400 hover:text-white text-xs ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  id="search-btn"
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-zinc-300 hover:text-purple-400 transition-colors"
                  aria-label="Buscar"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Wishlist Heart Icon */}
            <button
              id="wishlist-btn"
              onClick={onOpenWishlist}
              className="p-2 text-zinc-300 hover:text-purple-400 transition-colors relative"
              aria-label="Favoritos"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-pink-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* User Profile Icon */}
            <button
              id="user-auth-btn"
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 p-2 rounded-full hover:bg-zinc-800/60 text-zinc-300 hover:text-white transition-colors"
              aria-label="Perfil y Cuenta"
            >
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-full object-cover border border-purple-500"
                />
              ) : (
                <User className="w-5 h-5 text-zinc-300 hover:text-purple-300" />
              )}
            </button>

            {/* Cart Button with Circular Counter Badge matching reference */}
            <button
              id="cart-btn"
              onClick={onOpenCart}
              className="relative p-2 text-zinc-200 hover:text-purple-300 transition-colors flex items-center justify-center"
              aria-label="Carrito de compras"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 text-white font-mono font-bold text-[10px] rounded-full flex items-center justify-center shadow">
                {cartCount}
              </span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-zinc-300 hover:text-white"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-950 border-b border-purple-900/40 px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-2 pt-2 border-t border-zinc-800">
            <button
              onClick={() => {
                onSelectCategory('TODOS');
                if (onScrollToTop) onScrollToTop();
                setMobileMenuOpen(false);
              }}
              className="py-2.5 px-3 rounded text-left text-xs font-bold text-zinc-300 hover:bg-purple-950/40 hover:text-purple-300"
            >
              INICIO
            </button>
            <button
              onClick={() => {
                if (onScrollToProducts) onScrollToProducts();
                setMobileMenuOpen(false);
              }}
              className="py-2.5 px-3 rounded text-left text-xs font-bold text-zinc-300 hover:bg-purple-950/40 hover:text-purple-300"
            >
              TIENDA (PRODUCTOS DESTACADOS)
            </button>
            <button
              onClick={() => {
                if (onOpenAbout) onOpenAbout();
                setMobileMenuOpen(false);
              }}
              className="py-2.5 px-3 rounded text-left text-xs font-bold text-zinc-300 hover:bg-purple-950/40 hover:text-purple-300"
            >
              NOSOTROS
            </button>
            <button
              onClick={() => {
                if (onOpenContact) onOpenContact();
                setMobileMenuOpen(false);
              }}
              className="py-2.5 px-3 rounded text-left text-xs font-bold text-zinc-300 hover:bg-purple-950/40 hover:text-purple-300"
            >
              CONTACTO
            </button>
            <button
              onClick={() => {
                onOpenWishlist();
                setMobileMenuOpen(false);
              }}
              className="py-2.5 px-3 rounded text-left text-xs font-bold text-pink-400 hover:bg-purple-950/40"
            >
              MIS FAVORITOS ({wishlistCount})
            </button>
            <button
              onClick={() => {
                onOpenAuth();
                setMobileMenuOpen(false);
              }}
              className="py-2.5 px-3 rounded text-left text-xs font-bold text-purple-300 hover:bg-purple-950/40"
            >
              MI CUENTA {currentUser ? `(${currentUser.name.split(' ')[0]})` : ''}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
