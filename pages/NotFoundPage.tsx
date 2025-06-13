
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { usePointerParallax } from '../hooks/usePointerParallax';

// Standard Heroicon for warning/error
const ExclamationTriangleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-24 h-24"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
);


interface NotFoundPageProps {
    message?: string;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ message }) => {
  const { parallaxStyle, onPointerMove, onPointerEnter, onPointerLeave } = usePointerParallax();

  const panelStyle = `
    bg-slate-50/60 backdrop-blur-xl backdrop-saturate-150
    border border-slate-900/10
    shadow-xl shadow-slate-900/5
    rounded-[24px]
    p-8 md:p-12 text-center max-w-lg w-full
    transition-shadow duration-150 ease-in-out
    hover:shadow-2xl hover:shadow-slate-900/10
  `;

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div
        className={panelStyle.replace(/\s\s+/g, ' ').trim()}
        style={parallaxStyle}
        onPointerMove={onPointerMove}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
        <ExclamationTriangleIcon className="text-[#0A6CFF] opacity-60 mb-8 mx-auto w-20 h-20 md:w-24 md:h-24" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#0A6CFF] mb-4">404</h1>
        <p className="text-lg md:text-xl text-slate-600 mb-8">
          {message || "おっと！お探しのページは見つからなかったようです。"}
        </p>
        <Link to="/">
          <Button variant="primary" size="lg">
            ホームページに戻る
          </Button>
        </Link>
      </div>
    </div>
  );
};