import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Input, Card, Typography, Tooltip, message, Tag, Modal } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAllCategories, deleteCategory, restoreCategory } from '../../redux/actions/admin/categoryManagementAction';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useDispatch } from 'react-redux';
import {
    SearchOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    RedoOutlined,
    ArrowLeftOutlined, UndoOutlined, CheckOutlined, StopOutlined
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

    const handleDelete = (record) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this product?',
            content: `Product Name: ${record.name}`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await dispatch(deleteCategory({ id: record.id, axiosInstance: axiosPrivate }));
                    message.success('Product deleted successfully');
                    fetchProducts(pagination.current, pagination.pageSize, searchText);
                } catch (error) {
                    message.error('Failed to delete product: ' + error.message);
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
                    <Text type="secondary" className="text-xs">SKU: {record.current_seller?.sku}</Text>
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
                    <Tooltip title="Edit">
                        <Button
                            type="link"
                            icon={<EditOutlined />}
                            onClick={() => handleView(record)}
                            className="text-yellow-600 p-0 hover:text-gray-800"
                        />
                    </Tooltip>
                    <Tooltip title={record.inventory_status == 'available' ? 'suspend' : 'available'}>
                        <Button
                            type="link"
                            icon={record.inventory_status == 'available' ? <DeleteOutlined /> : <RedoOutlined />}
                            onClick={() => {
                                record.inventory_status == 'available' ? handleDelete(record) : handleRestored(record)
                            }}
                            className={record.inventory_status == 'available' ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}
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
                    <Button
                        onClick={handleRefresh}
                        icon={<RedoOutlined />}
                    >
                        Tải lại
                    </Button>
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