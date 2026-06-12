import React from 'react';
import { useLocation } from 'react-router';
import { Menu, Bell, Search, ChevronDown } from 'lucide-react';

const Header = ({ setSidebarOpen }) => {
  const location = useLocation();
  const currentPage = location.pathname.slice(1) || 'dashboard';

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 mr-2"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-gray-800 capitalize">{currentPage}</h2>
        </div>
      </div>
    </header>
  );
};

export default Header;