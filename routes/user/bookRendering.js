const express = require('express');
const router = express.Router();
const path = require("path");
const fs = require('fs');
const Books = require("../../models/bookModel");
const User = require("../../models/user");

router.get('/get-book/:slug', async (req, res) => {
    try {
      const slug = req.params.slug;
      const book = await Books.findOne({ slug: slug });
  
      if (!book || !book.contentImage || book.contentImage.length === 0) {
        return res.status(404).send('PDF not found');
      }
  
      const pdfFileName = book.contentImage[0]; // Assuming the first file is the PDF
      const filePath = path.join(__dirname, '../../public/pdf', pdfFileName);
  
      if (!fs.existsSync(filePath)) {
        return res.status(404).send('PDF file not found');
      }
  
      const data = fs.readFileSync(filePath);
      res.contentType('application/pdf');
      res.send(data);
    } catch (error) {
      console.error('Error fetching book:', error);
      res.status(404).send('Internal Server Error');
    }
  });
  router.post('/:slug/update-progress', async (req, res) => {
    try {
      const { slug, currentPage } = req.body; // currentPage indicates the current page number

      const user = await User.findById(req.user._id); 
  
      // Find the book by slug and update the progress for the current user
      user.readingProgress.set(slug, currentPage); // Assuming readingProgress is a Map or an object in the User model
  
      await user.save();
  
      res.status(200).json({ message: 'Reading progress updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update reading progress' });
    }
  });

module.exports = router;