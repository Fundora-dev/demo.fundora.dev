import React, { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Breadcrumbs } from './Breadcrumbs';
import { Button } from './Button'; 
import { ScrollToTopButton } from './ScrollToTopButton'; // Import ScrollToTopButton

// ArrowLeftIcon for the back button
const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.56l2.72 2.72a.75.75 0 11-1.06 1.06l-4.25-4.25a.75.75 0 010-1.06l4.25-4.25a.75.75 0 111.06 1.06L5.56 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
  </svg>
);

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const showBackButton = location.pathname !== '/';

  const handleBackButtonClick = () => {
    if (location.pathname === '/create-project') {
      navigate('/dashboard/owner');
    } else if (location.pathname === '/dashboard/owner') {
      navigate('/');
    }
     else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#1E1E1E]">
      <Navbar />
      <div className="container mx-auto px-4 py-4 flex-grow">
        <Breadcrumbs />
        <main className="py-4">
          {children}
        </main>
        {showBackButton && (
          <div className="py-6 text-center">
            <Button 
              variant="outline" 
              size="md"
              onClick={handleBackButtonClick}
              leftIcon={<ArrowLeftIcon className="w-5 h-5"/>}
            >
              前のページに戻る
            </Button>
          </div>
        )}
      </div>
      <Footer />
      <ScrollToTopButton /> {/* Add ScrollToTopButton here */}
    </div>
  );
};