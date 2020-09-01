import { Schema, model, Document, Mongoose } from 'mongoose';
import { IItem } from './Item';

enum Situation {
    EmAnalise = 0,
    Aprovado = 1,
    Cancelado = 2
}

interface IOrder extends Document {
    items?: IItem[];
    totalValue?: number;
    description: string;
    situation?: Situation;
}

const OrderSchema = new Schema({
    items: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Item',
        },
    ],
    totalValue: Number,
    description: String,
    situation: {
        type: String,
        enum: [0, 1, 2],
        default: 0
    },
}, {
    timestamps: true,
});

export default model<IOrder>('Order', OrderSchema);
