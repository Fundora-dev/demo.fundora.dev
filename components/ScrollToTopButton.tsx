// components/ScrollToTopButton.tsx
import React, { useState, useEffect } from 'react';
import { Button } from './Button'; // Assuming Button component can accept style prop for parallax
import { usePointerParallax } from '../hooks/usePointerParallax';

const ArrowUpIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
  </svg>
);

export const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { parallaxStyle, onPointerMove, onPointerEnter, onPointerLeave } = usePointerParallax();

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const lightGlassScrollButtonStyle = `
    !p-3 fixed bottom-6 right-6 z-50 rounded-full 
    !bg-slate-50/70 !backdrop-blur-lg !backdrop-saturate-150 
    !border !border-slate-900/15
    !shadow-lg !shadow-slate-900/10
    hover:!scale-[0.97] hover:!bg-slate-50/80
    focus-visible:!ring-2 focus-visible:!ring-[#0A6CFF]/50 focus-visible:!ring-offset-2 focus-visible:!ring-offset-transparent
    !text-[#0A6CFF] 
    transition-transform,transition-shadow !duration-150 ease-in-out transform hover:scale-105
  `;

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className={lightGlassScrollButtonStyle.replace(/\s\s+/g, ' ').trim()}
          style={parallaxStyle}
          onPointerMove={onPointerMove}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          aria-label="トップへ戻る"
        >
          <ArrowUpIcon className="w-5 h-5" />
        </button>
      )}
    </>
  );
};