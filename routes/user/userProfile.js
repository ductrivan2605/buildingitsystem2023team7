const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require("../../models/user.js");
const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const { checkAuthenticated } = require("../../middleware/checkAuthenticated.js");

router.get("/", checkAuthenticated, async (req, res) => {
    try {
        const userId = req.user.id;
        const users = await User.find();
        console.log("User ID:", userId); // Log user ID
        res.render("user/profile", {
            layout: "./layouts/user/userProfilePage",
            title: "Profile",
            users: users,
            user: req.user,
            messages: req.flash(),
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
  });

  router.get('/change', (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error logging out');
      }
      res.redirect('/auth/signin');
    });
  });

  module.exports = router;