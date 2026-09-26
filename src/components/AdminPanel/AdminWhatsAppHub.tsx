import React, { useState } from 'react';
import { MessageCircle, Send, Check, Copy, Edit, Sparkles, Smartphone, Users } from 'lucide-react';
import { WhatsAppTemplate, Order } from '../../types';
import { StoreDB } from '../../services/storeDb';

interface AdminWhatsAppHubProps {
  orders: Order[];
  onOrdersUpdated: () => void;
}

export const AdminWhatsAppHub: React.FC<AdminWhatsAppHubProps> = ({ orders, onOrdersUpdated }) => {
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>(StoreDB.getTemplates());
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || '');
  const [targetPhone, setTargetPhone] = useState('+54 9 11 6495-6256');
  const [customMessage, setCustomMessage] = useState(templates[0]?.content || '');
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');
  const [copied, setCopied] = useState(false);

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);
  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  // When order or template changes, generate preview
  const handleSelectTemplate = (tpl: WhatsAppTemplate) => {
    setSelectedTemplateId(tpl.id);
    if (selectedOrder) {
      setCustomMessage(StoreDB.formatWhatsAppOrderMessage(selectedOrder, tpl.content));
    } else {
      setCustomMessage(tpl.content);
    }
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    const ord = orders.find(o => o.id === orderId);
    if (ord) {
      setTargetPhone(ord.customer.phone);
      if (selectedTemplate) {
        setCustomMessage(StoreDB.formatWhatsAppOrderMessage(ord, selectedTemplate.content));
      }
    }
  };

  const handleSend = () => {
    if (!targetPhone) return;
    const link = StoreDB.generateWhatsAppLink(targetPhone, customMessage);
    if (selectedOrder) {
      StoreDB.markWhatsAppNotified(selectedOrder.id);
      onOrdersUpdated();
    }
    window.open(link, '_blank');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(customMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bebas tracking-wide text-white flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-emerald-400" />
          <span>HUB DE COMUNICACIÓN DIRECTA POR WHATSAPP</span>
        </h2>
        <p className="text-xs text-zinc-400">
          Plantillas automáticas, seguimiento de pedidos y contacto fluido entre vendedores y clientes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Templates & Order Picker (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Order Selector */}
          <div className="p-4 bg-zinc-950 border border-purple-900/40 rounded-xl space-y-2">
            <label className="block text-xs font-bold text-zinc-300 uppercase">
              1. Seleccionar Pedido o Cliente:
            </label>
            <select
              value={selectedOrderId}
              onChange={e => handleSelectOrder(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-xs text-white"
            >
              {orders.map(o => (
                <option key={o.id} value={o.id}>
                  #{o.orderNumber} - {o.customer.name} (${o.total.toLocaleString('es-AR')}) - {o.status.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Templates list */}
          <div className="p-4 bg-zinc-950 border border-purple-900/40 rounded-xl space-y-3">
            <label className="block text-xs font-bold text-zinc-300 uppercase">
              2. Plantillas Automáticas Disponibles:
            </label>
            <div className="space-y-2">
              {templates.map(tpl => (
                <button
                  key={tpl.id}
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`w-full p-3 rounded-lg text-left text-xs transition-all border ${
                    selectedTemplateId === tpl.id
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  <p className="font-bold text-white">{tpl.name}</p>
                  <p className="text-[11px] text-zinc-500 line-clamp-2 mt-0.5">{tpl.content}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Message Editor & Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 bg-zinc-950 border border-purple-900/40 rounded-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                3. Vista Previa & Envío de Mensaje
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 rounded text-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado' : 'Copiar Texto'}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">Destinatario (WhatsApp):</label>
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <input
                  type="text"
                  value={targetPhone}
                  onChange={e => setTargetPhone(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                  placeholder="+54 9 11 ..."
                />
              </div>
            </div>

            {/* Live WhatsApp chat balloon style */}
            <div className="p-4 bg-[#0b141a] rounded-xl border border-emerald-950/60 shadow-inner">
              <div className="flex items-center gap-2 mb-2 pb-1 border-b border-emerald-950 text-[10px] text-emerald-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>VISTA PREVIA DE CHAT WHATSAPP</span>
              </div>
              <div className="max-w-md bg-[#005c4b] text-white p-3 rounded-xl rounded-tl-none text-xs font-sans whitespace-pre-line shadow">
                {customMessage}
                <div className="text-[9px] text-emerald-200 text-right mt-1 flex items-center justify-end gap-1">
                  <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span>✓✓</span>
                </div>
              </div>
            </div>

            {/* Editable Content */}
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Personalizar mensaje antes de enviar:</label>
              <textarea
                rows={5}
                value={customMessage}
                onChange={e => setCustomMessage(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-xs text-white font-sans focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Action button */}
            <button
              onClick={handleSend}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold font-montserrat tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all active:scale-98"
            >
              <Send className="w-4 h-4" />
              <span>ABRIR EN WHATSAPP Y ENVIAR 📲</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
