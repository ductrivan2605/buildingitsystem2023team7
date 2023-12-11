// routes/wishlist.js
const express = require('express');
const router = express.Router();
const WishlistItem = require('../models/Wishlist')

//render all wishlist

// Route to handle form submission
wishlistRouter.post('/submitWishlist', async (req, res) => {
  try {
    res.render("user/wishlist", {
      layout: "./layouts/user/wishlistUserLayout",
  
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to handle approving a wishlist item
wishlistRouter.post('/approveWishlist/:id', async (req, res) => {
  try {
    const wishlistItemId = req.params.id;

    // Find the wishlist item by ID in MongoDB
    const wishlistItem = await WishlistItem.findById(wishlistItemId);

    if (!wishlistItem) {
      console.log('Wishlist item not found');
      return res.status(404).send('Wishlist item not found');
    }

    // Update the 'approved' field to true
    wishlistItem.approved = true;

    // Save the updated wishlist item
    await wishlistItem.save();

    console.log('Wishlist item approved:', wishlistItem);
    res.redirect('/wishlistadmin.html'); // Redirect to admin dashboard after approval
  } catch (error) {
    console.error('Error approving wishlist item:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to handle deleting a wishlist item
wishlistRouter.post('/deleteWishlist/:id', async (req, res) => {
  try {
    const wishlistItemId = req.params.id;

    // Find the wishlist item by ID in MongoDB
    const wishlistItem = await WishlistItem.findById(wishlistItemId);

    if (!wishlistItem) {
      console.log('Wishlist item not found');
      return res.status(404).send('Wishlist item not found');
    }

    // Remove the wishlist item from MongoDB
    await wishlistItem.remove();

    console.log('Wishlist item deleted:', wishlistItem);
    res.redirect('/wishlistadmin.html'); // Redirect to admin dashboard after deletion
  } catch (error) {
    console.error('Error deleting wishlist item:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
