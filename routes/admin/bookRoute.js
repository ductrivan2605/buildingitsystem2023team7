const fs = require("fs");
const path = require("path");
const express = require('express')
const router = express.Router()
const Category = require("../../models/Category.js");
const Authors = require("../../models/author.js");
const upload = require("../../controllers/uploadImage.js");

router.post('/add-new-book', upload.single('image'), async (req, res) => {
    try {
        const { title, authors, categories, published, rating, description, review } = req.body;
        const image = req.file ? req.file.filename : null;

        // Convert authors and categories to arrays
        const authorIds = authors ? authors.split(',').map(item => item.trim()) : [];
        const categoryIds = categories ? categories.split(',').map(item => item.trim()) : [];

        const book = await Books.create({
            title,
            author: authorIds,
            category: categoryIds,
            published,
            rating,
            description,
            review,
            image,
        });

        console.log(book);
    } catch (error) {
        console.log(error);
    }
});


// Update a book
router.post('/update-book/:id', upload.single('image'), async (req, res) => {
    try {
        const bookId = req.params.id;
        const { title, published, rating, description, review } = req.body;
        const image = req.file ? req.file.filename : null;
        // Convert authors and categories to arrays
        const selectedAuthors = req.body.authors ? req.body.authors.split(',').map(item => item.trim()) : [];
        const selectedCategories = req.body.categories ? req.body.categories.split(',').map(item => item.trim()) : [];

        const updatedBook = await Books.findByIdAndUpdate(
            bookId,
            {
                title,
                author: selectedAuthors,
                category: selectedCategories,
                published,
                rating,
                description,
                review,
                image,
            },
            { new: true }
        );

        if (!updatedBook) {
            return res.status(404);
        }

        console.log(updatedBook);
    } catch (error) {
        console.log(error);
    }
});






module.exports = router


