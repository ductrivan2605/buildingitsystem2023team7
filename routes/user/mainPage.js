const express = require("express");
const router = express.Router();
const Categories = require("../../models/Category.js");
const Authors = require("../../models/author.js");
const Books = require("../../models/bookModel.js");
const User = require("../../models/user.js");
const mongoose = require('mongoose');

router.get("/", async (req, res) => {
  try {
    const categories = await Categories.find({}).limit(5);
    const users = await User.find();
    // Check if the user is authenticated
    const isAuthenticated = req.isAuthenticated();

    // Check if the user is an admin
    
    // Fetch user's bookmarks is authenticated
    const userBookmarks = isAuthenticated ? req.user.bookmarks.map(bookmark => bookmark.toString()) : [];
    const books = await Books.find({});
    res.render("user/categoryNavigation", {
      layout: "./layouts/user/mainPage",
      categories: categories,
      books: books.map(book => ({
        ...book.toObject(),
        bookmarked: userBookmarks.includes(book._id.toString()),
      })),
      title: "Booktopia",
      users: users,
      user: req.user,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/book/:slug", async (req, res) => {
  try {
    const books = await Books.findOne({ slug: req.params.slug });
    res.render("user/bookDetail", {
      layout: "./layouts/user/bookDetailPage",
      title: "Booktopia",
      books: books,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/book/:slug/comments", async (req, res) => {});

module.exports = router;
