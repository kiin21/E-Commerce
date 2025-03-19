import { Route, Navigate } from "react-router-dom";
import UserLayout from "../layouts/UserLayout.jsx";
import Home from "../pages/user/HomePage.jsx";
import Search from "../pages/user/SearchPage.jsx";
import CategoryWithProducts from "../components/user/CategoryWithProducts.jsx";
import ProductDetails from "../components/user/ProductDetails.jsx";
import TopDealsPage from "../pages/user/TopDealsPage.jsx";
import FlashSalePage from "../pages/user/FlashSalePage.jsx";
import FeaturedProductPage from "../pages/user/FeaturedProductPage.jsx";
import AccountInfo from "../pages/user/AccountInfo.jsx";
import Cart from "../pages/user/CartPage.jsx";
import StoreDetail from "../pages/user/StoreDetail.jsx";
import RequireAuth from "../hooks/RequireAuth.jsx";
import PaymentPage from "../pages/user/PaymentPage.jsx";
import OrderManagement from "../pages/user/OrderManagement.jsx";
import PaymentSuccess from "../components/user/PaymentSuccess.jsx";
import PaymentFailure from "../components/user/PaymentFailure.jsx";

const ROLES = {
    User: 'User',
    Seller: 'Seller',
    Admin: 'Admin',
};

const UserRoutes = [
    <Route path="/" element={<UserLayout />} key="user-layout">
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
    </Route>,

    <Route element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Admin]} />} key="user-auth">
        <Route path="/" element={<UserLayout />}>
            <Route path="/checkout/payment" element={<PaymentPage />} />
            <Route path="/order-management" element={<OrderManagement />} />
        </Route>
        <Route path="/checkout/success" element={<PaymentSuccess />} />
        <Route path="/checkout/failure" element={<PaymentFailure />} />
    </Route>
];

export default UserRoutes;