import express from 'express';
import { GetAllCategories,GetAllCategoriesAndRecipes,GetAllCategoriesAndRecipesByName } from '../controllers/category.controller.js';
import { auth } from '../middlwares/auth.middlwares.js'

const router = express.Router();

// קבלת כל הקטגוריות
router.get('/', GetAllCategories);

// קבלת כל הקטגוריות עם המתכונים
router.get('/recipes',auth, GetAllCategoriesAndRecipes);

// קבלת קטגוריה לפי שם וכל המתכונים בקטגוריה זו
router.get('/recipes/name',auth, GetAllCategoriesAndRecipesByName);


export default router;





