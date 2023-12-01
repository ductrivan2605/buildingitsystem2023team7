const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  authorWishlist: String,
  titleWishlist: String,
  dateWishlist: Date,
  imageWishlist: String,
});

const WishlistItem = mongoose.model('WishlistItem', wishlistSchema);

module.exports = WishlistItem;