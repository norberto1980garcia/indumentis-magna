import React from 'react';
import bannerIndumentis from '../assets/images/banner-indumentis.jpeg';

interface HeroProps {
  onSelectCategory: (category: string) => void;
  onScrollToProducts: () => void;
}

export const Hero: React.FC<HeroProps> = () => {
  return (
    <section className="w-full bg-[#09070c]">
      <img
        src={bannerIndumentis}
        alt="Indumentis Magna"
        className="w-full h-auto block"
      />
    </section>
  );
};