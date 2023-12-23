const express = require("express");
const router = express.Router();
const Book = require("../../models/bookModel.js");
const { checkAuthenticated } = require("../../middleware/checkAuthenticated");

// Display book details and reviews
router.get("/:slug", async (req, res) => {
    try {
        const books = await Book.findOne({ slug: req.params.slug });
        console.log(books);
        res.render('user/bookDetail', { layout: './layouts/user/bookDetailPage', title: "Booktopia" ,books  });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


// Submit a new review
router.post("/:slug/review",checkAuthenticated,  async (req, res) => {
    try {
        const { review, rating } = req.body;

        // Create the review
        const newReview = {
            userName: req.user.name || "Anonymous",
            review,
            rating: parseInt(rating) || 1, // Convert the rating to a number
        };

        // Update the book's reviews array
        await Book.updateOne({ slug: req.params.slug }, { $push: { reviews: newReview } });

        res.redirect(`/book/${req.params.slug}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
