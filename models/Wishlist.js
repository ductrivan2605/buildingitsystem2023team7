const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  authorWishlist: { 
    type: String
  },
  titleWishlist: {
    type: String
  },
  dateWishlist: {
    type: Date
  },
  imageWishlist: {
    type: String
  },
});

const WishlistItem = mongoose.model('WishlistItem', wishlistSchema);

module.exports = WishlistItem;
