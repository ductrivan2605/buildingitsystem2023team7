const express = require('express');
const router = express.Router();
const path = require("path");
// const fs = require('fs');
const Book = require("../../models/bookModel");
const User = require("../../models/user");
const fetchUserData = require('../../middleware/fetchUserData');

// router.get('/:slug/progress',fetchUserData, async (req, res) => {
//   const { slug } = req.params; // Extract the book slug from the request parameters
//   const userId = req.user._id; // Assuming userId is available from authentication

//   try {
//     // Fetch user's reading progress for the specific book
//     const user = await User.findById(userId).populate('readingProgress.bookId');
//     const bookProgress = user.readingProgress.find(progress => progress.bookId.slug === slug);

//     if (bookProgress) {
//       res.json({ currentPage: bookProgress.currentPage });
//     } else {
//       res.json({ currentPage: 1 }); // Default to page 1 if no progress is found
//     }
//   } catch (error) {
//     console.error('Error fetching reading progress:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
router.post('/:userId/:slug/update-progress', async (req, res) => {
  try {
    const { currentPage, totalNumberOfPages, slug } = req.body;
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (user) {
      const isInReadingProgress = user.readingProgress.some(progress => progress.bookId.slug === slug);

      if (isInReadingProgress) {
        const bookProgressIndex = user.readingProgress.findIndex(progress => progress.bookId.slug === slug);

        if (currentPage > user.readingProgress[bookProgressIndex].currentPage) {
          user.readingProgress[bookProgressIndex].currentPage = currentPage;
          user.readingProgress[bookProgressIndex].progress = ((currentPage - 1) / (totalNumberOfPages - 1)) * 100;
          user.readingProgress[bookProgressIndex].lastAccessed = new Date(); // Add lastAccessed
        }
      } else {
        const newProgress = {
          bookId: { slug: slug },
          currentPage,
          totalPages: totalNumberOfPages,
          progress: ((currentPage - 1) / (totalNumberOfPages - 1)) * 100,
          lastAccessed: new Date(), // Add lastAccessed
        };
        user.readingProgress.push(newProgress);
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