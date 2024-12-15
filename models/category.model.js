import { Schema,model } from 'mongoose';


const categorySchema = new Schema({
    description: { type: String, required: true },
    recipesQuantity: { type: Number, default: 0 }

});

export default model('category', categorySchema);