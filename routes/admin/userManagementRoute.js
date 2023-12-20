const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require("../../models/user.js");
const fs = require('fs').promises;
const upload = require("../../middleware/uploadImage.js");

// GET /admin - View all users 
router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.render("admin/userManagement", {
      layout: "./layouts/admin/itemsManagementLayout",
      title: "User Management",
      users: users,
    });
  } catch (error) {
    res.send(error);
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
router.post('/add-user', upload.single([{
  name:"image", maxCount: 1
}]), async (req, res) => {
  try {
    // if (req.user.role !== 'admin') {
    //   return res.status(403).send('Access denied');
    const {
      name,
      username,
      email,
      password,
      address,
      subaddress,
      country,
      role
    } = req.body;
    //get the filenames for profileImage
    const image = req.file ? req.file.filename : null;

    // Check if the username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).send('Username or email already exists');
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const user = await User.create({
      image: image,
      name: name,
      username: username,
      email: email,
      password: hashedPassword,
      address: address,
      subaddress: subaddress,
      country: country,
      role
    });

    console.log("Added new user:", user);
    await user.save();
    res.redirect('/admin/users-management');
  } catch (error) {
    res.status(500).send("Can't add user");
    console.log(error.message)
  }
});
// POST /admin/user/update/:id - Update user by ID
router.post('/update/:id',
 upload.single('editImage'), 
 async (req, res) => {
  try {
    const userId = req.params.id;

    const {
      name,
      username,
      email,
      password,
      address,
      subaddress,
      country,
      role,
    } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.redirect("/admin/users-management");
    }

    // Construct a dynamic update object
    const updateFields = {};
    if (name) updateFields.name = name;
    if (username) updateFields.username = username;
    if (email) updateFields.email = email;
    if (address) updateFields.address = address;
    if (subaddress) updateFields.subaddress = subaddress;
    if (country) updateFields.country = country;
    if (role) updateFields.role = role;

    // Update profile image if a new image is uploaded
    if (req.file) {
      // Delete the old profile image if it exists
      if (user.image) {
        const oldImageFilePath = path.resolve(__dirname, "../../public/images", user.image);
        if (fs.existsSync(oldImageFilePath)) {
          fs.unlinkSync(oldImageFilePath);
        }
      }
      // Save the new profile image
      user.image = req.file.filename;
    }

    // Check if a new password is provided and hash it
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send('User not found');
    }
    console.log(updatedUser);
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete a user
router.post('/delete/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      req.flash('rejected', 'User not found!');
      res.redirect('/admin/users-management');
      return;
    }

    // Delete user profile image if exists
    if (user.image) {
      const imagePath = path.join(__dirname, '../../public/images', user.image);
      try {
        await fs.unlink(imagePath);
      } catch (error) {
        console.error('Error deleting profile image:', error);
      }
    }

    // Delete the user document
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/admin/users-management');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete all users
router.post('/delete-all-users', async (req, res) => {
  try {
    const deletedUsers = await User.find({});

    for (const deletedUser of deletedUsers) {
      await User.findByIdAndDelete(deletedUser._id);

      // Delete profile image if exists
      if (deletedUser.image) {
        const imagePath = path.join(__dirname, '../../public/profile-images', deletedUser.image);
        try {
          await fs.unlink(imagePath);
        } catch (error) {
          console.error('Error deleting profile image:', error);
        }
      }
    }
    res.status(202).redirect('/admin/users-management');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
// Search for users
router.post("/search", async(req, res) => {
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
