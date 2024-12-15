import Category from '../models/category.model.js';
import Recipe from '../models/recipe.model.js';

// קבלת כל הקטגוריות
export const GetAllCategories = async function (req, res, next) {
    try {
        const categories = await Category.find(); // כאן צריך await כי אנחנו מחכים לתוצאה מה-DB
        res.json(categories);
    } catch (error) {
        next({ status: 500, error: error.message });
    }
}

// קבלת כל הקטגוריות וכל המתכונים לכל קטגוריה
export const GetAllCategoriesAndRecipes = async function (req, res, next) {
    try {
        const categories = await GetAllCategories();  // קוראים לפונקציה שמחזירה את כל הקטגוריות
        const categoriesWithRecipes = [];

        for (let category of categories) {
            const recipes = await Recipe.find({
                'category.code': category.code,
                $or: [
                    { user: req.user?.id }, // בדיקה אם המשתמש הנוכחי הוא זה שיצר את המתכון
                    { isAdmin: req.user?.isAdmin }, // בדיקה אם המשתמש הנוכחי הוא מנהל
                    { isPrivate: false } // מתכון ציבורי שאינו פרטי
                ]
            });
            if (recipes.length > 0) {
                categoriesWithRecipes.push({
                    category,
                    recipes
                });
            }
        }
        res.json(categoriesWithRecipes);
        
    } catch (error) {
        next({ status: 500, error: error.message });
    }
};


// קבלת קטגוריה לפי שם וכל המתכונים בקטגוריה זו
export const GetAllCategoriesAndRecipesByName = async function (req, res, next) {
    try {
        const name = req.params.name;
        const categoriesWithRecipes = await GetAllCategoriesAndRecipes(); // מחכים שהתשובה תחזור
        const CategoriesWithRecipesByName = categoriesWithRecipes.filter(c =>
            c.category.name.toLowerCase() === name.toLowerCase()); // חיפוש בקטגוריות לפי שם
        res.json(CategoriesWithRecipesByName);
    } catch (error) {
        next({ status: 500, error: error.message });
    }
}
