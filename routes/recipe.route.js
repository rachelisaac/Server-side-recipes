import express from "express";
import {getAllRecipes,getRecipesByMinutes, addRecipe, deleteRecipe, updateRecipe, getRecipesByUserId, getRecipeById } from '../controllers/recipe.controller.js';
import { auth } from '../middlwares/auth.middlwares.js'

const router = express.Router();

router.get("/", auth, getAllRecipes);

router.get("/byminutes/:minutes", auth, getRecipesByMinutes);

router.post("/addRecipe", auth, addRecipe);

router.delete("/:rid", auth, deleteRecipe);

router.put("/:id", auth, updateRecipe);

router.get("/byuserid/:uid", auth, getRecipesByUserId);

router.get("/byuserid/:uid", auth, getRecipeById);

export default router;