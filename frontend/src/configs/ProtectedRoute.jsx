import React from 'react';
import { Outlet, Navigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { HOME_PATH, LOGIN_PATH } from './constants';

const ProtectedRoute = ({ role }) => {
  const { user, loading } = useAuth();

  // ถ้ายังโหลดข้อมูล user อยู่ ให้รอ (หรือโชว์ spinner)
  if (loading) return <div className="text-center py-10">
    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div></div>;

  // ยังไม่ login
  if (!user) return <Navigate to={LOGIN_PATH} replace />;

  // role ไม่ตรง
  if (role && user.role !== role) return <Navigate to={HOME_PATH} replace />;

  return <Outlet />;
};

export default ProtectedRoute;
