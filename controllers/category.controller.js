import Category from '../models/category.model.js';
import Recipe from '../models/recipe.model.js';

// קבלת כל הקטגוריות***********************
export const GetAllCategories = async function (req, res, next, sendResponse = true) {
    try {
        console.log("i started GetAllCategories function")
        const categories = await Category.find(); 
        console.log("i finished GetAllCategories function but didnt res still")
        
        if (sendResponse) {
            res.json(categories);
        } else {
            return categories;
        }
    } catch (error) {
        next({ status: 500, error: error.message });
    }
}

// קבלת כל הקטגוריות וכל המתכונים לכל קטגוריה*******************
export const GetAllCategoriesAndRecipes = async function (req, res, next) {
    try {
        console.log("i am in GetAllCategoriesAndRecipes function")
        const categories = await GetAllCategories(req, res, next, false); ;  // קוראים לפונקציה שמחזירה את כל הקטגוריות
        console.log(categories);
        const categoriesWithRecipes = [];
        
        console.log("User ID:", req.user_id);
        console.log("Is Admin:", req.user_role);
        
        for (let category of categories) {
            const recipes = await Recipe.find({
                'category': category.id,
                $or: [
                    { user: req.user_id }, // בדיקה אם המשתמש הנוכחי הוא זה שיצר את המתכון
                    { isAdmin: req.user_isAdmin }, // בדיקה אם המשתמש הנוכחי הוא מנהל
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
        console.log("i am in the end of GetAllCategoriesAndRecipes function")
        console.log(categoriesWithRecipes);
        res.json(categoriesWithRecipes);
        
    } catch (error) {
        next({ status: 500, error: error.message });
    }
};


// קבלת קטגוריה לפי שם וכל המתכונים בקטגוריה זו*******************************
export const GetAllCategoriesAndRecipesByName = async function (req, res, next) {
    try {
        const name = req.params.name;
        const categoriesWithRecipes = await GetAllCategoriesAndRecipes(); 
        const CategoriesWithRecipesByName = categoriesWithRecipes.filter(c =>
            c.category.name.toLowerCase() === name.toLowerCase()); // חיפוש בקטגוריות לפי שם
        res.json(CategoriesWithRecipesByName);
    } catch (error) {
        next({ status: 500, error: error.message });
    }
}
