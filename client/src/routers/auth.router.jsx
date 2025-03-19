import { Route, Navigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout.jsx";
import Login from "../pages/user/LoginPage.jsx";
import Register from "../pages/user/RegisterPage.jsx";
import ForgetPassword from "../pages/user/ForgetPasswordPage.jsx";
import ResetPassword from "../pages/user/ResetPasswordPage.jsx";
import OTPVerification from "../pages/user/OTPVerificationPage.jsx";
import GoogleAuthHandler from '../pages/user/GoogleAuthHandlerPage.jsx';

const AuthRoutes = [
    <Route path="/auth" element={<AuthLayout />} key="auth-layout">
        <Route index element={<Navigate to="/auth/login" replace />} />
        <Route path="login" element={<Login />} state={{ title: "Login" }} />
        <Route path="register" element={<Register />} state={{ title: "Register" }} />
    </Route>,
    <Route path="/auth/forget-password" element={<ForgetPassword />} key="forget-password" />,
    <Route path="/auth/reset-password" element={<ResetPassword />} key="reset-password" />,
    <Route path="/auth/register/verify-otp" element={<OTPVerification />} key="verify-otp" />,
    <Route path="/auth/google/callback" element={<GoogleAuthHandler />} key="google-callback" />
];

export default AuthRoutes;