const express = require("express");
const router = express.Router();
const User = require("../../models/user.js");
const Book = require("../../models/bookModel.js");
const path = require("path");
const fs = require("fs");
const { checkAuthenticated } = require("../../middleware/checkAuthenticated");
const fetchUserData = require("../../middleware/fetchUserData.js");

// Display book details and reviews
router.get("/:slug",fetchUserData, async (req, res) => {
    try {
        const userId = req.user.id;
        const books = await Book.findOne({ slug: req.params.slug });
        const user = await User.findById(userId).populate("bookmarks").lean();
        const userBookmarks = isAuthenticated ? req.user.bookmarks.map(bookmark => bookmark.toString()) : []; 

        console.log(books);
        res.render('user/bookDetail', { layout: './layouts/user/bookDetailPage', title: "Booktopia" ,books,user,  });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});
router.get("/:slug/read", checkAuthenticated, async (req, res) => {
  try {
    const book = await Book.findOne({ slug: req.params.slug });
    const userId = await User.findById(req.params._id);
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
      userId: userId,
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
    const { review, rating } = req.body;
    const userName = req.user.name || "Anonymous";
    const slug = req.params.slug;

    const hasReviewed = await userHasReviewed(slug, userName);

    if (hasReviewed) {
      await Book.updateOne(
        { slug, "reviews.userName": userName },
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
        userName,
        review,
        rating: parseInt(rating) || 1,
      };

      await Book.updateOne({ slug }, { $push: { reviews: newReview } });
    }

    res.redirect(`/book/${slug}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});



module.exports = router;