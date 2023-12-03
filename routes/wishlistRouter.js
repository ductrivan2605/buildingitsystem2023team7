const express = require('express');
const router = express.Router();
const path = require('path');
const WishlistItem = require('../models/wishlist');

router.get('/wishlist', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'partial', 'wishlist.ejs'));
});

// Get all wishlist items
router.get('/wishlist-items', async (req, res) => {
  try {
    const wishlistItems = await WishlistItem.find({});
    res.json(wishlistItems);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// Handle POST requests to submit a wishlist item
router.post('/submit-wishlist', async (req, res) => {
  try {
    const wishlistData = req.body;
    const wishlistItem = new WishlistItem(wishlistData);
    await wishlistItem.save();
    res.json({ message: 'Wishlist item submitted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// Update a wishlist item
router.post('/update-wishlist/:id', async (req, res) => {
  try {
    const wishlistItemId = req.params.id;
    const wishlistData = req.body;

    const updatedWishlistItem = await WishlistItem.findByIdAndUpdate(
      wishlistItemId,
      wishlistData,
      { new: true } // Return the updated document
    );

    if (!updatedWishlistItem) {
      return res.status(404).json({ message: 'Wishlist item not found' });
    }

    res.json(updatedWishlistItem);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// Delete a wishlist item
router.delete('/delete-wishlist/:id', async (req, res) => {
  try {
    const wishlistItemId = req.params.id;

    const deletedWishlistItem = await WishlistItem.findByIdAndDelete(wishlistItemId);

    if (!deletedWishlistItem) {
      return res.status(404).json({ message: 'Wishlist item not found' });
    }

    res.json({ message: 'Wishlist item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

module.exports = router;