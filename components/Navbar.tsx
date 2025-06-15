import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { SITE_NAME, NAV_LINKS, USER_ROLE_SPECIFIC_NAV } from '../constants';
import { UserRole } from '../types';
import { Button } from './Button'; 
import { usePointerParallax } from '../hooks/usePointerParallax';

// SVG Icons (Heroicons) - colors will be inherited via text color
const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const XMarkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const UserCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

interface NavLinkWithParallaxProps {
  to: string;
  children: React.ReactNode;
  classNameCallback: ({ isActive }: { isActive: boolean }) => string;
  onClick?: () => void;
}

const NavLinkWithParallax: React.FC<NavLinkWithParallaxProps> = ({ to, children, classNameCallback, onClick }) => {
  const { parallaxStyle, onPointerMove, onPointerEnter, onPointerLeave } = usePointerParallax();
  return (
    <NavLink
      to={to}
      className={classNameCallback}
      style={parallaxStyle}
      onPointerMove={onPointerMove}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onClick={onClick}
    >
      {children}
    </NavLink>
  );
};


export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, loginAsOwner, loginAsInvestor, logout } = useUser();

  const navLinkBaseClasses = "px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ease-in-out text-slate-700 hover:text-[#0052CC]";
  
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `${navLinkBaseClasses} ${
      isActive ? 'bg-[#0A6CFF]/80 text-white shadow-md backdrop-blur-sm' : 'hover:bg-slate-900/5'
    }`;
  
  const roleSpecificNavLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `${navLinkBaseClasses} ${
        isActive ? 'bg-[#8B5CF6]/80 text-white shadow-md backdrop-blur-sm' : 'hover:bg-slate-900/5 hover:text-[#6D28D9]'
      }`;


  const commonLinks = NAV_LINKS.map(link => (
    <NavLinkWithParallax
      key={link.name}
      to={link.path}
      classNameCallback={navLinkClasses}
      onClick={() => setIsMobileMenuOpen(false)}
    >
      {link.name}
    </NavLinkWithParallax>
  ));

  const roleSpecificLinks = currentUser?.role ? USER_ROLE_SPECIFIC_NAV[currentUser.role]?.map(link => (
    <NavLinkWithParallax
      key={link.name}
      to={link.path}
      classNameCallback={roleSpecificNavLinkClasses}
      onClick={() => setIsMobileMenuOpen(false)}
    >
      {link.name}
    </NavLinkWithParallax>
  )) : [];

  const navBarStyle = `
    sticky top-0 z-50 
    bg-white/70 backdrop-blur-xl backdrop-saturate-150 
    border-b border-slate-900/10 
    shadow-md shadow-slate-900/5
  `;
  
  const mobileMenuButtonStyle = `
    bg-slate-100/50 backdrop-blur-sm 
    inline-flex items-center justify-center p-2 rounded-lg 
    text-[#0A6CFF] hover:text-[#0052CC] hover:bg-slate-100/70 
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:ring-[#0A6CFF]
  `;
  
  const mobileDropDownStyle = `
    md:hidden 
    bg-white/80 backdrop-blur-xl backdrop-saturate-150
    border-t border-slate-900/10 
    shadow-xl
  `;


  return (
    <nav className={navBarStyle.replace(/\s\s+/g, ' ').trim()}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 text-[#0A6CFF] text-xl font-bold hover:text-[#0052CC] transition-colors flex items-center">
                <span>{SITE_NAME}</span>
                <span className="ml-2 px-2 py-0.5 rounded-md text-xs font-semibold bg-gradient-to-r from-[#8B5CF6] to-[#7038E0] text-white border border-transparent shadow-sm">
                  Demo
                </span>
              </Link>
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-2">
                  {commonLinks}
                  {roleSpecificLinks}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                {currentUser ? (
                  <div className="flex items-center space-x-3">
                    <img src={currentUser.avatarUrl} alt={currentUser.name} className="h-9 w-9 rounded-full border-2 border-slate-300/70 shadow-sm"/>
                    <span className="text-slate-700 text-sm font-medium">{currentUser.name} ({currentUser.role})</span>
                    <Button
                      onClick={logout}
                      variant="outline"
                      size="sm"
                    >
                      ログアウト
                    </Button>
                  </div>
                ) : (
                  <div className="space-x-2">
                    <Button
                      onClick={loginAsInvestor}
                      variant="primary" 
                      size="sm"
                    >
                      支援者としてログイン
                    </Button>
                    <Button
                      onClick={loginAsOwner}
                      variant="secondary"
                      size="sm"
                    >
                      研究者としてログイン
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                type="button"
                className={mobileMenuButtonStyle.replace(/\s\s+/g, ' ').trim()}
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen ? "true" : "false"}
              >
                <span className="sr-only">メインメニューを開く</span>
                {isMobileMenuOpen ? <XMarkIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>

      {/* Mobile menu overlay and menu */}
      {isMobileMenuOpen && (
        <>
          {/* グラスモーフィズムの全画面オーバーレイ（黒/グレー半透明＋blur） */}
          <div
            className="fixed inset-0 z-40 bg-black/90 backdrop-blur-md transition-all duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* メニュー本体 */}
          <div className="fixed inset-0 z-50 flex justify-center items-center h-screen">
            <button
              className="absolute top-6 right-6 text-3xl text-white bg-gray-800/80 rounded-full p-2 shadow-md"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="メニューを閉じる"
            >
              <XMarkIcon className="w-8 h-8" />
            </button>
            <nav className="w-full h-full flex flex-col items-center justify-center bg-gray-900/95 shadow-xl py-8 px-4 backdrop-blur-lg border-none">
              {/* アカウント情報表示 */}
              <div className="flex flex-col items-center mb-6 mt-10">
                {currentUser ? (
                  <>
                    <img src={currentUser.avatarUrl} alt={currentUser.name} className="h-14 w-14 rounded-full border-2 border-slate-300/70 shadow mb-2" />
                    <div className="text-white text-base font-semibold">{currentUser.name}</div>
                    <div className="text-[#0A6CFF] text-sm font-medium">{currentUser.role}</div>
                  </>
                ) : (
                  <>
                    <div className="bg-gray-700 rounded-full h-14 w-14 flex items-center justify-center mb-2">
                      <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-8 h-8 text-gray-400'>
                        <path strokeLinecap='round' strokeLinejoin='round' d='M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z' />
                      </svg>
                    </div>
                    <div className="text-white text-base font-semibold">未ログイン</div>
                  </>
                )}
              </div>
              <div className="flex flex-col items-center w-full h-[60vh] justify-center overflow-y-auto space-y-4">
                {NAV_LINKS.map(link => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) =>
                      `w-full text-center text-lg font-semibold px-4 py-3 rounded-lg transition-colors duration-150 ${isActive ? 'bg-[#0A6CFF]/90 text-white shadow' : 'text-white bg-gray-800/60 hover:bg-[#0A6CFF]/30'}`
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </NavLink>
                ))}
                {currentUser?.role && USER_ROLE_SPECIFIC_NAV[currentUser.role]?.map(link => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) =>
                      `w-full text-center text-lg font-semibold px-4 py-3 rounded-lg transition-colors duration-150 ${isActive ? 'bg-[#8B5CF6]/90 text-white shadow' : 'text-white bg-gray-700/60 hover:bg-[#8B5CF6]/30'}`
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </NavLink>
                ))}
              </div>
              <div className="pt-8 w-full flex flex-col items-center space-y-3">
                {currentUser ? (
                  <Button
                    onClick={() => { setIsMobileMenuOpen(false); logout(); }}
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    ログアウト
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={() => { setIsMobileMenuOpen(false); loginAsInvestor(); }}
                      variant="primary"
                      size="lg"
                      className="w-full"
                    >
                      支援者としてログイン
                    </Button>
                    <Button
                      onClick={() => { setIsMobileMenuOpen(false); loginAsOwner(); }}
                      variant="secondary"
                      size="lg"
                      className="w-full"
                    >
                      研究者としてログイン
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        </>
      )}
    </nav>
  );
};