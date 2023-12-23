const mongoose = require("mongoose");
const { default: slugify } = require("slugify");

const ReviewSchema = new mongoose.Schema({
  review: {
    type: String,
  },
  userName: {
    type: String,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  authors: [
    {
      type: String,
      required: true,
    },
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
    required: true,
  },
  rating: {
    type: Number,
  },
  description: {
    type: String,
  },
  reviews: [ReviewSchema],
  contentImage: [
    {
      type: String,
    },
  ],
  imageCover: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  bookmarked:{
    type: Boolean,
    default: false,
  },
  authorsSlug: [
    {
      type: String,
      required: true,
    },
  ],
});

// Calculating the average stars
BookSchema.virtual("averageRating").get(function () {
  if (this.reviews.length === 0) {
    return 0; // Default to 0 if there are no reviews
  }

  const totalRating = this.reviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );
  return totalRating / this.reviews.length;
});

BookSchema.set("toObject", { virtuals: true });
BookSchema.set("toJSON", { virtuals: true });

BookSchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  // Create slugs for authors
  if (this.authors && Array.isArray(this.authors)) {
    this.authorsSlug = this.authors.map((author) =>
      slugify(author, { lower: true, strict: true })
    );
  }

  next();
});

const Books = mongoose.model("Book details", BookSchema);

module.exports = Books;
