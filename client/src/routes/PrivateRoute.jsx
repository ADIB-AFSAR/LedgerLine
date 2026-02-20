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
        // Redirect to login but save the attempted location
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check Mobile Verification (Exclude verify-mobile and verification pages to avoid loop)
    if (user && !user.isMobileVerified && location.pathname !== '/verify-mobile' && location.pathname !== '/verification' && !isAdmin) {
        return <Navigate to="/verification" replace />;
    }

    // Enforce matching role (admin vs user)
    if (adminOnly && !isAdmin) {
        // Redirect non-admins to user dashboard
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default PrivateRoute;
