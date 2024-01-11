const express = require("express");
const router = express.Router();
const Books = require("../../models/bookModel.js");
const Author = require("../../models/author.js");
const Category = require("../../models/Category.js");
const fetchUserData = require("../../middleware/fetchUserData.js");



router.get("/",fetchUserData, async (req, res) => {
    try {
      const books = await Books.find({});
      const authors = await Author.find({});
      const categories = await Category.find({});
      res.render("user/searchPage", {
        layout: "./layouts/user/searchPageLayout",
        title: "Search Page",
        books:books,
        authors: authors,
        categories: categories
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

// Search for books
router.post("/result", async(req, res) => {
  try {
    let searchTerm = req.body.search;
    // Use a regular expression for case-insensitive search
    const regex = new RegExp(searchTerm, 'i');
    
    let books = await Books.find({
      $or: [
        {title: regex},
        {authors: regex},
      ]
    });

    const isAuthenticated = req.isAuthenticated();
    const userBookmarks = isAuthenticated ? req.user.bookmarks.map(bookmark => bookmark.toString()) : [];
    const authors = await Author.find({});
    const categories = await Category.find({});
    res.render("user/searchPageResult", {
      layout: "./layouts/user/searchPageLayout",
      title: "Book Management",
      searchTerm: searchTerm, 
      books:books.map(book => ({
        ...book.toObject(),
        bookmarked: userBookmarks.includes(book._id.toString()),
      })),
      authors: authors,
      categories: categories
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


module.exports = router;
