import { Route } from "react-router-dom";
import MissingPage from "../pages/MissingPage.jsx";
import PersistLogin from "../hooks/PersistLogin.jsx";
import userRoutes from './user.router.jsx';
import adminRoutes from './admin.router.jsx';
import sellerRoutes from './seller.router.jsx';
import authRoutes from './auth.router.jsx';

export const ROLES = {
    User: 'User',
    Seller: 'Seller',
    Admin: 'Admin',
};

const routes = [
    <Route element={<PersistLogin />} key="persist-login">
        {userRoutes}
        {adminRoutes}
        {sellerRoutes}
    </Route>,
    
    ...authRoutes,
    
    <Route path="unauthorized" element={<MissingPage />} key="unauthorized" />,
    <Route path="*" element={<MissingPage />} key="404" />
];

export default routes;