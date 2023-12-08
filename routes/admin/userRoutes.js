const express = require('express');
const router = express.Router();
const User = require('../../models/user');

// GET /user/:id/profile route to display user profile and configuration form
router.get('/:id/profile', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.render('userProfile', { user });
  } catch (error) {
    res.status(500).send('Error fetching user');
  }
});

// POST /user/:id/profile route to update user information
router.post('/:id/profile', async (req, res) => {
  try {
    const { name, email, address, subaddress, country } = req.body;
    await User.findByIdAndUpdate(req.params.id, {
      name,
      email,
      address,
      subaddress,
      country
    });
    res.redirect(`/user/${req.params.id}/profile`);
  } catch (error) {
    res.status(500).send('Error updating user information');
  }
});

module.exports = router;
