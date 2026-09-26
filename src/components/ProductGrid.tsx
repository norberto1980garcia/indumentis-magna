import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  onAddToCart: (product: Product, size: string) => void;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  searchQuery: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  activeCategory,
  onSelectCategory,
  onAddToCart,
  wishlist,
  onToggleWishlist,
  searchQuery,
}) => {
  const [onlyInStock, setOnlyInStock] = useState(false);

  // Filter products by category and search
  const filteredProducts = products.filter(product => {
    // Category match
    if (activeCategory !== 'TODOS' && activeCategory !== 'CALZADO') {
      if (activeCategory === 'JORDAN') {
        const isJordan = product.name.toUpperCase().includes('JORDAN') || 
                         product.tags.some(t => t.toLowerCase().includes('jordan'));
        if (!isJordan) return false;
      } else if (activeCategory === 'AIR FORCE 1') {
        const isAF1 = product.name.toUpperCase().includes('AIR FORCE') || 
                      product.tags.some(t => t.toLowerCase().includes('af1') || t.toLowerCase().includes('airforce'));
        if (!isAF1) return false;
      } else if (product.category !== activeCategory) {
        return false;
      }
    }
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchSubtitle = product.subtitle.toLowerCase().includes(q);
      const matchTags = product.tags.some(t => t.toLowerCase().includes(q));
      if (!matchName && !matchSubtitle && !matchTags) return false;
    }
    // Stock filter
    if (onlyInStock && product.totalStock === 0) {
      return false;
    }
    return true;
  });

  const sortedProducts = filteredProducts;

  return (
    <section id="productos-seccion" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Section Header matching reference image: ★ PRODUCTOS DESTACADOS ★ */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-b border-purple-900/40 pb-5 mb-8 gap-4">
        <div className="flex items-center gap-3">
          <span className="text-purple-400 text-lg">★</span>
          <h2 className="text-2xl sm:text-3xl font-bebas tracking-widest text-white">
            PRODUCTOS DESTACADOS
          </h2>
          <span className="text-purple-400 text-lg">★</span>
          <span className="text-xs bg-purple-900/60 border border-purple-500/40 px-2 py-0.5 rounded text-purple-300 font-mono">
            {sortedProducts.length} disponibles
          </span>
        </div>

        {/* View All / Category Link */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onSelectCategory('TODOS')}
            className="text-xs font-montserrat font-bold tracking-wider text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors uppercase"
          >
            <span>VER TODOS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter and Sorting Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-[#100d17] border border-[#2b213b] p-3 rounded-xl">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: 'TODOS (10)', value: 'TODOS' },
            { label: 'JORDAN (5)', value: 'JORDAN' },
            { label: 'AIR FORCE 1 (5)', value: 'AIR FORCE 1' },
          ].map(cat => (
            <button
              key={cat.value}
              onClick={() => onSelectCategory(cat.value)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-montserrat font-bold tracking-wider transition-all ${
                activeCategory === cat.value
                  ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.6)]'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Stock toggle */}
<div className="flex items-center gap-3">
  <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer select-none">
    <input
      type="checkbox"
      checked={onlyInStock}
      onChange={(e) => setOnlyInStock(e.target.checked)}
      className="accent-purple-600 rounded w-3.5 h-3.5"
    />
    <span>Solo en stock</span>
  </label>
</div>
      </div>

      {/* Product Cards Grid */}
      {sortedProducts.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-zinc-800 rounded-xl bg-zinc-950/40">
          <p className="text-lg font-bebas text-zinc-400 tracking-wider">No se encontraron productos</p>
          <p className="text-xs text-zinc-500 mt-1">Prueba con otra categoría o término de búsqueda.</p>
          <button
            onClick={() => {
              onSelectCategory('TODOS');
            }}
            className="mt-4 px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-lg"
          >
            Ver todo el catálogo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              isWishlisted={wishlist.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      )}

    </section>
  );
};
