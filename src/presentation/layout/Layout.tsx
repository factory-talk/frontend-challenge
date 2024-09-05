import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="main-container">
      <main className="flex-grow w-full flex items-center justify-center">
        {children}
      </main>
    </div>
  );
};

export default Layout;
