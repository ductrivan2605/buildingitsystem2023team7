// models/Wishlist.js
const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  authorWishlist: String,
  titleWishlist: String,
  dateWishlist: Date,
  imageWishlist: String,
  approved: { type: Boolean, default: false }, // New field for approval status
});

const WishlistItem = mongoose.model('WishlistItem', wishlistSchema);

module.exports = WishlistItem;
