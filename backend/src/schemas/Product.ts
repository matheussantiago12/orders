import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
    sku: string;
    title: string;
    price: number;
    discount?: number;
}

const ProductSchema = new Schema({
    sku: String,
    title: String,
    price: Number,
    discount: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

export default model<IProduct>('Product', ProductSchema);
