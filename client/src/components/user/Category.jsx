import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CategoryItem from './CategoryItem';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChildrenCategories } from '../../redux/actions/user/categoryAction';
import { selectCategory, clearError } from '../../redux/reducers/user/categoryReducer';
import { Spin } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

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
            }, 500);
        }
    }, [status]);

    const chunkedCategories = [];
    for (let i = 0; i < childrenCategories.length; i += 12) {
        chunkedCategories.push(childrenCategories.slice(i, i + 12));
    }

    if (chunkedCategories.length === 0) {
        return null;
    }

    if (status === 'loading') return <Spin />;
    if (status === 'failed') return <p className="text-red-500">{error || 'Failed to load categories.'}</p>;

    if (!isNewCategoryLoaded || !isCategoryVisible) {
        return <Spin />;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg overflow-hidden">
            <h2 className="font-semibold mb-6 text-2xl text-gray-800">Danh mục</h2>

            <Swiper
                modules={[Navigation]}
                navigation
                spaceBetween={20}
                slidesPerView={1}
            >
                {chunkedCategories.map((categoryGroup, index) => (
                    <SwiperSlide key={index}>
                        <div className="flex flex-col px-4 gap-6">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {categoryGroup.map((category) => (
                                    <div
                                        key={category.id}
                                        className="flex justify-center flex-shrink-0 rounded-lg bg-gray-50 p-4 hover:bg-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer"
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
            </Swiper>
        </div>
    );
};

export default Category;