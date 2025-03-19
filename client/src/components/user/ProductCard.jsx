import { StarFilled } from '@ant-design/icons';

const ProductCard = ({ image, name, price, originalPrice, discountRate, quantitySold, ratingAverage, isTopDeal, isFlashSale }) => {
    return (
        <div className="relative group cursor-pointer w-full h-full">
            {/* Deal Badge */}
            {(isTopDeal || isFlashSale) && (
                <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-md z-10">
                    {isTopDeal ? 'TOP DEAL' : discountRate + '% OFF'}
                </div>
            )}

            {/* Card Container with fixed width and height */}
            <div className="bg-white p-4 rounded-lg hover:shadow-lg transition-shadow h-full flex flex-col">
                {/* Larger Image Container with larger aspect ratio */}
                <div className="relative aspect-square w-full mb-3 overflow-hidden">
                    <img
                        src={image || 'https://via.placeholder.com/150'}
                        alt={name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                </div>

                {/* Product Name */}
                <h3 className="text-sm text-gray-800 font-medium mb-2 line-clamp-2 min-h-12">
                    {name}
                </h3>

                {/* Price and Discount */}
                <div className="flex items-center gap-2 mb-2 min-h-6">
                    {discountRate > 0 && (
                        <>
                            <span className="text-xs text-gray-500 font-semibold bg-slate-200 p-1 mr-2">
                                -{discountRate}%
                            </span>

                            <span className="text-xs text-gray-500 line-through">
                                {parseInt(originalPrice).toLocaleString('vi-VN')}đ
                            </span>
                        </>
                    )}
                </div>

                {/* Current Price */}
                <p className="text-red-500 font-semibold">
                    {parseInt(price).toLocaleString('vi-VN')}đ
                </p>

                {/* Rating and Sales - pushed to bottom with mt-auto */}
                <div className="mt-auto pt-2 flex items-center gap-1">
                    <div className="flex items-center gap-1">
                        <StarFilled style={{ color: '#fadb14' }} />
                        <span className="text-xs">{ratingAverage}</span>
                    </div>
                    <span className="text-xs text-gray-500 ml-auto">{quantitySold} đã bán</span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;