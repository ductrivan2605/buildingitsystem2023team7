const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
const User = require("../../models/user.js");
const Books = require("../../models/bookModel.js");
const Author = require("../../models/author.js");
const Category = require("../../models/Category.js");
const upload = require("../../middleware/uploadImage.js");
const { checkAdmin } = require("../../middleware/checkAuthenticated.js");
const fetchUserData = require("../../middleware/fetchUserData.js");

router.get("/",fetchUserData, checkAdmin, async (req, res) => {
  try {
    const books = await Books.find({});
    const authors = await Author.find({});
    const categories = await Category.find({});
    res.render("admin/bookManagement", {
      layout: "./layouts/admin/itemsManagementLayout",
      title: "Book Management",
      books: books,
      authors: authors,
      categories: categories,
      messages: req.flash(),
    });
  } catch (error) {
    res.status(404).render("404", { layout: false });
  }
});

router.post(
  "/add-new-book",
  checkAdmin,
  upload.single("imageCover"),
  async (req, res) => {
    try {
      const { title, authors, categories, published, publisher, description } =
        req.body;
      const imageCover = req.file ? req.file.filename : "";

      const authorIds = Array.isArray(authors) ? authors : [authors];
      const categoryIds = Array.isArray(categories) ? categories : [categories];

      const book = await Books.create({
        title: title,
        authors: authorIds,
        category: categoryIds,
        published: published,
        publisher: publisher,
        description: description,
        imageCover: imageCover,
      });

      if (!book) {
        req.flash("fail", "Unable to create new book!");
        res.redirect("/admin/books-management");
      }
      req.flash("success", "New book created successfully!");
      res.redirect("/admin/books-management");
    } catch (error) {
      console.log(error);
      res.status(404).render("404", { layout: false });
    }
  }
);

// Update a book
router.post(
  "/update-book/:id",

  checkAdmin,
  upload.fields([
    { name: "imageCover", maxCount: 1 },
    { name: "contentImage", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const bookId = req.params.id;

      // Retrieve the current book to access the old image filename
      const books = await Books.findById(bookId);
      if (!books) {
        req.flash("fail", "Unable to find book!");
        res.redirect("/admin/books-management");
      }
      // Construct a dynamic update object
      const updateFields = {};
      if (req.body.title) updateFields.title = req.body.title;
      if (req.body.published) updateFields.published = req.body.published;
      if (req.body.publisher) updateFields.publisher = req.body.publisher;
      if (req.body.description) updateFields.description = req.body.description;

      // Delete the old image if a new image is uploaded
      if (req.files["imageCover"]) {
        // Check if the current book has an old image
        if (books.imageCover) {
          // Delete the old image
          const oldImageFilePath = path.resolve(
            __dirname,
            "../../public/images",
            books.imageCover
          );
          if (fs.existsSync(oldImageFilePath)) {
            fs.unlinkSync(oldImageFilePath);
          }
        }
        // Save the new image
        updateFields.imageCover = req.files["imageCover"][0].filename;
      }

      // Convert authors and categories to arrays
      const selectedAuthors = req.body.authors
        ? req.body.authors.split(",").map((item) => item.trim())
        : [];
      const selectedCategories = req.body.categories
        ? req.body.categories.split(",").map((item) => item.trim())
        : [];

      if (selectedAuthors.length > 0) {
        updateFields.authors = selectedAuthors;
      }

      if (selectedCategories.length > 0) {
        updateFields.category = selectedCategories;
      }

      await Books.findByIdAndUpdate(bookId, updateFields, {
        new: true,
      });

      req.flash("success", "Updated book successfully!");
      res.redirect("/admin/books-management");
    } catch (error) {
      res.status(404).render("404", { layout: false });
    }
  }
);

// Delete a book
router.post("/delete/:id", checkAdmin, async (req, res) => {
  try {
    const book = await Books.findById(req.params.id);

    if (!book) {
      req.flash("fail", "Unable to delete book!");
      res.redirect("/admin/books-management");
    }
    // Delete content images
    if (book.contentImage) {
      for (const imageFileName of book.contentImage) {
        const imagePath = path.join(
          __dirname,
          "../../public/images",
          imageFileName
        );
        await fs.promises.unlink(imagePath);
      }
    }

    // Delete the image cover file
    const imageCoverPath = path.join(
      __dirname,
      "../../public/images",
      book.imageCover
    );
    await fs.promises.unlink(imageCoverPath);

    await Books.findByIdAndDelete(req.params.id);
    // Find all users who have bookmarked this book
    const usersWithBookmark = await User.find({ bookmarks: req.params.id });

    // Remove the book ID from each user's bookmarks
    usersWithBookmark.forEach(async (user) => {
      user.bookmarks = user.bookmarks.filter(
        (bookmark) => bookmark.toString() !== req.params.id
      );
      await user.save();
    });
    req.flash("success", "Book deleted successfully!");
    res.redirect("/admin/books-management");
  } catch (error) {
    res.status(404).render("404", { layout: false });
  }
});

// Delete all books
router.post(
  "/delete-all-books",

  checkAdmin,
  async (req, res) => {
    try {
      const deletedBooks = await Books.find({});

      for (const deletedBook of deletedBooks) {
        await Books.findByIdAndDelete(deletedBook._id);
        // Find all users who have bookmarked this book
        const usersWithBookmark = await User.find({
          bookmarks: deletedBook._id,
        });

        // Remove the book ID from each user's bookmarks
        usersWithBookmark.forEach(async (user) => {
          user.bookmarks = user.bookmarks.filter(
            (bookmark) => bookmark.toString() !== deletedBook._id.toString()
          );
          await user.save();
        });
        // Delete the corresponding image files
        if (deletedBook.imageCover) {
          const imageCoverPath = path.join(
            __dirname,
            "../../public/images",
            deletedBook.imageCover
          );

          await fs.promises.unlink(imageCoverPath);
        }

        // Delete the image cover file
        const imageCoverPath = path.join(
          __dirname,
          "../../public/images",
          deletedBook.imageCover
        );
        await fs.promises.unlink(imageCoverPath);
      }
      if (!deletedBooks) {
        req.flash("fail", "Unable to delete all book!");
        res.redirect("/admin/books-management");
      }
      req.flash("success", "All book deleted successfully!");
      res.redirect("/admin/books-management");
    } catch (error) {
      res.status(404).render("404", { layout: false });
    }
  }
);

// Search for book
router.post("/search", checkAdmin, async (req, res) => {
  let searchTerm = req.body.search;
  // Use a regular expression for case-insensitive search
  const regex = new RegExp(searchTerm, "i");

  let books = await Books.find({
    $or: [{ title: regex }, { authors: regex }],
  });
  const authors = await Author.find({});
  const categories = await Category.find({});
  res.render("admin/searchBookManagement", {
    layout: "./layouts/admin/itemsManagementLayout",
    title: "Book Management",
    books: books,
    authors: authors,
    categories: categories,
  });
});

module.exports = router;
