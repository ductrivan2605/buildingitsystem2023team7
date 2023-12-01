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

router.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
      role: 'normal' // 'admin' for admin users
    });
    await user.save();
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

module.exports = router;
