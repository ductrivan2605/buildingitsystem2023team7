const express = require('express');
const router = express.Router();
const path = require("path");
// const fs = require('fs');
const Book = require("../../models/bookModel");
const User = require("../../models/user");
const fetchUserData = require('../../middleware/fetchUserData');

// API endpoint to get the last accessed page for a book
router.get('/:slug/progress',fetchUserData, async (req, res) => {
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
    const { currentPage, totalPages } = req.body;
    const { userId, slug } = req.params;

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, 'readingProgress.bookId.slug': slug },
      {
        $set: {
          'readingProgress.$.currentPage': currentPage,
          'readingProgress.$.progress': ((currentPage - 1) / (totalPages - 1)) * 100,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send('User not found');
      }
      // Create a new progress record
      user.readingProgress.push({
        bookId: { slug },
        currentPage,
        totalPages,
        progress: ((currentPage - 1) / (totalPages - 1)) * 100,
      });
      await user.save();
    }

    res.sendStatus(200); // Send a success response
  } catch (error) {
    console.error('Error saving progress:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;