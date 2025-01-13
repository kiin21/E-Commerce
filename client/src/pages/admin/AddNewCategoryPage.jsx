import React, { useState } from 'react';
import { Card, Form, Input, Switch, Button, Space, Typography, message, Upload, Select } from 'antd';
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import { uploadImages } from '../../helpers/upload';
import useCategories from '../../hooks/useCategories';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import slugify from 'slugify';

const { Title } = Typography;
const { Option } = Select;

const AddCategoryForm = ({ onSuccess, onCancel }) => {
    const [form] = Form.useForm();
    const [submitLoading, setSubmitLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [uploadLoading, setUploadLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const axiosPrivate = useAxiosPrivate();
    const { categories } = useCategories(searchTerm, 1, 50);

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
            // Generate URL path if not provided
            const urlPath = values.url_path || slugify(values.name, { lower: true, strict: true });

            const response = await axiosPrivate.post('/api/admin/category/add', {
                ...values,
                url_path: urlPath,
                is_active: true
            });

            message.success('Category added successfully');
            form.resetFields();
            setImageUrl('');
            if (onSuccess) onSuccess(response.data);
        } catch (error) {
            console.error('Error adding category:', error);
            message.error(error.response?.data?.message || 'Failed to add category');
        } finally {
            setSubmitLoading(false);
        }
    };

    const uploadButton = (
        <div>
            {uploadLoading ? <LoadingOutlined /> : <UploadOutlined />}
            <div className="mt-2">Upload</div>
        </div>
    );

    return (
        <Card className="max-w-2xl mx-auto">
            <div className="mb-6">
                <Title level={4}>Add New Category</Title>
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
                    <Input
                        placeholder="Enter category name"
                        onChange={(e) => {
                            const urlPath = slugify(e.target.value, { lower: true, strict: true });
                            form.setFieldsValue({ url_path: urlPath });
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label="Thumbnail"
                    name="thumbnail_url"
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
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                uploadButton
                            )}
                        </Upload>
                    </div>
                </Form.Item>

                <Form.Item
                    label="Parent Category"
                    name="parent_id"
                >
                    <Select
                        showSearch
                        placeholder="Select parent category (optional)"
                        filterOption={false}
                        onSearch={setSearchTerm}
                        allowClear
                    >
                        {categories.map((category) => (
                            <Option key={category.id} value={category.id}>{category.name}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="URL Path"
                    name="url_path"
                    rules={[{ required: true, message: 'Please enter URL path' }]}
                >
                    <Input placeholder="Enter URL path (auto-generated from name if empty)" />
                </Form.Item>

                <Form.Item
                    label="Is Leaf Category"
                    name="is_leaf"
                    valuePropName="checked"
                    initialValue={false}
                >
                    <Switch />
                </Form.Item>

                <Form.Item className="mt-6">
                    <Space>
                        <Button onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={submitLoading}
                        >
                            Add Category
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default AddCategoryForm;