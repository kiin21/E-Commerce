import React from "react";
import BestSellerItem from "./BestSellerItem";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const BestSeller = ({ title, products }) => {
  const navigate = useNavigate();

  const handleProductClick = (product) => {
    navigate(`/product/${product.url_key}`, { state: { product } });
  };

  return (
    <div className="mt-10 max-w-7xl mx-auto p-4 bg-white bg-opacity-80 rounded-md">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h2 className="text-red-500 font-medium text-xl mb-2 sm:mb-0">{title}</h2>
      </div>

      <div className="px-3 pb-12">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={12}
          navigation
          pagination={{
            clickable: true,
            el: ".swiper-pagination",
            type: "bullets",
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
      </div>
    </div>
  );
};

export default BestSeller;
