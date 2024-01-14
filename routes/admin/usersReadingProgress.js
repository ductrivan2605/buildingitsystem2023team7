const express = require('express');
const router = express.Router();
const User = require("../../models/user.js");
const Book = require("../../models/bookModel.js");
// const pdfParse = require('pdf-parse');
const { checkAdmin } = require("../../middleware/checkAuthenticated.js");
const fetchUserData = require('../../middleware/fetchUserData.js');

router.post('/:userId/:slug/update-progress', async (req, res) => {
  try {
    const { action, currentPage } = req.body;
    const userId = req.params.userId;
    const slug = req.params.slug;

    // Fetch the user
    const user = await User.findById(userId);

    if (user) {
      // Fetch the book by slug
      const book = await Books.findOne({ slug });

      if (!book) {
        return res.status(404).send('Book not found');
      }

      // Find the book progress for the current slug
      const bookProgress = user.readingProgress.find((progress) => progress.bookId.slug === slug);

      let totalPages;

      if (book) {
        // Fetch total pages from the contentImage array
        totalPages = await getTotalPagesFromPDF(book.contentImage[0]);
      }

      if (bookProgress) {
        // Update existing progress
        bookProgress.currentPage = currentPage;
        bookProgress.totalPages = totalPages;
        bookProgress.progress = ((currentPage - 1) / (totalPages - 1)) * 100;
      } else {
        // Create new progress if not exists
        user.readingProgress.push({
          bookId: { slug },
          currentPage,
          totalPages,
          progress: ((currentPage - 1) / (totalPages - 1)) * 100,
        });
      }

      // Save the user with updated progress
      await user.save();

      res.sendStatus(200); // Send a success response
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error updating reading progress:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Function to get total pages from a PDF file
async function getTotalPagesFromPDF(pdfContent) {
  try {
    const data = await pdfParse(pdfContent);
    return data.numpages || 1; // Default to 1 if unable to determine total pages
  } catch (error) {
    console.error('Error parsing PDF:', error);
    return 1; // Default to 1 if an error occurs
  }
}

router.get("/:userId", fetchUserData, checkAdmin, async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      // If the user is not found, redirect or handle as appropriate
      return res.status(404).render('error', { message: 'User not found', error: {} });
    }

    res.render('admin/userReadingProgress', {
      layout: './layouts/admin/itemsManagementLayout',
      title: `User Reading Progress - ${user.username}`,
      user: user,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).render('error', { message: 'Internal Server Error', error: error });
  }
});

module.exports = router;
