import React, { useState } from 'react';
import { Tag, Plus, Trash2, Check, Copy, Percent, DollarSign } from 'lucide-react';
import { Coupon } from '../../types';
import { StoreDB } from '../../services/storeDb';

interface AdminCouponsProps {
  coupons: Coupon[];
  onCouponsUpdated: () => void;
}

export const AdminCoupons: React.FC<AdminCouponsProps> = ({ coupons, onCouponsUpdated }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'percent' as 'percent' | 'amount',
    value: 15,
    minPurchase: 50000,
    maxUses: 100,
    expiresAt: '2026-12-31'
  });

  const handleToggleActive = (couponId: string) => {
    StoreDB.toggleCouponActive(couponId);
    onCouponsUpdated();
  };

  const handleDelete = (couponId: string) => {
    if (window.confirm('¿Seguro que deseas eliminar este cupón?')) {
      StoreDB.deleteCoupon(couponId);
      onCouponsUpdated();
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code.trim()) return;

    StoreDB.addCoupon({
      code: newCoupon.code.trim().toUpperCase(),
      discountPercent: newCoupon.type === 'percent' ? Number(newCoupon.value) : undefined,
      discountAmount: newCoupon.type === 'amount' ? Number(newCoupon.value) : undefined,
      minPurchase: Number(newCoupon.minPurchase) || undefined,
      active: true,
      maxUses: Number(newCoupon.maxUses) || undefined,
      expiresAt: newCoupon.expiresAt
    });

    setIsCreating(false);
    setNewCoupon({
      code: '',
      type: 'percent',
      value: 15,
      minPurchase: 50000,
      maxUses: 100,
      expiresAt: '2026-12-31'
    });
    onCouponsUpdated();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bebas tracking-wide text-white">
            CONFIGURACIÓN DE DESCUENTOS Y CUPONES
          </h2>
          <p className="text-xs text-zinc-400">
            Creá promociones exclusivas, porcentajes de descuento y beneficios para fidelizar clientes.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold font-montserrat tracking-wider uppercase transition-colors shadow-[0_0_15px_rgba(168,85,247,0.4)]"
        >
          <Plus className="w-4 h-4" />
          <span>CREAR CUPÓN</span>
        </button>
      </div>

      {/* Create Modal / Form */}
      {isCreating && (
        <div className="p-5 bg-zinc-950 border border-purple-800/60 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Nuevo Cupón de Descuento
            </h3>
            <button
              onClick={() => setIsCreating(false)}
              className="text-xs text-zinc-400 hover:text-white"
            >
              Cancelar
            </button>
          </div>

          <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-zinc-300 font-bold mb-1">Código del Cupón *</label>
              <input
                type="text"
                required
                placeholder="Ej: STREETVIP"
                value={newCoupon.code}
                onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white font-mono uppercase"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-bold mb-1">Tipo de Descuento</label>
              <select
                value={newCoupon.type}
                onChange={e => setNewCoupon({ ...newCoupon, type: e.target.value as any })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white"
              >
                <option value="percent">Porcentaje (% OFF)</option>
                <option value="amount">Monto Fijo ($ ARS)</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-300 font-bold mb-1">
                {newCoupon.type === 'percent' ? 'Porcentaje (%)' : 'Monto ($)'}
              </label>
              <input
                type="number"
                required
                min="1"
                max={newCoupon.type === 'percent' ? 90 : 500000}
                value={newCoupon.value}
                onChange={e => setNewCoupon({ ...newCoupon, value: Number(e.target.value) })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-bold mb-1">Compra Mínima ($ ARS)</label>
              <input
                type="number"
                value={newCoupon.minPurchase}
                onChange={e => setNewCoupon({ ...newCoupon, minPurchase: Number(e.target.value) })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-bold mb-1">Límite de Canjes (Usos)</label>
              <input
                type="number"
                value={newCoupon.maxUses}
                onChange={e => setNewCoupon({ ...newCoupon, maxUses: Number(e.target.value) })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-bold mb-1">Fecha de Vencimiento</label>
              <input
                type="date"
                value={newCoupon.expiresAt}
                onChange={e => setNewCoupon({ ...newCoupon, expiresAt: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white"
              />
            </div>

            <div className="sm:col-span-3 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg shadow"
              >
                Guardar Cupón
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons Table */}
      <div className="bg-zinc-950 border border-purple-900/40 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 font-bold uppercase">
                <th className="py-3 px-4">Código</th>
                <th className="py-3 px-4">Beneficio</th>
                <th className="py-3 px-4">Compra Mínima</th>
                <th className="py-3 px-4">Usos / Límite</th>
                <th className="py-3 px-4">Vencimiento</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {coupons.map(coupon => (
                <tr key={coupon.id} className="hover:bg-zinc-900/40 transition-colors">
                  {/* Code with Copy Button */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-700/60">
                        {coupon.code}
                      </span>
                      <button
                        onClick={() => handleCopy(coupon.code)}
                        className="text-zinc-500 hover:text-white p-1"
                        title="Copiar código"
                      >
                        {copiedCode === coupon.code ? (
                          <Check className="w-3.5 h-3.5 text-green-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>

                  {/* Benefit */}
                  <td className="py-3 px-4 font-bold text-white">
                    {coupon.discountPercent ? (
                      <span className="text-green-400">{coupon.discountPercent}% OFF</span>
                    ) : (
                      <span className="text-green-400">$ {coupon.discountAmount?.toLocaleString('es-AR')} OFF</span>
                    )}
                  </td>

                  {/* Min Purchase */}
                  <td className="py-3 px-4 font-mono text-zinc-300">
                    {coupon.minPurchase ? `$ ${coupon.minPurchase.toLocaleString('es-AR')}` : 'Sin mínimo'}
                  </td>

                  {/* Uses */}
                  <td className="py-3 px-4 font-mono">
                    <span className="text-purple-300">{coupon.usedCount}</span>
                    <span className="text-zinc-500"> / {coupon.maxUses || '∞'}</span>
                  </td>

                  {/* Expires */}
                  <td className="py-3 px-4 text-zinc-400 font-mono text-[11px]">
                    {coupon.expiresAt || 'Indefinido'}
                  </td>

                  {/* Toggle Active */}
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleToggleActive(coupon.id)}
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold font-mono transition-colors ${
                        coupon.active
                          ? 'bg-green-950 border border-green-700 text-green-300'
                          : 'bg-zinc-900 border border-zinc-700 text-zinc-500'
                      }`}
                    >
                      {coupon.active ? 'ACTIVO' : 'INACTIVO'}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDelete(coupon.id)}
                      className="p-1.5 text-zinc-500 hover:text-red-400 rounded transition-colors"
                      title="Eliminar cupón"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
