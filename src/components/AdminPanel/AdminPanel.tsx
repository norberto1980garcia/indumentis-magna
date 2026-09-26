import React, { useState } from 'react';
import { LayoutDashboard, Package, ShoppingBag, Tag, Users, MessageCircle, ArrowLeft, Bell, Radio, ShieldCheck, AlertCircle } from 'lucide-react';
import { Product, Order, Coupon, AppUser, NotificationItem } from '../../types';
import { StoreDB } from '../../services/storeDb';
import { AdminAnalytics } from './AdminAnalytics';
import { AdminInventory } from './AdminInventory';
import { AdminOrders } from './AdminOrders';
import { AdminCoupons } from './AdminCoupons';
import { AdminUsers } from './AdminUsers';
import { AdminWhatsAppHub } from './AdminWhatsAppHub';

interface AdminPanelProps {
  onBackToStore: () => void;
  currentUser: AppUser | null;
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  users: AppUser[];
  notifications: NotificationItem[];
  onRefreshData: () => void;
}

type AdminTab = 'analytics' | 'inventory' | 'orders' | 'coupons' | 'whatsapp' | 'users';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onBackToStore,
  currentUser,
  products,
  orders,
  coupons,
  users,
  notifications,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
  const [lastSyncTime, setLastSyncTime] = useState<string>(new Date().toLocaleTimeString());

  const handleSimulateNewOrder = () => {
    // Demo quick simulation of a new purchase
    const sampleProduct = products[0] || {
      id: 'prod-nike-dunk-low',
      name: 'NIKE DUNK LOW',
      subtitle: 'Black / White',
      price: 89999,
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80'
    };

    StoreDB.createOrder({
      customer: {
        name: 'Nicolás Balbi',
        email: 'nico.balbi@gmail.com',
        phone: '+54 9 11 6495-6256',
        address: 'Av. Santa Fe 2100',
        city: 'Buenos Aires',
        zipCode: '1425',
        dniOrTaxId: '43.902.112'
      },
      items: [
        {
          id: `ci-${Date.now()}`,
          productId: sampleProduct.id,
          name: sampleProduct.name,
          subtitle: sampleProduct.subtitle,
          price: sampleProduct.price,
          image: sampleProduct.image,
          size: '42',
          quantity: 1,
          maxAvailableStock: 10
        }
      ],
      subtotal: sampleProduct.price,
      discount: 0,
      shipping: 0,
      total: sampleProduct.price,
      paymentMethod: 'mercadopago',
      paymentStatus: 'paid',
      status: 'pending'
    });

    setLastSyncTime(new Date().toLocaleTimeString());
    onRefreshData();
  };

  const navItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'analytics', label: 'Analíticas & Ventas', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'inventory', label: 'Inventario & Stock', icon: <Package className="w-4 h-4" /> },
    { id: 'orders', label: 'Pedidos en Tiempo Real', icon: <ShoppingBag className="w-4 h-4" />, badge: orders.filter(o => o.status === 'pending').length },
    { id: 'coupons', label: 'Descuentos & Cupones', icon: <Tag className="w-4 h-4" /> },
    { id: 'whatsapp', label: 'Hub WhatsApp Directo', icon: <MessageCircle className="w-4 h-4" /> },
    { id: 'users', label: 'Usuarios & Permisos', icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#09070d] text-white">
      
      {/* Top Admin Navigation Header */}
      <header className="border-b border-purple-900/40 bg-zinc-950/90 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left Brand and Return */}
            <div className="flex items-center gap-4">
              <button
                onClick={onBackToStore}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>VOLVER A LA TIENDA</span>
              </button>

              <div className="hidden sm:flex items-center gap-2 border-l border-zinc-800 pl-4">
                <span className="text-sm font-bebas tracking-wider text-purple-400">INDUMENTIS MAGNA</span>
                <span className="text-[10px] bg-purple-950/80 border border-purple-700 text-purple-300 font-mono px-2 py-0.5 rounded">
                  PANEL CONTROL
                </span>
              </div>
            </div>

            {/* Real-time Status & Trigger Demo */}
            <div className="flex items-center gap-3">
              {/* Real-time sync badge */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/80 text-[11px] font-mono text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Base de Datos Sincronizada ({lastSyncTime})</span>
              </div>

              {/* Push Simulation trigger */}
              <button
                onClick={handleSimulateNewOrder}
                className="px-3 py-1.5 bg-gradient-to-r from-purple-800 to-fuchsia-700 hover:from-purple-700 hover:to-fuchsia-600 text-white rounded-lg text-xs font-bold font-montserrat flex items-center gap-1.5 shadow"
                title="Simula un nuevo pedido entrante en tiempo real con descuento de stock y sonido"
              >
                <Radio className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Simular Nuevo Pedido</span>
                <span className="sm:hidden">+Pedido</span>
              </button>

              {/* Current User Role Pill */}
              <div className="flex items-center gap-2 px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-xs">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span className="font-bold text-white capitalize">{currentUser?.name?.split(' ')[0] || 'Admin'}</span>
                <span className="text-[10px] text-purple-400 font-mono uppercase font-bold">
                  ({currentUser?.role || 'admin'})
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto">
          <div className="flex space-x-1 sm:space-x-2 py-2 border-t border-zinc-900">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-montserrat font-bold tracking-wider whitespace-nowrap transition-all ${
                  activeTab === item.id
                    ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-1.5 py-0.2 bg-red-600 text-white text-[10px] font-bold rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'analytics' && (
          <AdminAnalytics orders={orders} products={products} />
        )}
        {activeTab === 'inventory' && (
          <AdminInventory products={products} onProductsUpdated={onRefreshData} />
        )}
        {activeTab === 'orders' && (
          <AdminOrders orders={orders} onOrdersUpdated={onRefreshData} />
        )}
        {activeTab === 'coupons' && (
          <AdminCoupons coupons={coupons} onCouponsUpdated={onRefreshData} />
        )}
        {activeTab === 'whatsapp' && (
          <AdminWhatsAppHub orders={orders} onOrdersUpdated={onRefreshData} />
        )}
        {activeTab === 'users' && (
          <AdminUsers users={users} onUsersUpdated={onRefreshData} currentUser={currentUser} />
        )}
      </main>

    </div>
  );
};
