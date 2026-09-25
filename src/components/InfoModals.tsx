import React from 'react';
import { X, ShieldCheck, MapPin, Clock, Phone, Instagram, Send, Heart, Sparkles } from 'lucide-react';
import { StoreDB } from '../services/storeDb';

interface InfoModalsProps {
  type: 'about' | 'contact' | null;
  onClose: () => void;
}

export const InfoModals: React.FC<InfoModalsProps> = ({ type, onClose }) => {
  if (!type) return null;

  const handleOpenWhatsApp = () => {
    const msg = '¡Hola Indumentis Magna! 👋 Me gustaría hacerles una consulta sobre su catálogo y compras.';
    const link = StoreDB.generateWhatsAppLink('+5491158249120', msg);
    window.open(link, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-[#110e19] border border-purple-800/60 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(168,85,247,0.3)] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Glow ambient effects */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-fuchsia-600/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-900/60 hover:bg-zinc-800 transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {type === 'about' ? (
          /* NOSOTROS CONTENT */
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 text-purple-400 mb-1">
                <Sparkles className="w-4 h-4" />
                <span className="text-[11px] font-mono tracking-widest uppercase">CONOCÉ NUESTRA MARCA</span>
              </div>
              <h2 className="text-3xl font-bebas tracking-wider text-white">
                INDUMENTIS <span className="text-purple-400">MAGNA</span>
              </h2>
              <p className="text-xs text-purple-300 font-script tracking-wide mt-1">
                Estilo que te impulsa
              </p>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-zinc-300 leading-relaxed">
              <p>
                Nacimos inspirados por la cultura underground, el básquet callejero y la obsesión por las zapatillas icónicas. En <strong className="text-white">Indumentis Magna</strong> creemos que el calzado que calzas define tu actitud y tu impronta en cada paso.
              </p>
              <p>
                Trabajamos exclusivamente con pares seleccionados de <strong className="text-purple-300">Air Jordan, Nike Air Force 1 y siluetas legendarias</strong>. Cada producto publicado en nuestra plataforma cuenta con verificación física de calidad, garantizando materiales auténticos, terminaciones originales y stock real listo para entrega inmediata.
              </p>
            </div>

            {/* Core Values grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-zinc-950/70 border border-purple-900/40 rounded-xl p-3">
                <div className="text-purple-400 mb-1">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-white font-montserrat">STOCK 100% REAL</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">Fotos auténticas de las unidades reales en depósito.</p>
              </div>

              <div className="bg-zinc-950/70 border border-purple-900/40 rounded-xl p-3">
                <div className="text-purple-400 mb-1">
                  <Heart className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-white font-montserrat">ATENCIÓN PERSONAL</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">Asesoramiento directo en talles y envíos vía WhatsApp.</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-montserrat font-bold text-xs tracking-wider uppercase transition-colors shadow-[0_0_20px_rgba(168,85,247,0.4)]"
            >
              EXPLORAR CATÁLOGO
            </button>
          </div>
        ) : (
          /* CONTACTO CONTENT */
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 text-purple-400 mb-1">
                <Send className="w-4 h-4" />
                <span className="text-[11px] font-mono tracking-widest uppercase">CANALES OFICIALES</span>
              </div>
              <h2 className="text-3xl font-bebas tracking-wider text-white">
                CONTACTANOS DIRECTO
              </h2>
              <p className="text-xs text-zinc-400">
                Estamos disponibles para consultas sobre talles, formas de pago y despachos.
              </p>
            </div>

            <div className="space-y-3">
              {/* WhatsApp direct card */}
              <button
                onClick={handleOpenWhatsApp}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-emerald-950/40 border border-emerald-700/60 hover:border-emerald-400 hover:bg-emerald-950/60 text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-600 text-white rounded-lg group-hover:scale-105 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">WHATSAPP VENTAS & ENVÍOS</h4>
                    <p className="text-xs text-emerald-400 font-mono">+54 9 11 5824-9120</p>
                  </div>
                </div>
                <span className="text-xs bg-emerald-600 text-white font-bold px-3 py-1 rounded-full">
                  CHATEAR 📲
                </span>
              </button>

              {/* Instagram Card */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-between p-4 rounded-xl bg-purple-950/30 border border-purple-800/40 hover:border-purple-500 hover:bg-purple-950/50 text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-tr from-purple-600 to-pink-500 text-white rounded-lg group-hover:scale-105 transition-transform">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">INSTAGRAM OFICIAL</h4>
                    <p className="text-xs text-purple-300">@indumentismagna</p>
                  </div>
                </div>
                <span className="text-xs text-purple-300 font-bold group-hover:underline">
                  SEGUINOS ↗
                </span>
              </a>

              {/* Info details */}
              <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-4 space-y-2 text-xs text-zinc-400">
                <div className="flex items-center gap-2 text-zinc-300">
                  <MapPin className="w-4 h-4 text-purple-400" />
                  <span>Buenos Aires, Argentina (Despachos a todo el país vía Correo Argentino y Andreani)</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span>Horarios de atención: Lunes a Sábados de 10:00 a 20:00 hs</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl font-montserrat font-bold text-xs uppercase transition-colors"
            >
              CERRAR
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
