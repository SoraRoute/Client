import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loader from "../components/common/Loader";

/**
 * Guards a portal's private routes.
 *
 * @param {() => object} useAuth - one of useCustomerAuth / useSellerAuth / useAdminAuth
 * @param {string} redirectTo - login route to bounce unauthenticated users to
 */
export default function ProtectedRoute({ useAuth, redirectTo }) {
  const { isAuthenticated, isLoading, hasChecked, refresh } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!hasChecked) {
      refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasChecked]);

  if (!hasChecked || isLoading) {
    return <Loader fullScreen label="Checking your session…" />;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return <Outlet />;
}
