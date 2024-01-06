const express = require('express');
const router = express.Router();
const User = require("../../models/user.js");
const { checkAdmin } = require("../../middleware/checkAuthenticated.js");
const fetchUserData = require('../../middleware/fetchUserData.js');

// GET /admin/user-reading-progress - View user reading progress
router.get("/:userId",fetchUserData, checkAdmin, async (req, res) => {
  try {
    const userId = req.params.userId;
    const users = await User.findById(userId).populate('readingProgress.bookId');
    res.render("admin/userReadingProgress", {
        layout: "./layouts/admin/itemsManagementLayout",
        title: "User Reading Progress",
        users: users,
        messages: req.flash(),
    });
  } catch (error) {
    console.log(error)
    res.status(404).render("404", { layout: false });
  }
});

module.exports = router;
