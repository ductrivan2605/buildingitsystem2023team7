const fs = require("fs");
const path = require("path");
const express = require('express')
const router = express.Router()
const Category = require("../../models/Category.js");
const upload = require("../../controllers/uploadImage.js");

// Get all categories
router.get('/', async (req,res) => {
    try{

        const category = await Category.find({})

    }catch(error){
        res.send(error);
    }
})


// Add a new category
router.post('/add-new-category', upload.single('image'), async (req, res) => {
    try {
        const { category, subCategory} = req.body;
        const image = req.file ? req.file.filename : null;
        // Split subCategory into an array
        const subCategoryArray = subCategory ? subCategory.split(',').map(item => item.trim()) : [];

        const Scategory = await Category.create({category:category, subCategory: subCategoryArray, image: image});

        // req.flash("accepted", "Successfully create new category")
        console.log(Scategory);

    } catch (error) {
        console.log(error);
        res.send(error);
    }
});

router.post('/update-category/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;
        const { category, subCategory } = req.body;
        const image = req.file ? req.file.filename : null;
        // Split subCategory into an array
        const subCategoryArray = subCategory ? subCategory.split(',').map(item => item.trim()) : [];

        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            { category, subCategory: subCategoryArray, image },
            { new: true } // Return the updated document
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        // req.flash("accepted", "Successfully create new category")
        console.log(updatedCategory);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

// Delete a single category
router.delete('/delete-category/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;

        const deletedCategory = await Category.findByIdAndDelete(categoryId);

        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        // req.flash("accepted", "Successfully create new category")
        console.log(deletedCategory);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

// Delete all categories
router.delete('/delete-all-categories', async (req, res) => {
    try {
        const deletedCategories = await Category.deleteMany({});
        // req.flash("accepted", "Successfully create new category")
        console.log(deletedCategories);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});


module.exports = router
