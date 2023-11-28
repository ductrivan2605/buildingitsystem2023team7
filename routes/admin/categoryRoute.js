const fs = require("fs");
const path = require("path");
const express = require('express')
const router = express.Router()
const Category = require("../../models/Category.js");

// Get all categories
router.get('/', async (req,res) => {
    try{

        const category = await Category.find({})

    }catch(error){
        res.send(error);
    }
})


// Add a new category
router.post('/add-new-category', async (req, res) => {
    try {
        const { category, subCategory} = req.body;
        const image = req.files['image'] ? req.files['image'][0].filename : null;
        // Split subCategory into an array
        const subCategoryArray = subCategory ? subCategory.split(',').map(item => item.trim()) : [];

        await Category.create({category:category, subCategory: subCategoryArray, image: image});

        res.flash("accepted", "Successfully create new category")
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});


module.exports = router
