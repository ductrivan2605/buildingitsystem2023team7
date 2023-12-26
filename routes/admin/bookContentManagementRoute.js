const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
const Books = require("../../models/bookModel.js");
const uploadContent = require("../../middleware/uploadBookContent.js");
const { checkAdmin } = require("../../middleware/checkAuthenticated.js");

router.get("/:id", checkAdmin, async (req, res) => {
  try {
    const books = await Books.find({ _id: req.params.id });
    res.render("admin/bookContentsManagement", {
      layout: "./layouts/admin/itemsManagementLayout",
      title: "Book Management",
      books: books,
      messages: req.flash(),
    });
  } catch (error) {
    res.status(404).render("404", { layout: false });
  }
});

router.post(
  "/:id/add-new-content",
  checkAdmin,
  uploadContent.array("contentImage"),
  async (req, res) => {
    try {
      const bookID = req.params.id;
      const contentImageFiles = req.files;

      if (!contentImageFiles || contentImageFiles.length === 0) {
        req.flash("fail", "No files were uploaded.");
        return res.redirect(`/admin/books-management/${bookID}`);
      }

      // Assuming your Books model has a contentImage field that is an array
      const updatedBook = await Books.findByIdAndUpdate(
        bookID,
        {
          $push: {
            contentImage: contentImageFiles.map((file) => file.filename),
          },
        },
        { new: true }
      );

      if (!updatedBook) {
        req.flash("fail", "Unable to add new content!");
        return res.redirect(`/admin/books-management/${bookID}`);
      }

      req.flash("success", "New content added successfully!");
      res.redirect(`/admin/books-management/${bookID}`);
    } catch (error) {
      res.status(404).render("404", { layout: false });
    }
  }
);

// Update a book content image
router.post(
  "/:id/update-content/:contentIndex",
  checkAdmin,
  uploadContent.single("editContentImage"),
  async (req, res) => {
    try {
      const bookId = req.params.id;
      const contentIndex = req.params.contentIndex;

      const book = await Books.findById(bookId);

      if (!book) {
        req.flash("fail", "Unable to find the book!");
        return res.redirect("/admin/books-management");
      }

      // Ensure the contentIndex is within the valid range
      if (contentIndex >= 0 && contentIndex < book.contentImage.length) {
        const editContentImage = req.file;

        // Delete the old content image file
        const oldImagePath = path.join(
          __dirname,
          "../../public/pdf",
          book.contentImage[contentIndex]
        );
        await fs.promises.unlink(oldImagePath);

        // Update the content image with the new one
        book.contentImage[contentIndex] = editContentImage.filename;

        // Save the updated book
        await book.save();

        req.flash("success", "Updated content image successfully!");
      } else {
        req.flash("fail", "Invalid content image index!");
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
    const contentIndex = req.body.contentIndex;

    const book = await Books.findById(bookId);

    if (!book) {
      req.flash("fail", "Unable to delete book content!");
      return res.redirect("/admin/books-management");
    }

    // Ensure the contentIndex is within the valid range
    if (contentIndex >= 0 && contentIndex < book.contentImage.length) {
      const deletedImage = book.contentImage.splice(contentIndex, 1)[0];

      // Delete the content image file
      const imagePath = path.join(__dirname, "../../public/pdf", deletedImage);
        await fs.promises.unlink(imagePath);

      // Save the updated book without the deleted content image
      await book.save();

      req.flash("success", "Content image deleted successfully!");
    } else {
      req.flash("fail", "Invalid content image index!");
    }

    res.redirect(`/admin/books-management/${bookId}`);
  } catch (error) {
    res.status(404).render("404", { layout: false });
  }
});

// Delete all books
router.post(
  "/:id/delete-all-contents",

  checkAdmin,
  async (req, res) => {
    try {
      const bookId = req.params.id;

      const book = await Books.findById(bookId);

      if (!book) {
        req.flash("fail", "Unable to delete book content!");
        return res.redirect("/admin/books-management");
      }

      if (book.contentImage && book.contentImage.length > 0) {
        for (const imageFileName of book.contentImage) {
          const imagePath = path.join(
            __dirname,
            "../../public/pdf",
            imageFileName
          );
            await fs.promises.unlink(imagePath);
        }

        book.contentImage = [];

        await book.save();

        req.flash("success", "Book content deleted successfully!");
      } else {
        req.flash("fail", "No content images to delete!");
      }

      res.redirect(`/admin/books-management/${bookId}`);
    } catch (error) {
      res.status(404).render("404", { layout: false });
    }
  }
);

module.exports = router;
