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
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// Update an author
router.post("/update-author/:id", upload.single("image"), async (req, res) => {
  try {
    const authorId = req.params.id;
    const { name, email, background } = req.body;
    const image = req.file ? req.file.filename : null;

    const updatedAuthor = await Authors.findByIdAndUpdate(
      authorId,
      { name, email, background, image },
      { new: true } // Return the updated document
    );

    if (!updatedAuthor) {
      return res.status(404);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// Delete a single author
router.delete("/delete-author/:id", async (req, res) => {
  try {
    const authorId = req.params.id;

    const deletedAuthor = await Authors.findByIdAndDelete(authorId);

    if (!deletedAuthor) {
      return res.status(404);
    }

    // Delete the corresponding image file from the server
    if (deletedAuthor.image) {
      const imagePath = path.join(
        __dirname,
        "../../public/images",
        deletedAuthor.image
      );

      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image file:", err);
        } else {
          console.log("Image file deleted successfully");
        }
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// Delete all authors
router.delete("/delete-all-authors", async (req, res) => {
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
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
