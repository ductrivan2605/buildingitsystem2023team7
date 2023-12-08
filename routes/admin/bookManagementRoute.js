const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
const Books = require("../../models/bookModel.js");
const Author = require("../../models/author.js");
const Category = require("../../models/Category.js");
const upload = require("../../middleware/uploadImage.js");

router.get("/", async (req, res) => {
  try {
    const books = await Books.find({});
    const authors = await Author.find({});
    const categories = await Category.find({});
    res.render("admin/bookManagement", {
      layout: "./layouts/admin/itemsManagementLayout",
      title: "Book Management",
      books:books,
      authors: authors,
      categories: categories
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


router.post("/add-new-book", upload.fields([
  { name: 'contentImage', maxCount: 10 },
  { name: 'imageCover', maxCount: 1 }
]), async (req, res) => {
  try {
     const {
        title,
        authors,
        categories,
        published,
        description,
     } = req.body;

     // Get the filenames for both contentImage and imageCover
     const contentImage = req.files['contentImage'].map((file) => file.filename);
     const imageCover = req.files['imageCover'][0].filename;

     // Convert authors and categories to arrays
     const authorIds = authors
        ? authors.split(",").map((item) => item.trim())
        : [];
     const categoryIds = categories
        ? categories.split(",").map((item) => item.trim())
        : [];

     const book = await Books.create({
        title: title,
        authors: authorIds,
        category: categoryIds,
        published: published,
        description: description,
        contentImage: contentImage,
        imageCover: imageCover,
     });

     console.log("Added new book:", book);
     res.status(201).redirect("/admin/books-management");
  } catch (error) {
     if (error.message === "Invalid file type") {
        return res.status(400);
     }
     res.status(500);
  }
});



// Update a book
router.post("/update-book/:id", upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'contentImage', maxCount: 10 }
]), async (req, res) => {
  try {
    const bookId = req.params.id;

    // Retrieve the current book to access the old image filename
    const books = await Books.findById(bookId);

    // Construct a dynamic update object
    const updateFields = {};
    if (req.body.title) updateFields.title = req.body.title;
    if (req.body.published) updateFields.published = req.body.published;
    if (req.body.description) updateFields.description = req.body.description;

    // Delete the old image if a new image is uploaded
    if (req.files['imageCover']) {
      // Check if the current book has an old image
      if (books.imageCover) {
        // Delete the old image
        const oldImageFilePath = path.resolve(__dirname, "../../public/images", books.imageCover);
        if (fs.existsSync(oldImageFilePath)) {
          fs.unlinkSync(oldImageFilePath);
        }
      }
      // Save the new image
      updateFields.imageCover = req.files['imageCover'][0].filename;
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

    const updatedBook = await Books.findByIdAndUpdate(
      bookId,
      updateFields,
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).send("Book not found");
    }

    res.redirect('/admin/books-management');
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});




// Delete a book
router.post("/delete/:id", async (req, res) => {
  try {
    const book = await Books.findById(req.params.id);

    if (!book) {
      req.flash("rejected", "Book not found!");
      res.redirect("/admin/books-management");
      return;
    }

    // Delete content images
    for (const imageFileName of book.contentImage) {
      const imagePath = path.join(__dirname, "../../public/images", imageFileName);
      try {
        await fs.promises.unlink(imagePath);
      } catch (error) {
        console.error("Error deleting image file:", error);
      }
    }

    // Delete the image cover file
    const imageCoverPath = path.join(__dirname, "../../public/images", book.imageCover);
    try {
      await fs.promises.unlink(imageCoverPath);
    } catch (error) {
      console.error("Error deleting image cover file:", error);
    }

    // Delete the book document
    await Books.findByIdAndDelete(req.params.id);
    res.redirect("/admin/books-management");
  } catch (error) {
    res.status(500).send(error.message);
  }
});


// Delete all books
router.post("/delete-all-books", async (req, res) => {
  try {
    const deletedBooks = await Books.find({});

    for (const deletedBook of deletedBooks) {
      await Books.findByIdAndDelete(deletedBook._id);

      // Delete the corresponding image files
      for (const imageFileName of deletedBook.contentImage) {
        const imagePath = path.join(__dirname, "../../public/images", imageFileName);
        try {
          await fs.promises.unlink(imagePath);
        } catch (error) {
          console.error("Error deleting image file:", error);
        }
      }

      // Delete the image cover file
      const imageCoverPath = path.join(__dirname, "../../public/images", deletedBook.imageCover);
      try {
        await fs.promises.unlink(imageCoverPath);
      } catch (error) {
        console.error("Error deleting image cover file:", error);
      }
    }
    res.status(202).redirect('/admin/books-management');
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


// Search for book
router.post("/search", async(req,res) => {
  let searchTerm = req.body.search;
  let books = await Books.find({$text: {$search: searchTerm, $diacriticSensitive: true}});
  const authors = await Author.find({});
  const categories = await Category.find({});
  res.render("admin/searchBookManagement", {
    layout: "./layouts/admin/itemsManagementLayout",
    books:books,
    authors: authors,
    categories: categories
  });
})

module.exports = router;
