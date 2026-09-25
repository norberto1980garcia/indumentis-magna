import React, { useState } from 'react';
import { Search, MessageCircle, Package, Truck, CheckCircle, Clock, XCircle, ExternalLink, Send } from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { StoreDB } from '../../services/storeDb';

interface AdminOrdersProps {
  orders: Order[];
  onOrdersUpdated: () => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({ orders, onOrdersUpdated }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});

  const filteredOrders = orders.filter(o => {
    if (statusFilter !== 'ALL' && o.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.email.toLowerCase().includes(q) ||
        o.customer.phone.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const tracking = trackingInputs[orderId];
    StoreDB.updateOrderStatus(orderId, newStatus, tracking);
    onOrdersUpdated();
  };

  const handleSendWhatsApp = (order: Order, type: 'confirmed' | 'shipped' | 'delivered') => {
    const templates = StoreDB.getTemplates();
    let template = templates.find(t => {
      if (type === 'confirmed') return t.category === 'order_confirmed';
      if (type === 'shipped') return t.category === 'order_shipped';
      return false;
    });

    let msg = '';
    if (template) {
      msg = StoreDB.formatWhatsAppOrderMessage(order, template.content);
    } else {
      msg = `¡Hola ${order.customer.name}! 👋 Te contactamos de *Indumentis Magna* por tu pedido *${order.orderNumber}* por un total de *$${order.total.toLocaleString('es-AR')}*. ¿Cómo podemos ayudarte?`;
    }

    const link = StoreDB.generateWhatsAppLink(order.customer.phone, msg);
    StoreDB.markWhatsAppNotified(order.id);
    onOrdersUpdated();
    window.open(link, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bebas tracking-wide text-white">
            SEGUIMIENTO DE PEDIDOS & GESTIÓN EN TIEMPO REAL
          </h2>
          <p className="text-xs text-zinc-400">
            Control de envíos, estados de compra y comunicación directa con clientes vía WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-purple-300 font-mono font-bold bg-purple-950/60 border border-purple-800 px-3 py-1.5 rounded-lg">
            {orders.length} pedidos registrados
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-zinc-950 border border-purple-900/40 rounded-xl">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-zinc-500 ml-2" />
          <input
            type="text"
            placeholder="Buscar por nro pedido, cliente, teléfono..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none text-xs text-white focus:outline-none placeholder-zinc-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', 'pending', 'preparing', 'shipped', 'delivered', 'cancelled'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold uppercase transition-all ${
                statusFilter === st
                  ? 'bg-purple-600 text-white shadow'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              {st === 'ALL' ? 'TODOS' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-zinc-950 border border-dashed border-zinc-800 rounded-xl">
            <p className="text-sm font-mono text-zinc-400">No se encontraron pedidos con los filtros actuales.</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div
              key={order.id}
              className="p-4 bg-zinc-950 border border-purple-900/40 rounded-xl hover:border-purple-600/50 transition-all space-y-3"
            >
              {/* Order Header Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-900">
                <div className="flex items-center gap-3">
                  <span className="font-bebas text-lg tracking-wider text-purple-400">
                    #{order.orderNumber}
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">
                    {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {order.whatsappNotified && (
                    <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/80 text-[10px] text-emerald-300 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      WA Notificado
                    </span>
                  )}
                </div>

                {/* Status Badge & Selector */}
                <div className="flex items-center gap-2">
                  <select
                    value={order.status}
                    onChange={e => handleStatusChange(order.id, e.target.value as OrderStatus)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase focus:outline-none cursor-pointer border ${
                      order.status === 'delivered'
                        ? 'bg-green-950/80 text-green-300 border-green-700'
                        : order.status === 'shipped'
                        ? 'bg-cyan-950/80 text-cyan-300 border-cyan-700'
                        : order.status === 'preparing'
                        ? 'bg-purple-950/80 text-purple-300 border-purple-700'
                        : order.status === 'cancelled'
                        ? 'bg-red-950/80 text-red-300 border-red-700'
                        : 'bg-amber-950/80 text-amber-300 border-amber-700'
                    }`}
                  >
                    <option value="pending" className="bg-zinc-900 text-white">PENDIENTE</option>
                    <option value="preparing" className="bg-zinc-900 text-white">EN PREPARACIÓN</option>
                    <option value="shipped" className="bg-zinc-900 text-white">ENVIADO (DESPACHADO)</option>
                    <option value="delivered" className="bg-zinc-900 text-white">ENTREGADO</option>
                    <option value="cancelled" className="bg-zinc-900 text-white">CANCELADO</option>
                  </select>
                </div>
              </div>

              {/* Order Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                {/* Customer Information */}
                <div className="md:col-span-4 space-y-1">
                  <p className="font-bold text-white text-sm">{order.customer.name}</p>
                  <p className="text-zinc-400">{order.customer.email}</p>
                  <p className="text-purple-300 font-mono">{order.customer.phone}</p>
                  <p className="text-zinc-500">{order.customer.address}, {order.customer.city}</p>
                  {order.customer.notes && (
                    <p className="text-amber-400/90 text-[11px] italic">Nota: {order.customer.notes}</p>
                  )}
                </div>

                {/* Items in order */}
                <div className="md:col-span-5 space-y-1.5">
                  <p className="text-zinc-500 font-bold uppercase text-[10px]">Prendas Compradas:</p>
                  <div className="space-y-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-zinc-300 bg-zinc-900/60 p-1.5 rounded border border-zinc-800">
                        <div className="flex items-center gap-2 truncate">
                          <img src={item.image} alt={item.name} className="w-6 h-6 rounded object-cover" />
                          <span className="truncate font-semibold">{item.name} (Talle {item.size})</span>
                        </div>
                        <span className="font-mono text-purple-300 flex-shrink-0 ml-2">
                          x{item.quantity} = ${(item.price * item.quantity).toLocaleString('es-AR')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment and Direct Actions */}
                <div className="md:col-span-3 flex flex-col justify-between space-y-2 border-l border-zinc-900 pl-4">
                  <div>
                    <span className="text-zinc-500 text-[10px] block">TOTAL ABONADO</span>
                    <span className="text-base font-black font-mono text-purple-400">
                      $ {order.total.toLocaleString('es-AR')}
                    </span>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">
                      Método: <strong className="text-white">{order.paymentMethod.toUpperCase()}</strong>
                    </span>
                  </div>

                  {/* Direct WhatsApp Messaging Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => handleSendWhatsApp(order, order.status === 'shipped' ? 'shipped' : 'confirmed')}
                      className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-montserrat font-bold text-xs flex items-center justify-center gap-2 shadow transition-transform active:scale-95"
                      title="Enviar mensaje personalizado por WhatsApp al cliente"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp Cliente</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Tracking input if shipped */}
              {order.status === 'shipped' && (
                <div className="flex items-center gap-2 pt-2 border-t border-zinc-900 text-xs">
                  <Truck className="w-4 h-4 text-cyan-400" />
                  <span className="text-zinc-400">N° de Guía / Tracking:</span>
                  <input
                    type="text"
                    placeholder="Ej: OCA-981240123"
                    value={trackingInputs[order.id] ?? (order.trackingNumber || '')}
                    onChange={e => setTrackingInputs({ ...trackingInputs, [order.id]: e.target.value })}
                    className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-white font-mono text-xs flex-1 max-w-xs"
                  />
                  <button
                    onClick={() => handleStatusChange(order.id, 'shipped')}
                    className="px-2.5 py-1 bg-cyan-900/60 hover:bg-cyan-800 text-cyan-200 border border-cyan-700 rounded text-xs font-bold"
                  >
                    Guardar Guía
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
};
