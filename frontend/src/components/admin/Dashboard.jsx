import React, { useState, useEffect } from 'react';
import { Eye, Edit, Trash2, Plus, TrendingUp, TrendingDown, BarChart3, Users, Package, Tag, MessageCircle, FileText, MapPin, ExternalLink } from 'lucide-react';
import StatsCard from './card/StatusCard';
import dashboardService from '../../services/dashboardService';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalCategories: 0,
    total3DRequests: 0,
    totalContent: 0,
    totalAddresses: 0,
    totalContentTypes: 0,
    recentProducts: [],
    recentUsers: [],
    recentRequests: [],
    popularCategories: [],
    productsByCategory: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await dashboardService.getDashboardStats();
      if (response.data && response.data.data) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    { 
      title: 'Total Users', 
      value: stats.totalUsers?.toLocaleString() || '0', 
      change: '+0%', 
      trend: 'up', 
      color: 'blue',
      icon: Users
    },
    { 
      title: 'Total Products', 
      value: stats.totalProducts?.toLocaleString() || '0', 
      change: '+0%', 
      trend: 'up', 
      color: 'green',
      icon: Package
    },
    { 
      title: 'Total Categories', 
      value: stats.totalCategories?.toLocaleString() || '0', 
      change: '+0%', 
      trend: 'up', 
      color: 'yellow',
      icon: Tag
    },
    { 
      title: '3D Model Requests', 
      value: stats.total3DRequests?.toLocaleString() || '0', 
      change: '+0%', 
      trend: 'up', 
      color: 'purple',
      icon: MessageCircle
    }
  ];

  const getRequestStatusColor = (handled) => {
    return handled ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {statsCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${
                stat.color === 'blue' ? 'from-blue-500 to-blue-600' : 
                stat.color === 'green' ? 'from-green-500 to-green-600' : 
                stat.color === 'yellow' ? 'from-yellow-500 to-yellow-600' : 
                stat.color === 'purple' ? 'from-purple-500 to-purple-600' : 
                stat.color === 'red' ? 'from-red-500 to-red-600' : 
                'from-indigo-500 to-indigo-600'
              } flex items-center justify-center mb-4`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">{stat.title}</h3>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts and Category Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Products by Category Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Products by Category</h3>
          <div className="h-64 flex items-end space-x-2 justify-center">
            {stats.productsByCategory && stats.productsByCategory.length > 0 ? (
              stats.productsByCategory.map((category, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="w-8 bg-gradient-to-t from-green-500 to-green-400 rounded-t-md"
                    style={{ height: `${(category.amount / Math.max(...stats.productsByCategory.map(c => c.amount))) * 200}px` }}
                  ></div>
                  <span className="text-xs mt-2 text-gray-600">{category.month}</span>
                  <span className="text-xs text-gray-500">{category.amount} products</span>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No category data available
              </div>
            )}
          </div>
        </div>

        {/* Popular Categories */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Popular Categories</h3>
          <div className="space-y-3">
            {stats.popularCategories && stats.popularCategories.length > 0 ? (
              stats.popularCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-md mr-3 flex items-center justify-center">
                      <Tag className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{category.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{category.productCount} products</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No category data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Products, Users and 3D Requests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Recent Users</h3>
            <Link to="/admin/users" className="text-blue-600 hover:text-blue-800 flex items-center text-sm">
              View All <ExternalLink className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.recentUsers && stats.recentUsers.length > 0 ? (
                  stats.recentUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                            <span className="text-sm font-medium text-gray-700">
                              {user.username?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                          {user.username}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 truncate max-w-xs" title={user.email}>{user.email}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-4 py-4 text-center text-gray-500">No users available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent 3D Model Requests */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Recent 3D Requests</h3>
            <Link to="/admin/requests3d" className="text-blue-600 hover:text-blue-800 flex items-center text-sm">
              View All <ExternalLink className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.recentRequests && stats.recentRequests.length > 0 ? (
                  stats.recentRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 truncate max-w-xs" title={request.email}>{request.email}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 truncate max-w-xs" title={request.productName}>{request.productName}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRequestStatusColor(request.handled)}`}>
                          {request.handled ? 'Handled' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-4 py-4 text-center text-gray-500">No requests available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;