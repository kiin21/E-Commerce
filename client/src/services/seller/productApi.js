// services/productApi.js
export const getProductsOfStore = async (axiosPrivate, status, page = 1, limit = 10, search = '', sortField = '', sortOrder = '') => {
  try {
      const response = await axiosPrivate.get(`/api/seller/products`, {
          params: { status, page, limit, search, sortField, sortOrder },
      });
      console.log(response.data);
      return response.data;
  } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch products by status');
  }
};

