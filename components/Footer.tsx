import React from 'react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="py-16 border-t border-gray-100/50 text-center bg-white flex flex-col items-center">
      <Logo className="w-12 h-12 mb-6 opacity-30 grayscale brightness-125" />
      <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-gray-300 px-4">
        © 2026 ExpaLink Global Network. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;