import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, adminOnly = false }) => {
    const { isLoggedIn, loading, isAdmin, user } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isLoggedIn) {
        // If trying to access admin routes, redirect to admin login
        if (location.pathname.startsWith('/admin')) {
            return <Navigate to="/admin/login" state={{ from: location }} replace />;
        }
        // Redirect to login but save the attempted location
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check Mobile Verification (Exclude verify-mobile and verification pages to avoid loop)
    // Only enforced for regular users, admins/CA usually bypassed or handled differently
    if (user && !user.isMobileVerified && location.pathname !== '/verify-mobile' && location.pathname !== '/verification' && user.role === 'user') {
        return <Navigate to="/verification" replace />;
    }

    // Enforce matching role (admin/ca vs user)
    if (adminOnly) {
        const hasAdminAccess = user?.role === 'admin' || (user?.role === 'ca' && user?.adminStatus === 'approved');
        
        if (!hasAdminAccess) {
            // Check status for smarter redirection if on an admin path
            if (location.pathname.startsWith('/admin')) {
                if (user?.adminStatus === 'pending') {
                    return <Navigate to="/admin/request-status" replace />;
                } else if (user?.adminStatus === 'rejected') {
                    return <Navigate to="/admin/rejected" replace />;
                } else if (location.pathname !== '/admin/request-access') {
                    return <Navigate to="/admin/request-access" replace />;
                }
            }
            // Redirect non-admins to user dashboard if not trying to access admin request flow
            return <Navigate to="/dashboard" replace />;
        }
    }

    return children;
};

export default PrivateRoute;
