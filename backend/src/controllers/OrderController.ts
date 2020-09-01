import { Request, Response } from 'express';
import Order from '../schemas/Order';

class OrderController {
    public async index (req: Request, res: Response): Promise<Response> {
        try {
            const orders = await Order.find();
            
            return res.json(orders);
        } catch (error) {
            return res.status(400).send({ error: 'Error on loading orders'});
        }
    }

    public async show (req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            let order = await Order.findById(id);
            order = await order!.populate('items').execPopulate();
            order = await order!.populate('items.product').execPopulate();

            return res.json(order);
        } catch (error) {
            return res.status(400).send({ error: 'Error on loading order'});
        }
    }

    public async store (req: Request, res: Response): Promise<Response> {
        try {
            const { items, description } = req.body;
            let order = await Order.create({ description });
            let totalValue = 0;
            order.items?.push(...items);
            order = await order.populate('items').execPopulate();
            order.items?.map(item => {
                totalValue += item.totalValue!;
            });
            order.totalValue = totalValue;
            order.save();

            return res.json(order);
        } catch (error) {
            return res.status(400).send({ error: 'Error on creating order'});
        }
    }

    public async update (req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const { description, situation } = req.body;

            const order = await Order.findByIdAndUpdate(id, { description, situation }, {});

            return res.json(order);
        } catch (error) {
            return res.status(400).send({ error: 'Error on updating order'});
        }
    }

    public async destroy (req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params; 
            await Order.findByIdAndRemove(id);

            return res.json({
                message: 'Order successfully deleted',
                id,
            });
        } catch (error) {
            return res.status(400).send({ error: 'Error on removing order'});
        }
    }
}

export default new OrderController();
