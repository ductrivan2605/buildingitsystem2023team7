const express = require('express');
const router = express.Router();
const User = require("../../models/user.js");
const { checkAdmin } = require("../../middleware/checkAuthenticated.js");
const fetchUserData = require('../../middleware/fetchUserData.js');

// GET /admin/user-reading-progress - View user reading progress
router.get("/:userId",fetchUserData, checkAdmin, async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      // If the user is not found, redirect or handle as appropriate
      return res.status(404).render('error', { message: 'User not found', error: {} });
    }

    res.render('admin/userReadingProgress', {
      layout: './layouts/admin/itemsManagementLayout',
      title: `User Reading Progress - ${user.username}`,
      user: user,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).render('error', { message: 'Internal Server Error', error: error });
  }
});

module.exports = router;
