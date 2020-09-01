import { Router } from 'express';
import ProductController from './controllers/ProductController';
import ItemController from './controllers/ItemController';
import OrderController from './controllers/OrderController';

const routes = Router();

/*
 * Product
 */
routes.get('/products', ProductController.index);
routes.get('/products/:id', ProductController.show);
routes.post('/products', ProductController.store);
routes.put('/products/:id', ProductController.update);
routes.delete('/products/:id', ProductController.destroy);

/*
 * Item
 */
routes.get('/items', ItemController.index);
routes.post('/items', ItemController.store);

/*
 * Order
 */
routes.get('/orders', OrderController.index);
routes.get('/orders/:id', OrderController.show);
routes.post('/orders', OrderController.store);
routes.put('/orders/:id', OrderController.update);
routes.delete('/orders/:id', OrderController.destroy);

export default routes;