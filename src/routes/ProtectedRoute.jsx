// Shared Module
// Authors: Nishtha & Pinki

import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loader from "../components/common/Loader";

/**
 * Protects private routes by allowing access
 * only to authenticated users.
 */
export default function ProtectedRoute({ useAuth, redirectTo }) {
    const { isAuthenticated, isLoading, hasChecked, refresh } = useAuth();
    const location = useLocation();

    // Check the user's authentication status when the route is first visited.
    useEffect(() => {
        if (!hasChecked) {
            refresh();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasChecked]);

    // Show a loader while the authentication check is in progress.
    if (!hasChecked || isLoading) {
        return <Loader fullScreen label="Checking your session…" />;
    }

    // Redirect unauthenticated users to the login page.
    if (!isAuthenticated) {
        return <Navigate to={redirectTo} replace state={{ from: location }} />;
    }

    // Render the protected page.
    return <Outlet />;
}
