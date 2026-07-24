import { Routes, Route } from "react-router-dom";

import CustomerLayout from "./components/layout/CustomerLayout";
import SellerLayout from "./components/layout/SellerLayout";
import AdminLayout from "./components/layout/AdminLayout";

import ProtectedRoute from "./routes/ProtectedRoute";
import GuestRoute from "./routes/GuestRoute";

import { useCustomerAuth } from "./context/CustomerAuthContext";
import { useSellerAuth } from "./context/SellerAuthContext";
import { useAdminAuth } from "./context/AdminAuthContext";

import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import ComingSoon from "./pages/ComingSoon";

import Home from "./pages/customer/Home";
import Shop from "./pages/customer/Shop";
import ProductDetail from "./pages/customer/ProductDetail";
import Categories from "./pages/customer/Categories";
import CategoryProducts from "./pages/customer/CategoryProducts";
import Search from "./pages/customer/Search";
import Login from "./pages/customer/Login";
import Register from "./pages/customer/Register";
import ForgotPassword from "./pages/customer/ForgotPassword";
import Cart from "./pages/customer/Cart";
import Checkout from "./pages/customer/Checkout";
import Wishlist from "./pages/customer/Wishlist";
import Orders from "./pages/customer/Orders";
import OrderDetail from "./pages/customer/OrderDetail";
import Profile from "./pages/customer/Profile";
import Addresses from "./pages/customer/Addresses";

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

import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminSellers from "./pages/admin/Sellers";
import AdminSellerDetail from "./pages/admin/SellerDetail";
import AdminProducts from "./pages/admin/Products";
import AdminProductDetail from "./pages/admin/ProductDetail";
import AdminCategories from "./pages/admin/Categories";
import AdminOrders from "./pages/admin/Orders";
import AdminOrderDetail from "./pages/admin/OrderDetail";
import AdminProfile from "./pages/admin/Profile";
import AdminChangePassword from "./pages/admin/ChangePassword";

export default function App() {
    return (
        <Routes>
            {/* ---------------- Customer portal ---------------- */}
            <Route element={<CustomerLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Shop />} />
                <Route path="/products/:productId" element={<ProductDetail />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/categories/:categoryId" element={<CategoryProducts />} />
                <Route path="/search" element={<Search />} />

                <Route element={<GuestRoute useAuth={useCustomerAuth} redirectTo="/" />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                </Route>

                <Route element={<ProtectedRoute useAuth={useCustomerAuth} redirectTo="/login" />}>
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/orders/:orderId" element={<OrderDetail />} />
                    <Route path="/account/profile" element={<Profile />} />
                    <Route path="/account/addresses" element={<Addresses />} />
                    <Route path="/account/change-password" element={<ComingSoon title="Change password" />} />
                </Route>
            </Route>

            {/* ---------------- Seller portal ---------------- */}
            <Route element={<GuestRoute useAuth={useSellerAuth} redirectTo="/seller/dashboard" />}>
                <Route path="/seller/login" element={<SellerLogin />} />
                <Route path="/seller/register" element={<SellerRegister />} />
                <Route path="/seller/forgot-password" element={<SellerForgotPassword />} />
            </Route>

            <Route element={<ProtectedRoute useAuth={useSellerAuth} redirectTo="/seller/login" />}>
                <Route element={<SellerLayout />}>
                    <Route path="/seller/dashboard" element={<SellerDashboard />} />
                    <Route path="/seller/products" element={<SellerProducts />} />
                    <Route path="/seller/products/new" element={<AddProduct />} />
                    <Route path="/seller/products/:productId/edit" element={<EditProduct />} />
                    <Route path="/seller/orders" element={<SellerOrders />} />
                    <Route path="/seller/revenue" element={<SellerRevenue />} />
                    <Route path="/seller/profile" element={<SellerProfile />} />
                    <Route path="/seller/change-password" element={<SellerChangePassword />} />
                </Route>
            </Route>

            {/* ---------------- Admin portal ---------------- */}
            <Route element={<GuestRoute useAuth={useAdminAuth} redirectTo="/admin/dashboard" />}>
                <Route path="/admin/login" element={<AdminLogin />} />
            </Route>

            <Route element={<ProtectedRoute useAuth={useAdminAuth} redirectTo="/admin/login" />}>
                <Route element={<AdminLayout />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/sellers" element={<AdminSellers />} />
                    <Route path="/admin/sellers/:sellerId" element={<AdminSellerDetail />} />
                    <Route path="/admin/products" element={<AdminProducts />} />
                    <Route path="/admin/products/:productId" element={<AdminProductDetail />} />
                    <Route path="/admin/categories" element={<AdminCategories />} />
                    <Route path="/admin/orders" element={<AdminOrders />} />
                    <Route path="/admin/orders/:orderId" element={<AdminOrderDetail />} />
                    <Route path="/admin/profile" element={<AdminProfile />} />
                    <Route path="/admin/change-password" element={<AdminChangePassword />} />
                </Route>
            </Route>

            {/* ---------------- Fallbacks ---------------- */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
