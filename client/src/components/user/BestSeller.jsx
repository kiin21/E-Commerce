import React from "react";
import BestSellerItem from "./BestSellerItem";
import { RightOutlined } from "@ant-design/icons";

const BestSeller = ({ title, products }) => {
  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h2 className="text-red-500 font-medium text-xl mb-2 sm:mb-0">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 relative">
        {products.map((product) => (
          <BestSellerItem
            key={product.id}
            image={product.image}
            title={product.name}
            price={product.price}
            isTop={product.isTop}
          />
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
