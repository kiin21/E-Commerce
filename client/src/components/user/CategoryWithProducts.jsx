import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Category from "./Category";
import ProductList from "./ProductList";

const CategoryWithProducts = () => {
    const { url_key, id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
    }, [id]);

    return (
        <div className="py-8 px-4 bg-gray-50">
            <div className="flex flex-col space-y-8 max-w-7xl mx-auto">
                {/* Category section */}
                <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-60' : 'opacity-100'}`}>
                    <Category id={id} />
                </div>
                
                {/* Product list section */}
                <div className={`transition-all duration-300 ${isLoading ? 'opacity-60' : 'opacity-100'}`}>
                    <ProductList categoryId={id} />
                </div>
            </div>
        </div>
    );
};

export default CategoryWithProducts;