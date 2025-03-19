import { Suspense, lazy, useState, useEffect } from 'react';
import BestSeller from "../../components/user/BestSeller";
import ProductSlider from '../../components/user/ProductSlider';
import { getTopDealsv2, getFlashSalev2, getFeaturedProducts, getBestSellerProduct } from '../../service/productApi';
import { Spin } from 'antd';
// Lazy-load Category component
const Category = lazy(() => import("../../components/user/Category"));

const Home = () => {
    const [topDeals, setTopDeals] = useState([]);
    const [flashSale, setFlashSale] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [bestSellerProds, setbestSellerProds] = useState([]);

    useEffect(() => {

        const fetchTopDeals = async () => {
            const data = await getTopDealsv2();
            setTopDeals(data.data);
        };

        const fetchFlashSale = async () => {
            const data = await getFlashSalev2();
            setFlashSale(data.data);
        };

        const fetchFeaturedProducts = async () => {
            const data = await getFeaturedProducts();
            setFeaturedProducts(data.data);
        };

        const fetchBestSellerProduct = async () => {
            const data = await getBestSellerProduct({ limit: 10 });
            setbestSellerProds(data.data);
        };

        fetchTopDeals();
        fetchFlashSale();
        fetchFeaturedProducts();
        fetchBestSellerProduct();
    }, []);

    return (
        <div className="flex flex-wrap flex-col items-center mx-auto max-w-6xl">
            {/* Suspense will show fallback UI until Category is loaded */}
            <Suspense fallback={<Spin />}>
            <div className="mt-10">
                <Category />
            </div>
            </Suspense>
            {/* TOP DEAL */}
            <ProductSlider
                title="Top Deal"
                products={topDeals}
                url="/top-deals"
                isTopDeal={true}
                isFlashSale={false}
            />
            {/* FLASH SALE */}
            {<ProductSlider
                title="Flash Sale"
                products={flashSale}
                url="/flash-sale"
                isTopDeal={false}
                isFlashSale={true}
            />}

            {/* OTHERS */}
            {<ProductSlider
                title="Sản phẩm tiêu biểu"
                products={featuredProducts}
                url="/featured-products"
                isTopDeal={false}
                isFlashSale={true}
                chunkedSize={10}
            />}

            <BestSeller
                title= "Sản phẩm bán chạy"
                products={bestSellerProds}
            />
        </div>
    );
};

export default Home;
