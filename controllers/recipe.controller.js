import Recipe from '../models/recipe.model.js';

// פונקציה לשליפת כל המתכונים שאינם פרטיים ו/או המתכונים של המשתמש המחובר
export const getAllRecipes = async (req) => {
    try {
        const userId = req.user_id;
        const query = {
            $or: [
                { isPrivate: false },
                { user: userId }
            ]
        };
        if (req.query.str) {
            const searchTerm = req.query.str;
            query.$text = { $search: searchTerm };
        }
        return await Recipe.find(query)
            .populate('category', 'name')
            .populate('user', 'name')
            .exec();
    } catch (error) {
        throw { status: 500, error: error.message };
    }
};

//  קבלת מתכון לפי זמן הכנה
export const getRecipesByMinutes = async (req, res, next) => {
    try {
        const minutes = parseInt(req.params.minutes, 10);
        const recipes = await getAllRecipes(req);
        const filteredRecipes = recipes.filter(recipe => recipe.timeInMinutes <= minutes);
        res.json({ recipes: filteredRecipes });
    } catch (error) {
        next(error);
    }
};



// הוספת מתכון
export const addRecipe = async (req, res, next) => {
    if (req.user_role !== 'user' && req.user_role !== 'admin')
        return next({ status: 403, error: 'only user can add Recipe' });
    try {
        const newRecipe = new Recipe(req.body);
        newRecipe.user = req.user;
        for (let categoryName of newRecipe.categories) {
            // חיפוש קטגוריה לפי שם (description)
            const categoryExists = await Category.findOne({ description: categoryName });

            if (categoryExists) {
                // אם הקטגוריה קיימת, עדכון המונה שלה
                categoryExists.recipesQuantity += 1;
                await categoryExists.save(); // שמירה של הקטגוריה עם עדכון המונה
            } else {
                // אם הקטגוריה לא קיימת, הוספה של קטגוריה חדשה
                const newCategory = new Category({
                    description: categoryName,  // שם הקטגוריה
                    recipesQuantity: 1,  // המונה מתחיל ב-1
                });
                await newCategory.save();  // שמירה של הקטגוריה החדשה
            }
        }
        await newRecipe.save(); // שמירה בדטהבייס בודקת תקינות
        res.status(201).send(newRecipe); // האוביקט שנוסף עם הקוד האוטומטי
    } catch (error) {
        next({ error: error.message, status: 400 })
    }
};


// עדכון מתכון
export const updateRecipe = async (req, res, next) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).send({ error: 'Recipe not found' });
        }
        if (recipe.user.toString() !== req.user_id && req.user_role !== 'admin') {
            return res.status(403).send({ error: 'Unauthorized' });
        }
        recipe.name = req.body.name || recipe.name;
        recipe.description = req.body.description || recipe.description;
        recipe.timeInMinutes = req.body.timeInMinutes || recipe.timeInMinutes;
        recipe.level = req.body.level || recipe.level;
        recipe.isPrivate = req.body.isPrivate || recipe.isPrivate;
        const oldCategories = recipe.category || [];  // קטגוריות ישנות
        const newCategories = req.body.category || [];  // קטגוריות חדשות
        // מחיקת קטגוריות ישנות שלא קיימות עוד במתכון
        for (let categoryName of oldCategories) {
            if (!newCategories.includes(categoryName)) {
                const categoryExists = await Category.findOne({ description: categoryName });
                if (categoryExists) {
                    categoryExists.recipesQuantity -= 1;
                    if (categoryExists.recipesQuantity === 0) {
                        await Category.deleteOne({ _id: categoryExists._id });
                    } else {
                        await categoryExists.save();
                    }
                }
            }
        }
        // הוספת קטגוריות חדשות שלא קיימות עדיין
        for (let categoryName of newCategories) {
            if (!oldCategories.includes(categoryName)) {
                const categoryExists = await Category.findOne({ description: categoryName });
                if (categoryExists) {
                    categoryExists.recipesQuantity += 1;
                    await categoryExists.save();
                } else {
                    const newCategory = new Category({
                        description: categoryName,
                        recipesQuantity: 1,  // המונה מתחיל ב-1
                    });
                    await newCategory.save();
                }
            }
        }
        recipe.category = newCategories;
        await recipe.save();
        res.status(200).send(recipe);
    } catch (error) {
        next({ error: error.message, status: 400 });
    }
};

//מחיקת מתכון רק מנהל או המשתמש שכתב יכולים למחוק
export const deleteRecipe = async (req, res, next) => {
    try {
        const id = req.params.id;
        const recipe = await Recipe.findById(id);

        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        if (recipe.user.toString() !== req.user_id && req.user_role !== 'admin') {
            return res.status(403).json({ error: 'You are not authorized to delete this recipe' });
        }
        await Recipe.findByIdAndDelete(id);
        res.status(204).json();
    } catch (error) {
        next({ error: error.message });
    }
};


// קבלת המתכונים למשתמש מסוים
export const getRecipesByUserId = async function (req, res, next) {
    const UserId = req.params.id;
    try {
        const recipes = await Recipe.find({ user: UserId });
        res.json(recipes);
    }
    catch (error) {
        next({ status: 500, error: error.message });
    }
}

// קבלת פרטי מתכון לפי קוד מתכון
export const getRecipeById = async (req, res, next) => {
    const id = req.params.id;
    try {
        const recipe = await Recipe.findById(id).populate('user_id');
        if (!recipe) {
            next({ status: 404, error: "recipe not found" }); 
        } 
        if (recipe.user._id.toString() !== req.user_id && req.user_role !== 'admin') {
            return res.status(403).send({ error: 'Unauthorized' });
        }
        res.json(recipe);
    } catch (error) {
        next({ error: error.message });
    }
};


