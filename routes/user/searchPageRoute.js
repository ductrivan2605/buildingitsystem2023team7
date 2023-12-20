const express = require("express");
const router = express.Router();
const Books = require("../../models/bookModel.js");
const Author = require("../../models/author.js");
const Category = require("../../models/Category.js");



router.get("/", async (req, res) => {
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
    const authors = await Author.find({});
    const categories = await Category.find({});
    res.render("user/searchPageResult", {
      layout: "./layouts/user/searchPageLayout",
      title: "Book Management",
      searchTerm: searchTerm,  // searchTerm을 변수로 전달
      books: books,
      authors: authors,
      categories: categories
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


module.exports = router;
