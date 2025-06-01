import React, { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-24 pb-10">
          {children}
        </main>
        
        <footer className="bg-white border-t border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            HelpDesk Ticketing System &copy; {new Date().getFullYear()}
          </div>
        </footer>
      </div>
    </div>
  );
};