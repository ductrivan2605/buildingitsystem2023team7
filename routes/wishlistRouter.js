// routes/wishlist.js
const express = require('express');
const WishlistItem = require('../models/Wishlist');
const wishlistRouter = express.Router();

// Route to handle form submission
wishlistRouter.post('/submitWishlist', async (req, res) => {
  try {
    // Create a new WishlistItem instance with data from the form
    const newWishlistItem = new WishlistItem({
      authorWishlist: req.body.authorWishlist,
      titleWishlist: req.body.titleWishlist,
      dateWishlist: req.body.dateWishlist,
      imageWishlist: req.body.imageWishlist,
    });

    // Save the new WishlistItem to MongoDB
    await newWishlistItem.save();

    console.log('New wishlist item submitted:', newWishlistItem);
    res.redirect('/wishlistadmin.html'); 
  } catch (error) {
    console.error('Error submitting wishlist item:', error);
    res.status(500).send('Internal Server Error');
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

module.exports = wishlistRouter;
