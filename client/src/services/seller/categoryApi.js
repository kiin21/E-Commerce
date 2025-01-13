export const getAllCategories = async ({ axiosPrivate, page = 1, limit = 10, search = '' }) => {
    try {
        const response = await axiosPrivate.get(`/api/seller/categories`, {
            params: { page, limit, search },
        });

        if (response.data && Array.isArray(response.data.data)) {
            return {
                data: response.data.data,
                total: response.data.total,
                page: response.data.page,
                limit: response.data.limit,
            };
        } else {
            throw new Error('Invalid response structure');
        }
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch categories');
    }
};

export const updateCategory = async ({ axiosPrivate, categoryId, formData }) => {
    try {
        const queryParams = new URLSearchParams(formData).toString();
        const response = await axiosPrivate.put(`/api/admin/category/${categoryId}?${queryParams}`);
        return response.data.data;
    } catch (error) {
        console.error('AxiosError:', error);
        alert(error.response?.data?.message || error.message || 'Failed to update category');
        throw new Error(error.response?.data?.message || 'Failed to update category');
    }
};
