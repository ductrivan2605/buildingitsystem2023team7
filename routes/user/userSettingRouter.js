
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
      const users = await User.find();
      console.log("User ID:", userId); // Log user ID
      res.render("user/setting", {
          layout: "./layouts/user/userLayout",
          title: "User Setting",
          users: users,
          user: req.user,
          messages: req.flash(),
      });
  } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
  }
});
router.post('/update/:id', checkAuthenticated, upload.single('editProfileImage'), async (req, res) => {
  const userId = req.params.id;
  const { name, email, currentPassword, newPassword, repeatPassword } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.redirect("/user/setting");
    }

    if (!currentPassword || !(await bcrypt.compare(currentPassword, user.password))) {
      // If the current password is incorrect or required, delete the newly uploaded file
      if (req.file) {
        const newImageFilePath = path.join(__dirname, '../../public', 'images', req.file.filename);
        try {
          await fs.unlink(newImageFilePath);
        } catch (error) {
          console.error(`Error deleting new image: ${error.message}`);
        }
      }

      // Send a window alert indicating the current password is incorrect or required
      return res.send('<script>alert("Current password is incorrect or required"); window.location="/user/setting";</script>');
    }

    // Check if the updated email is unique
    if (email !== user.email) {
      const emailExists = await User.exists({ email: email });
      if (emailExists) {
        // If the email is not unique, delete the newly uploaded file
        if (req.file) {
          const newImageFilePath = path.join(__dirname, '../../public', 'images', req.file.filename);
          try {
            await fs.unlink(newImageFilePath);
          } catch (error) {
            console.error(`Error deleting new image: ${error.message}`);
          }
        }

        // Send a window alert indicating the email is not unique
        return res.send('<script>alert("Email is already in use"); window.location="/user/setting";</script>');
      }
    }

    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;

    if (req.file) {
      const oldImageFilePath = path.join(__dirname, '../../public', user.image);
      try {
        await fs.unlink(oldImageFilePath);
        // Save the new profile image only if the deletion is successful
        updateFields.image = '/images/' + req.file.filename;
      } catch (error) {
        console.error(`Error deleting old image: ${error.message}`);
        // Handle the error, but don't return, continue with the update without the new image
      }
    }

    if (newPassword && newPassword === repeatPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateFields.password = hashedPassword;
    }

    const updatedUser = await User.findOneAndUpdate({ _id: userId }, updateFields, { new: true });

    if (!updatedUser) {
      // Send a window alert indicating the user is not found
      return res.send('<script>alert("User not found!"); window.location="/user/setting";</script>');
    }

    console.log('Updated user:', updatedUser);
    res.redirect('/user/setting');
  } catch (error) {
    console.error('Error in update route:', error);

    // If there's an error, delete the newly uploaded file
    if (req.file) {
      const newImageFilePath = path.join(__dirname, '../../public', 'images', req.file.filename);
      try {
        await fs.unlink(newImageFilePath);
      } catch (deleteError) {
        console.error(`Error deleting new image: ${deleteError.message}`);
      }
    }

    // Send a window alert indicating the internal server error
    return res.send('<script>alert("Internal Server Error"); window.location="/user/setting";</script>');
  }
});







module.exports = router;
