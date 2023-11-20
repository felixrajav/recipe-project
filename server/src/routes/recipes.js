import express from "express";
import mongoose from "mongoose";
import { RecipesModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await RecipesModel.find({});
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new recipe
router.post("/", verifyToken, async (req, res) => {
  const recipe = new RecipesModel({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    image: req.body.image,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    imageUrl: req.body.imageUrl,
    cookingTime: req.body.cookingTime,
    userOwner: req.body.userOwner,
  });
  console.log(recipe);

  try {
    const result = await recipe.save();
    res.status(201).json({
      createdRecipe: {
        name: result.name,
        image: result.image,
        ingredients: result.ingredients,
        instructions: result.instructions,
        _id: result._id,
      },
    });
  } catch (err) {
    // console.log(err);
    res.status(500).json(err);
  }
});

// Get a recipe by ID
router.get("/:recipeId", async (req, res) => {
  try {
    const result = await RecipesModel.findById(req.params.recipeId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Save a Recipe
router.put("/",  async (req, res) => {
  const recipe = await RecipesModel.findById(req.body.recipeID);
  const user = await UserModel.findById(req.body.userID);
  try {
    user.savedRecipes.push(recipe);
    await user.save();
    res.status(201).json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get id of saved recipes
router.get("/savedRecipes/ids/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    res.status(201).json({ savedRecipes: user?.savedRecipes });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Get saved recipes
router.get("/savedRecipes/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    const savedRecipes = await RecipesModel.find({
      _id: { $in: user.savedRecipes },
    });

    console.log(savedRecipes);
    res.status(201).json({ savedRecipes });
  } catch (err) { 
    console.log(err);
    res.status(500).json(err);
  }
});

router.put("/:recipeId", verifyToken, async (req, res) => {
  const { recipeId } = req.params;
  const { userId } = req.body; // Assuming you're sending the user ID in the request body

  // Check if the authenticated user has the authority to edit this recipe
  // For example, you might want to compare the `userId` from the token with the `userId` from the request body
  if (userId !== req.userId) {
    return res.status(403).json({ message: "You do not have permission to edit this recipe" });
  }

  const {
    name,
    image,
    ingredients,
    instructions,
    imageUrl,
    cookingTime,
  } = req.body;

  try {
    const updatedRecipe = await RecipesModel.findByIdAndUpdate(
      recipeId,
      {
        name,
        image,
        ingredients,
        instructions,
        imageUrl,
        cookingTime,
      },
      { new: true }
    );

    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json(updatedRecipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// Delete a recipe by ID
router.delete("/:recipeId", verifyToken, async (req, res) => {
  const { recipeId } = req.params;

  try {
    const deletedRecipe = await RecipesModel.findByIdAndRemove(recipeId);

    if (!deletedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Remove the recipe from the user's saved recipes
    await UserModel.updateMany(
      { savedRecipes: { $in: [recipeId] } },
      { $pull: { savedRecipes: recipeId } }
    );

    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


export { router as recipesRouter };