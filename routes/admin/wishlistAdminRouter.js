
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const WishlistItem = require('../../models/Wishlist');

// Get all wishlist items
router.get('/', async (req, res) => {
  try {
    const wishlistItems = await WishlistItem.find({});
    res.render('admin/wishlistAdmin', {
      layout: './layouts/admin/itemsManagementLayout',
      title: 'Wishlist Management',
      wishlistItems: wishlistItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Get a single wishlist item by ID
router.get('/:id', async (req, res) => {
  try {
    const wishlistItem = await WishlistItem.findById(req.params.id);
    if (!wishlistItem) {
      return res.status(404).json({ error: 'Wishlist Item not found' });
    }
    res.json(wishlistItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//aprove wishlist bby id
router.post('/approve/:id', async (req, res) => {
  try {
    const wishlistItemId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(wishlistItemId)) {
      return res.status(400).json({ error: 'Invalid Wishlist Item ID' });
    }

    const updatedWishlistItem = await WishlistItem.findByIdAndUpdate(
      wishlistItemId,
      { $set: { approveWishlist: true } },
      { new: true } // Return the updated document
    );

    if (!updatedWishlistItem) {
      return res.status(404).json({ error: 'Wishlist Item not found' });
    }
    res.status(200).json({ message: 'Wishlist has been approved sucessfully' });
    res.json(updatedWishlistItem);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/delete/:id', async (req, res) => {
  try {
    const wishlistItemId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(wishlistItemId)) {
      return res.status(400).json({ error: 'Invalid Wishlist Item ID' });
    }

    const deletedWishlistItem = await WishlistItem.findByIdAndDelete(wishlistItemId);

    if (!deletedWishlistItem) {
      return res.status(404).json({ error: 'Wishlist Item not found' });
    }

    res.status(200).json({ message: 'Wishlist Item deleted successfully' });
  } catch (error) {
    console.error('Error in delete route:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

module.exports = router;
