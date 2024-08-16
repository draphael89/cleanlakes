'use client';

import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main className="flex-grow container mx-auto p-4">
        {children}
      </main>
      <Footer />
    </>
  );
};

export default ClientLayout;