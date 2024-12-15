// import Category from '../models/category.model.js';
// import Recipe from '../models/recipe.model.js';

// //קבלת כל הקטגוריות
// exports.GetAllCategories=async function (req, res, next) {
//     try{
//         const categories = await Category.find();//למה צריך לעשות פה await?
//         res.json(categories);
//     }
//     catch(error){
//         next({ status: 500, error: error.message }); 
//     }
// }

// //קבלת כל הקטגוריות וכל המתכונים לכל קטגוריה
// exports.GetAllCategoriesAndRecipes=async function (req, res, next) {
//     try{
//         const categories = await GetAllCategories();
//         const categoriesWithRecipes = [];
//         for (let category of categories) {
//             const recipes = await Recipe.find({ 'category.code': category.code });
//             categoriesWithRecipes.push({
//                 category,  
//                 recipes   
//             });
//         }
//         res.json(categoriesWithRecipes);
//     }
//     catch(error){
//         next({ status: 500, error: error.message }); 
//     }
// }

// // קבלת קטגוריה לפי שם וכל המתכונים בקטגוריה זו
// exports.GetAllCategoriesAndRecipesByName=async function (req, res, next) {
//     try{
//         const name = req.params.name;
//         const categoriesWithRecipes=await GetAllCategoriesAndRecipes();//כל הקטגוריות עם המתכונים שלה
//         const CategoriesWithRecipesByName = await categoriesWithRecipes.filter(c => 
//             c.category.name.toLowerCase() === name.toLowerCase());       
//         res.json(CategoriesWithRecipesByName);
//     }  
//     catch(error){
//         next({ status: 500, error: error.message }); 
//     }
// }
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
            const recipes = await Recipe.find({ 'category.code': category.code });  // כאן גם יש await, כי אנחנו ממתינים לתוצאה
            categoriesWithRecipes.push({
                category,
                recipes
            });
        }
        res.json(categoriesWithRecipes);
    } catch (error) {
        next({ status: 500, error: error.message });
    }
}

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
