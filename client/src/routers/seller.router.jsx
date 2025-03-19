import { Route, Navigate } from "react-router-dom";
import SellerLayout from "../layouts/SellerLayout.jsx";
import RequireAuth from "../hooks/RequireAuth.jsx";
import SellerDashboard from "../pages/seller/SellerDashboard.jsx";
import SellerProductManagement from "../pages/seller/SellerProductManagement.jsx";
import SellerProductDetail from "../pages/seller/SellerProductDetail.jsx";
import SellerAddProduct from "../pages/seller/SellerAddProduct.jsx";
import SellerVoucher from "../pages/seller/SellerVoucher.jsx";
import SellerEditProduct from "../pages/seller/SellerEditProduct.jsx";
import SellerInfo from "../pages/seller/SellerInfo.jsx";
import SellerOrder from "../pages/seller/SellerOrder.jsx";

const ROLES = {
    User: 'User',
    Seller: 'Seller',
    Admin: 'Admin',
};

const SellerRoutes = [
    <Route element={<RequireAuth allowedRoles={[ROLES.Seller]} />} key="seller-routes">
        <Route path="/seller" element={<SellerLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<SellerDashboard />} />
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
];

export default SellerRoutes;