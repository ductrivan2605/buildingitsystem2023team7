const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const Feedback = require('../../models/feedback');
const { checkAuthenticated } = require("../../middleware/checkAuthenticated.js");


router.get("/", checkAuthenticated, async (req, res) => {
  try {
      res.render("user/feedback", {
          layout: "./layouts/user/feedbackLayout",
          title: "Feedback",
      });
  } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
  }
});


router.post("/", checkAuthenticated, async (req, res) => {
  try {
      const newFeedback = new Feedback({
          feedbackCategory: req.body.feedbackCategory,
          feedbackText: req.body.feedbackText,
          
      });

      await newFeedback.save();
      
      res.redirect('/'); 
  } catch (error) {
      console.log(error);
      
      res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
