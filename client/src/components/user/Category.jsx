import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CategoryItem from './CategoryItem';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChildrenCategories } from '../../redux/actions/user/categoryAction';
import { selectCategory, clearError } from '../../redux/reducers/user/categoryReducer';
import { Spin } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Category = ({ id }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { childrenCategories, status, error } = useSelector(selectCategory);
    const [isNewCategoryLoaded, setIsNewCategoryLoaded] = useState(false);
    const [isCategoryVisible, setIsCategoryVisible] = useState(false);

    let pId = 0;

    if (id) {
        pId = parseInt(id.replace('c', ''), 10);
    }

    useEffect(() => {
        setIsNewCategoryLoaded(false);
        setIsCategoryVisible(false);
        dispatch(fetchChildrenCategories({ parentId: pId }));
    }, [dispatch, id]);

    useEffect(() => {
        if (status === 'succeeded') {
            setIsNewCategoryLoaded(true);
            setTimeout(() => {
                setIsCategoryVisible(true);
            }, 300);
        }
    }, [status]);

    const chunkedCategories = [];
    for (let i = 0; i < childrenCategories.length; i += 12) {
        chunkedCategories.push(childrenCategories.slice(i, i + 12));
    }

    if (chunkedCategories.length === 0) {
        return null;
    }

    if (status === 'loading') {
        return (
            <div className="flex justify-center items-center h-40">
                <Spin size="large" />
            </div>
        );
    }
    
    if (status === 'failed') {
        return (
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-red-600 font-medium">{error || 'Failed to load categories.'}</p>
            </div>
        );
    }

    if (!isNewCategoryLoaded || !isCategoryVisible) {
        return (
            <div className="flex justify-center items-center h-40">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-2xl text-gray-800">Danh mục</h2>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                    Xem tất cả
                </button>
            </div>

            <Swiper
                modules={[Navigation, Pagination]}
                navigation={{
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }}
                pagination={{
                    clickable: true,
                    el: '.swiper-pagination',
                    bulletClass: 'swiper-pagination-bullet',
                    bulletActiveClass: 'swiper-pagination-bullet-active',
                }}
                spaceBetween={20}
                slidesPerView={1}
                className="category-swiper"
            >
                {chunkedCategories.map((categoryGroup, index) => (
                    <SwiperSlide key={index}>
                        <div className="flex flex-col px-2 gap-6">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {categoryGroup.map((category) => (
                                    <div
                                        key={category.id}
                                        className="flex justify-center flex-shrink-0"
                                        onClick={() => navigate(`/category/${category.url_path.split('/')[0]}/c${category.id}`)}
                                    >
                                        <CategoryItem
                                            thumbnail={category.thumbnail_url}
                                            name={category.name}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
                <div className="swiper-pagination mt-6"></div>
                <div className="swiper-button-next"></div>
                <div className="swiper-button-prev"></div>
            </Swiper>
        </div>
    );
};

export default Category;