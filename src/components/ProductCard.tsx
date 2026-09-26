import React, { useState } from 'react';
import { Heart, ShoppingBag, Check, MessageCircle, AlertTriangle } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, selectedSize: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onOpenQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}) => {
  // Select first size that has stock by default
  const availableSizes = product.sizes.filter(s => (product.stockPerSize[s] || 0) > 0);
  const [selectedSize, setSelectedSize] = useState<string>(
    availableSizes.length > 0 ? availableSizes[0] : product.sizes[0] || ''
  );
  const [addedAnimation, setAddedAnimation] = useState(false);

  const currentSizeStock = product.stockPerSize[selectedSize] ?? 0;
  const isOutOfStock = product.totalStock === 0 || currentSizeStock === 0;

  const handleAdd = () => {
    if (isOutOfStock) return;
    onAddToCart(product, selectedSize);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };



  return (
    <div className="group relative flex flex-col bg-[#120f1a] border border-[#2b213b] hover:border-purple-500/70 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_25px_rgba(168,85,247,0.25)]">
      
      {/* Top Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-black/40">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter contrast-105"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Wishlist Button */}
        <button
          onClick={() => onToggleWishlist(product.id)}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            isWishlisted
              ? 'bg-pink-600/90 text-white shadow-lg shadow-pink-600/50'
              : 'bg-black/50 text-zinc-300 hover:text-white hover:bg-black/80'
          }`}
          aria-label="Añadir a favoritos"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Stock or Feature Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.badge && (
            <span className="px-2 py-0.5 bg-purple-900/90 border border-purple-500/50 text-[10px] font-montserrat font-bold tracking-wider text-purple-200 rounded">
              {product.badge}
            </span>
          )}
          {product.totalStock <= 3 && product.totalStock > 0 && (
            <span className="px-2 py-0.5 bg-amber-900/90 border border-amber-500/60 text-[10px] font-bold text-amber-200 rounded flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              ¡ÚLTIMAS {product.totalStock}!
            </span>
          )}
          {product.totalStock === 0 && (
            <span className="px-2 py-0.5 bg-red-900/90 border border-red-500/60 text-[10px] font-bold text-red-200 rounded">
              AGOTADO
            </span>
          )}
        </div>

        
      </div>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="text-base font-bold font-montserrat tracking-tight text-white group-hover:text-purple-300 transition-colors uppercase truncate">
            {product.name}
          </h3>
          <p className="text-xs text-zinc-400 font-montserrat truncate mt-0.5">
            {product.subtitle}
          </p>
        </div>

        {/* Price Tag */}
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-black font-montserrat text-white tracking-tight">
            $ {product.price.toLocaleString('es-AR')}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs line-through text-zinc-500">
              $ {product.originalPrice.toLocaleString('es-AR')}
            </span>
          )}
        </div>

        {/* Real-time stock per selected size notification */}
        <div className="text-[11px] text-zinc-400 flex items-center justify-between">
          <span>Talles disponibles:</span>
          <span className={currentSizeStock <= 2 && currentSizeStock > 0 ? 'text-amber-400 font-semibold' : 'text-purple-400'}>
            {currentSizeStock > 0 ? `${currentSizeStock} en stock` : 'Sin stock en este talle'}
          </span>
        </div>

        {/* Size Selector Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {product.sizes.map((sz) => {
            const stock = product.stockPerSize[sz] ?? 0;
            const isSelected = selectedSize === sz;
            const hasStock = stock > 0;

            return (
              <button
                key={sz}
                onClick={() => setSelectedSize(sz)}
                disabled={!hasStock}
                className={`min-w-8 px-2 py-1 text-xs font-mono font-bold rounded transition-all ${
                  isSelected
                    ? 'bg-purple-600 text-white border border-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.7)]'
                    : hasStock
                    ? 'bg-zinc-900 text-zinc-300 border border-zinc-700 hover:border-purple-500 hover:text-white'
                    : 'bg-zinc-950/60 text-zinc-600 border border-zinc-900 cursor-not-allowed line-through'
                }`}
              >
                {sz}
              </button>
            );
          })}
        </div>

        {/* "AGREGAR AL CARRITO" Action Button matching reference */}
        <button
          onClick={handleAdd}
          disabled={isOutOfStock}
          className={`w-full py-2.5 px-4 rounded-lg font-montserrat font-black text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
            addedAnimation
              ? 'bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.6)]'
              : isOutOfStock
              ? 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-800 to-purple-600 hover:from-purple-700 hover:to-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.7)] active:scale-98'
          }`}
        >
          {addedAnimation ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>¡AGREGADO AL CARRITO!</span>
            </>
          ) : isOutOfStock ? (
            <span>SIN STOCK</span>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>AGREGAR AL CARRITO</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
