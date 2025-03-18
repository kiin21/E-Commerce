import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/user/RegisterPage.jsx";
import Login from "./pages/user/LoginPage.jsx";
import Home from "./pages/user/HomePage.jsx";
import UserLayout from "./layouts/UserLayout.jsx";
import AuthLayout from "./layouts/AuthLayout";
import AdminLayout from "./layouts/AdminLayout";
import SellerLayout from "./layouts/SellerLayout.jsx";
import MissingPage from "./pages/MissingPage.jsx";
import RequireAuth from "./hooks/RequireAuth";
import PersistLogin from "./hooks/PersistLogin";
import OTPVerification from "./pages/user/OTPVerificationPage.jsx";
import ForgetPassword from "./pages/user/ForgetPasswordPage.jsx";
import ResetPassword from "./pages/user/ResetPasswordPage.jsx";
import GoogleAuthHandler from './pages/user/GoogleAuthHandlerPage.jsx';
import Search from "./pages/user/SearchPage.jsx";
import CategoryWithProducts from "./components/user/CategoryWithProducts.jsx";
import ProductDetails from "./components/user/ProductDetails.jsx";
import TopDealsPage from "./pages/user/TopDealsPage.jsx";
import FlashSalePage from "./pages/user/FlashSalePage.jsx";
import FeaturedProductPage from "./pages/user/FeaturedProductPage.jsx";
import OrderManagement from "./pages/user/OrderManagement.jsx";
import AccountInfo from "./pages/user/AccountInfo.jsx";

// Admin page components
import AdminDashboard from "./pages/admin/DashboardPage.jsx";
import UserManagement from "./pages/admin/UserManagementPage.jsx";
import UserDetailPage from "./pages/admin/UserDetailPage.jsx";
import UserWithOrderPage from "./pages/admin/UserWithOrderPage.jsx";
import SellerManagement from "./pages/admin/SellerManagementPage.jsx";
import SellerDetailPage from "./pages/admin/SellerDetailPage.jsx";
import SellerProductPage from "./pages/admin/SellerWithProductPage.jsx";
import Cart from "./pages/user/CartPage.jsx";
import PaymentPage from "./pages/user/PaymentPage.jsx";
import PaymentSuccess from "./components/user/PaymentSuccess.jsx";
import PaymentFailure from "./components/user/PaymentFailure.jsx";
import SellerAnalyticsPage from "./pages/admin/SellerAnalyticsPage.jsx";
import SellerEditPage from "./pages/admin/SellerEditPage.jsx";
import ProductManagement from "./pages/admin/ProductManagementPage.jsx";
import ProductDetailPage from "./pages/admin/ProductManagementDetailPage.jsx";
import CategoryManagement from "./pages/admin/CategoryManagementPage.jsx";
import CategoryDetailPage from "./pages/admin/CategoryDetailPage.jsx";
import AddNewCategorylPage from "./pages/admin/AddNewCategoryPage.jsx";

// Seller page components
import SellerDashboard from "./pages/seller/SellerDashboard.jsx";
import SellerProductManagement from "./pages/seller/SellerProductManagement.jsx";
import SellerProductDetail from "./pages/seller/SellerProductDetail.jsx";
import SellerAddProduct from "./pages/seller/SellerAddProduct.jsx";
import SellerVoucher from "./pages/seller/SellerVoucher.jsx";
import SellerEditProduct from "./pages/seller/SellerEditProduct.jsx";
import SellerInfo from "./pages/seller/SellerInfo.jsx";
import SellerOrder from "./pages/seller/SellerOrder.jsx";
import StoreDetail from "./pages/user/StoreDetail.jsx";

const ROLES = {
    User: 'User',
    Seller: 'Seller',
    Admin: 'Admin',
}

