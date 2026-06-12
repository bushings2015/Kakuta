import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import authService from "../../services/authService";
import {
  Home, BarChart3, FileText, Layers, Tag, X,
  MapPin, ChevronDown, ChevronUp, Package, LogOut,
  User2,
  MessageCircle
} from 'lucide-react';
import { CONTENTTYPES, DASHBOARD, CONTENTS, ADDRESSTYPES, ADDRESS, CATEGORIES, PRODUCTS, PROFILE, REQUESTS3D } from "../../configs/constants";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const [openSubmenus, setOpenSubmenus] = useState({});
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const toggleSubmenu = (label) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authService.userInfo();
        setUser(res.data.data);
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    };
    fetchUser();
  }, []);

  const getInitials = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  const sidebarItems = [
    { path: DASHBOARD, icon: Home, label: 'Dashboard' },
    {
      icon: Layers,
      label: 'Content Management',
      submenu: [
        { path: CONTENTS, label: 'Contents', icon: FileText },
        { path: CONTENTTYPES, label: 'Content-types', icon: Tag },
        { path: ADDRESSTYPES, label: 'Address-types', icon: MapPin },
        { path: ADDRESS, label: 'Address', icon: MapPin },
      ],
    },
    {
      icon: Layers,
      label: 'Products Management',
      submenu: [
        { path: CATEGORIES, label: 'Categories', icon: Tag },
        { path: PRODUCTS, label: 'Products', icon: Package },
        { path: REQUESTS3D, label: '3D Requests', icon: MessageCircle },
      ],
    },
    { path: PROFILE, icon: User2, label: 'Profile' },
  ];

  return (
    <div
      className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Profile Section */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
          {getInitials(user?.username)}
        </div>
        <div className="ml-3">
          <p className="text-gray-800 font-medium">{user?.username || "Loading..."}</p>
          <p className="text-gray-500 text-sm">{user?.email || ""}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-4">
        {sidebarItems.map((item) => {
          const Icon = item.icon;

          if (item.submenu) {
            return (
              <div key={item.label} className="mb-1">
                <button
                  onClick={() => toggleSubmenu(item.label)}
                  className="w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 transition-colors text-gray-600"
                >
                  {Icon && <Icon className="w-5 h-5 mr-3" />}
                  <span className="flex-1">{item.label}</span>
                  {openSubmenus[item.label] ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {openSubmenus[item.label] &&
                  item.submenu.map((sub) => {
                    const SubIcon = sub.icon;
                    return (
                      <NavLink
                        key={sub.path}
                        to={sub.path}
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) =>
                          `w-full flex items-center px-12 py-2 text-left hover:bg-gray-100 transition-colors ${isActive
                            ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                            : 'text-gray-600'
                          }`
                        }
                      >
                        {SubIcon && <SubIcon className="w-4 h-4 mr-2" />}
                        {sub.label}
                      </NavLink>
                    );
                  })}
              </div>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 transition-colors ${isActive
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                  : 'text-gray-600'
                }`
              }
            >
              {Icon && <Icon className="w-5 h-5 mr-3" />}
              {item.label}
            </NavLink>
          );
        })}

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 transition-colors text-gray-600 mt-2"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
