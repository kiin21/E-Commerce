import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { useAxiosPrivate } from '../../../hooks/useAxiosPrivate';

const axios = useAxiosPrivate;

export const fetchAllCategories = createAsyncThunk(
    'admin/category/fetchCategory',
    async ({ axiosInstance, page = 1, limit = 10, search = '' }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/admin/category', {
                params: { page, limit, search },
            });
            return {
                category: response.data.data,
                totalCount: response.data.total,
                currentPage: response.data.page,
                pageSize: response.data.limit,
            };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch categories';
            toast.error(errorMessage);
            return rejectWithValue({ message: errorMessage });
        }
    }
);

export const fetchOneCategory = createAsyncThunk(
    'admin/category/fetchOneCategory',
    async ({ categoryId, axiosInstance }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/admin/category/${categoryId}`);
            console.log('API Response:', response.data.data);
            return response.data.data; // Access the first element of the data array
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch category';
            toast.error(errorMessage);
            return rejectWithValue({ message: errorMessage });
        }
    }
);

export const deleteCategory = createAsyncThunk(
    'admin/category/delete',
    async ({ id, axiosInstance }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/api/admin/category/${id}/suspend`);
            return response.data.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            toast.error(errorMessage);
            return rejectWithValue({ message: errorMessage });
        }
    }
);

export const restoreCategory = createAsyncThunk(
    'admin/category/restore',
    async ({ id, axiosInstance }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/api/admin/category/${id}/restore`);
            return response.data.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            toast.error(errorMessage);
            return rejectWithValue({ message: errorMessage });
        }
    }
);
