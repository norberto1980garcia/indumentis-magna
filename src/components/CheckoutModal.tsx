import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, CheckCircle2, ShieldCheck, CreditCard, QrCode, Building2, Banknote, ArrowRight, MessageCircle, AlertCircle, Sparkles } from 'lucide-react';
import { CartItem, Coupon, Order, PaymentMethod } from '../types';
import { StoreDB } from '../services/storeDb';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  appliedCoupon: Coupon | null;
  couponDiscountAmount: number;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  appliedCoupon,
  couponDiscountAmount,
  onOrderSuccess,
}) => {
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Customer form state
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: 'Buenos Aires',
    zipCode: '',
    dniOrTaxId: '',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mercadopago');

  // Card details state
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    installments: '3'
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const subtotal = items.reduce((a, b) => a + b.price * b.quantity, 0);
  const isFreeShipping = subtotal >= 100000;
  const shippingCost = isFreeShipping ? 0 : 4500;
  
  // Extra 5% discount if paying via bank transfer
  const transferDiscount = paymentMethod === 'transfer' ? Math.round(subtotal * 0.05) : 0;
  const total = Math.max(0, subtotal - couponDiscountAmount - transferDiscount + shippingCost);

  const validateDetails = () => {
    const errs: Record<string, string> = {};
    if (!customer.name.trim()) errs.name = 'Ingresá tu nombre completo';
    if (!customer.email.trim() || !customer.email.includes('@')) errs.email = 'Email válido requerido';
    if (!customer.phone.trim() || customer.phone.length < 8) errs.phone = 'Teléfono / WhatsApp requerido';
    if (!customer.address.trim()) errs.address = 'Dirección de entrega requerida';
    if (!customer.dniOrTaxId.trim()) errs.dniOrTaxId = 'DNI requerido para facturación y envío';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleGoToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateDetails()) {
      setStep('payment');
    }
  };

  const handleProcessOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
      // Create order in StoreDB (this automatically decreases stock in real time!)
      const order = StoreDB.createOrder({
        customer,
        items,
        subtotal,
        discount: couponDiscountAmount + transferDiscount,
        shipping: shippingCost,
        total,
        paymentMethod,
        paymentStatus: 'paid',
        status: 'pending',
        couponCode: appliedCoupon?.code,
        notes: customer.notes
      });

      setCreatedOrder(order);
      setIsProcessing(false);
      setStep('success');
      onOrderSuccess(order);

      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Ignored if canvas unavailable
      }
    }, 1500);
  };

  const handleSendWhatsAppConfirmation = () => {
    if (!createdOrder) return;
    const msg = `¡Hola Indumentis Magna! 👋 Acabo de realizar el pedido *${createdOrder.orderNumber}* por un total de *$${createdOrder.total.toLocaleString('es-AR')}*.\n\n👤 Cliente: ${createdOrder.customer.name}\n📍 Dirección: ${createdOrder.customer.address}, ${createdOrder.customer.city}\n💳 Método de pago: ${createdOrder.paymentMethod.toUpperCase()}.\n\n¿Me confirman la preparación y envío? ¡Muchas gracias!`;
    const link = StoreDB.generateWhatsAppLink('+5491158249120', msg);
    StoreDB.markWhatsAppNotified(createdOrder.id);
    window.open(link, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-[#110e19] border border-purple-800/60 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-zinc-950 px-6 py-4 border-b border-purple-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-purple-900/60 border border-purple-500/50 flex items-center justify-center text-purple-300 font-bold text-xs">
              ⚡
            </span>
            <div>
              <h3 className="text-lg font-bebas tracking-wider text-white">
                CHECKOUT SEGURO INDUMENTIS MAGNA
              </h3>
              <p className="text-[11px] text-zinc-400">
                {step === 'details' ? 'Paso 1: Datos de envío' : step === 'payment' ? 'Paso 2: Pasarela de pago' : '¡Pedido Confirmado!'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: CUSTOMER DETAILS */}
        {step === 'details' && (
          <form onSubmit={handleGoToPayment} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Mateo Fernández"
                  value={customer.name}
                  onChange={e => setCustomer({ ...customer, name: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 focus:border-purple-500 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                />
                {formErrors.name && <p className="text-[11px] text-red-400 mt-1">{formErrors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Email para Comprobante *</label>
                <input
                  type="email"
                  required
                  placeholder="ejemplo@correo.com"
                  value={customer.email}
                  onChange={e => setCustomer({ ...customer, email: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 focus:border-purple-500 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                />
                {formErrors.email && <p className="text-[11px] text-red-400 mt-1">{formErrors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Teléfono / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  placeholder="+54 9 11 5824-9120"
                  value={customer.phone}
                  onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 focus:border-purple-500 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                />
                {formErrors.phone && <p className="text-[11px] text-red-400 mt-1">{formErrors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">DNI / CUIT *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: 42.189.502"
                  value={customer.dniOrTaxId}
                  onChange={e => setCustomer({ ...customer, dniOrTaxId: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 focus:border-purple-500 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                />
                {formErrors.dniOrTaxId && <p className="text-[11px] text-red-400 mt-1">{formErrors.dniOrTaxId}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-zinc-300 mb-1">Dirección de Entrega *</label>
                <input
                  type="text"
                  required
                  placeholder="Calle, número, piso, departamento"
                  value={customer.address}
                  onChange={e => setCustomer({ ...customer, address: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 focus:border-purple-500 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                />
                {formErrors.address && <p className="text-[11px] text-red-400 mt-1">{formErrors.address}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Ciudad / Localidad</label>
                <input
                  type="text"
                  value={customer.city}
                  onChange={e => setCustomer({ ...customer, city: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 focus:border-purple-500 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Código Postal</label>
                <input
                  type="text"
                  placeholder="Ej: 1425"
                  value={customer.zipCode}
                  onChange={e => setCustomer({ ...customer, zipCode: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 focus:border-purple-500 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-zinc-300 mb-1">Notas para el repartidor (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ej: Tocar timbre 4B o dejar en recepción"
                  value={customer.notes}
                  onChange={e => setCustomer({ ...customer, notes: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 focus:border-purple-500 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Price Preview */}
            <div className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-800 flex items-center justify-between text-xs">
              <span className="text-zinc-400">Total a abonar:</span>
              <span className="text-lg font-bold font-mono text-purple-400">
                $ {total.toLocaleString('es-AR')}
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500 text-white font-montserrat font-bold text-xs tracking-wider uppercase rounded-xl flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
            >
              <span>CONTINUAR AL PAGO</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: PAYMENT GATEWAY SELECTION */}
        {step === 'payment' && (
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-xs font-bold tracking-wider text-zinc-300 uppercase mb-3">
                Seleccioná tu pasarela de pago segura:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Option 1: Mercado Pago */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mercadopago')}
                  className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    paymentMethod === 'mercadopago'
                      ? 'bg-[#009ee3]/10 border-[#009ee3] shadow-[0_0_15px_rgba(0,158,227,0.3)]'
                      : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-[#009ee3]/20 text-[#009ee3]">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Mercado Pago</span>
                    <span className="text-[11px] text-zinc-400 block">QR, Dinero en cuenta, Débito o Cuotas</span>
                    <span className="text-[10px] text-cyan-400 font-bold mt-1 inline-block">HASTA 6 CUOTAS</span>
                  </div>
                </button>

                {/* Option 2: Tarjeta Directa */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    paymentMethod === 'credit_card'
                      ? 'bg-purple-950/40 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                      : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-purple-900/40 text-purple-400">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Tarjeta Crédito / Débito</span>
                    <span className="text-[11px] text-zinc-400 block">Visa y Mastercard</span>
                    <span className="text-[10px] text-purple-400 font-bold mt-1 inline-block">PROCESAMIENTO SEGURO SSL</span>
                  </div>
                </button>

                {/* Option 3: Transferencia Bancaria */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('transfer')}
                  className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    paymentMethod === 'transfer'
                      ? 'bg-emerald-950/30 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-emerald-900/40 text-emerald-400">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Transferencia Bancaria</span>
                    <span className="text-[11px] text-zinc-400 block">Alias CBU / CVU directo</span>
                    <span className="text-[10px] text-emerald-400 font-bold mt-1 inline-block">5% OFF ADICIONAL</span>
                  </div>
                </button>

                {/* Option 4: Efectivo / Contra entrega */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    paymentMethod === 'cash'
                      ? 'bg-amber-950/30 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                      : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-amber-900/40 text-amber-400">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Efectivo contra entrega</span>
                    <span className="text-[11px] text-zinc-400 block">Abonás al recibir con cadete</span>
                    <span className="text-[10px] text-amber-400 font-bold mt-1 inline-block">SOLO CABA / GBA</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Payment Details Form based on chosen method */}
            {paymentMethod === 'credit_card' && (
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-3">
                <p className="text-xs font-bold text-purple-300">Datos de la Tarjeta:</p>
                <div>
                  <input
                    type="text"
                    maxLength={19}
                    placeholder="4509 •••• •••• ••••"
                    value={cardData.number}
                    onChange={e => setCardData({ ...cardData, number: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="MM/AA"
                    maxLength={5}
                    value={cardData.expiry}
                    onChange={e => setCardData({ ...cardData, expiry: e.target.value })}
                    className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-xs text-white font-mono"
                  />
                  <input
                    type="password"
                    placeholder="CVV (3 dígitos)"
                    maxLength={3}
                    value={cardData.cvv}
                    onChange={e => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '') })}
                    className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Nombre impreso en la tarjeta"
                    value={cardData.name}
                    onChange={e => setCardData({ ...cardData, name: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <select
                    value={cardData.installments}
                    onChange={e => setCardData({ ...cardData, installments: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-xs text-white"
                  >
                    <option value="1">1 pago de ${total.toLocaleString('es-AR')}</option>
                    <option value="3">3 cuotas fijas de ${Math.round(total / 3).toLocaleString('es-AR')}</option>
                    <option value="6">6 cuotas fijas de ${Math.round(total / 6).toLocaleString('es-AR')}</option>
                  </select>
                </div>
              </div>
            )}

            {paymentMethod === 'mercadopago' && (
              <div className="p-4 bg-[#009ee3]/10 border border-[#009ee3]/30 rounded-xl space-y-2 text-xs text-zinc-300">
                <div className="flex items-center gap-2 text-[#009ee3] font-bold">
                  <QrCode className="w-4 h-4" />
                  <span>Pasarela oficial Mercado Pago Checkout Pro</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Al confirmar la compra, se simulará la aprobación inmediata del pago y la reserva de stock instantánea en el sistema.
                </p>
              </div>
            )}

            {paymentMethod === 'transfer' && (
              <div className="p-4 bg-emerald-950/40 border border-emerald-600/40 rounded-xl space-y-2 text-xs">
                <p className="text-emerald-300 font-bold">Datos para Transferencia:</p>
                <div className="p-2 bg-black/60 rounded font-mono text-xs space-y-1">
                  <p>Alias: <strong className="text-emerald-400">MAGNA.URBANO</strong></p>
                  <p>CBU: <strong className="text-zinc-300">0000003100098421890123</strong></p>
                  <p>Titular: <strong className="text-zinc-300">Indumentis Magna S.A.</strong></p>
                </div>
                <p className="text-[11px] text-zinc-400">
                  * Tenés un 5% de descuento adicional aplicado automáticamente.
                </p>
              </div>
            )}

            {/* Total Summary */}
            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Total de la orden:</span>
                <span className="text-lg font-bold font-mono text-purple-400">
                  $ {total.toLocaleString('es-AR')}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                <span>Transacción encriptada con certificación de seguridad SSL</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="py-3 px-4 border border-zinc-700 text-zinc-300 hover:text-white rounded-xl text-xs font-bold"
              >
                Volver
              </button>

              <button
                type="button"
                onClick={handleProcessOrder}
                disabled={isProcessing}
                className="flex-1 py-3 bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500 text-white font-montserrat font-bold text-xs tracking-wider uppercase rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.5)] disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>PROCESANDO PAGO SEGURO...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>CONFIRMAR Y PAGAR ${total.toLocaleString('es-AR')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ORDER SUCCESS */}
        {step === 'success' && createdOrder && (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-green-950 border border-green-500/60 flex items-center justify-center mx-auto text-green-400 shadow-[0_0_25px_rgba(34,197,94,0.5)]">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-purple-400">
                ORDEN CONFIRMADA & STOCK ACTUALIZADO
              </span>
              <h3 className="text-3xl font-bebas tracking-wide text-white mt-1">
                ¡GRACIAS POR TU COMPRA, {createdOrder.customer.name.toUpperCase()}!
              </h3>
              <p className="text-sm font-mono text-zinc-300 mt-1">
                N° de Pedido: <strong className="text-purple-400 text-base">{createdOrder.orderNumber}</strong>
              </p>
            </div>

            <div className="bg-zinc-950/80 border border-purple-900/40 rounded-xl p-4 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between text-zinc-400">
                <span>Destinatario:</span>
                <span className="text-white font-semibold">{createdOrder.customer.name}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Envío a:</span>
                <span className="text-white">{createdOrder.customer.address}, {createdOrder.customer.city}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Método de pago:</span>
                <span className="text-purple-300 font-semibold">{createdOrder.paymentMethod.toUpperCase()} (PAGADO)</span>
              </div>
              <div className="flex justify-between text-zinc-400 border-t border-zinc-800 pt-2 font-bold text-white">
                <span>Total Abonado:</span>
                <span className="text-purple-400 text-sm font-mono">$ {createdOrder.total.toLocaleString('es-AR')}</span>
              </div>
            </div>

            {/* Automated WhatsApp notification button */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleSendWhatsAppConfirmation}
                className="w-full max-w-md mx-auto py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-montserrat font-bold text-xs tracking-wider uppercase rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-transform active:scale-98"
              >
                <MessageCircle className="w-5 h-5" />
                <span>NOTIFICAR Y COORDINAR POR WHATSAPP 📲</span>
              </button>
              <p className="text-[11px] text-zinc-500">
                Hacé click para abrir WhatsApp con los datos de tu compra precargados y contactar al equipo de ventas.
              </p>
            </div>

            <div>
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold"
              >
                Seguir Explorando Tienda
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
