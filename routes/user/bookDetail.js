const express = require("express");
const router = express.Router();
const Book = require("../../models/bookModel.js");
const path = require("path");
const fs = require("fs");
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

router.get("/:slug/read", checkAuthenticated, async (req, res) => {
    try {
      const book = await Book.findOne({ slug: req.params.slug });
      if (!book || !book.contentImage || book.contentImage.length === 0) {
        return res.status(404).send('PDF not found');
      }
  
      const pdfFileName = book.contentImage[0]; // Assuming the first file is the PDF
      const filePath = path.join(__dirname, '../../public/pdf', pdfFileName);
  
      if (!fs.existsSync(filePath)) {
        return res.status(404).send('PDF file not found');
      }
  
      const data = fs.readFileSync(filePath);
      const pdfBuffer = Buffer.from(data, 'base64'); // Convert the file to a buffer
  
      // Send the buffer as a base64 string to render in the client-side PDF viewer
      const base64Data = pdfBuffer.toString('base64');
      const pdfDataUri = `data:application/pdf;base64,${base64Data}`;
  
      // Render the bookReading.ejs for the user to read
      res.render('user/bookReading', {
        layout: './layouts/user/bookReadingPageLayout',
        title: 'Booktopia',
        pdfDataUri: pdfDataUri, // Pass the base64 data to the view
        book: book // Pass other book details if needed
      });
    } catch (error) {
      console.error(error);
      res.status(404).send('Internal Server Error');
    }
  });
  
module.exports = router;
