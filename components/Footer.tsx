import React from 'react';
import { Link } from 'react-router-dom';
import { FOOTER_TEXT, SITE_NAME, NAV_LINKS, FOOTER_LINKS_LEGAL, FOOTER_LINKS_CONNECT, HERO_SUBTITLE } from '../constants';

export const Footer: React.FC = () => {
  const footerStyle = `
    bg-[rgba(240,247,255,0.6)] backdrop-blur-md 
    border-t border-[rgba(200,210,230,0.5)] 
    text-[#374151]
  `;
  return (
    <footer className={footerStyle.replace(/\s\s+/g, ' ').trim()}>
      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Logo, Site Name & Short Description */}
          <div className="sm:col-span-2 md:col-span-2">
            <Link to="/" className="text-2xl font-bold text-[#0A6CFF] hover:text-[#0052CC] transition-colors mb-3 inline-block">
              {SITE_NAME}
            </Link>
            <p className="text-sm text-slate-600 mb-4 max-w-md md:max-w-none pr-4">
              {HERO_SUBTITLE}
            </p>
          </div>

          {/* Main Navigation Links */}
          <div>
            <h5 className="text-lg font-semibold text-[#0A6CFF] mb-4">ナビゲーション</h5>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={`footer-nav-${link.name}`}>
                  <Link to={link.path} className="text-slate-600 hover:text-[#0A6CFF] transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Legal & Connect Links */}
          <div>
            <h5 className="text-lg font-semibold text-[#0A6CFF] mb-4">サポート</h5>
            <ul className="space-y-2">
              {FOOTER_LINKS_LEGAL.map((link) => (
                <li key={`footer-legal-${link.name}`}>
                  <Link to={link.path} className="text-slate-600 hover:text-[#0A6CFF] transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
              {FOOTER_LINKS_CONNECT.map((link) => (
                <li key={`footer-connect-${link.name}`}>
                  <Link to={link.path} className="text-slate-600 hover:text-[#0A6CFF] transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-300/60 pt-8 text-center text-sm text-slate-500">
          <p>{FOOTER_TEXT}</p>
        </div>
      </div>
    </footer>
  );
};
