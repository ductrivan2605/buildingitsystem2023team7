const express = require("express");
const router = express.Router();
const User = require("../../models/user.js");
const Books = require("../../models/bookModel.js");
const connectEnsureLogin = require('connect-ensure-login');

router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate("bookmarks").lean();

    res.render("user/bookmarksList", {
      layout: "./layouts/user/bookMarkPage",
      title: "Booktopia",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/add/:slug",connectEnsureLogin.ensureLoggedIn({redirectTo:'/auth/signin'}), async (req, res) => {
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
      { $addToSet: { bookmarks: book._id } },
      { new: true }
    );

    res.redirect('/bookmarks');
    console.log("Added bookmarks");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/delete/:slug",connectEnsureLogin.ensureLoggedIn({redirectTo:'/auth/signin'}), async (req, res) => {
  try {
    const { slug } = req.params;

    // Find the book by slug
    const book = await Books.findOne({ slug });

    if (!book) {
      return res.redirect("/bookmarks");
    }

    const userId = req.user.id;

    // Remove the book ID from the user's bookmarks array
    await User.findByIdAndUpdate(
      userId,
      { $pull: { bookmarks: book._id } },
      { new: true }
    );

    console.log("Deleted bookmark");

    // Redirect to the bookmark list page
    res.redirect("/bookmarks");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
