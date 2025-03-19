import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { Spin, Alert } from 'antd';
import { useSelector } from "react-redux";
import useRefreshToken from "./useRefreshToken";
import { selectAuth } from "../redux/reducers/user/authReducer";

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useSelector(selectAuth);
    const refreshToken = useRefreshToken();

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refreshToken();
            } catch (err) {
                console.error('Error refreshing token:', err);
            } finally {
                setIsLoading(false);  // Only set to false after attempting refresh
            }
        };
        if (!user?.accessToken) {
            verifyRefreshToken();
        } else {
            setIsLoading(false);  // Token is already available
        }
    }, []);


    return isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Spin tip="Loading..." size="large">
                <Alert
                    message="Loading"
                    description="Verifying your session, please wait."
                    type="info"
                    showIcon
                />
            </Spin>
        </div>
    ) : (
        <Outlet />
    );
};

export default PersistLogin;