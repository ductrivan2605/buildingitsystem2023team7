const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
const Category = require("../../models/Category.js");
const upload = require("../../middleware/uploadImage.js");
const {
  checkAdmin
} = require("../../middleware/checkAuthenticated.js");
// const fetchUserData = require("../../middleware/fetchUserData.js");
// Get all categories
router.get("/", checkAdmin, async (req, res) => {
  try {
    const categories = await Category.find({});
    res.render("admin/categoryManagement", {
      layout: "./layouts/admin/itemsManagementLayout",
      title: "Category Management",
      categories: categories,
      messages:req.flash(),
    });
  } catch (error) {
    res.status(404).render("./404", {layout: false});
  }
});

// Add a new category
router.post("/add-new-category", checkAdmin, upload.single("image"), async (req, res) => {
  try {
    const { category, subCategory } = req.body;
    const image = req.file ? req.file.filename : null;
    // Split subCategory into an array
    const subCategoryArray = subCategory
      ? subCategory.split(",").map((item) => item.trim())
      : [];

    const categories = await Category.create({
      category: category,
      subCategory: subCategoryArray,
      image: image,
    });
    if (!categories) {
      req.flash("fail", "Unable to create new category!");
      res.redirect("/admin/categories");
    } 
      req.flash("success", "New category created successfully!");
      res.redirect("/admin/categories");
  } catch (error) {
    res.status(404).render("./404", {layout: false});
  }
});

router.post(
  "/update-category/:id",
   checkAdmin,
  upload.single("editImage"),
  async (req, res) => {
    try {
      const categoryId = req.params.id;
      if (!categoryId) {
        req.flash("fail", "Unable to find category!");
        res.redirect("/admin/categories");
      } 
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
        req.flash("fail", "Unable to update category!");
        res.redirect("/admin/categories");
      }
      req.flash("success", "Category updated successfully!");
      res.redirect("/admin/categories");

    } catch (error) {
      res.status(404).render("./404", {layout:false});
    }
  }
);

// Delete a single category
router.post("/delete/:id", checkAdmin, async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);

    if (!deletedCategory) {
      req.flash("fail", "Unable to find category!");
      res.redirect("/admin/categories");
    }

    if (deletedCategory.image) {
      const imagePath = path.join(
        __dirname,
        "../../public/images",
        deletedCategory.image
      );
      await fs.promises.unlink(imagePath);
    }

    req.flash("success", "Category deleted successfully!");
    res.redirect("/admin/categories");
  } catch (error) {
    res.status(504).render("../404", {layout: false});
  }
});

// Delete all categories
router.post("/delete-all-categories", checkAdmin, async (req, res) => {
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

    const allCategories = await Category.deleteMany({});
    if (!allCategories) {
      req.flash("fail", "Unable to delete all categories!");
      res.redirect("/admin/categories");
    }
    req.flash("success", "All category deleted successfully!");
    res.redirect("/admin/categories");
  } catch (error) {
    res.status(404).render("../404", {layout: false});
  }
});

module.exports = router;
