import { Routes, Route } from "react-router-dom";

import CustomerLayout from "./components/layout/CustomerLayout";

import ProtectedRoute from "./routes/ProtectedRoute";
import GuestRoute from "./routes/GuestRoute";

import { useCustomerAuth } from "./context/CustomerAuthContext";

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

export default function App() {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Shop />} />
        <Route path="/products/:productId" element={<ProductDetail />} />
        <Route path="/categories" element={<Categories />} />
        <Route
          path="/categories/:categoryId"
          element={<CategoryProducts />}
        />
        <Route path="/search" element={<Search />} />

        {/* Guest Routes */}
        <Route
          element={
            <GuestRoute
              useAuth={useCustomerAuth}
              redirectTo="/"
            />
          }
        >
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />
        </Route>

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute
              useAuth={useCustomerAuth}
              redirectTo="/login"
            />
          }
        >
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/orders" element={<Orders />} />
          <Route
            path="/orders/:orderId"
            element={<OrderDetail />}
          />
          <Route
            path="/account/profile"
            element={<Profile />}
          />
          <Route
            path="/account/addresses"
            element={<Addresses />}
          />
          <Route
            path="/account/change-password"
            element={<ComingSoon title="Change Password" />}
          />
        </Route>
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}