import { combineReducers } from '@reduxjs/toolkit';
import sellerReducer from './sellerReducer';
import userReducer from './userReducer';
import productReducer from './productReducer';
import categoryReducer from './categoryReducer';
import salesAnalyticsReducer from './salesAnalyticsReducer';

const adminReducer = combineReducers({
    sellers: sellerReducer,
    users: userReducer,
    product: productReducer,
    category: categoryReducer,
    salesAnalytics: salesAnalyticsReducer,
});

export default adminReducer;