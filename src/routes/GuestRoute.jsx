import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "../components/common/Loader";

/**
 * Prevents logged-in users from accessing guest-only pages
 * like login, register, and forgot password.
 */

export default function GuestRoute({ useAuth, redirectTo }) {

    const { isAuthenticated, isLoading, hasChecked, refresh } = useAuth();

    // Check the user's authentication status when the route is first visited.
    useEffect(() => {
        if (!hasChecked) {
            refresh();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        
    }, [hasChecked]);

    // Show a loader while the authentication check is in progress.
    if (!hasChecked || isLoading) {
        return <Loader fullScreen label="Loading…" />;
    }

    // Redirect authenticated users to their dashboard.
    if (isAuthenticated) {
        return <Navigate to={redirectTo} replace />;
    }

    // Render the guest page.
    return <Outlet />;
}