import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Input, Card, Typography, Tooltip, message, Tag, Modal } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAllCategories, deleteCategory, restoreCategory } from '../../redux/actions/admin/categoryManagementAction';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useDispatch } from 'react-redux';
import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    RedoOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

const CategoryManagementPage = () => {
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const dispatch = useDispatch(); // Added missing dispatch
    const [searchText, setSearchText] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    const fetchProducts = async (page = 1, pageSize = 10, search = '') => {
        setLoading(true);
        try {
            const resultAction = await dispatch(
                fetchAllCategories({
                    axiosInstance: axiosPrivate,
                    page,
                    limit: pageSize,
                    search,
                })
            );

            if (fetchAllCategories.fulfilled.match(resultAction)) {
                const { category, totalCount, currentPage, pageSize, search } = resultAction.payload;
                setCategories(category);
                setPagination({
                    current: currentPage,
                    pageSize,
                    total: totalCount,
                    search: search,
                });
                console.log('Products:', resultAction);
            } else {
                message.error(resultAction.error?.message || 'Failed to load products');
            }
        } catch (error) {
            message.error('Failed to load products: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(pagination.current, pagination.pageSize, searchText);
    }, [searchText]);

    const handleSearch = React.useCallback(() => {
        fetchProducts(1, pagination.pageSize, searchText);
    }, [searchText, pagination.pageSize]);

    const handleTableChange = (newPagination) => {
        fetchProducts(newPagination.current, newPagination.pageSize, searchText);
    };

    const handleRefresh = () => {
        setSearchText('');
        fetchProducts(1, pagination.pageSize, '');
    };

    const handleAddNew = () => {
        navigate('/admin/category-management/add');
    };

    const handleDelete = (record) => {
        Modal.confirm({
            title: 'Bạn có chắc chắn rằng muốn xoá danh mục này?',
            content: `Tên danh mục: ${record.name}`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await dispatch(deleteCategory({ id: record.id, axiosInstance: axiosPrivate }));
                    message.success('Category deleted successfully');
                    fetchProducts(pagination.current, pagination.pageSize, searchText);
                } catch (error) {
                    message.error('Failed to delete category: ' + error.message);
                }
            },
        });
    };

    const handleView = (record) => {
        navigate(`/admin/category-management/${record.id}`);
    }

    const columns = [
        {
            title: 'No.',
            key: 'index',
            width: '50px',
            render: (_, __, index) => (
                <Text>
                    {(pagination.current - 1) * pagination.pageSize + index + 1}
                </Text>
            ),
        },
        {
            title: 'Ảnh',
            key: 'thumbnail_url',
            width: '70px',
            render: (_, record) => (
                <img
                    src={record.thumbnail_url}
                    alt={record.name}
                    className="w-10 h-10 rounded object-cover border border-gray-200"
                />
            ),
        },
        {
            title: 'Tên danh mục',
            key: 'name',
            width: '400px',
            render: (_, record) => (
                <div>
                    <Text strong className="block">{record.name}</Text>
                </div>
            ),
        },
        {
            title: 'Hành động',
            key: 'actions',
            width: '80px',
            fixed: 'right',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Sửa">
                        <Button
                            type="link"
                            icon={<EditOutlined />}
                            onClick={() => handleView(record)}
                            className="text-yellow-600 p-0 hover:text-gray-800"
                        />
                    </Tooltip>
                    <Tooltip title='Xoá'>
                        <Button
                            type="link"
                            icon={<DeleteOutlined />}
                            onClick={() => {
                                handleDelete(record);
                            }}
                            className='text-red-600 hover:text-red-800'
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Card title="Quản lý danh mục" className="shadow-md">
                <div className="mb-4 flex justify-between items-center">
                    <Input
                        placeholder="Search products..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        onPressEnter={handleSearch}
                        className="w-64"
                    />
                    <div className="flex gap-2">
                        <Button
                            onClick={handleAddNew}
                            icon={<PlusOutlined />}
                            type="primary"
                        >
                            Thêm danh mục mới
                        </Button>
                        <Button
                            onClick={handleRefresh}
                            icon={<RedoOutlined />}
                        >
                            Refresh
                        </Button>
                    </div>
                </div>

                <Table
                    columns={columns}
                    dataSource={categories}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `Total ${total} categories`,
                        position: ['bottomCenter'],
                    }}
                    onChange={handleTableChange}
                    className="border border-gray-200 rounded"
                />
            </Card>
        </div>
    );
};

export default CategoryManagementPage;