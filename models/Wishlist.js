// models/WishlistItem.js
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
    type: String,
  },
  // Change field name to approveWishlist
  approveWishlist: {
    type: Boolean,
    default: false, // Set default value to false
  },
});

const WishlistItem = mongoose.model('WishlistItem', wishlistItemSchema);

module.exports = WishlistItem;
