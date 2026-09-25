import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Check, Truck } from 'lucide-react';
import { CartItem, Coupon } from '../types';
import { StoreDB } from '../services/storeDb';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: () => void;
  appliedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon | null, discountAmount: number) => void;
  couponDiscountAmount: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  appliedCoupon,
  onApplyCoupon,
  couponDiscountAmount,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShippingThreshold = 100000;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingCost = items.length === 0 ? 0 : isFreeShipping ? 0 : 4500;
  const total = Math.max(0, subtotal - couponDiscountAmount + shippingCost);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleApplyCoupon = () => {
    setCouponError('');
    setCouponSuccess('');
    if (!couponInput.trim()) return;

    const res = StoreDB.validateCoupon(couponInput, subtotal);
    if (!res.valid) {
      setCouponError(res.error || 'Cupón inválido');
      return;
    }

    if (res.coupon) {
      onApplyCoupon(res.coupon, res.discountAmount);
      setCouponSuccess(`¡Cupón ${res.coupon.code} aplicado! Ahorras $${res.discountAmount.toLocaleString('es-AR')}`);
    }
  };

  const handleRemoveCoupon = () => {
    onApplyCoupon(null, 0);
    setCouponInput('');
    setCouponSuccess('');
    setCouponError('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0e0c14] border-l border-purple-900/50 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-purple-900/30 flex items-center justify-between bg-zinc-950">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-bebas tracking-wider text-white">
                TU CARRITO ({items.reduce((a, b) => a + b.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-purple-950/40 border-b border-purple-900/30 px-5 py-3">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-1.5 text-purple-300 font-semibold">
                <Truck className="w-4 h-4 text-purple-400" />
                {isFreeShipping ? (
                  <span>¡Felicitaciones! Tenés <strong>ENVÍO GRATIS</strong></span>
                ) : (
                  <span>
                    Te faltan <strong>${remainingForFreeShipping.toLocaleString('es-AR')}</strong> para envío gratis
                  </span>
                )}
              </div>
              <span className="text-purple-400 font-mono text-[10px]">{freeShippingProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-fuchsia-500 rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-purple-950/40 border border-purple-800/40 flex items-center justify-center mx-auto text-purple-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-lg font-bebas text-zinc-300 tracking-wide">Tu carrito está vacío</p>
                  <p className="text-xs text-zinc-500 mt-1">Descubrí lo último en sneakers y streetwear.</p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold font-montserrat tracking-wider shadow"
                >
                  VER PRODUCTOS
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-lg object-cover bg-black flex-shrink-0 border border-zinc-800"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-white uppercase truncate">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-zinc-500 hover:text-red-400 transition-colors p-0.5"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate">{item.subtitle}</p>
                      <div className="inline-block mt-1 px-1.5 py-0.5 bg-purple-950/80 border border-purple-800/50 rounded text-[10px] font-mono font-bold text-purple-300">
                        Talle: {item.size}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-zinc-900">
                      <div className="flex items-center border border-zinc-800 rounded bg-zinc-900">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="px-2 py-0.5 text-zinc-400 hover:text-white disabled:opacity-30"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.maxAvailableStock}
                          className="px-2 py-0.5 text-zinc-400 hover:text-white disabled:opacity-30"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-white font-montserrat">
                        $ {(item.price * item.quantity).toLocaleString('es-AR')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="p-5 border-t border-purple-900/30 bg-zinc-950/90 space-y-4">
              
              {/* Coupon Form */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2 rounded bg-purple-950/60 border border-purple-700/60 text-xs">
                    <div className="flex items-center gap-1.5 text-purple-200">
                      <Tag className="w-3.5 h-3.5 text-purple-400" />
                      <span>Cupón <strong>{appliedCoupon.code}</strong> aplicado</span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-xs text-red-400 hover:text-red-300 font-bold ml-2"
                    >
                      Quitar
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Código de descuento (ej: MAGNA10)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-purple-500 rounded-lg px-3 py-2 text-xs text-white uppercase font-mono focus:outline-none"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="px-4 py-2 bg-purple-900/50 hover:bg-purple-900 text-purple-200 rounded-lg text-xs font-bold transition-colors border border-purple-700/50"
                      >
                        Aplicar
                      </button>
                    </div>
                    {couponError && <p className="text-[11px] text-red-400">{couponError}</p>}
                    {couponSuccess && <p className="text-[11px] text-green-400">{couponSuccess}</p>}
                    <p className="text-[10px] text-zinc-500">
                      Probá con cupones activos: <span className="text-purple-400 font-mono">MAGNA10</span> (10% off) o <span className="text-purple-400 font-mono">BIENVENIDA20</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-zinc-200 font-mono font-semibold">
                    $ {subtotal.toLocaleString('es-AR')}
                  </span>
                </div>
                {couponDiscountAmount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Descuento cupón</span>
                    <span className="font-mono font-semibold">
                      - $ {couponDiscountAmount.toLocaleString('es-AR')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span className="text-zinc-200 font-mono font-semibold">
                    {shippingCost === 0 ? (
                      <span className="text-purple-400 font-bold">¡GRATIS!</span>
                    ) : (
                      `$ ${shippingCost.toLocaleString('es-AR')}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-zinc-800">
                  <span>Total</span>
                  <span className="text-purple-300 font-mono text-lg">
                    $ {total.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                id="checkout-trigger-btn"
                onClick={onProceedToCheckout}
                className="w-full py-3.5 px-4 rounded-xl font-montserrat font-black text-sm tracking-wider uppercase bg-gradient-to-r from-purple-700 via-purple-600 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <span>INICIAR COMPRA ⚡</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-4 text-[10px] text-zinc-500">
                <span>🔒 Pasarela 100% Segura</span>
                <span>•</span>
                <span>📦 Despacho Rápido</span>
                <span>•</span>
                <span>📲 Notificación WhatsApp</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
