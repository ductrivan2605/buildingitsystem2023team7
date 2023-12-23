const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
const Authors = require("../../models/author.js");
const upload = require("../../middleware/uploadImage.js");
const {
  checkAuthenticated,
  checkNotAuthenticated,
  checkAdmin,
} = require("../../middleware/checkAuthenticated.js");

// Get all authors
router.get("/", checkAuthenticated, checkAdmin, async (req, res) => {
  try {
    const authors = await Authors.find({});
    res.render("admin/authorManagement", {
      layout: "./layouts/admin/itemsManagementLayout",
      title: "Author Management",
      authors: authors,
    });
    console.log(authors);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// Add a new author
router.post(
  "/add-new-author",
  checkAuthenticated,
  checkAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, email, background } = req.body;
      const image = req.file ? req.file.filename : null;

      const author = await Authors.create({ name, email, background, image });
      console.log(author);
      res.redirect("/admin/authors");
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
);

// Update an author
router.post(
  "/update-author/:id",
  checkAuthenticated,
  checkAdmin,
  upload.single("editImage"),
  async (req, res) => {
    try {
      const existingAuthor = await Authors.findById(req.params.id);

      if (!existingAuthor) {
        // req.flash("rejected", "Author not found!");
        return res.redirect("/admin/authors");
      }

      // Update the image field if a new image is provided
      if (req.file) {
        // Check if there is an existing image
        if (existingAuthor.image) {
          const oldImageFilePath = path.resolve(
            __dirname,
            "../../public/images",
            existingAuthor.image
          );
          // Delete the old image file
          if (fs.existsSync(oldImageFilePath)) {
            fs.unlinkSync(oldImageFilePath);
          }
        }
        // Update with the new image file
        existingAuthor.image = req.file.filename;
      }

      // Update fields if provided in the request
      existingAuthor.name = req.body.name || existingAuthor.name;
      existingAuthor.email = req.body.email || existingAuthor.email;
      existingAuthor.background =
        req.body.background || existingAuthor.background;

      await existingAuthor.save();

      res.redirect("/admin/authors");
    } catch (error) {
      console.error("Error updating author:", error);

      if (error.name === "CastError") {
        return res.status(400).send("Invalid authorId");
      }

      res.status(500).send("Internal Server Error");
    }
  }
);

// Delete a single author
router.post("/delete/:id", checkAuthenticated, checkAdmin, async (req, res) => {
  try {
    const author = await Authors.findByIdAndDelete(req.params.id);

    if (!author) {
      // req.flash("rejected", "Author not found!");
      return res.redirect("/admin/authors");
    }

    // Delete the corresponding image file from the server
    if (author.image) {
      const imagePath = path.join(
        __dirname,
        "../../public/images",
        author.image
      );
      await fs.promises.unlink(imagePath);
    }

    res.redirect("/admin/authors");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete all authors
router.post(
  "/delete-all-authors",
  checkAuthenticated,
  checkAdmin,
  async (req, res) => {
    try {
      const deletedAuthors = await Authors.find({});

      for (const author of deletedAuthors) {
        if (author.image) {
          const imagePath = path.join(
            __dirname,
            "../../public/images",
            author.image
          );
          await fs.promises.unlink(imagePath);
        }
      }

      await Authors.deleteMany({});
      console.log(deletedAuthors);
      res.redirect("/admin/authors");
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
);

// Search for book
router.post("/search", checkAuthenticated, checkAdmin, async (req, res) => {
  let searchTerm = req.body.search;
  const regex = new RegExp(searchTerm, "i");

  let authors = await Authors.find({
    $or: [{ name: regex }, { background: regex }],
  });
  res.render("admin/searchItemsManagement", {
    layout: "./layouts/admin/itemsManagementLayout",
    authors: authors,
    title: "Author Management",
  });
});

module.exports = router;
