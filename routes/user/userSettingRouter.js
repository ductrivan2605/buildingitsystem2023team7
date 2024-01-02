
//routes/user/userSettingRouter.js
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require("../../models/user.js");
const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const upload = require("../../middleware/uploadImage.js");
const { checkAuthenticated } = require("../../middleware/checkAuthenticated.js");

router.get("/", checkAuthenticated, async (req, res) => {
    try {
        const userId = req.user.id;
        // Fetch users from the database using Mongoose
        const users = await User.find();
        res.render("user/setting", {
            layout: "./layouts/user/userLayout",
            title: "User Setting",
            users: users,  // Pass the users data to the render function
            messages: req.flash(),
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/update/:id', checkAuthenticated, upload.single('editProfileImage'), async (req, res) => {
  console.log('Reached update route');
  const userId = req.params.id;
  const { name, email, currentPassword, newPassword, repeatPassword } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.redirect("/user/settings");
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(400).send('Current password is incorrect');
    }

    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;

    if (req.file) {
      // Delete the old profile image if it exists
      if (user.image) {
        const oldImageFilePath = path.join(__dirname, '../public', user.image);
        try {
          await fs.unlink(oldImageFilePath);
        } catch (error) {
          console.error(`Error deleting old image: ${error.message}`);
        }
      }
      // Save the new profile image
      updateFields.image = '/images/' + req.file.filename;
    }

    if (newPassword && newPassword === repeatPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateFields.password = hashedPassword;
    }

    const updatedUser = await User.findOneAndUpdate({ _id: userId }, updateFields, { new: true });

    if (!updatedUser) {
      return res.status(404).send('User not found');
    }

    console.log('Updated user:', updatedUser);
    res.redirect('/user/settings');
  } catch (error) {
    console.error('Error in update route:', error);
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

module.exports = router;
