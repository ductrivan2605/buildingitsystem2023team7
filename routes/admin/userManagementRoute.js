const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require("../../models/user.js");
const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const upload = require("../../middleware/uploadImage.js");
const {
  checkAdmin
} = require("../../middleware/checkAuthenticated.js");
const fetchUserData = require('../../middleware/fetchUserData.js');

// GET /admin - View all users 
router.get("/",fetchUserData, checkAdmin, async (req, res) => {
  try {
    const users = await User.find({});
    res.render("admin/userManagement", {
      layout: "./layouts/admin/itemsManagementLayout",
      title: "User Management",
      users: users,
      messages: req.flash(),
    });
  } catch (error) {
    res.status(404).render("404", { layout: false });
  }
});

// // GET /auth/admin/edit/:id - Edit user by ID 
// router.get('/admin/edit/:id', async (req, res) => {
//   try {
//     if (req.user.role !== 'admin') {
//       return res.status(403).send('Access denied');
//     }

//     const user = await User.findById(req.params.id);
//     res.render('edit', { user });
//   } catch (error) {
//     res.status(500).send('Error fetching user');
//   }
// });
// POST /admin/add-user - Add a new user
router.post('/add-user', checkAdmin, upload.single('profileImage'), async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      password,
      role,
    } = req.body;

    // Get the filename for the profileImage, or use default if not provided
    const image = req.file ? '/images/' + req.file.filename : '/images/userDefault.png';

    // Check if the username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).send('Username or email already exists');
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const user = new User({
      image,
      name,
      username,
      email,
      password: hashedPassword,
      role,
      readingProgress: [], // Initialize reading progress for the new user
    });

    // Save the new user
    await user.save();

    console.log('Added new user:', user);
    res.redirect('/admin/users-management');
  } catch (error) {
    console.error(error.message);
    res.status(404).render("404", { layout: false });
  }
});

// POST /admin/user/update/:id - Update user by ID
router.post('/update/:id', checkAdmin, upload.single('editProfileImage'), async (req, res) => {
  const userId = req.params.id;
  const { name, username, email, password, role } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.redirect("/admin/users-management");
    }
    

    const updateFields = {};
    if (name) updateFields.name = name;
    if (username) updateFields.username = username;
    if (email) updateFields.email = email;
    if (role) updateFields.role = role;

    if (req.file) {
      // Delete the old profile image if it exists
      if (user.image) {
        const oldImageFilePath = path.join(__dirname, '../../public', user.image);
        try {
          await fs.unlink(oldImageFilePath);
        } catch (error) {
          console.error(`Error deleting old image: ${error.message}`);
        }
      }
      // Save the new profile image
      updateFields.image = '/images/' + req.file.filename;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }

    // Use findOneAndUpdate with the filter on _id
    const updatedUser = await User.findOneAndUpdate({ _id: userId }, updateFields, { new: true });

    if (!updatedUser) {
      return res.status(404).send('User not found');
    }

    console.log('Updated user:', updatedUser);
    res.redirect('/admin/users-management');
  } catch (error) {
    console.error('Error in update route:', error);
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});
// Delete a user
router.post('/delete-user/:id', checkAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid User ID' });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (deletedUser.image) {
      const imagePath = `public${deletedUser.image}`; // Assume the image path is already in the correct format

      try {
        await fs.unlink(imagePath);
      } catch (error) {
        console.error('Error deleting image file:', error);
      }
    }

    res.redirect('/admin/users-management');
  } catch (error) {
    console.error('Error in delete route:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});
// Delete all users
router.post('/delete-all-users', checkAdmin, async (req, res) => {
  try {
    const deletedUsers = await User.find({});

    for (const deletedUser of deletedUsers) {
      // Delete profile image if exists
      if (deletedUser.image) {
        const imagePath = path.join(__dirname, '../../public', deletedUser.image);
        try {
          await fs.unlink(imagePath);
        } catch (error) {
          console.error('Error deleting profile image:', error);
        }
      }

      // Remove the image reference from the user document
      deletedUser.image = null;
      await deletedUser.save();
    }

    // Delete all user documents
    await User.deleteMany({});

    res.status(202).redirect('/admin/users-management');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Search for users
router.post("/search", checkAdmin, async(req, res) => {
  try {
    let searchTerm = req.body.search;
    const users = await User.find({
      $or: [
        { name: { $regex: searchTerm, $options: "i" } },
        { username: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
        { address: { $regex: searchTerm, $options: "i" } },
        { country: { $regex: searchTerm, $options: "i" } },
      ],
    });

    res.render("admin/userManagement",  {
      layout: "./layouts/admin/itemManagementLayout",
      users: users,
    });
  } catch (error) {
    res.status(500).send("Error searching for users");
  }
});

module.exports = router;
