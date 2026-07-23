import { CustomerAuthProvider } from "./CustomerAuthContext";
import { SellerAuthProvider } from "./SellerAuthContext";
import { AdminAuthProvider } from "./AdminAuthContext";

// Wraps the app in every portal's auth context. Nesting order doesn't
// matter since each context is independent, but keeping Customer outermost
// mirrors it being the primary/default experience.
export default function AppProviders({ children }) {
  return (
    <CustomerAuthProvider>
      <SellerAuthProvider>
        <AdminAuthProvider>{children}</AdminAuthProvider>
      </SellerAuthProvider>
    </CustomerAuthProvider>
  );
}
