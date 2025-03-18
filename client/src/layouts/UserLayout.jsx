import { Outlet } from 'react-router-dom';
import Footer  from '../components/user/Footer';
import Header from '../components/user/Header';
import NavigationBar from '../components/user/NavigationBar';

const UserLayout = () => {
    return (
        <div className='min-h-screen bg-sky-200 flex flex-col'>
            <Header />
            <NavigationBar /> 
            <Outlet/>
            <Footer />
        </div>
    );
};

export default UserLayout;