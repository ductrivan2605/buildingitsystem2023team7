const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const {checkNotAuthenticated } = require("./../middleware/checkAuthenticated");

router.get("/signin",checkNotAuthenticated, async (req, res) => {
  try {
    res.render("signin", {
      layout: false,
      title: "User Authenticate",
    });
  } catch (error) {
    res.send(error);
  }
});

router.get("/register", async (req, res) => {
  try {
    res.render("register", {
      layout: false,
      title: "User Authenticate",
    });
  } catch (error) {
    res.send(error);
  }
});

router.get("/configure", async (req, res) => {
  try {
    res.render("configure", {
      layout: "./layouts/admin/itemsManagementLayout",
      title: "User Authenticate",
    });
  } catch (error) {
    res.send(error);
    res.render("404")
  }
});
router.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      name: req.body.name,
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email ||"",
      role: 'standard' // 'admin' for admin users
    });
    await user.save();
    console.log(user);
    res.redirect('/auth/signin');
  } catch (error) {
    res.status(500).send('Error registering user');
    res.render("404")
  }
});

// router.post('/signin', async (req, res) => {
//   const { username, password } = req.body;
//   const user = await User.findOne({ username });

//   if (!user) {
//     return res.status(404).send('User not found');
//   }

//   try {
//     if (await bcrypt.compare(password, user.password)) {
//       res.send(`Welcome, ${user.username}!`);
//       res.redirect("/")
//     } else {
//       res.status(401).send('Invalid password');
//     }
//   } catch (error) {
//     res.status(500).send('Error signing in');
//     res.render("404")
//   }
// });

router.post('/signin', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/signin',
  failureFlash: false, 
}), (req, res) => {
  console.log('Authentication successful');
});



// POST /auth/configure route to handle user information update
router.post('/configure', async (req, res) => {
  const { name, email, address, subaddress, country } = req.body;
  const userId = req.user._id; // Assuming user is authenticated and their ID is available in req.user

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    user.name = name;
    //addusername or nickname
    user.email = email;
    user.address = address; //we don't need
    user.subaddress = subaddress; //we don't need
    user.country = country; //we don't need

    await user.save();
    res.redirect('/configure'); // Redirect to profile viewing page
  } catch (error) {
    res.status(500).send('Error updating user information');
    res.render("404")
  }
});

module.exports = router;
