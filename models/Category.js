const mongoose = require("mongoose");
const { default: slugify } = require('slugify');

const CategorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  subCategory: [
    {
      type: String,
    },
  ],
  image: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
});

CategorySchema.pre("validate", function (next) {
  if (this.category) {
    this.slug = slugify(this.category, { lower: true, strict: true });
  }
  next();
});

const Category = mongoose.model("Categories", CategorySchema);

module.exports = Category;
