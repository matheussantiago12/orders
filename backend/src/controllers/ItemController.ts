import { Request, Response } from 'express';
import Item from '../schemas/Item';

class ItemController {

    public async index (req: Request, res: Response): Promise<Response> {
        try {
            const items = await Item.find().populate('product');
            
            return res.json(items);
        } catch (error) {
            return res.status(400).send({ error: 'Error on loading items'});
        }
    }

    public async store (req: Request, res: Response): Promise<Response> {
        try {
            const { product, quantity } = req.body;
            let item = await Item.create({ product, quantity });
            item = await item.populate('product').execPopulate();
            item.totalValue = (item.product.price - (item.product.price / 100 * item.product.discount!)) * item.quantity;
            await item.save();
    
            return res.json(item); 
        } catch (error) {
            return res.status(400).send({ error: 'Error on creating item' });
        }
    }
}

export default new ItemController();
