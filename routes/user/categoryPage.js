const express = require("express");
const router = express.Router();
const Books = require("../../models/bookModel.js");
const Categories= require("../../models/Category.js")

router.get("/:category", async (req, res) => {
    try {
        const page = req.query.page || 1;
        const itemsPerPage = 10; // Set the number of items to display per page
        let searchTerm = req.params.category; // Use req.params.category to get the selected category from the URL
        const regex = new RegExp(searchTerm, 'i');

        // Find the category based on the regex (you can customize this part based on your data model)
        let category = await Categories.find({
            $or: [
                { category: regex },
                { subCategory: regex },
            ]
        });

        // Find the total number of books in the selected category
        const totalBooks = await Books.countDocuments({ category: searchTerm });

        const totalPages = Math.ceil(totalBooks / itemsPerPage);

        // Retrieve books in the selected category, paginated
        const books = await Books.find({ category: searchTerm })
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage);

        res.render('user/categoryPage', {
            layout: './layouts/user/bookDetailPage',
            category: category,
            books: books,
            itemsPerPage: itemsPerPage,
            currentPage: page,
            totalPages: totalPages,
            title: "Booktopia"
        });
    } catch (error) {
        console.log(error);
    }
});



module.exports = router;
