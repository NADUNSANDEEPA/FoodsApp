const express = require('express');
const router = express.Router();
const FoodRecipe = require('../model/food_recipe');

// Create a new food recipe
router.post('/addRecipe', (req, res) => {
  const { title, description, file, uploadedBy , culture } = req.body;
  const newRecipe = new FoodRecipe({
    title,
    description,
    file,
    uploadedBy,
    culture
  });

  newRecipe.save()
    .then(() => {
      res.status(200).json({ message: 'Food recipe published.' });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Failed to save food recipe' });
    });
});

// Get all food recipes
router.get('/getList', (req, res) => {
  FoodRecipe.find()
    .then((recipes) => {
      res.status(200).json(recipes);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Failed to retrieve food recipes' });
    });
});

router.get('/getListForUser/:user', async (req, res) => {
  try {
    const user = req.params.user;

    // Fetch the list for the specified user using the FoodRecipe model
    const list = await FoodRecipe.find({ uploadedBy: user });

    // Return the list data
    res.json(list);
  } catch (error) {
    console.error('Error fetching list data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a specific food recipe by ID
router.get('/singlePost/:id', (req, res) => {
  const { id } = req.params;
  FoodRecipe.findById(id)
    .then((recipe) => {
      if (recipe) {
        res.status(200).json(recipe);
      } else {
        res.status(404).json({ message: 'Food recipe not found' });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Failed to retrieve food recipe' });
    });
});

router.get('/searchPost/:title', async (req, res) => {
  try {
    const { title } = req.params;
    
    // Use the LIKE operator to search for posts with matching titles
    const searchResults = await FoodRecipe.find({ title: { $regex: title, $options: 'i' } });
    
    // Return the search results
    res.status(200).json(searchResults);
  } catch (error) {
    // Handle any errors that occur during the search process
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a specific food recipe by ID
router.put('/editPost/:id', async (req, res) => {
  const postId = req.params.id;
  const { title, description, culture } = req.body;

  try {
    // Find the post by ID and update its data
    const updatedPost = await FoodRecipe.findOneAndUpdate(
      { _id: postId },
      { title, description, culture },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json({ message: 'Post updated successfully', post: updatedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});


 

// Delete a specific food recipe by ID
router.delete('/deletePost/:id', (req, res) => {
  const { id } = req.params;
  FoodRecipe.findByIdAndDelete(id)
    .then((deletedRecipe) => {
      if (deletedRecipe) {
        res.status(200).json({ message: 'Food recipe deleted successfully' });
      } else {
        res.status(404).json({ message: 'Food recipe not found' });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Failed to delete food recipe' });
    });
});

module.exports = router;
