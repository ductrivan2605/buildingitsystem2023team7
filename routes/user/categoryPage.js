const express = require("express");
const router = express.Router();
const Books = require("../../models/bookModel.js");
const Categories = require("../../models/Category.js");


router.get('/all', async (req,res) => {
    const categories = await Categories.find({});
    res.render('user/allcategorypage', {
        layout: './layouts/user/categoryPage',
        categories: categories,
        title: "Booktopia",

    });
})
// For the main category page
router.get("/:slug", async (req, res) => {
    try {
        const page = req.query.page || 1;
        const itemsPerPage = 10;
        const searchTermSlug = req.params.slug;

        const category = await Categories.findOne({
            slug: searchTermSlug,
        });

        if (!category) {
            // Handle case where category with given slug is not found
            return res.status(404).send("Category not found");
        }

        const totalBooks = await Books.countDocuments({
            $or: [
                { category: searchTermSlug.category },
                { category: { $in: category.subCategory } },
            ]
        });

        const totalPages = Math.ceil(totalBooks / itemsPerPage);

        let books;

        // Check if subcategories are selected
        if (req.query.subcategories) {
            const selectedSubcategories = req.query.subcategories.split(',');
            books = await Books.find({
                category: { $in: selectedSubcategories },
            })
                .skip((page - 1) * itemsPerPage)
                .limit(itemsPerPage);
        } else {
            books = await Books.find({
                $or: [
                    { category: searchTermSlug.category },
                    { category: { $in: category.subCategory } },
                ]
            })
                .skip((page - 1) * itemsPerPage)
                .limit(itemsPerPage);
        }

        res.render('user/categoryPage', {
            layout: './layouts/user/bookDetailPage',
            category: category,
            books: books,
            itemsPerPage: itemsPerPage,
            currentPage: page,
            totalPages: totalPages,
            title: "Booktopia",
            selectedSubcategories: req.query.subcategories ? req.query.subcategories.split(',') : [],
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});

// For subcategory page
router.get("/:category/:subCategory", async (req, res) => {
    try {
        const page = req.query.page || 1;
        const itemsPerPage = 10;
        const categorySlug = req.params.category;
        const subCategorySlug = req.params.subCategory;

        const category = await Categories.findOne({
            slug: categorySlug,
        });

        if (!category) {
            // Handle case where category with given slug is not found
            return res.status(404).send("Category not found");
        }

        const totalBooks = await Books.countDocuments({
            category: subCategorySlug,
        });

        const totalPages = Math.ceil(totalBooks / itemsPerPage);

        const books = await Books.find({
            category: subCategorySlug,
        })
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage);

        res.render('user/subCategoryPage', {
            layout: './layouts/user/bookDetailPage',
            category: { subCategory: subCategorySlug },
            books: books,
            itemsPerPage: itemsPerPage,
            currentPage: page,
            totalPages: totalPages,
            title: "Booktopia"
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;