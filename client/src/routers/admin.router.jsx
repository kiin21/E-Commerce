import { Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout.jsx";
import RequireAuth from "../hooks/RequireAuth.jsx";
import AdminDashboard from "../pages/admin/DashboardPage.jsx";
import UserManagement from "../pages/admin/UserManagementPage.jsx";
import UserDetailPage from "../pages/admin/UserDetailPage.jsx";
import UserWithOrderPage from "../pages/admin/UserWithOrderPage.jsx";
import SellerManagement from "../pages/admin/SellerManagementPage.jsx";
import SellerDetailPage from "../pages/admin/SellerDetailPage.jsx";
import SellerProductPage from "../pages/admin/SellerWithProductPage.jsx";
import SellerAnalyticsPage from "../pages/admin/SellerAnalyticsPage.jsx";
import SellerEditPage from "../pages/admin/SellerEditPage.jsx";
import ProductManagement from "../pages/admin/ProductManagementPage.jsx";
import ProductDetailPage from "../pages/admin/ProductManagementDetailPage.jsx";
import CategoryManagement from "../pages/admin/CategoryManagementPage.jsx";
import CategoryDetailPage from "../pages/admin/CategoryDetailPage.jsx";
import AddNewCategorylPage from "../pages/admin/AddNewCategoryPage.jsx";

const ROLES = {
    User: 'User',
    Seller: 'Seller',
    Admin: 'Admin',
};

const AdminRoutes = [
    <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />} key="admin-routes">
        <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboards" replace />} />
            <Route path="dashboards" element={<AdminDashboard />} />
            <Route path="user-management" >
                <Route index element={<UserManagement />} />
                <Route path=":id" element={<UserDetailPage />} />
                <Route path=":id/products" element={<UserWithOrderPage />} />
            </Route>
            <Route path="seller-management">
                <Route index element={<SellerManagement />} />
                <Route path=":id" element={<SellerDetailPage />} />
                <Route path=":id/products" element={<SellerProductPage />} />
                <Route path=":id/edit" element={<SellerEditPage />} />
                <Route path=":id/analytics" element={<SellerAnalyticsPage />} />
            </Route>
            <Route path="product-management" >
                <Route index element={<ProductManagement />} />
                <Route path=":id" element={<ProductDetailPage />} />
            </Route>
            <Route path="category-management" >
                <Route index element={<CategoryManagement />} />
                <Route path=":id" element={<CategoryDetailPage />} />
                <Route path="add" element={<AddNewCategorylPage />} />
            </Route>
        </Route>
    </Route>
];

export default AdminRoutes;