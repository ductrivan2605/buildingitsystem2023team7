const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
const Authors = require("../../models/author.js");
const upload = require("../../middleware/uploadImage.js");
const { checkAdmin } = require("../../middleware/checkAuthenticated.js");

// Get all authors
router.get("/", checkAdmin, async (req, res) => {
  try {
    const authors = await Authors.find({});
    res.render("admin/authorManagement", {
      layout: "./layouts/admin/itemsManagementLayout",
      title: "Author Management",
      authors: authors,
      messages: req.flash(),
    });
  } catch (error) {
    res.status(404).render("/404");
  }
});

// Add a new author
router.post(
  "/add-new-author",

  checkAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, email, background } = req.body;
      const image = req.file ? req.file.filename : null;

      const author = await Authors.create({ name, email, background, image });

      if (!author) {
        req.flash("fail", "Unable to create new author!");
        res.redirect("/admin/authors");
      } else {
        req.flash("success", "New author created successfully!");
        res.redirect("/admin/authors");
      }
    } catch (error) {
      res.status(404).render("/404");
    }
  }
);

// Update an author
router.post(
  "/update-author/:id",

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

      const author = await existingAuthor.save();

      if (!author) {
        req.flash("fail", "Unable to edit author!");
        res.redirect("/admin/authors");
      } else {
        req.flash("success", "New author edited successfully!");
        res.redirect("/admin/authors");
      }
    } catch (error) {
      res.status(404).render("/404");
    }
  }
);

// Delete a single author
router.post("/delete/:id", checkAdmin, async (req, res) => {
  try {
    const author = await Authors.findByIdAndDelete(req.params.id);

    if (!author) {
      req.flash("fail", "Unable to find author!");
      res.redirect("/admin/authors");
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
    req.flash("success", "Deleted author successfully!");
    res.redirect("/admin/authors");
  } catch (error) {
    res.status(404).render("/404");
  }
});

// Delete all authors
router.post(
  "/delete-all-authors",

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

      const author = await Authors.deleteMany({});
      if (!author) {
        req.flash("fail", "Unable to delete all author!");
        res.redirect("/admin/authors");
      } else {
        req.flash("success", "All author deleted successfully!");
        res.redirect("/admin/authors");
      }

    } catch (error) {
      res.status(404).render("/404");
    }
  }
);

// Search for book
router.post("/search", checkAdmin, async (req, res) => {
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
