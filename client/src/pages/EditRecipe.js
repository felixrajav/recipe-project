import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import './editRecipe.css';

const EditRecipe = () => {
  const { recipeId } = useParams();

  const [recipe, setRecipe] = useState({
    name: "",
    description: "",
    ingredients: [],
    instructions: "",
    imageUrl: "",
    cookingTime: 0,
  });

  const [actualAuthTokenVariable, setActualAuthTokenVariable] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/recipes/${recipeId}`
        );
        setRecipe(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRecipe({ ...recipe, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const token = "your_token_here"; // Replace with your actual token
      setActualAuthTokenVariable(token);
      console.log(`Bearer ${actualAuthTokenVariable}`);
  
      const updatedRecipe = {
        name: recipe.name,
        description: recipe.description,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        imageUrl: recipe.imageUrl,
        cookingTime: recipe.cookingTime,
      };
  
      await axios.put(
        `http://localhost:3001/recipes/${recipeId}`,
        updatedRecipe,
        {
          headers: {
            Authorization: `Bearer ${actualAuthTokenVariable}`,
          },
        }
      );
  
      alert("Recipe updated successfully");
      navigate("/"); // Redirect to home page or recipe list
    } catch (error) {
      console.error(error); 
    }
  };
  

  return (
    <div className="edit-recipe-container">
      <h2>Edit Recipe</h2>
      <form className="edit-recipe-form">
        <label className="edit-recipe-label" htmlFor="name">
          Name
        </label>
        <input
          className="edit-recipe-input"
          type="text"
          id="name"
          name="name"
          value={recipe.name}
          onChange={handleChange}
        />

        <label className="edit-recipe-label" htmlFor="description">
          Description
        </label>
        <textarea
          className="edit-recipe-textarea"
          id="description"
          name="description"
          value={recipe.description}
          onChange={handleChange}
        />

        <label htmlFor="ingredients">Ingredients</label>
        <textarea
          id="ingredients"
          name="ingredients"
          value={recipe.ingredients.join("\n")}
          onChange={handleChange}
        />

        <label htmlFor="instructions">Instructions</label>
        <textarea
          id="instructions"
          name="instructions"
          value={recipe.instructions}
          onChange={handleChange}
        />

        <label htmlFor="imageUrl">Image URL</label>
        <input
          type="text"
          id="imageUrl"
          name="imageUrl"
          value={recipe.imageUrl}
          onChange={handleChange}
        />

        <label htmlFor="cookingTime">Cooking Time (minutes)</label>
        <input
          type="number"
          id="cookingTime"
          name="cookingTime"
          value={recipe.cookingTime}
          onChange={handleChange}
        />

        <button className="edit-recipe-button" onClick={handleUpdate}>
          Update Recipe
        </button>
      </form>
    </div>
  );
};

export default EditRecipe;
