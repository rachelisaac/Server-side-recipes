import express from 'express';
import { GetAllCategories, GetAllCategoriesAndRecipes, GetCategoryByNameWithRecipes } from '../controllers/category.controller';

const router = express.Router();

// קבלת כל הקטגוריות
router.get('/', GetAllCategories);

// קבלת כל הקטגוריות עם המתכונים
router.get('/recipes',auth, GetAllCategoriesAndRecipes);

// קבלת קטגוריה לפי שם וכל המתכונים שלה
router.get('/recipes/:name',auth, GetCategoryByNameWithRecipes);

export default router;





