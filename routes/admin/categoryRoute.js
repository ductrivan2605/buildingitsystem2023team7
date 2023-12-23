const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
const Category = require("../../models/Category.js");
const upload = require("../../middleware/uploadImage.js");
const {
  checkAuthenticated,
  checkNotAuthenticated,
  checkAdmin,
} = require("../../middleware/checkAuthenticated.js");
// Get all categories
router.get("/",checkAuthenticated, checkAdmin, async (req, res) => {
  try {
    const categories = await Category.find({});
    res.render("admin/categoryManagement", {
      layout: "./layouts/admin/itemsManagementLayout",
      title: "Category Management",
      categories: categories,
    });
  } catch (error) {
    res.send(error);
  }
});

// Add a new category
router.post("/add-new-category",checkAuthenticated, checkAdmin, upload.single("image"), async (req, res) => {
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
    res.redirect("/admin/categories");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

router.post(
  "/update-category/:id",
  checkAuthenticated, checkAdmin,
  upload.single("editImage"),
  async (req, res) => {
    try {
      const categoryId = req.params.id;

      // Extract fields from the request body
      const { category, subCategory } = req.body;
      const newImage = req.file ? req.file.filename : null;

      // Find the current category to get the old image filename
      const currentCategory = await Category.findById(categoryId);

      // Construct a dynamic update object with only provided fields
      const updateFields = {};
      if (category) updateFields.category = category;
      if (subCategory)
        updateFields.subCategory = subCategory
          .split(",")
          .map((item) => item.trim());
      if (newImage) {
        // Delete the old image file
        if (currentCategory.image) {
          const oldImagePath = path.resolve(
            __dirname,
            "../../public/images",
            currentCategory.image
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        // Set the new image filename
        updateFields.image = newImage;
      }

      // Update the category
      const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        updateFields,
        { new: true } // Return the updated document
      );

      if (!updatedCategory) {
        return res.status(404);
      }

      // req.flash("accepted", "Successfully update category");
      res.redirect("/admin/categories");
    } catch (error) {
      if (error.code === 11000) {
        // Handle duplicate key error
        console.error('Duplicate key violation:', error.keyValue);
        // Implement your error handling or validation logic
      } else {
        // Handle other MongoDB errors
        console.error('MongoDB error:', error);
      }
    }
  }
);

// Delete a single category
router.post("/delete/:id",checkAuthenticated, checkAdmin, async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);

    if (!deletedCategory) {
      return res.status(404);
    }

    if (deletedCategory.image) {
      const imagePath = path.join(
        __dirname,
        "../../public/images",
        deletedCategory.image
      );
      await fs.promises.unlink(imagePath);
    }

    // req.flash("accepted", "Successfully create new category")
    res.redirect("/admin/categories");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// Delete all categories
router.post("/delete-all-categories",checkAuthenticated, checkAdmin, async (req, res) => {
  try {
    const categories = await Category.find({});

    for (const category of categories) {
      if (category.image) {
        const imagePath = path.join(
          __dirname,
          "../../public/images",
          category.image
        );
        await fs.promises.unlink(imagePath);
      }
    }

    await Category.deleteMany({});
    res.redirect("/admin/categories");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
