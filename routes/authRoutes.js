const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/user');

router.get('/', (req, res) => {
  res.render('signin');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/configure', (req, res) => {
  res.render('configure')
});
router.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
      role: 'standard' // 'admin' for admin users
    });
    await user.save();
    console.log(user);
    res.redirect('/auth/signin');
  } catch (error) {
    res.status(500).send('Error registering user');
  }
});

router.post('/signin', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(404).send('User not found');
  }

  try {
    if (await bcrypt.compare(password, user.password)) {
      res.send(`Welcome, ${user.username}!`);
    } else {
      res.status(401).send('Invalid password');
    }
  } catch (error) {
    res.status(500).send('Error signing in');
  }
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
    user.email = email;
    user.address = address;
    user.subaddress = subaddress;
    user.country = country;

    await user.save();
    res.redirect('/dashboard'); // Redirect to profile viewing page
  } catch (error) {
    res.status(500).send('Error updating user information');
  }
});

module.exports = router;
