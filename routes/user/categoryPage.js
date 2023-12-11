const express = require("express");
const router = express.Router();
const Books = require("../../models/bookModel.js");
const Categories= require("../../models/Category.js")

router.get("/:category", async (req, res) => {
    try {
        const page = req.query.page || 1;
        const itemsPerPage = 10; // Set the number of items to display per page

        const category = await Categories.find({ category: req.params.category });
        const totalBooks = await Books.countDocuments({});
        const totalPages = Math.ceil(totalBooks / itemsPerPage);

        const books = await Books.find({})
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
