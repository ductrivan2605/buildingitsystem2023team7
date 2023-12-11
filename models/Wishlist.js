// models/WishlistItem.js
const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema({
  authorWishlist: {
    type: String,
    required: true,
  },
  titleWishlist: {
    type: String,
    required: true,
  },
  dateWishlist: {
    type: Date,
    required: true,
  },
  imageWishlist: {
    type: String, // Assuming the image is stored as a URL
  },
});

const WishlistItem = mongoose.model('WishlistItem', wishlistItemSchema);

module.exports = WishlistItem;
