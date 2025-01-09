export const getAllCategories = async ({axiosPrivate,  page = 1, limit = 10, search = '' }) => {
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