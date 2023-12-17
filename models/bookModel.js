const mongoose = require('mongoose');
const { default: slugify } = require('slugify');

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    authors: [
        {
            type: String,
            required: true
        }
    ],
    category: [
        {
            type: String,
            required: true,
        },
    ],
    published: {
        type: String,
    },
    publisher: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
    },
    description: {
        type: String,
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reviews"
    }],
    contentImage: [{
        type: String,
    }],
    imageCover: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    authorsSlug: [{
        type: String,
        required: true,
    }],
});

BookSchema.pre('validate', function (next) {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }

    // Create slugs for authors
    if (this.authors && Array.isArray(this.authors)) {
        this.authorsSlug = this.authors.map(author => slugify(author, { lower: true, strict: true }));
    }

    next();
});

const Books = mongoose.model('Book details', BookSchema);

module.exports = Books;
