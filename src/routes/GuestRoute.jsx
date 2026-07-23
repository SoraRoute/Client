import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "../components/common/Loader";

/**
 * Wraps a portal's public auth pages (login/register/forgot-password) and
 * redirects an already-authenticated user away from them.
 *
 * @param {() => object} useAuth - one of useCustomerAuth / useSellerAuth / useAdminAuth
 * @param {string} redirectTo - where a logged-in user should land instead
 */
export default function GuestRoute({ useAuth, redirectTo }) {
  const { isAuthenticated, isLoading, hasChecked, refresh } = useAuth();

  useEffect(() => {
    if (!hasChecked) {
      refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasChecked]);

  if (!hasChecked || isLoading) {
    return <Loader fullScreen label="Loading…" />;
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
