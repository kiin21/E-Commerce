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

export const deleteProductById = async (axiosPrivate, id) => {
    try {
        const response = await axiosPrivate.delete(`/api/seller/products/remove/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw new Error(error.response?.data?.message || 'Failed to delete product');
    }
};

export const deleteMultipleProductsById = async (axiosPrivate, ids) => {
    try {
        const response = await axiosPrivate.post(`/api/seller/products/remove-multiple`, { ids });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete products');
    }
}
