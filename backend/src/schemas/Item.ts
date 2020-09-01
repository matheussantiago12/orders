import { Schema, model, Document, Mongoose } from 'mongoose';
import { IProduct } from './Product';

export interface IItem extends Document {
    product: IProduct;
    quantity: number;
    totalValue?: number;
}

const ItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
    },
    quantity: Number,
    totalValue: Number,
}, {
    timestamps: true,
});

export default model<IItem>('Item', ItemSchema);
