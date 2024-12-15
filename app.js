import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser'

import recipeRouter from './routes/recipe.route.js';
import categoryRouter from './routes/category.route.js';
import usersRouter from './routes/users.route.js';
import { errorHandling, pageNotFound } from './middlwares/errorHandling.middleware.js';
import { connectToDB } from './config/db.js';
import { auth } from "./middlwares/auth.middlwares.js"

// חיבור למסד נתונים
connectToDB();

const app = express();

// app.get("/", (req, res, next) => {
//     res.send("Welcome to my website");
// });

// app.use(express.json());
app.use(bodyParser.json())
app.use(cors());
app.use(morgan('dev'));

// בדיקה אם הרשמה או התחברות


// חיבור לנתיבים
app.use("/recipe", recipeRouter);
app.use("/users", usersRouter);
app.use("/category", categoryRouter);

// טיפול בשגיאות
app.use(pageNotFound);
app.use(errorHandling);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