const App = () => {
    return (
        <Routes>
            <Route element={<PersistLogin />}>
                {/* USER ROUTE */}
                <Route path="/" element={<UserLayout />}>
                    <Route index element={<Home />} />
                    <Route path="/top-deals" element={<TopDealsPage />} />
                    <Route path="/flash-sale" element={<FlashSalePage />} />
                    <Route path="/featured-products" element={<FeaturedProductPage />} />
                    <Route path="/search/:keyword" element={<Search />} />
                    <Route path="category/:url_key/:id" element={<CategoryWithProducts />} />
                    <Route path="product/:url_key" element={<ProductDetails />} />
                    <Route path="store/:storeId" element={<StoreDetail />} />
                    <Route path="/checkout" element={<Navigate to="/checkout/cart" />} />
                    <Route path="/checkout/cart" element={<Cart />} />
                    <Route path="account/info" element={<AccountInfo />} />
                </Route>

                {/* USER ROUTE RequireAuth */}
                <Route element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Admin]} />}>
                    <Route path="/" element={<UserLayout />}>
                        <Route path="/checkout/payment" element={<PaymentPage />} />
                        <Route path="/order-management" element={<OrderManagement />} />
                    </Route>
                    <Route path="/checkout/success" element={<PaymentSuccess />} />
                    <Route path="/checkout/failure" element={<PaymentFailure />} />
                </Route>

                {/* ADMIN ROUTES */}
                <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        {/* Redirect to /admin/dashboards */}
                        <Route index element={<Navigate to="/admin/dashboards" replace />} />
                        {/* Admin Dashboards */}
                        <Route path="dashboards" element={<AdminDashboard />} />
                        {/* User Management */}
                        <Route path="user-management" >
                            <Route index element={<UserManagement />} />
                            <Route path=":id" element={<UserDetailPage />} />
                            <Route path=":id/products" element={<UserWithOrderPage />} />
                        </Route>
                        {/* Seller Management */}
                        <Route path="seller-management">
                            <Route index element={<SellerManagement />} />
                            <Route path=":id" element={<SellerDetailPage />} />
                            <Route path=":id/products" element={<SellerProductPage />} />
                            <Route path=":id/edit" element={<SellerEditPage />} />
                            <Route path=":id/analytics" element={<SellerAnalyticsPage />} />
                        </Route>
                        {/* Product Management */}
                        <Route path="product-management" >
                            <Route index element={<ProductManagement />} />
                            <Route path=":id" element={<ProductDetailPage />} />
                        </Route>
                        {/* Category Management */}
                        <Route path="category-management" >
                            <Route index element={<CategoryManagement />} />
                            <Route path=":id" element={<CategoryDetailPage />} />
                            <Route path="add" element={<AddNewCategorylPage />} />
                        </Route>
                    </Route>
                </Route>

                {/* SELLER ROUTE */}
                <Route element={<RequireAuth allowedRoles={[ROLES.Seller]} />}>
                    <Route path="/seller" element={<SellerLayout />}>
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route index path="dashboard" element={<SellerDashboard />} />
                        <Route path="product-management">
                            <Route index element={<SellerProductManagement />} />
                            <Route path="detail/:productId" element={<SellerProductDetail />} />
                            <Route path="add" element={<SellerAddProduct />} />
                            <Route path="edit/:productId" element={<SellerEditProduct />} />
                        </Route>
                        <Route path="order" element={<SellerOrder />} />
                        <Route path="voucher" element={<SellerVoucher />} />
                        <Route path="info" element={<SellerInfo />} />
                    </Route>
                </Route>
            </Route>

            {/* AUTH ROUTES */}
            <Route path="/auth" element={<AuthLayout />}>
                <Route index element={<Navigate to="/auth/login" replace />} />
                <Route path="login" element={<Login />} state={{ title: "Login" }} />
                <Route path="register" element={<Register />} state={{ title: "Register" }} />
            </Route>
            <Route path="/auth/forget-password" element={<ForgetPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/auth/register/verify-otp" element={<OTPVerification />} />
            <Route path="/auth/google/callback" element={<GoogleAuthHandler />} />

            {/* ERROR PAGES */}
            <Route path="unauthorized" element={<MissingPage />} /> {/* 403 Page */}

            <Route path="*" element={<MissingPage />} /> {/* 404 Page */}
        </Routes>
    );
};

export default App;