import React, { useState } from 'react';
import {
  Search,
  Menu,
  X,
  Phone,
  ChevronDown
} from 'lucide-react';
import { NavLink } from 'react-router';
import logo from "/logo.webp";
import {
  HOME_PATH,
  ABOUT_PATH,
  PRODUCTS_PATH,
} from '../../configs/constants';
import ContactBanner from '../../components/web/ContactBanner';

const categories = [
  { name: 'Home', path: HOME_PATH },
  { name: 'About', path: ABOUT_PATH },
  {
    name: 'Products',
    path: PRODUCTS_PATH,
  },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to the search results page with query parameter
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="w-full">
      {/* Contact Banner */}
      <ContactBanner />

      {/* Main Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <NavLink to="/" className="flex items-center">
                <img src={logo} alt="Logo" className="h-10 w-auto" />
              </NavLink>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {categories.map((category, index) => (
                <div key={index} className="relative group">
                  {category.submenu ? (
                    <div>
                      <button
                        className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 relative flex items-center"
                        onMouseEnter={() => setIsProductsMenuOpen(true)}
                        onMouseLeave={() => setIsProductsMenuOpen(false)}
                      >
                        {category.name}
                        <ChevronDown className="w-4 h-4 ml-1" />
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
                      </button>

                      {isProductsMenuOpen && (
                        <div
                          className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-2 z-50"
                          onMouseEnter={() => setIsProductsMenuOpen(true)}
                          onMouseLeave={() => setIsProductsMenuOpen(false)}
                        >
                          {category.submenu.map((item, subIndex) => (
                            <NavLink
                              key={subIndex}
                              to={item.path}
                              className={({ isActive }) =>
                                `block px-4 py-2 text-sm transition-colors duration-200 ${isActive ? "text-red-600 bg-gray-100" : "text-gray-700 hover:text-red-600 hover:bg-gray-100"
                                }`
                              }
                            >
                              {item.name}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <NavLink
                      to={category.path}
                      className={({ isActive }) =>
                        `text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 relative ${isActive ? "text-red-600" : ""
                        }`
                      }
                    >
                      {category.name}
                    </NavLink>
                  )}
                </div>
              ))}
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <button 
                  onClick={handleSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-600"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-red-600 transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-4">
            <div className="relative px-4">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <button 
                onClick={handleSearch}
                className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-600"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden bg-white border-t border-gray-200">
              <div className="px-4 pt-2 pb-4 space-y-1">
                {categories.map((category, index) => (
                  <div key={index}>
                    {category.submenu ? (
                      <div>
                        <span className="block w-full text-left px-3 py-2 text-gray-700 font-medium">
                          {category.name}
                        </span>
                        <div className="ml-4 space-y-1">
                          {category.submenu.map((item, subIndex) => (
                            <NavLink
                              key={subIndex}
                              to={item.path}
                              className={({ isActive }) =>
                                `block w-full text-left px-3 py-2 text-sm transition-colors duration-200 ${isActive ? "text-red-600 bg-gray-50" : "text-gray-600 hover:text-red-600 hover:bg-gray-50"
                                }`
                              }
                            >
                              {item.name}
                            </NavLink>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <NavLink
                        to={category.path}
                        className={({ isActive }) =>
                          `block w-full text-left px-3 py-2 rounded-md transition-colors duration-200 ${isActive ? "text-red-600 bg-gray-50" : "text-gray-700 hover:text-red-600 hover:bg-gray-50"
                          }`
                        }
                      >
                        {category.name}
                      </NavLink>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;