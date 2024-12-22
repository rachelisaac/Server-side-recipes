import User from '../models/user.model.js';
import { generateToken } from '../middlwares/generateToken.middleware.js';
import bcrypt from 'bcryptjs'

//קבלת כל המשתמשים -רק למנהל יש הרשאה
export const getAllUsers = async function (req, res, next) {
    try {
            const arrUsers = await User.find();
            res.json(arrUsers);
    } catch (error) {
        next({ error: error.message });
    }
}

// התחברות
export const login = async function (req, res, next) {
    console.log("1");
    const { email, password } = req.body;  // הנתונים מהלקוח
    console.log("1");
    try {
        const user = await User.findOne({ email: email });
        console.log("2");
        if (!user) {
            return next({ error: 'login failed', status: 401 });
        }

        const result = await bcrypt.compare(password, user.password); 
        if (result) {
            const token = generateToken(user); 
            user.password = '****';  // הסתרת הסיסמא לפני החזרה
            return res.json({ user_name: user.name, token });
        } else {
            return next({ error: 'login failed', status: 401 });
        }
    } catch (error) {
        next({ error: error.message });
    }
}

// הרשמה
export const register = async function (req, res, next) {
    const { name, email, password, address: { city, street, num } } = req.body;
    console.log("register");

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ error: 'User already exists' });
        }

        const newUser = new User({
            name,
            email,
            password,
            address: { city, street, num },
            role: 'user',
        });
        await newUser.save();
        console.log(newUser);

        const token =await generateToken(newUser);
        console.log(token);

        res.status(201).send({
            user: {
                name: newUser.name,
                email: newUser.email,
                address: newUser.address,
            },
            token
        });
    } catch (error) {
        next({ error: error.message, status: 400 });
    }
}



