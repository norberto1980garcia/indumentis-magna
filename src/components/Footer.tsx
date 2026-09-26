import React from 'react';
import { Instagram, MessageCircle } from 'lucide-react';
import { StoreDB } from '../services/storeDb';

export const Footer: React.FC = () => {
  const handleWhatsApp = () => {
    const link = StoreDB.generateWhatsAppLink(
      '+5491158249120',
      '¡Hola Indumentis Magna! 👋 Me comunico desde la tienda online para hacer una consulta.'
    );
    window.open(link, '_blank');
  };

  return (
    <footer className="bg-[#07050a] border-t border-purple-900/40 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Top Row: Logo | Socials | Payment Methods */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pb-8 border-b border-zinc-900">

          {/* Left: Brand Logo */}
          <div className="md:col-span-4 flex flex-col space-y-1">
            <span className="text-[10px] tracking-[0.4em] text-purple-400 font-montserrat font-bold -mb-1">
              — INDUMENTIS —
            </span>
            <span className="text-3xl sm:text-4xl font-bebas tracking-wider text-white drop-shadow-[0_0_12px_rgba(168,85,247,0.4)]">
              MAGNA
            </span>
          </div>

          {/* Center: Social Networks */}
          <div className="md:col-span-4 flex flex-col items-center justify-center space-y-3">
            <span className="text-xs font-montserrat font-bold tracking-widest text-zinc-300 uppercase">
              SEGUINOS EN REDES
            </span>

            <div className="flex items-center gap-4">

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-purple-500 hover:text-purple-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>

              {/* TikTok */}
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-purple-500 hover:text-purple-400 transition-colors flex items-center justify-center"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>

              {/* WhatsApp Direct */}
              <button
                onClick={handleWhatsApp}
                className="p-2.5 rounded-full bg-emerald-950/60 border border-emerald-800/80 hover:border-emerald-400 text-emerald-400 hover:text-emerald-300 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </button>

            </div>
          </div>

          {/* Right: Payment Methods */}
          <div className="md:col-span-4 flex flex-col md:items-end space-y-3">
            <span className="text-xs font-montserrat font-bold tracking-widest text-zinc-300 uppercase">
              MEDIOS DE PAGO
            </span>

            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-[#009ee3]/20 border border-[#009ee3]/50 text-[#009ee3] rounded text-xs font-bold font-montserrat">
                mercado pago
              </span>

              <span className="px-2.5 py-1 bg-blue-900/30 border border-blue-600/50 text-blue-300 rounded text-xs font-black tracking-wider">
                VISA
              </span>

              <span className="px-2.5 py-1 bg-orange-950/40 border border-orange-600/50 text-orange-400 rounded text-xs font-bold">
                mastercard
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">

          <p className="flex items-center gap-1 select-none">
            <span>©</span>
            <span>2026 INDUMENTIS MAGNA. Todos los derechos reservados.</span>
          </p>

          <div>
            <span className="text-xl sm:text-2xl font-script text-purple-300/90 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] select-none">
              Pensamos en vos cuando otros no lo hacen.
            </span>
          </div>

        </div>

      </div>
    </footer>
  );
};