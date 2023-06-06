const mongoose = require('mongoose');

const foodRecipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  culture: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  file: {
    type: String,
    required: true,
  },
  uploadedBy: {
    type: String,
    required: true,
  },
});

const FoodRecipe = mongoose.model('FoodRecipe', foodRecipeSchema);

module.exports = FoodRecipe;
