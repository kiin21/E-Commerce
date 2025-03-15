import React, { useEffect, useState } from "react";
import { Card, Button, Table, Tooltip, Modal, message, Typography } from 'antd';
import { getVouchers, addVoucher, deleteVoucher } from '../../services/seller/voucherApi';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;
const { Text } = Typography;
import Select from 'react-select';
import { useAxiosPrivate } from '../../hooks/useAxiosPrivate';
import useProducts from '../../hooks/useProducts'; // Import custom hook


const SellerVoucher = () => {

  const [voucherShop, setVoucherShop] = useState({ discount: "", start_date: "", end_date: "" });
  const [voucherForProduct, setVoucherForProduct] = useState({ discount: "", start_date: "", end_date: "", product_id: "" });
  const [voucherData, setVoucherData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const { products, loading, error, loadProducts } = useProducts(searchTerm, 1, 50);
  const axiosPrivate = useAxiosPrivate();

  const columns = [
    {
      title: 'STT', key: 'index', width: '60px',
      render: (_, __, index) => <Text>{(pagination.current - 1) * pagination.pageSize + index + 1}</Text>,
    },
    { title: 'Phần trăm giảm', dataIndex: 'discount', key: 'discount', render: (discount) => <span>{discount}%</span> },
    { title: 'Ngày bắt đầu', dataIndex: 'start_date', key: 'start_date', render: (date) => <span>{new Date(date).toLocaleString()}</span> },
    { title: 'Ngày kết thúc', dataIndex: 'end_date', key: 'end_date', render: (date) => <span>{new Date(date).toLocaleString()}</span> },
    {
      title: 'Sản phẩm', dataIndex: 'product_id', key: 'product_id',
      render: (product_id) => {
        const product = products.find((product) => product.id === product_id);
        return product ? product.name : 'All products';
      }
    },
    {
      title: 'Xóa', dataIndex: '', key: 'action', render: (_, record) =>
        <Tooltip title="Delete">
          <Button
            type="link"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            className="text-red-600 p-0 hover:text-red-800"
          />
        </Tooltip>
    },
  ];

  useEffect(() => {
    loadVouchers();
  }, [pagination.current]);

  const loadVouchers = async () => {
    try {
      const response = await getVouchers(axiosPrivate, pagination.current, pagination.pageSize);
      setVoucherData(response.vouchers);
      setPagination({ ...pagination, total: response.totalItems });
    } catch (error) {
      console.error(error);
    }
  }

  const handleSearchChange = (inputValue) => {
    setSearchTerm(inputValue);
    loadProducts(inputValue, 1);
  };

  const handleChangeVoucherShop = (e) => {
    const { name, value } = e.target;
    setVoucherShop(prevState => ({
      ...prevState,  // Giữ lại các giá trị cũ của voucherShop
      [name]: value  // Chỉ cập nhật giá trị của trường name
    }));
    console.log(voucherShop);
  };

  const handleChangeVoucherForProduct = (e) => {
    const { name, value } = e.target;
    setVoucherForProduct(prevState => ({
      ...prevState,  // Giữ lại các giá trị cũ của voucherShop
      [name]: value  // Chỉ cập nhật giá trị của trường name
    }));
  };

  const handleAddVoucherShop = async () => {
    // Kiểm tra xem các thông tin bắt buộc có được nhập đầy đủ không
    if (!voucherShop.discount) {
      message.error('Chọn phần trăm giảm cho voucher!');
      return;
    }
    if (!voucherShop.start_date) {
      message.error('Chọn ngày bắt đầu cho voucher!');
      return;
    }
    if (!voucherShop.end_date) {
      message.error('Chọn ngày kết thúc cho voucher!');
      return;
    }

    if (new Date(voucherShop.start_date) > new Date(voucherShop.end_date)) {
      message.error('Ngày bắt đầu phải trước ngày kết thúc!');
      return;
    }

    if (new Date(voucherShop.end_date) < new Date()) {
      message.error('Ngày kết thúc phải sau ngày hiện tại!');
      return;
    }

    const newVoucher = await addVoucher(axiosPrivate, voucherShop);
    if (!newVoucher) {
      message.error('Thêm voucher thất bại');
      return;
    }

    setVoucherData([...voucherData, newVoucher.voucher]);

    // Reset voucherForProduct 
    setVoucherShop({ discount: "", start_date: "", end_date: "" });
    message.success('Thêm voucher thành công');
  };

  const handleAddVoucherForProduct = async () => {
    if (!voucherForProduct.discount) {
      message.error('Chọn phần trăm giảm cho voucher!');
      return;
    }
    if (!voucherForProduct.start_date) {
      message.error('Chọn ngày bắt đầu cho voucher!');
      return;
    }
    if (!voucherForProduct.end_date) {
      message.error('Chọn ngày kết thúc cho voucher!');
      return;
    }

    if (new Date(voucherForProduct.start_date) > new Date(voucherForProduct.end_date)) {
      message.error('Ngày bắt đầu phải trước ngày kết thúc!');
      return;
    }

    if (new Date(voucherForProduct.end_date) < new Date()) {
      message.error('Ngày kết thúc phải sau ngày hiện tại!');
      return;
    }

    if (!selectedProduct) {
      message.error('Chọn sản phẩm có thể áp dụng voucher!');
      return;
    }
    voucherForProduct.product_id = selectedProduct.value;

    const newVoucher = await addVoucher(axiosPrivate, voucherForProduct);
    if (!newVoucher) {
      message.error('Thêm voucher thất bại');
      return;
    }

    setVoucherData([...voucherData, newVoucher.voucher]);

    // Reset voucherForProduct
    setVoucherForProduct({ discount: "", start_date: "", end_date: "", product_id: "" });

    message.success('Thêm voucher thành công');
  };

  const handleDelete = (voucherId) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa voucher này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Hành động này không thể hoàn tác',
      okText: 'Có',
      okType: 'danger',
      cancelText: 'Không',
      onOk: async () => {
        try {
          await deleteVoucher(axiosPrivate, voucherId);
          message.success('Xóa voucher thành công');
          loadVouchers();
        } catch (error) {
          message.error('Xóa voucher thất bại');
        }
      },
    });
  };

  return (
    <Card className="shadow-md">
      <div className="flex flex-row ">
        {/* Voucher Shop */}
        <div className="flex-1 p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold">Đặt mã giảm giá cho cửa hàng</h2>
          </div>
          {/* Content for voucher shop */}
          <div>
            <div>
              <p>Phần trăm giảm</p>
              <select
                className="border-dashed border-2 rounded-md p-3 w-full mt-2 mb-4"
                name="discount"
                onChange={handleChangeVoucherShop}
                value={voucherShop.discount}
              >
                <option value="" disabled hidden></option>
                <option value="10">10%</option>
                <option value="15">15%</option>
                <option value="20">20%</option>
                <option value="25">25%</option>
                <option value="30">30%</option>
              </select>
            </div>

            <div>
              <p>Ngày bắt đầu</p>
              <input aria-label="Date and time" type="datetime-local"
                className="border-dashed border-2 rounded-md p-3 w-full mt-2 mb-4 focus:outline-none"
                name="start_date"
                value={voucherShop.start_date}
                onChange={handleChangeVoucherShop}
                onClick={(e) => e.target.showPicker()} />
            </div>

            <div>
              <p>Ngày kết thúc</p>
              <input aria-label="Date and time" type="datetime-local"
                className="border-dashed border-2 rounded-md p-3 w-full mt-2 mb-4"
                name="end_date"
                value={voucherShop.end_date}
                onChange={handleChangeVoucherShop}
                onClick={(e) => e.target.showPicker()}
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="primary"
                onClick={handleAddVoucherShop}
                style={{ marginLeft: '10px', position: 'right' }}
              >
                Thêm
              </Button>
            </div>
          </div>
        </div>

        {/* Voucher for Specific Products */}
        <div className="flex-1 p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold">Đặt voucher cho sản phẩm cụ thể</h2>
          </div>
          {/* Content for specific product vouchers */}
          <div>
            <div>
              <p>Phần trăm giảm</p>
              <select className="border-dashed border-2 rounded-md p-3 w-full mt-2 mb-4"
                value={voucherForProduct.discount}
                name="discount"
                onChange={handleChangeVoucherForProduct}
              >
                <option value="" disabled hidden></option>
                <option value="10">10%</option>
                <option value="15">15%</option>
                <option value="20">20%</option>
                <option value="25">25%</option>
                <option value="30">30%</option>
              </select>
            </div>

            <div>
              <p>Ngày bắt đầu</p>
              <input aria-label="Date and time" type="datetime-local"
                className="border-dashed border-2 rounded-md p-3 w-full mt-2 mb-4"
                name="start_date"
                value={voucherForProduct.start_date}
                onChange={handleChangeVoucherForProduct}
                onClick={(e) => e.target.showPicker()} />
            </div>

            <div>
              <p>Ngày kết thúc</p>
              <input aria-label="Date and time" type="datetime-local"
                className="border-dashed border-2 rounded-md p-3 w-full mt-2 mb-4"
                name="end_date"
                value={voucherForProduct.end_date}
                onChange={handleChangeVoucherForProduct}
                onClick={(e) => e.target.showPicker()} />
            </div>

            <div>
              <p className="mb-2">Sản phẩm</p>
              <Select
                value={selectedProduct}
                onChange={setSelectedProduct}
                onInputChange={handleSearchChange} // Cập nhật từ khóa tìm kiếm khi người dùng gõ
                options={products.map((product) => ({
                  value: product.id,
                  label: product.name,
                }))}
                placeholder="Chọn sản phẩm"
                isClearable
              />
            </div>

            <div className="flex justify-end mt-4">
              <Button
                type="primary"
                onClick={handleAddVoucherForProduct}
                style={{ marginLeft: '10px', position: 'right' }}
              >
                Thêm
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-col justify-between mt-6 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Mã giảm giá</h2>
        </div>
        <Table
          columns={columns}
          dataSource={voucherData}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            position: ['bottomCenter'],
          }}
        />
      </div>
    </Card>
  );
}


export default SellerVoucher;