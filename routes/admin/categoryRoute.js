const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
const Category = require("../../models/Category.js");
const upload = require("../../middleware/uploadImage.js");

// Get all categories
router.get("/", async (req, res) => {
  try {
    const category = await Category.find({});
  } catch (error) {
    res.send(error);
  }
});

// Add a new category
router.post("/add-new-category", upload.single("image"), async (req, res) => {
  try {
    const { category, subCategory } = req.body;
    const image = req.file ? req.file.filename : null;
    // Split subCategory into an array
    const subCategoryArray = subCategory
      ? subCategory.split(",").map((item) => item.trim())
      : [];

    await Category.create({
      category: category,
      subCategory: subCategoryArray,
      image: image,
    });

    // req.flash("accepted", "Successfully create new category")
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

router.post(
  "/update-category/:id",
  upload.single("image"),
  async (req, res) => {
    try {
      const categoryId = req.params.id;
      const { category, subCategory } = req.body;
      const image = req.file ? req.file.filename : null;
      // Split subCategory into an array
      const subCategoryArray = subCategory
        ? subCategory.split(",").map((item) => item.trim())
        : [];

      const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        { category, subCategory: subCategoryArray, image },
        { new: true } // Return the updated document
      );

      if (!updatedCategory) {
        return res.status(404);
      }
      // req.flash("accepted", "Successfully create new category")
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
);

// Delete a single category
router.delete("/delete-category/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;

    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return res.status(404);
    }
    // Delete the corresponding image file from the server
    if (deletedCategory.image) {
      const imagePath = path.join(
        __dirname,
        "../../public/images",
        deletedCategory.image
      );

      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image file:", err);
        } else {
          console.log("Image file deleted successfully");
        }
      });
    }
    // req.flash("accepted", "Successfully create new category")
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// Delete all categories
router.delete("/delete-all-categories", async (req, res) => {
  try {
    const deletedCategories = await Category.find({});

    deletedCategories.forEach((category) => {
      if (category.image) {
        const imagePath = path.join(
          __dirname,
          "../../public/images",
          category.image
        );
        fs.unlinkSync(imagePath);
      }
    });

    await Category.deleteMany({});
    // req.flash("accepted", "Successfully create new category")
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
