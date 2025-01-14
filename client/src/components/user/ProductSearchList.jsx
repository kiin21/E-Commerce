import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { Radio, Pagination, Spin } from 'antd';
import { StarFilled } from '@ant-design/icons';
import { getSearchResults } from "../../redux/services/user/searchService";
import ProductCard from './ProductCard';

function ProductSearchList() {
    const { keyword } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [results, setResults] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState(null);
    const [sort, setSort] = useState('default');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(20);
    const [ratingRange, setRatingRange] = useState('all');

    const sortOptions = [
        { label: 'Liên quan', value: 'most_relevant' },
        { label: 'Phổ biến', value: 'default' },
        { label: 'Mới Nhất', value: 'newest' },
        { label: 'Bán Chạy', value: 'top_seller' },
        { label: 'Giá cao đến thấp', value: 'price,desc' },
        { label: 'Giá thấp đến cao', value: 'price,asc' },
    ];

    const ratingOptions = [
        { label: 'Tất cả', value: 'all' },
        { label: '4 - 5 sao', value: '4-5' },
        { label: '3 - 4 sao', value: '3-4' },
        { label: '2 - 3 sao', value: '2-3' },
        { label: '1 - 2 sao', value: '1-2' },
    ];

    useEffect(() => {
        setCurrentPage(1);
        setTotalPages(1);
        setRatingRange('all');
    }, [keyword]);

    useEffect(() => {
        const fetchResults = async () => {
            setStatus('loading');
            try {
                const [minRating, maxRating] = ratingRange !== 'all'
                    ? ratingRange.split('-').map(Number)
                    : [0, 5];

                const response = await getSearchResults({
                    keyword,
                    limit,
                    page: currentPage,
                    sort,
                    minRating,
                    maxRating,
                });

                const { data, paging } = response;
                setResults(data);
                setTotalPages(paging.total_pages);
                setStatus('succeeded');
            } catch (err) {
                setError(err?.response?.data?.message || 'An error occurred');
                setStatus('failed');
            }
        };

        if (keyword) {
            fetchResults();
        }
    }, [keyword, currentPage, sort, limit, ratingRange]);

    const handleSortChange = (e) => {
        setSort(e.target.value);
        setCurrentPage(1);
    };

    const handleRatingChange = (e) => {
        setRatingRange(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleProductClick = (product) => {
        navigate(`/product/${product.url_key}`, { state: { product } });
    };

    const renderStarRange = (range) => {
        if (range === 'all') return null;

        const [min, max] = range.split('-');
        return (
            <span className="flex items-center">
                {[...Array(5)].map((_, index) => (
                    <StarFilled
                        key={index}
                        className={`text-sm ${index >= min - 1 && index < max
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                    />
                ))}
            </span>
        );
    };

    return (
        <div className="flex-1">
            <div className="mb-4">
                <h2 className="text-lg font-semibold">
                    Kết quả tìm kiếm cho từ khóa: <span className="text-blue-500">{keyword}</span>
                </h2>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm mb-4 space-y-4">
                {/* Sort Section */}
                <div className="flex items-center gap-4">
                    <span className="min-w-24">Sắp xếp theo</span>
                    <Radio.Group value={sort} onChange={handleSortChange} buttonStyle="solid">
                        {sortOptions.map(option => (
                            <Radio.Button key={option.value} value={option.value}>
                                {option.label}
                            </Radio.Button>
                        ))}
                    </Radio.Group>
                </div>

                {/* Rating Filter Section */}
                <div className="flex items-center gap-4">
                    <span className="min-w-24">Đánh giá</span>
                    <Radio.Group value={ratingRange} onChange={handleRatingChange} buttonStyle="solid">
                        {ratingOptions.map(option => (
                            <Radio.Button key={option.value} value={option.value} className="flex items-center">
                                {option.value === 'all' ? option.label : renderStarRange(option.value)}
                            </Radio.Button>
                        ))}
                    </Radio.Group>
                </div>
            </div>

            {status === 'succeeded' && totalPages > 0 && (
                <div className="flex justify-end mt-4">
                    <Pagination
                        simple
                        current={currentPage}
                        total={totalPages * limit}
                        pageSize={limit}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                    />
                </div>
            )}

            {status === 'loading' && (
                <div className="flex justify-center mt-6">
                    <Spin size="large" />
                </div>
            )}

            {status === 'failed' && (
                <div className="bg-red-100 text-red-600 p-4 rounded-lg mb-4">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {status === 'succeeded' && results.length === 0 && (
                    <div className="col-span-4 text-center text-gray-500">
                        Không có sản phẩm nào.
                    </div>
                )}

                {status === 'succeeded' && results.map((product) => (
                    <div
                        key={product.id}
                        onClick={() => handleProductClick(product)}
                        className="cursor-pointer"
                    >
                        <ProductCard
                            key={product.id}
                            image={product.thumbnail_url}
                            name={product.name}
                            price={product.price}
                            originalPrice={product.original_price}
                            discountRate={product.discount_rate}
                            quantitySold={product.quantity_sold}
                            ratingAverage={product.rating_average}
                            isTopDeal={false}
                            isFlashSale={false}
                        />
                    </div>
                ))}
            </div>

            {status === 'succeeded' && totalPages > 0 && (
                <div className="flex justify-center mt-4">
                    <Pagination
                        current={currentPage}
                        total={totalPages * limit}
                        pageSize={limit}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                    />
                </div>
            )}
        </div>
    );
}

export default ProductSearchList;