const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const Books = require('../../models/bookModel.js');
const upload = require('../../middleware/uploadImage.js');

router.get("/", async (req, res) => {
    try {
      const books = await Books.find({});
      console.log(books);
    } catch (error) {
      res.send(error);
    }
});
  

router.post('/add-new-book', upload.single('image'), async (req, res) => {
    try {
        const { title, authors, categories, published, rating, description, review } = req.body;
        const image = req.file ? req.file.filename : null;

        console.log(title);
        // Convert authors and categories to arrays
        const authorIds = authors ? authors.split(',').map(item => item.trim()) : [];
        const categoryIds = categories ? categories.split(',').map(item => item.trim()) : [];

        const book = await Books.create({
        title: title,
        author: authorIds,
        category: categoryIds,
        published: published,
        rating: rating,
        description: description,
        review: review,
        image: image,
        });

        console.log('Added new book:', book);
        res.status(201);
    } catch (error) {
        if (error.message === 'Invalid file type') {
        return res.status(400);
        }
        console.error(error);
        res.status(500);
    }
});
  

// Update a book
router.post('/update-book/:id', upload.single('image'), async (req, res) => {
    try {
        const bookId = req.params.id;
        const { title, published, rating, description, review } = req.body;
        const image = req.file ? req.file.filename : null;
        // Convert authors and categories to arrays
        const selectedAuthors = req.body.authors ? req.body.authors.split(',').map(item => item.trim()) : [];
        const selectedCategories = req.body.categories ? req.body.categories.split(',').map(item => item.trim()) : [];

        const updatedBook = await Books.findByIdAndUpdate(
            bookId,
            {
                title,
                author: selectedAuthors,
                category: selectedCategories,
                published,
                rating,
                description,
                review,
                image,
            },
            { new: true }
        );

        if (!updatedBook) {
            return res.status(404);
        }

        console.log(updatedBook);
    } catch (error) {
        console.log(error);
    }
});

// Delete a book
router.delete('/delete-book/:id', async (req, res) => {
    try {
        const bookId = req.params.id;

        const deletedBook = await Books.findByIdAndDelete(bookId);

        if (!deletedBook) {
            return res.status(404);
        }

        console.log('Deleted Book:', deletedBook);
    } catch (error) {
        console.log(error);
        res.status(500) ;
    }
});

// Delete all books
router.delete('/delete-all-books', async (req, res) => {
    try {
        const deletedBooks = await Books.find({});
        deletedBooks.forEach(book =>{
            if(book.image){
                const imagePath = path.join(__dirname, "../../public/images", book.image);
                fs.unlinkSync(imagePath);
            }
        }); 

        await Books.deleteMany({});

        console.log('Deleted Books:', deletedBooks);
    } catch (error) {
        console.log(error);
        res.status(500);
    }
});




module.exports = router


