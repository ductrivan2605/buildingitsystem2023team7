const express = require("express");
const router = express.Router();
const Book = require("../../models/bookModel.js");
const path = require("path");
const fs = require("fs");
const { checkAuthenticated } = require("../../middleware/checkAuthenticated");
const fetchUserData = require("../../middleware/fetchUserData.js");

// Display book details and reviews
router.get("/:slug",fetchUserData, async (req, res) => {
    try {
        const books = await Book.findOne({ slug: req.params.slug });
        console.log(books);
        res.render('user/bookDetail', { layout: './layouts/user/bookDetailPage', title: "Booktopia" ,books  });
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

    await Book.updateOne({ slug: req.params.slug }, { $inc: { readCount: 1 } });

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


const userHasReviewed = async (slug, userName) => {
  try {
      const book = await Book.findOne({ slug });
      if (!book) {
          return false; 
      }

      return book.reviews.some(review => review.userName === userName);
  } catch (error) {
      console.error(error);
      return false;
  }
};
// Submit a new review or update existing review
router.post("/:slug/review", checkAuthenticated, async (req, res) => {
  try {
      const { reviewId, review, rating } = req.body;

      // Check if the user has already reviewed the book
      const hasReviewed = await userHasReviewed(req.params.slug, req.user.name);

      if (hasReviewed) {
          // User has already reviewed, update the existing review
          await Book.updateOne(
              { slug: req.params.slug, "reviews._id": reviewId },
              {
                  $set: {
                      "reviews.$.review": review,
                      "reviews.$.rating": parseInt(rating) || 1,
                  },
              }
          );
      } else {
          // User has not reviewed, add a new review
          const newReview = {
              userName: req.user.name || "Anonymous",
              review,
              rating: parseInt(rating) || 1,
          };

          await Book.updateOne({ slug: req.params.slug }, { $push: { reviews: newReview } });
      }

      res.redirect(`/book/${req.params.slug}`);
  } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
  }
});


module.exports = router;
