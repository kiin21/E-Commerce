import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { getProductsOfStore } from '../../services/seller/productApi';

const SellerProductManagement = () => {
  const axiosPrivate = useAxiosPrivate();
  const products = getProductsOfStore(
    axiosPrivate,
  );
  
};

export default SellerProductManagement;
