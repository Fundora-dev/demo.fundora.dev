// hooks/usePointerParallax.ts
import { useState, useCallback, CSSProperties } from 'react';

export const usePointerParallax = () => {
  const [gradientPos, setGradientPos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const onPointerMove = useCallback((event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setGradientPos({ x, y });
    if (!isHovering) setIsHovering(true);
  }, [isHovering]);

  const onPointerEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const onPointerLeave = useCallback(() => {
    setGradientPos({ x: 50, y: 50 });
    setIsHovering(false);
  }, []);

  const parallaxStyle: CSSProperties = isHovering ? {
    backgroundImage: `radial-gradient(800px at ${gradientPos.x}% ${gradientPos.y}%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 60%, transparent 100%)`,
    backgroundSize: '200% 200%', 
  } : {
    backgroundImage: 'none',
  };

  return { parallaxStyle, onPointerMove, onPointerEnter, onPointerLeave, isHovering };
};