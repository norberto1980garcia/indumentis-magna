import React from 'react';
import bannerIndumentis from '../assets/images/banner-indumentis.jpeg';

interface HeroProps {
  onSelectCategory: (category: string) => void;
  onScrollToProducts: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onSelectCategory,
  onScrollToProducts,
}) => {
  return (
    <section className="w-full bg-[#09070c]">
      {/* Banner principal */}
      <img
        src={bannerIndumentis}
        alt="Indumentis Magna"
        className="w-full h-auto block"
      />

      {/* Categorías */}
      <div className="flex justify-center items-center gap-2 sm:gap-4 md:gap-12 py-5 px-2">
        <button
          onClick={() => {
            onSelectCategory('Calzado');
            onScrollToProducts();
          }}
          className="px-3 sm:px-5 md:px-7 py-3 bg-[#110e19] border border-purple-800/50 text-purple-200 font-montserrat text-sm font-semibold tracking-[0.2em] hover:bg-purple-900/40 hover:border-purple-500 hover:text-white transition-all duration-300"
        >
          CALZADO
        </button>

        <button
          onClick={() => {
            onSelectCategory('Ropa');
            onScrollToProducts();
          }}
          className="px-3 sm:px-5 md:px-7 py-3 bg-[#110e19] border border-purple-800/50 text-purple-200 font-montserrat text-sm font-semibold tracking-[0.2em] hover:bg-purple-900/40 hover:border-purple-500 hover:text-white transition-all duration-300"
        >
          ROPA
        </button>

        <button
          onClick={() => {
            onSelectCategory('Accesorios');
            onScrollToProducts();
          }}
          className="px-3 sm:px-5 md:px-7 py-3 bg-[#110e19] border border-purple-800/50 text-purple-200 font-montserrat text-sm font-semibold tracking-[0.2em] hover:bg-purple-900/40 hover:border-purple-500 hover:text-white transition-all duration-300"
        >
          ACCESORIOS
        </button>
      </div>
    </section>
  );
};
