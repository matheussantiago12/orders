import React from 'react';
import { Redirect } from 'react-router-dom';
import Orders from './pages/Orders';
import Products from './pages/Products';
import OrderDetails from './pages/OrderDetails';
import ProductDetails from './pages/ProductDetails';

const routes = [
    {
        path: '/pedidos',
        component: Orders,
        exact: true,
        key: 'orders',
    },
    {
        path: '/pedidos/:id',
        component: OrderDetails,
        exact: true,
        key: 'orderDetails',
    },
    {
        path: '/produtos',
        component: Products,
        exact: true,
        key: 'products',
    },
    {
        path: '/produtos/:id',
        component: ProductDetails,
        exact: true,
        key: 'productDetails',
    },
    {
        path: '/',
        component: () => <Redirect to='/pedidos' />,
        exact: false,
        key: 'root',
    }
];

export default routes;