const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
const Authors = require("../../models/author.js");
const upload = require("../../middleware/uploadImage.js");

// Get all authors
router.get("/", async (req, res) => {
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
router.post("/add-new-author", upload.single("image"), async (req, res) => {
  try {
    const { name, email, background } = req.body;
    const image = req.file ? req.file.filename : null;

    const author = await Authors.create({ name, email, background, image });
    console.log(author);
    res.redirect('/admin/authors');
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// Update an author
router.post("/update-author/:id", upload.single("editImage"), async (req, res) => {
  try {
    // Get the image to be updated
    const authors = await Authors.findById(req.params.id);
    if (!authors) {
      req.flash("rejected", "Image not found!");
      res.redirect("/admin/welcome_page");
      return;
    }

    // Update the image with the new image file, if one was uploaded
    if (req.file) {
      // Unlink the old image file, if it exists
      const oldImageFilePath = path.resolve(
        __dirname,
        "../../public/images",
        authors.image
      );
      if (fs.existsSync(oldImageFilePath)) {
        fs.unlink(oldImageFilePath, (err) => {
          if (err) {
            console.log("Error deleting old image file:", err);
          }
        });
      }

      // Update the picture with the new image file
      authors.image = req.file.filename;
    }

    // Update the image's other fields
    authors.name = req.body.name;
    authors.email = req.body.email;
    authors.background = req.body.background;

    // Save the updated image
    await authors.save();

    if (!authors) {
      return res.status(404).send("Author not found");
    }

    res.redirect('/admin/authors');
  } catch (error) {
    console.error("Error updating author:", error);

    // Customize the response based on the type of error
    if (error.name === "CastError") {
      // Handle invalid authorId
      return res.status(400).send("Invalid authorId");
    }

    // Handle other errors
    res.status(500).send("Internal Server Error");
  }
});


// Delete a single author
router.post("/delete/:id", async (req, res) => {
  try {
    const authors = await Authors.findById(req.params.id);
    if (!authors) {
      req.flash("rejected", "Author not found!");
      res.redirect("/admin/authors");
      return;
    }

    // Delete the corresponding image file from the server
    if (authors.image) {
      const imagePath = path.join(
        __dirname,
        "../../public/images",
        authors.image
      );
      fs.promises.unlink(imagePath);
    }
    await Authors.findByIdAndDelete(req.params.id);
    res.redirect('/admin/authors');
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete all authors
router.post("/delete-all-authors", async (req, res) => {
  try {
    const deletedAuthors = await Authors.find({});

    deletedAuthors.forEach((author) => {
      if (author.image) {
        const imagePath = path.join(
          __dirname,
          "../../public/images",
          author.image
        );
        fs.unlinkSync(imagePath);
      }
    });

    await Authors.deleteMany({});
    res.redirect('/admin/authors');
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
