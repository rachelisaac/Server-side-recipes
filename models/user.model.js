
import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import Joi from 'joi'; // Import Joi for validation

// Define the Joi validation schema
const userValidationSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
    address: Joi.object({
        city: Joi.string().required(),
        street: Joi.string().required(),
        num: Joi.number().integer().required(),
    }).required(),
    role: Joi.string().valid('admin', 'user', 'guest'),
});

// Define the Mongoose schema
const userSchema = new Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, lowercase: true, unique: true, required: true },
    address: {
        city: { type: String, required: true },
        street: { type: String, required: true },
        num: { type: Number, required: true },
    },
    role: { type: String, enum: ['admin', 'user', 'guest'], default: 'guest' },
});

// Pre-save hook with Joi validation and password hashing
userSchema.pre('save', async function (next) {
    try {
        // Validate the data using Joi
        const { error } = userValidationSchema.validate({
            name: this.name,
            password: this.password,
            email: this.email,
            address: {
                city: this.address.city,
                street: this.address.street,
                num: this.address.num,
            },
            role: this.role,
        });

        if (error) {
            // If validation fails, throw the error
            throw new Error(error.details[0].message);
        }

        // Hash the password if it's valid
        const newPass = await bcrypt.hash(this.password, 10);
        this.password = newPass;

        next();
    } catch (err) {
        next(err);
    }
});

export default model('user', userSchema);
