import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Form, Input, Switch, Button, Space, Typography, message, Spin, Upload } from 'antd';
import { ArrowLeftOutlined, UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import { fetchOneCategory } from '../../redux/actions/admin/categoryManagementAction';
import { useAxiosPrivate } from '../../hooks/useAxiosPrivate';
import { uploadImages } from '../../helpers/upload';
import { updateCategory } from '../../services/seller/categoryApi';
const { Title } = Typography;

const CategoryEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const axiosPrivate = useAxiosPrivate();
    const { currentCategory, loading } = useSelector(state => state.admin.category);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [uploadLoading, setUploadLoading] = useState(false);

    useEffect(() => {
        const loadCategory = async () => {
            try {
                const resultAction = await dispatch(
                    fetchOneCategory({
                        categoryId: parseInt(id, 10),
                        axiosInstance: axiosPrivate
                    })
                ).unwrap();

                if (resultAction) {
                    form.setFieldsValue({
                        name: resultAction.name,
                        thumbnail_url: resultAction.thumbnail_url,
                        parent_id: resultAction.parent_id,
                        is_leaf: resultAction.is_leaf,
                        url_path: resultAction.url_path
                    });
                    setImageUrl(resultAction.thumbnail_url);
                }
            } catch (error) {
                console.error('Error fetching category:', error);
                message.error('Failed to load category data');
            }
        };

        if (id) {
            loadCategory();
        }
    }, [dispatch, axiosPrivate, id, form]);
    const handleImageUpload = async (file) => {
        try {
            setUploadLoading(true);
            const [uploadedImage] = await uploadImages([file], 'categories');
            setImageUrl(uploadedImage.thumbnail_url);
            form.setFieldValue('thumbnail_url', uploadedImage.thumbnail_url);
            message.success('Image uploaded successfully');
        } catch (error) {
            console.error('Error uploading image:', error);
            message.error('Failed to upload image');
        } finally {
            setUploadLoading(false);
        }
    };

    const onFinish = async (values) => {
        setSubmitLoading(true);
        try {
            const params = { ...values, id };
            console.log('Form values:', params);
            await updateCategory({ axiosPrivate, categoryId: id, formData: params });
            message.success('Category updated successfully');
            navigate('/admin/category-management');
        } catch (err) {
            console.error('Error updating category:', err);
            message.error('Failed to update category. Please try again.');
        } finally {
            setSubmitLoading(false);
        }
    };

    const uploadButton = (
        <div>
            {uploadLoading ? <LoadingOutlined /> : <UploadOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
            <Card>
                <div style={{ marginBottom: 24 }}>
                    <Space>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate('/admin/category-management')}
                            type="link"
                        />
                        <Title level={4} style={{ margin: 0 }}>Edit Category</Title>
                    </Space>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Category Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter category name' }]}
                    >
                        <Input placeholder="Enter category name" />
                    </Form.Item>

                    <Form.Item
                        label="Thumbnail"
                        name="thumbnail_url"
                        rules={[{ required: true, message: 'Please upload a thumbnail' }]}
                    >
                        <div>
                            <Upload
                                name="thumbnail"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                beforeUpload={(file) => {
                                    const isImage = file.type.startsWith('image/');
                                    if (!isImage) {
                                        message.error('You can only upload image files!');
                                        return false;
                                    }
                                    handleImageUpload(file);
                                    return false;
                                }}
                            >
                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt="thumbnail"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    uploadButton
                                )}
                            </Upload>
                            <Input
                                hidden
                                value={imageUrl}
                            />
                        </div>
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button
                                onClick={() => navigate('/admin/category-management')}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={submitLoading}
                            >
                                Save Changes
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default CategoryEditPage;