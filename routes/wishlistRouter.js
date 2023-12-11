// routes/wishlist.js
const express = require('express');
const router = express.Router();
const WishlistItem = require('../models/Wishlist')

//render all wishlist

// Route to handle form submission
router.post('/submitWishlist', async (req, res) => {
  try {
    res.render("user/wishlist", {
      layout: "./layouts/user/wishlistUserLayout",
  
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}); 


  router.post('/', async (req, res) => {
    try {
      const { authorWishlist, titleWishlist, dateWishlist, imageWishlist } = req.body;
  
      // Log received data
      console.log('Received data:', { authorWishlist, titleWishlist, dateWishlist, imageWishlist });

      const newWishlistItem = new WishlistItem({
        authorWishlist: authorWishlist,
        titleWishlist: titleWishlist,
        dateWishlist: dateWishlist,
        imageWishlist: imageWishlist,
      });
  
      // Save the wishlist item to the database
      await newWishlistItem.save();
  
      // Respond immediately without interacting with the database
      res.status(201).json({ message: 'Wishlist item submitted successfully' });
    } catch (error) {
      console.error('Error in route handling:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  
/* 
router.post('/', async (req, res) => {
    try {
      console.log('Received data:', req.body);
  
      res.status(200).json({ message: 'Received data successfully' });
    } catch (error) {
      console.error('Error in route handling:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
   */

module.exports = router;
