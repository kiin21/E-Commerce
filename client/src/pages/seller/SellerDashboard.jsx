import React, { use, useEffect, useState } from 'react';
import { Table, Button, Tooltip, Typography, Tag } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as TooltipRecharts, ResponsiveContainer, Legend } from 'recharts';
import { getTopSellingProductInDashboard, getTotalFollowers, getTotalProducts, getTotalRevenue, getTotalReviews } from '../../services/seller/productApi';
import { getPotentialCustomer, getRecentOrders, getMonthlyRevenue } from '../../services/seller/orderApi';
import {
    DollarSign,
    Users,
    CreditCard,
    MoreVertical,
    Package,
} from 'lucide-react';
import Select from 'react-select';
import { useAxiosPrivate } from '../../hooks/useAxiosPrivate';
const { Text } = Typography;

const SellerDashboard = () => {
    const lineChartData = [
        { name: 'Jan', value: 100 },
        { name: 'Feb', value: 120 },
        { name: 'Mar', value: 90 },
        { name: 'Apr', value: 140 },
        { name: 'May', value: 110 },
        { name: 'Jun', value: 130 },
    ];

    const salesDataSample = [
        { month: "Jan", value: 0 },
        { month: "Feb", value: 0 },
        { month: "Mar", value: 0 },
        { month: "Apr", value: 0 },
        { month: "May", value: 0 },
        { month: "Jun", value: 0 },
        { month: "Jul", value: 0 },
        { month: "Aug", value: 0 },
        { month: "Sep", value: 0 },
        { month: "Oct", value: 0 },
        { month: "Nov", value: 0 },
        { month: "Dec", value: 0 },
    ];
    const years = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i);

    const navigate = useNavigate();
    const [topSellingProducts, setTopSellingProducts] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
    const [loading, setLoading] = useState(true);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalFollowers, setTotalFollowers] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [potentialCustomers, setPotentialCustomers] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [salesData, setSalesData] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        loadTopSellingProducts();
    }, [pagination.current]);

    useEffect(() => {
        loadTotalRevenue();
        loadTotalProducts();
        loadTotalFollowers();
        loadTotalReviews();
        loadPotentialCustomers();
        loadRecentOrders();
    }, []);


    useEffect(() => {
        loadMonthlySales();
    }, [selectedYear]);


    const loadTotalRevenue = async () => {
        try {
            const response = await getTotalRevenue(axiosPrivate);
            setTotalRevenue(response.totalRevenue);
        } catch (err) {
            console.error(err);
        }
    }

    const loadTotalProducts = async () => {
        try {
            const response = await getTotalProducts(axiosPrivate);
            setTotalProducts(response.totalProducts);
        } catch (err) {
            console.error(err);
        }
    }

    const loadTotalFollowers = async () => {
        try {
            const response = await getTotalFollowers(axiosPrivate);
            setTotalFollowers(response.totalFollowers);
        } catch (err) {
            console.error(err);
        }
    }

    const loadTotalReviews = async () => {
        try {
            const response = await getTotalReviews(axiosPrivate);
            setTotalReviews(response.totalReviews);
        } catch (err) {
            console.error(err);
        }
    }

    const loadPotentialCustomers = async () => {
        try {
            const response = await getPotentialCustomer(axiosPrivate);
            setPotentialCustomers(response.data);
        } catch (err) {
            console.error(err);
        }
    }

    const loadRecentOrders = async () => {
        try {
            const response = await getRecentOrders(axiosPrivate);
            setRecentOrders(response.orders);
        } catch (err) {
            console.error(err);
        }
    }

    const loadMonthlySales = async () => {
        try {
            const response = await getMonthlyRevenue(axiosPrivate, selectedYear);
            console.log('Monthly sales:', selectedYear);
            console.log('Response:', response);

            if (response?.data && response.data.length > 0) {
                setSalesData(response.data);
            } else {
                // Nếu dữ liệu không hợp lệ, sử dụng dữ liệu mẫu
                setSalesData(salesDataSample);
            }
        } catch (err) {
            setSalesData(salesDataSample);
            console.error(err);
        }
    }

    const loadTopSellingProducts = async () => {
        setLoading(true);
        try {
            const response = await getTopSellingProductInDashboard(axiosPrivate, pagination.current, pagination.pageSize);

            // Giới hạn số lượng sản phẩm hiển thị tối đa
            const maxTotal = Math.min(response.totalItems, 19); // Giới hạn tối đa 20 sản phẩm

            setTopSellingProducts(response.products);
            setPagination({
                ...pagination,
                total: maxTotal, // Cập nhật tổng số sản phẩm hiển thị
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return <div className="text-center text-xl">Loading...</div>;
    }

    const handleView = (product) => {
        navigate(`/seller/product-management/detail/${product.id}`);
    };

    const handleChangeYear = (value) => {
        setSelectedYear(value);
        //console.log('Selected year:', value);
    };

    const formatCurrency = (value) => {
        if (value >= 1_000_000_000) {
            return `${(value / 1_000_000_000).toFixed(1)} Tỷ`;
        } else if (value >= 1_000_000) {
            return `${(value / 1_000_000).toFixed(1)} Triệu`;
        } else {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
        }
    };

    const topSellingProductsColumns = [
        {
            title: 'Ảnh', key: 'image', width: '80px',
            render: (_, record) => (
                <img
                    src={(Array.isArray(record.thumbnails) && record.thumbnails[0]) || ''}
                    alt={record.name || 'No image'}
                    className="w-10 h-10 object-cover border rounded"
                />
            ),
        },
        { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
        { title: 'Đã bán', dataIndex: 'quantity_sold', key: 'quantity_sold' },
        {
            title: 'Giá', dataIndex: 'price', key: 'price',
            render: (price) =>
                price ? (
                    <span style={{ color: 'green' }}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', }).format(Number(price))}
                    </span>
                ) : (
                    <span style={{ color: 'red' }}>N/A</span>
                ),
        },
        {
            title: 'Đánh giá', dataIndex: 'rating', key: 'rating',
            render: (rating) =>
                rating !== undefined && rating !== null ? `${parseFloat(rating).toFixed(1)} ⭐` : 'No rating',
        },
        {
            title: 'Doanh thu', dataIndex: 'earnings', key: 'earnings',
            render: (price) =>
                price ? (
                    <span style={{ color: 'green' }}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', }).format(Number(price))}
                    </span>
                ) : (
                    <span style={{ color: 'red' }}>N/A</span>
                ),
        },
        {
            title: 'Chi tiết', dataIndex: 'action', key: 'action',
            render: (_, record) => (
                <Tooltip title="View Product">
                    <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => handleView(record)}
                        className="text-blue-600 p-0 hover:text-blue-800"
                    />
                </Tooltip>
            )
        }
    ];

    const potentialCustomersColumns = [
        { title: 'Khách hàng', dataIndex: 'username', key: 'username' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        {
            title: 'Tổng chi tiêu', dataIndex: 'totalSpending', key: 'totalSpending',
            render: (price) =>
                price ? (
                    <span style={{ color: 'green' }}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', }).format(Number(price))}
                    </span>
                ) : (
                    <span style={{ color: 'red' }}>N/A</span>
                ),
        },
    ];

    const recentOrdersColumns = [
        {
            title: 'Khách hàng', dataIndex: 'user', key: 'user',
            render: (user) => (
                <>
                    <Text strong>{user.username}</Text>
                </>
            ),
        },
        {
            title: 'Tổng tiền', dataIndex: 'total_amount', key: 'total_amount',
            render: (price) => <Text style={{ color: 'green' }}>{Number(price).toLocaleString()} VND</Text>,
        },
        {
            title: 'Trạng thái', dataIndex: 'status', key: 'status',
            render: (status) => {
                let color = '';
                let text = '';
                switch (status) {
                    case 'processing':
                        color = 'orange';
                        text = 'Chờ duyệt';
                        break;
                    case 'delivered':
                        color = 'green';
                        text = 'Đang vận chuyển';
                        break;
                    case 'shipped':
                        color = 'blue';
                        text = 'Đơn hàng thành công';
                        break;
                    case 'cancelled':
                        color = 'red';
                        text = 'Đã hủy';
                        break;
                    default:
                        return null;
                }
                return <Tag color={color}>{text}</Tag>;
            },
        },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Main Content */}
            <div className="flex-1 p-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    {/* Total Revenue */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-2xl text-gray-500 font-bold">Tổng doanh thu cửa hàng</h3>
                        </div>
                        <div className="flex items-center justify-start mb-4">
                            <div className="p-2 bg-purple-100 rounded-full">
                                <DollarSign className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-2xl font-bold mb-1 ml-4">
                                {formatCurrency(totalRevenue)}
                            </h3>
                        </div>

                        <div className="mt-4">
                            <LineChart width={200} height={60} data={lineChartData}>
                                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={false} />
                            </LineChart>
                        </div>
                    </div>

                    {/* Total products */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-2xl text-gray-500 font-bold ">Số lượng sản phẩm</h3>
                        </div>
                        <div className="flex items-center justify-start mb-4">
                            <div className="p-2 bg-blue-100 rounded-full">
                                <Package className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold mb-1 ml-4">{totalProducts}</h3>
                        </div>

                        <div className="mt-4">
                            <LineChart width={200} height={60} data={lineChartData}>
                                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
                            </LineChart>
                        </div>
                    </div>

                    {/* Total Followers */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-2xl text-gray-500 font-bold ">Khách hàng theo dõi</h3>
                        </div>
                        <div className="flex items-center justify-start mb-4">
                            <div className="p-2 bg-orange-100 rounded-full">
                                <Users className="w-6 h-6 text-orange-600" />
                            </div>
                            <h3 className="text-2xl font-bold mb-1 ml-4">{totalFollowers}</h3>
                        </div>

                        <div className="mt-4">
                            <LineChart width={200} height={60} data={lineChartData}>
                                <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} dot={false} />
                            </LineChart>
                        </div>
                    </div>

                    {/* Total Reviews */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-2xl text-gray-500 font-bold ">Số lượng đánh giá</h3>
                        </div>
                        <div className="flex items-center justify-start mb-4">
                            <div className="p-2 bg-pink-100 rounded-full">
                                <CreditCard className="w-6 h-6 text-pink-600" />
                            </div>
                            <h3 className="text-2xl font-bold mb-1 ml-4">{totalReviews}</h3>
                        </div>

                        <div className="mt-4">
                            <LineChart width={200} height={60} data={lineChartData}>
                                <Line type="monotone" dataKey="value" stroke="#ec4899" strokeWidth={2} dot={false} />
                            </LineChart>
                        </div>
                    </div>
                </div>

                {/* Top Selling Products */}
                <div className="bg-white p-6 rounded-lg shadow mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold">Sản phẩm bán chạy</h3>
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                    </div>

                    <Table
                        columns={topSellingProductsColumns}
                        dataSource={topSellingProducts}
                        loading={loading}
                        rowKey="id"
                        pagination={{
                            current: pagination.current,
                            pageSize: pagination.pageSize,
                            total: pagination.total, // Tổng số sản phẩm sau khi giới hạn
                            position: ['bottomCenter'],
                            showSizeChanger: false,
                            showQuickJumper: false,
                            onChange: (page) => setPagination({ ...pagination, current: page }),
                        }}
                    />
                </div>

                {/* Sales Overview */}
                <div className="bg-white p-6 rounded-lg shadow mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold">Biểu đồ doanh thu</h3>
                        <Select
                            value={selectedYear}
                            style={{ width: 100 }}
                            onChange={handleChangeYear}
                            placeholder="Chọn năm"
                            defaultValue={new Date().getFullYear()}
                            options={years.map(year => ({
                                value: year,
                                label: year
                            }))}
                        >
                        </Select>
                    </div>
                    <div style={{ width: '100%', height: '500px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                width={1000} height={600} data={salesData}
                                margin={{ top: 20, right: 20, left: 40, bottom: 20 }}
                                barCategoryGap="20%"
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis
                                    tickFormatter={formatCurrency} // Format Y-axis as currency
                                    domain={[0, (dataMax) => (dataMax > 0 ? dataMax * 1.5 : 100000)]} // Ensure some padding above max value 
                                />
                                <TooltipRecharts />
                                <Bar dataKey="value" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Potential customers and rêcnt orders */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                    {/* Potential Customers */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold">Khách hàng chi tiêu nhiều nhất</h3>
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                        </div>
                        <Table
                            columns={potentialCustomersColumns}
                            dataSource={potentialCustomers}
                            loading={loading}
                            rowKey="id"
                            pagination={{ pageSize: 5 }}
                        />
                    </div>

                    {/* Recent orders */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold">Đơn hàng gần đây</h3>
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                        </div>
                        <Table
                            columns={recentOrdersColumns}
                            dataSource={recentOrders}
                            loading={loading}
                            rowKey="id"
                            pagination={{ pageSize: 5 }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;