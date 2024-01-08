const express = require("express");
const router = express.Router();
const Categories = require("../../models/Category.js");
const Books = require("../../models/bookModel.js");
const fetchUserData = require("../../middleware/fetchUserData.js");

router.get("/",fetchUserData, async (req, res) => {
  try {
    const categories = await Categories.find({}).limit(4);

    // Check if the user is authenticated
    const isAuthenticated = req.isAuthenticated();
    const userBookmarks = isAuthenticated ? req.user.bookmarks.map(bookmark => bookmark.toString()) : [];
    
    const newestBooks = await Books.find({}).sort({createdAt: -1});
    const mostRatingBooks = await Books.find({}).sort({"reviews.rating": -1});
    const mostReadBooks = await Books.find({}).sort({readCount: -1});
    
    res.render("user/categoryNavigation", {
      layout: "./layouts/user/mainPage",
      categories: categories,
      newestBooks: newestBooks.map(book => ({
        ...book.toObject(),
        bookmarked: userBookmarks.includes(book._id.toString()),
      })),
      mostRatingBooks: mostRatingBooks.map(book => ({
        ...book.toObject(),
        bookmarked: userBookmarks.includes(book._id.toString()),
      })),
      mostReadBooks: mostReadBooks.map(book => ({
        ...book.toObject(),
        bookmarked: userBookmarks.includes(book._id.toString()),
      })),
      title: "Booktopia",
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/book/:slug",fetchUserData, async (req, res) => {
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