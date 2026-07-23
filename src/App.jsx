import { Routes, Route } from "react-router-dom";

import SellerLayout from "./components/layout/SellerLayout";

import ProtectedRoute from "./routes/ProtectedRoute";
import GuestRoute from "./routes/GuestRoute";

import { useSellerAuth } from "./context/SellerAuthContext";

// Seller Pages
import SellerLogin from "./pages/seller/Login";
import SellerRegister from "./pages/seller/Register";
import SellerForgotPassword from "./pages/seller/ForgotPassword";
import SellerDashboard from "./pages/seller/Dashboard";
import SellerProducts from "./pages/seller/Products";
import AddProduct from "./pages/seller/AddProduct";
import EditProduct from "./pages/seller/EditProduct";
import SellerOrders from "./pages/seller/Orders";
import SellerRevenue from "./pages/seller/Revenue";
import SellerProfile from "./pages/seller/Profile";
import SellerChangePassword from "./pages/seller/ChangePassword";

export default function App() {
    return (
        <Routes>

            {/* ---------- Seller Public Routes ---------- */}
            <Route
                element={
                    <GuestRoute
                        useAuth={useSellerAuth}
                        redirectTo="/seller/dashboard"
                    />
                }
            >
                <Route path="/seller/login" element={<SellerLogin />} />
                <Route path="/seller/register" element={<SellerRegister />} />
                <Route
                    path="/seller/forgot-password"
                    element={<SellerForgotPassword />}
                />
            </Route>

            {/* ---------- Seller Protected Routes ---------- */}
            <Route
                element={
                    <ProtectedRoute
                        useAuth={useSellerAuth}
                        redirectTo="/seller/login"
                    />
                }
            >
                <Route element={<SellerLayout />}>
                    <Route
                        path="/seller/dashboard"
                        element={<SellerDashboard />}
                    />

                    <Route
                        path="/seller/products"
                        element={<SellerProducts />}
                    />

                    <Route
                        path="/seller/products/new"
                        element={<AddProduct />}
                    />

                    <Route
                        path="/seller/products/:productId/edit"
                        element={<EditProduct />}
                    />

                    <Route
                        path="/seller/orders"
                        element={<SellerOrders />}
                    />

                    <Route
                        path="/seller/revenue"
                        element={<SellerRevenue />}
                    />

                    <Route
                        path="/seller/profile"
                        element={<SellerProfile />}
                    />

                    <Route
                        path="/seller/change-password"
                        element={<SellerChangePassword />}
                    />
                </Route>
            </Route>

        </Routes>
    );
}