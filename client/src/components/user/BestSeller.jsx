import React, { useState } from 'react';
import BestSellerItem from './BestSellerItem';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const BestSeller = ({ title, products }) => {
    const navigate = useNavigate();
    const [swiperInstance, setSwiperInstance] = useState(null);

    // Create custom class names for navigation buttons 
    const sanitizeTitle = title
        ? title.toLowerCase().replace(/ /g, '-')
        : 'best-seller';
    const prevBtnClass = `swiper-button-prev-${sanitizeTitle}`;
    const nextBtnClass = `swiper-button-next-${sanitizeTitle}`;

    const handleProductClick = (product) => {
        navigate(`/product/${product.url_key}`, { state: { product } });
    };

    return (
        <div className="mt-10 max-w-6xl mx-auto p-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                <h2 className="text-red-500 font-medium text-xl mb-2 sm:mb-0">
                    {title}
                </h2>
            </div>

            <div className="px-3 pb-12 relative">
                <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={12}
                    navigation={{
                        nextEl: `.${nextBtnClass}`,
                        prevEl: `.${prevBtnClass}`,
                    }}
                    pagination={{
                        clickable: true,
                        el: '.swiper-pagination',
                        type: 'bullets',
                    }}
                    className="relative"
                    breakpoints={{
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 12,
                        },
                        768: {
                            slidesPerView: 3,
                            spaceBetween: 12,
                        },
                        1024: {
                            slidesPerView: 4,
                            spaceBetween: 12,
                        },
                    }}
                    onSlideChange={(swiper) => {
                        setSwiperInstance(swiper);
                        const prevButton = document.querySelector(
                            `.${prevBtnClass}`
                        );
                        const nextButton = document.querySelector(
                            `.${nextBtnClass}`
                        );

                        if (prevButton && nextButton) {
                            prevButton.style.opacity = '100';
                            nextButton.style.opacity = '100';

                            if (swiper.isBeginning) {
                                prevButton.style.opacity = '0';
                            }

                            if (swiper.isEnd) {
                                nextButton.style.opacity = '0';
                            }
                        }
                    }}
                >
                    {products.map((product) => (
                        <SwiperSlide key={product.id} className="pb-8">
                            <BestSellerItem
                                image={product.image}
                                title={product.name}
                                price={product.price}
                                isTop={product.isTop}
                                onClick={() => handleProductClick(product)}
                            />
                        </SwiperSlide>
                    ))}
                    <div className="swiper-pagination !bottom-0" />
                </Swiper>

                {/* Custom navigation buttons */}
                <div
                    className={`${prevBtnClass} absolute left-0 top-1/2 transform -translate-y-12 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 w-10 h-10 rounded-full flex items-center justify-center shadow-md cursor-pointer transition-all duration-200`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </div>
                <div
                    className={`${nextBtnClass} absolute right-0 top-1/2 transform -translate-y-12 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 w-10 h-10 rounded-full flex items-center justify-center shadow-md cursor-pointer transition-all duration-200`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default BestSeller;
