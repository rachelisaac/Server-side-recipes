import { Schema, model } from 'mongoose';
import Joi from 'joi';

// הגדרת הסכמה של המתכון
const recipSchema = new Schema({
    name: String,
    description: String,
    category: Joi.array().items(Joi.string().hex().length(24).required()),
    timeInMinutes: Number,
    level: { type: Number, enum: [1, 2, 3, 4, 5], },
    createdAt: { type: Date, default: Date.now },
    layers: Joi.array().items(
        Joi.object({
            description: Joi.string().required(),
            ingredients: Joi.string().required()
        })
    ).optional(),
    isPrivate: Boolean,
    user: { type: Schema.Types.ObjectId, ref: 'user' },
});

// הגדרת הסכמה של Joi לבדיקת הנתונים
const recipeValidationSchema = Joi.object({
    name: Joi.string().min(3).required(),
    description: Joi.string().optional(),
    category: Joi.array().items(Joi.string().hex().length(24).required()),
    timeInMinutes: Joi.number().integer().min(1).required(),
    level: Joi.number().valid(1, 2, 3, 4, 5).required(),
    createdAt: Joi.date().optional(),
    layers: Joi.array().items(
        Joi.object({
            description: Joi.string().required(),
            ingredients: Joi.string().required(),
        })
    ).optional(),
    isPrivate: Joi.boolean().optional(),
    user: Joi.string().hex().length(24).required()
});


// פונקציה לבדיקת תקינות הנתונים
const validateRecipe = (recipe) => {
    const { error } = recipeValidationSchema.validate(recipe);
    if (error) {
        throw new Error(`Validation failed: ${error.details.map(x => x.message).join(', ')}`);
    }
};

// לפני כל שמירה על המתכון, נוודא שהוא תקין
recipSchema.pre('save', function(next) {
    try {
        validateRecipe(this);  // בדוק את הנתונים לפני השמירה
        next();  // אם הכל תקין, המשך בשמירה
    } catch (err) {
        next(err);  // אם יש שגיאה, תפס אותה ואל תמשיך בשמירה
    }
});

export default model('recipe', recipSchema);
