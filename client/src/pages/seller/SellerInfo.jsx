import React, { useState, useEffect } from 'react';
import { getSellerInfo, updateSellerInfo } from '../../services/seller/infoApi';
import { getStore, updateStore } from '../../services/seller/storeApi';
import { getTopSellingProducts } from '../../services/seller/productApi';
import TopProducts from '../../components/seller/TopProducts';
import { useAxiosPrivate } from '../../hooks/useAxiosPrivate';
import { uploadImages } from '../../helpers/upload';
import { Card, Typography, Input, Button, Upload, Space, message, Spin } from 'antd';
import {
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CreditCardOutlined,
  IdcardOutlined,
  EditOutlined,
  StarOutlined,
  UsergroupAddOutlined,
  UserOutlined,
  MailOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

const SellerInfo = () => {
  const [sellerInfo, setSellerInfo] = useState(null);
  const [store, setStore] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditingSeller, setIsEditingSeller] = useState(false);
  const [isEditingStore, setIsEditingStore] = useState(false);
  const [originalSellerInfo, setOriginalSellerInfo] = useState(null);
  const [originalStoreInfo, setOriginalStoreInfo] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sellerResponse, storeResponse] = await Promise.all([
          getSellerInfo(axiosPrivate),
          getStore(axiosPrivate),
        ]);

        setSellerInfo(sellerResponse);
        setOriginalSellerInfo(sellerResponse);

        setStore(storeResponse);
        setOriginalStoreInfo(storeResponse);

        if (sellerResponse?.store_id) {
          const productsResponse = await getTopSellingProducts(axiosPrivate, sellerResponse.store_id);
          setTopProducts(productsResponse.data || []);
        }
      } catch (err) {
        setError(err.message || 'Failed to load seller or store info');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [axiosPrivate]);

  const handleEditSeller = () => {
    setIsEditingSeller(true);
  };

  const handleEditStore = () => {
    setIsEditingStore(true);
    setLogoPreview(store?.icon || null); // Show the current logo as preview
  };

  const handleLogoChange = ({ file }) => {
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveSeller = async () => {
    try {
      const response = await updateSellerInfo(axiosPrivate, sellerInfo);
      message.success(response.message);
      setOriginalSellerInfo(sellerInfo);
      setIsEditingSeller(false);
    } catch (err) {
      message.error('Lỗi khi lưu thông tin người bán');
    }
  };

  const handleSaveStore = async () => {
    try {
      let updatedStore = store;

      if (logoFile) {
        const uploadedImages = await uploadImages([logoFile], 'sellers');
        updatedStore = { ...updatedStore, icon: uploadedImages[0].thumbnail_url };
      }

      const response = await updateStore(axiosPrivate, updatedStore);
      message.success(response.message);
      setStore(updatedStore); // Update store with new logo
      setOriginalStoreInfo(updatedStore);
      setLogoFile(null);
      setLogoPreview(null);
      setIsEditingStore(false);
    } catch (err) {
      message.error('Lỗi khi lưu thông tin cửa hàng');
    }
  };

  const handleCancelSeller = () => {
    setSellerInfo(originalSellerInfo);
    setIsEditingSeller(false);
  };

  const handleCancelStore = () => {
    setStore(originalStoreInfo);
    setLogoFile(null);
    setLogoPreview(null);
    setIsEditingStore(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSellerInfo({ ...sellerInfo, [name]: value });
  };

  const handleChangeStore = (e) => {
    const { name, value } = e.target;
    setStore({ ...store, [name]: value });
  };

  if (loading) {
    return <Spin className="flex justify-center items-center h-screen" size="large" />;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <Card className="shadow-lg p-6">
        <Title level={3}>Thông tin người bán</Title>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Input
            addonBefore={<UserOutlined />}
            name="username"
            value={sellerInfo.username || ''}
            disabled
            placeholder="Tên đăng nhập"
          />
          <Input
            addonBefore={<MailOutlined />}
            name="email"
            value={sellerInfo.email || ''}
            disabled
            placeholder="Email"
          />
          <Input
            addonBefore={<PhoneOutlined />}
            name="phone"
            value={sellerInfo.phone || ''}
            onChange={handleChange}
            placeholder="Số điện thoại"
            disabled={!isEditingSeller}
          />
          <Input
            addonBefore={<EnvironmentOutlined />}
            name="address"
            value={sellerInfo.address || ''}
            onChange={handleChange}
            placeholder="Địa chỉ"
            disabled={!isEditingSeller}
          />
          <Input
            addonBefore={<ClockCircleOutlined />}
            name="working_time"
            value={sellerInfo.working_time || ''}
            onChange={handleChange}
            placeholder="Giờ làm việc"
            disabled={!isEditingSeller}
          />
          <Input
            addonBefore={<CreditCardOutlined />}
            name="payment_info"
            value={sellerInfo.payment_info || ''}
            onChange={handleChange}
            placeholder="Thông tin thanh toán"
            disabled={!isEditingSeller}
          />
          <Input.TextArea
            addonBefore={<IdcardOutlined />}
            name="description"
            value={sellerInfo.description || ''}
            onChange={handleChange}
            placeholder="Mô tả"
            disabled={!isEditingSeller}
            rows={3}
          />
        </div>
        <Space className="mt-4">
          {!isEditingSeller ? (
            <Button type="primary" icon={<EditOutlined />} onClick={handleEditSeller}>
              Chỉnh sửa thông tin người bán
            </Button>
          ) : (
            <>
              <Button onClick={handleCancelSeller}>Hủy</Button>
              <Button type="primary" onClick={handleSaveSeller}>Lưu</Button>
            </>
          )}
        </Space>
      </Card>

      <Card className="shadow-lg p-6">
        <Title level={3}>Tên cửa hàng</Title>
        <div className="text-center mb-6">
          {isEditingStore ? (
            <Upload
              listType="picture-card"
              beforeUpload={() => false}
              maxCount={1} // Only allow one image upload
              onChange={handleLogoChange}
              showUploadList={false}
            >
              {logoPreview ? <img src={logoPreview} alt="Logo Preview" className="w-32 h-32 object-cover rounded-full" /> : 'Upload Logo'}
            </Upload>
          ) : (
            <img
              src={store?.icon || ''}
              alt="Logo"
              className="w-32 h-32 mx-auto rounded-full"
            />
          )}
        </div>

        <Input
          name="name"
          value={store.name || ''}
          onChange={handleChangeStore}
          placeholder="Tên cửa hàng"
          disabled={!isEditingStore}
          className="text-center font-semibold text-lg"
        />

        <div className="mt-4 flex justify-center gap-8">
          <div className="flex items-center gap-2">
            <StarOutlined className="text-yellow-500" />
            <span className="font-medium">
              {parseFloat(store.avg_rating_point || 0).toFixed(1)} Sao
            </span>
          </div>
          <div className="flex items-center gap-2">
            <UsergroupAddOutlined className="text-blue-500" />
            <span className="font-medium">{store.total_follower || 0} người theo dõi</span>
          </div>
        </div>

        <div className="mt-4 flex justify-center items-center gap-4">
          <Space className="mt-4">
            {!isEditingStore ? (
              <Button type="primary" icon={<EditOutlined />} onClick={handleEditStore}>
                Chỉnh sửa thông tin cửa hàng
              </Button>
            ) : (
              <>
                <Button onClick={handleCancelStore}>Hủy</Button>
                <Button type="primary" onClick={handleSaveStore}>Lưu</Button>
              </>
            )}
          </Space>
        </div>
      </Card>

      <TopProducts products={topProducts} />
    </div>
  );
};

export default SellerInfo;
