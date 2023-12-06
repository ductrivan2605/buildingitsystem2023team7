
const express = require('express');
const router = express.Router();
const WishlistItem = require('../models/Wishlist'); 

router.get('/wishlist', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'partials','wishlist.html'));
});

// Handle POST requests to submit a wishlist item
router.post('/submit-wishlist', async (req, res) => {
  const wishlistData = req.body;

  // Save the wishlist item to MongoDB
  const wishlistItem = new WishlistItem(wishlistData);
  await wishlistItem.save();

  // Send a response to the client
  res.json({ message: 'Wishlist item submitted successfully!' });
});

module.exports = router;
