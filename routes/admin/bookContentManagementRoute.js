const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
const Books = require("../../models/bookModel.js");
const uploadContent = require("../../middleware/uploadBookContent.js");
const { checkAdmin } = require("../../middleware/checkAuthenticated.js");
const fetchUserData = require("../../middleware/fetchUserData.js");

router.get("/:id",fetchUserData, checkAdmin, async (req, res) => {
  try {
    const books = await Books.find({ _id: req.params.id });
    res.render("admin/bookContentsManagement", {
      layout: "./layouts/admin/itemsManagementLayout",
      title: "Book Content Management",
      books: books,
      messages: req.flash(),
    });
  } catch (error) {
    res.status(404).render("404", { layout: false });
  }
});

router.post("/:id/add-new-content", checkAdmin, uploadContent.single("contentImage"), async (req, res) => {
  try {
    const bookID = req.params.id;
    const contentImageFile = req.file;

    const book = await Books.findById(bookID);

    if (!book) {
      req.flash("fail", "Book not found!");
      return res.redirect("/admin/books-management");
    }

    if (book.contentImage) {
      req.flash("fail", "Only one content image allowed.");
      return res.redirect(`/admin/books-management/${bookID}`);
    } else{
      // Update the book with the new content image
      book.contentImage = contentImageFile.filename;
      await book.save();
      req.flash("success", "Content image added successfully!");
      res.redirect(`/admin/books-management/${bookID}`);
    }

  } catch (error) {
    res.status(404).render("404", { layout: false });
  }
});


// Update a book content image
router.post(
  "/:id/update-content",
  checkAdmin,
  uploadContent.single("editContentImage"),
  async (req, res) => {
    try {
      const bookId = req.params.id;

      const book = await Books.findById(bookId);

      if (!book) {
        req.flash("fail", "Unable to find the book!");
        return res.redirect("/admin/books-management");
      }

      const editContentImage = req.file;

      if (editContentImage) {
        // If there's an uploaded file, proceed with the update
        if (book.contentImage) {
          // Delete the old content image file
          const oldImagePath = path.join(
            __dirname,
            "../../public/pdf",
            book.contentImage
          );
          await fs.promises.unlink(oldImagePath);

          // Update the content image with the new one
          book.contentImage = editContentImage.filename;

          // Save the updated book
          await book.save();

          req.flash("success", "Updated content image successfully!");
        } else {
          req.flash("fail", "No content image to update!");
        }
      } else {
        req.flash("fail", "No file uploaded. Content image not updated.");
      }

      res.redirect(`/admin/books-management/${bookId}`);
    } catch (error) {
      res.status(404).render("404", { layout: false });
    }
  }
);



module.exports = router;

// Delete a content
router.post("/:id/delete-content", checkAdmin, async (req, res) => {
  try {
    const bookId = req.params.id;

    const book = await Books.findById(bookId);

    if (!book) {
      req.flash("fail", "Book not found!");
      return res.redirect("/admin/books-management");
    }

    if (book.contentImage) {
      // Delete the content image file
      const imagePath = path.join(__dirname, "../../public/pdf", book.contentImage);
      await fs.promises.unlink(imagePath);

      // Remove the content image from the book
      book.contentImage = null;
      await book.save();

      req.flash("success", "Content image deleted successfully!");
    } else {
      req.flash("fail", "No content image to delete!");
    }

    res.redirect(`/admin/books-management/${bookId}`);
  } catch (error) {
    console.log(error)
    // res.status(404).render("404", { layout: false });
  }
});

module.exports = router;
