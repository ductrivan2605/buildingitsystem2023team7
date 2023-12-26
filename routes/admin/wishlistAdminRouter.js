
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const WishlistItem = require('../../models/Wishlist');
const upload = require("../../middleware/uploadImage.js");
const fs = require('fs');
const path = require('path');
const User = require("../../models/user.js");
const {
  checkAdmin
} = require("../../middleware/checkAuthenticated.js");

let responseSent = false;

// Get all wishlist items
router.get('/', checkAdmin, async (req, res) => {
  try {
    const wishlistItems = await WishlistItem.find({ approveWishlist: false });
    const users = await User.find({});
    res.render('admin/wishlistAdmin', {
      layout: './layouts/admin/itemsManagementLayout',
      title: 'Wishlist Management',
      wishlistItems: wishlistItems,
      users: users,
      user: res.locals.user, // Pass the user object to the template
      messages: req.flash(),
    });
  } catch (error) {
    console.error(error);
    res.status(404).render("/404");
  }
});

router.get('/approved',  checkAdmin, async (req, res) => {
  try {
    const approvedWishlistItems = await WishlistItem.find({ approveWishlist: true });
    const users = await User.find({});
    res.render('admin/wishlistAdmin2', {
      layout: './layouts/admin/itemsManagementLayout',
      title: 'Approved Wishlist Items',
      wishlistItems: approvedWishlistItems,
      users: users,
      user: res.locals.user, // Pass the user object to the template
    });
  } catch (error) {
    res.status(404).render("/404");
  }
});



// Get a single wishlist item by ID
router.get('/:id', async (req, res) => {
  try {
    const wishlistItem = await WishlistItem.findById(req.params.id);

    if (!wishlistItem) {
      return res.status(404).render('error404', { error: 'Wishlist Item not found' });
    }

  

  } catch (error) {
    console.error(error);
    res.status(500).render('error500', { error: 'Internal Server Error' });
  }
});


// reset page 
router.post('/reset', async (req, res) => {
  try {
    // Your logic for resetting the wishlist goes here

    // Redirect back to the wishlist admin page after reset
    res.redirect('/admin/wishlist/');
  } catch (error) {
    res.status(404).render("/404");
  }
});

router.post('/reset2', async (req, res) => {
  try {
    // Your logic for resetting the wishlist goes here

    // Redirect back to the wishlist admin page after reset
    res.redirect('/admin/wishlist/approved');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//aprove wishlist bby id
/* router.post('/approve/:id', async (req, res) => {
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
}); */
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

    // Send the response with the updated item
    res.redirect('/admin/wishlist');

  } catch (error) {
    res.status(404).render("/404");
  }
});

router.post('/delete1/:id', async (req, res) => {
  try {
    const wishlistItemId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(wishlistItemId)) {
      return res.status(400).json({ error: 'Invalid Wishlist Item ID' });
    }

    const deletedWishlistItem = await WishlistItem.findByIdAndDelete(wishlistItemId);

    if (!deletedWishlistItem) {
      return res.status(404).json({ error: 'Wishlist Item not found' });
    }

    // Delete the associated image file asynchronously
    if (deletedWishlistItem.imageWishlist) {
      const imagePath = path.join(__dirname, '../../public/images', deletedWishlistItem.imageWishlist);
      
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Error deleting image file:', err);
        }
      });
    }

    // res.status(200).json({ message: 'Wishlist Item deleted successfully' });
    res.redirect('/admin/wishlist');
  } catch (error) {
    res.status(404).render("/404");
  }
});

router.post('/delete2/:id', async (req, res) => {
  try {
    const wishlistItemId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(wishlistItemId)) {
      return res.status(400).json({ error: 'Invalid Wishlist Item ID' });
    }

    const deletedWishlistItem = await WishlistItem.findByIdAndDelete(wishlistItemId);

    if (!deletedWishlistItem) {
      return res.status(404).json({ error: 'Wishlist Item not found' });
    }

    // Delete the associated image file asynchronously
    if (deletedWishlistItem.imageWishlist) {
      const imagePath = path.join(__dirname, '../../public/images', deletedWishlistItem.imageWishlist);
      
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Error deleting image file:', err);
        }
      });
    }

    // res.status(200).json({ message: 'Wishlist Item deleted successfully' });
    res.redirect('/admin/wishlist/approved');
  } catch (error) {
    res.status(404).render("/404");
  }
});

// wishlistAdminRouter.js
/* 
router.post('/delete-all', async (req, res) => {
  try {
    // Fetch all wishlist items to get image filenames
    const wishlistItems = await WishlistItem.find({});
    
    // Loop through wishlist items and delete associated images
    wishlistItems.forEach(async (item) => {
      if (item.imageWishlist) {
        // Assuming images are stored in the public/images directory
        const imagePath = path.join(__dirname, '../../public/images', item.imageWishlist);

        // Delete the image file
        await fs.promises.unlink(imagePath);
      }
    });

    // Delete all wishlist items from the database
    await WishlistItem.deleteMany({});

    // Redirect to the wishlist page
    res.redirect('/admin/wishlist');
  } catch (error) {
    console.error('Error in delete-all route:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}); */
router.post('/delete-all1', async (req, res) => {
  try {
    // Fetch all wishlist items to get image filenames
    const wishlistItems = await WishlistItem.find({ approveWishlist: false });

    // Loop through wishlist items and delete associated images
    for (const item of wishlistItems) {
      if (item.imageWishlist) {
        // Assuming images are stored in the public/images directory
        const imagePath = path.join(__dirname, '../../public/images', item.imageWishlist);

        // Delete the image file synchronously
        fs.unlinkSync(imagePath);
      }
    }

    // Delete all wishlist items from the database
    await WishlistItem.deleteMany({});

    // Redirect to the wishlist page
    res.redirect('/admin/wishlist');
  } catch (error) {
    res.status(404).render("/404");
  }
});

router.post('/delete-all2', async (req, res) => {
  try {
    // Fetch all wishlist items to get image filenames
    const wishlistItems = await WishlistItem.find({ approveWishlist: true });

    // Loop through wishlist items and delete associated images
    for (const item of wishlistItems) {
      if (item.imageWishlist) {
        // Assuming images are stored in the public/images directory
        const imagePath = path.join(__dirname, '../../public/images', item.imageWishlist);

        // Delete the image file synchronously
        fs.unlinkSync(imagePath);
      }
    }

    // Delete all wishlist items from the database
    const wishList = await WishlistItem.deleteMany({});
    if (!wishList) {
      req.flash("fail", "Unable to delete all wishlists!");
      res.redirect("/admin/categories");
    }
    req.flash("success", "All wishlists deleted successfully!");
    res.redirect("/admin/categories");
  } catch (error) {
    res.status(404).render("/404");
  }
});


module.exports = router;


