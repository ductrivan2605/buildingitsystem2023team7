const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const Feedback = require('../../models/feedback');
const {
    checkAdmin
} = require("../../middleware/checkAuthenticated.js");

router.get("/", checkAdmin, async (req, res) => {
    try {
        const feedbacks = await Feedback.find({});
        res.render("admin/feedback", {
            layout: "./layouts/admin/itemsManagementLayout",
            title: "Feedback Management",
            feedbacks: feedbacks,
          });
        } catch (error) {
          console.log(error);
          res.status(500).send("Internal Server Error");
        }
      });

      router.post("/", checkAdmin, async (req, res) => {
        try {
          const searchQuery = req.body.search;
          const feedbacks = await Feedback.find({
            $or: [
              { feedbackCategory: { $regex: searchQuery, $options: 'i' } },
              { feedbackText: { $regex: searchQuery, $options: 'i' } },
            ]
          });
      
          res.render("admin/feedback", {
            layout: "./layouts/admin/itemsManagementLayout",
            title: "Feedback Management",
            feedbacks: feedbacks
          });
        } catch (error) {
          console.log(error);
          res.status(500).send("Internal Server Error");
        }
      });



module.exports = router;