
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const upload = require("../../middleware/uploadImage.js");
const fs = require('fs');
const path = require('path');
const User = require("../../models/user.js");
const {
  checkAdmin
} = require("../../middleware/checkAuthenticated.js");

router.get("/", checkAdmin, async (req, res) => {
  try {
    const authors = await Authors.find({});
    res.render("admin/adminDashBoard", {
      layout: "./layouts/admin/admindashboardLayout",
      title: "Admin Dashboard",
      messages: req.flash(),
    });
  } catch (error) {
    // Render the 404 error page
    res.status(404).render("404", {
      layout: "./layouts/admin/admindashboardLayout",
      title: "Page Not Found",
      messages: req.flash(),
    });
  }
});





// Define /admin/auth/logout route
router.get('/auth/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error logging out');
        }
        res.redirect('/');
      });
});

module.exports = router;
