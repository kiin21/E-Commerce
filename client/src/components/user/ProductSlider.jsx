import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import { useState } from 'react';


const ProductSlider = ({ title, products, url, isTopDeal, isFlashSale, clickable = true, chunkedSize = 5 }) => {
    const navigate = useNavigate();
    const sanitizeTitle = title.toLowerCase().replace(/ /g, '-');
    const prevBtnClass = `swiper-button-prev-${sanitizeTitle}`;
    const nextBtnClass = `swiper-button-next-${sanitizeTitle}`;
    const [swiperInstance, setSwiperInstance] = useState(null);

    if (!products || products.length === 0) {
        return null;
    }

    const handleProductClick = (product) => {
        navigate(`/product/${product.url_key}`, { state: { product } });
    };

    // Chunk the products into groups based on chunkedSize
    const chunkedProducts = [];
    for (let i = 0; i < products.length; i += chunkedSize) {
        chunkedProducts.push(products.slice(i, i + chunkedSize));
    }

    // If no products exist after chunking, don't render the slider
    if (chunkedProducts.length === 0) {
        return null;
    }

    return (
        <div className="mt-10 max-w-6xl mx-auto p-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg overflow-hidden">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
                {clickable ? (
                    <Link
                        to={url}
                        className="text-sm text-white hover:text-yellow-200 hover:underline transition-colors duration-200 font-medium"
                    >
                        Xem tất cả
                    </Link>
                ) : (
                    <span className="text-sm text-gray-300 cursor-not-allowed"></span>
                )}
            </div>

            <div className="relative">
                <Swiper
                    modules={[Navigation]}
                    navigation={{
                        nextEl: `.${nextBtnClass}`,
                        prevEl: `.${prevBtnClass}`,
                    }}
                    spaceBetween={20}
                    slidesPerView={1}
                    className="pb-10"
                    onSlideChange={(swiper) => {
                        setSwiperInstance(swiper);
                        const prevButton = document.querySelector(`.${prevBtnClass}`);
                        const nextButton = document.querySelector(`.${nextBtnClass}`);

                        prevButton.style.opacity = '100';
                        nextButton.style.opacity = '100';

                        if (swiper.realIndex === 0) {
                            prevButton.style.opacity = '0';
                        }

                        if (swiper.realIndex === chunkedProducts.length - 1) {
                            nextButton.style.opacity = '0';
                        }
                    }}
                >
                    {chunkedProducts.map((productGroup, index) => (
                        <SwiperSlide key={index}>
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {productGroup.map((product) => (
                                    <div
                                        key={product.id}
                                        onClick={() => handleProductClick(product)}
                                        className="w-full h-full"
                                    >
                                        <ProductCard
                                            image={product.thumbnail_url || product.name}
                                            name={product.name.length > 50 ? product.name.slice(0, 50) + '...' : product.name}
                                            price={product.price}
                                            originalPrice={product.original_price}
                                            discountRate={product.discount_rate}
                                            quantitySold={product.quantity_sold}
                                            ratingAverage={product.rating_average}
                                            isTopDeal={isTopDeal}
                                            isFlashSale={isFlashSale}
                                        />
                                    </div>
                                ))}
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Custom navigation buttons with unique class names */}
                <div className={`${prevBtnClass} absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 w-10 h-10 rounded-full flex items-center justify-center shadow-md cursor-pointer transition-all duration-200`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </div>
                <div className={`${nextBtnClass} absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 w-10 h-10 rounded-full flex items-center justify-center shadow-md cursor-pointer transition-all duration-200`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default ProductSlider;
