// routes/wishlist.js
const express = require('express');
const router = express.Router();
const WishlistItem = require('../models/Wishlist')
const upload = require("../middleware/uploadImage");
const fetchUserData = require('../middleware/fetchUserData');

//render all wishlist
router.get('/',fetchUserData, async (req, res) => {
  try {
    const wishlistItems = await WishlistItem.find({});
    res.render('user/wishlist', {
      layout: './layouts/user/wishlistUserLayout',
      title: 'Wishlist',
      wishlistItems: wishlistItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

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



router.post('/', upload.single('imageWishlist'), async (req, res) => {
  try {
    const { authorWishlist, titleWishlist, dateWishlist, approveWishlist } = req.body;
    const imageWishlist = req.file ? req.file.filename : null;

    // Log received data
    console.log('Received data:', { authorWishlist, titleWishlist, dateWishlist, imageWishlist, approveWishlist });

    const newWishlistItem = new WishlistItem({
      authorWishlist,
      titleWishlist,
      dateWishlist,
      imageWishlist,
      approveWishlist,
    });

    // Save the wishlist item to the database
    await newWishlistItem.save();

    // Respond immediately without interacting with the database
    res.redirect('/wishlist');
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
