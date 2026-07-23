import { Routes, Route } from "react-router-dom";

import CustomerLayout from "./components/layout/CustomerLayout";

import ProtectedRoute from "./routes/ProtectedRoute";
import GuestRoute from "./routes/GuestRoute";

import { useCustomerAuth } from "./context/CustomerAuthContext";

export default function App() {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        {/* Customer pages will be added in later commits */}

        <Route
          element={
            <GuestRoute
              useAuth={useCustomerAuth}
              redirectTo="/"
            />
          }
        >
          {/* Login/Register routes will be added in Commit 4 */}
        </Route>

        <Route
          element={
            <ProtectedRoute
              useAuth={useCustomerAuth}
              redirectTo="/login"
            />
          }
        >
          {/* Protected routes will be added later */}
        </Route>
      </Route>
    </Routes>
  );
}