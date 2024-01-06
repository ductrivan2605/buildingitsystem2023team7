const express = require("express");
const router = express.Router();
const User = require("../../models/user.js");
const Books = require("../../models/bookModel.js");
const connectEnsureLogin = require('connect-ensure-login');

router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate("readingHistory").lean();

    res.render("user/readingHistoryList", {
      layout: "./layouts/user/bookMarkPage",
      title: "Booktopia",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/add-history/:slug",connectEnsureLogin.ensureLoggedIn({redirectTo:'/auth/signin'}), async (req, res) => {
  try {
    const { slug } = req.params;

    // Find the book by slug
    const book = await Books.findOne({ slug });

    if (!book) {
      return res.redirect("/");
    }

    const userId = req.user.id;

    // Update the user's bookmark array
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { readingHistory: book._id } },
      { new: true }
    );
    res.redirect(`/book/${slug}/read`)
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/delete-history/:slug",connectEnsureLogin.ensureLoggedIn({redirectTo:'/auth/signin'}), async (req, res) => {
  try {
    const { slug } = req.params;

    // Find the book by slug
    const book = await Books.findOne({ slug });

    if (!book) {
      return res.redirect("/reading-history");
    }

    const userId = req.user.id;

    // Remove the book ID from the user's bookmarks array
    await User.findByIdAndUpdate(
      userId,
      { $pull: { readingHistory: book._id } },
      { new: true }
    );

    // Redirect to the bookmark list page
    res.redirect("/reading-history");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
