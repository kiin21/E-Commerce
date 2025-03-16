import { useState, useEffect } from 'react';
import { getAllCategories } from '../services/seller/categoryApi';
import { useAxiosPrivate } from './useAxiosPrivate';

// Custom hook để quản lý việc tải và tìm kiếm danh mục
const useCategories = (searchTerm = '', page = 1, limit = 50) => {
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  const loadCategories = async (search = '', page = 1) => {
    setLoading(true);
    try {
      const { data, total: totalCount } = await getAllCategories({ axiosPrivate, search, page, limit });
      setCategories((prevCategories) => {
        if (page === 1) return data;
        return [...prevCategories, ...data];
      });
      setTotal(totalCount);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories(searchTerm, page);
  }, [searchTerm, page]);

  return { categories, total, loading, error, loadCategories };
};

export default useCategories;
