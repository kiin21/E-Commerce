import { createSlice } from '@reduxjs/toolkit';
import { fetchAllCategories, fetchOneCategory } from '../../actions/admin/categoryManagementAction';

const categorySlice = createSlice({
    name: 'adminCategories',
    initialState: {
        data: [],
        currentCategory: null,
        loading: false,
        error: null,
        pagination: {
            current: 1,
            pageSize: 10,
            total: 0
        }
    },
    reducers: {
        setCategoriesPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
        clearCategoriesError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch All Categories
            .addCase(fetchAllCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllCategories.fulfilled, (state, action) => {
                state.data = action.payload.category;
                state.pagination.total = action.payload.totalCount;
                state.pagination.current = action.payload.currentPage;
                state.pagination.pageSize = action.payload.pageSize;
                state.loading = false;
            })
            .addCase(fetchAllCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'An error occurred';
                state.data = [];
            })

            // Fetch One Category
            .addCase(fetchOneCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOneCategory.fulfilled, (state, action) => {
                state.currentCategory = action.payload[0];
                state.loading = false;
            })
            .addCase(fetchOneCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'An error occurred';
                state.currentCategory = null;
            });
    }
});

export const { setCategoriesPagination, clearCategoriesError } = categorySlice.actions;
export default categorySlice.reducer;
