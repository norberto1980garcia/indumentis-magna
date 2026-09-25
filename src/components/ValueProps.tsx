import React from 'react';
import { ShieldCheck, Truck, CreditCard, Award } from 'lucide-react';

export const ValueProps: React.FC = () => {
  const props = [
    {
      icon: <ShieldCheck className="w-7 h-7 text-purple-400 flex-shrink-0" />,
      title: 'CALIDAD PREMIUM',
      description: 'Productos originales y seleccionados.'
    },
    {
      icon: <Truck className="w-7 h-7 text-purple-400 flex-shrink-0" />,
      title: 'ENVÍOS A TODO EL PAÍS',
      description: 'Llegamos a donde estés.'
    },
    {
      icon: <CreditCard className="w-7 h-7 text-purple-400 flex-shrink-0" />,
      title: 'COMPRA 100% SEGURA',
      description: 'Tus datos protegidos.'
    },
    {
      icon: <Award className="w-7 h-7 text-purple-400 flex-shrink-0" />,
      title: 'DISEÑOS EXCLUSIVOS',
      description: 'Estilo único, siempre.'
    }
  ];

  return (
    <section className="border-t border-b border-purple-900/40 bg-[#09070c] py-6 my-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-purple-900/40 gap-y-4 sm:gap-y-0">
          {props.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-3.5 px-4 ${idx !== 0 ? 'sm:pl-6' : ''}`}
            >
              <div className="p-2 rounded-xl bg-purple-950/40 border border-purple-800/40 text-purple-400 flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold font-montserrat tracking-wider text-white uppercase">
                  {item.title}
                </h4>
                <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
