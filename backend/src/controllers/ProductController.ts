import { Request, Response } from 'express';
import Product from '../schemas/Product';

class ProductController {
    public async index (req: Request, res: Response): Promise<Response> {
        try {
            const products = await Product.find();

            return res.json(products);
        } catch (error) {
            return res.status(400).send({ error: 'Error on loading products' });
        }
    }

    public async show (req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const product = await Product.findById(id);

            return res.json(product);
        } catch (error) {
            return res.status(400).send({ error: 'Error on loading product' });
        }
    }

    public async store (req: Request, res: Response): Promise<Response> {
        try {
            const { sku, title, price, discount } = req.body;
            const product = await Product.create({ sku, title, price, discount });
            
            return res.json(product);
        } catch (error) {
            return res.status(400).send({ error: 'Error on creating product' });
        }
        
    }

    public async update (req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const { sku, title, price, discount } = req.body;

            const product = await Product.findByIdAndUpdate(id, { sku, title, price, discount }, {});

            return res.json(product);
        } catch (error) {
            return res.status(400).send({ error: 'Error on updating product'});
        }
    }

    public async destroy (req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params; 
            await Product.findByIdAndRemove(id);

            return res.json({
                message: 'Order successfully deleted',
                id,
            });
        } catch (error) {
            return res.status(400).send({ error: 'Error on removing product'});
        }
    }
}

export default new ProductController();
