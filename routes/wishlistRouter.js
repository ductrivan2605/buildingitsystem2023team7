// routes/wishlist.js
const express = require('express');
const router = express.Router();
const WishlistItem = require('../models/Wishlist')
const upload = require("../middleware/uploadImage.js");



/* router.post('/', async (req, res) => {
    try {
      const { author, title, date, image } = req.body;
      console.log('Received data:', { author, title, date, image });
  
      // Create a new wishlist item
      const newWishlistItem = new WishlistItem({
        author,
        title,
        date,
        image,
      });
  
      // Save the wishlist item to the database
      await newWishlistItem.save();
  
      console.log('Wishlist item saved successfully');
      res.status(201).json({ message: 'Wishlist item submitted successfully' });
    } catch (error) {
      console.error('Error submitting wishlist item:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }); */
  
// Render all wishlist items
router.get("/", async (req, res) => {
  try {
    res.render("user/wishlist", {
      layout: "./layouts/user/wishlistUserLayout",
  
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}); 


router.post('/', upload.single("imageWishlist") , async (req, res) => {
  try {
    const { authorWishlist, titleWishlist, dateWishlist, approveWishlist } = req.body;
    const imageWishlist = req.file ? req.file.filename : null;

    // Log received data
    console.log('Received data:', { authorWishlist, titleWishlist, dateWishlist, imageWishlist, approveWishlist });

    const newWishlistItem = new WishlistItem({
      authorWishlist: authorWishlist,
      titleWishlist: titleWishlist,
      dateWishlist: dateWishlist,
      imageWishlist: imageWishlist,
      // Update the field name to approveWishlist
      approveWishlist: approveWishlist,
    });

    // Save the wishlist item to the database
    await newWishlistItem.save();

    // Respond immediately without interacting with the database
    // res.status(201).json({ message: 'Wishlist item submitted successfully' });
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
