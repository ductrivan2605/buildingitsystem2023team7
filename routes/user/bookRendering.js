const express = require('express');
const router = express.Router();
const path = require("path");
// const fs = require('fs');
const Book = require("../../models/bookModel");
const User = require("../../models/user");

// API endpoint to get the last accessed page for a book
router.get('/:slug/progress', async (req, res) => {
  const { slug } = req.params; // Extract the book slug from the request parameters
  const userId = req.user._id; // Assuming userId is available from authentication

  try {
    // Fetch user's reading progress for the specific book
    const user = await User.findById(userId).populate('readingProgress.bookId');
    const bookProgress = user.readingProgress.find(progress => progress.bookId.slug === slug);

    if (bookProgress) {
      res.json({ currentPage: bookProgress.currentPage });
    } else {
      res.json({ currentPage: 1 }); // Default to page 1 if no progress is found
    }
  } catch (error) {
    console.error('Error fetching reading progress:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.post('/:userId/:slug/update-progress', async (req, res) => {
  try {
    const { currentPage, totalNumberOfPages, slug } = req.body;
    const userId = req.params.userId;
    
    const user = await User.findById(userId);
    if (user) {
      let bookProgress = user.readingProgress.find(progress => progress.bookId.slug === slug);
      if (bookProgress) {
        // Update the progress only if the current page is higher
        if (currentPage > bookProgress.currentPage) {
          bookProgress.currentPage = currentPage;
          bookProgress.progress = ((currentPage - 1) / (totalNumberOfPages - 1)) * 100;
        }
      } else {
        // Create a new progress record
        user.readingProgress.push({
          bookId: { slug },
          currentPage,
          totalPages: totalNumberOfPages,
          progress: ((currentPage - 1) / (totalNumberOfPages - 1)) * 100,
        });
      }
      // Save the updated user with progress
      await user.save();
      res.sendStatus(200); // Send a success response
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error saving progress:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;