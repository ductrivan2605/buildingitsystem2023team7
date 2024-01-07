const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const bookProgressSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book details',
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  totalPages: {
    type: Number,
    default: 0,
  },
  progress: {
    type: Number,
    default: 0,
  },
});

const userSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  name: {
    type: String, 
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email:{
    type: String,
  },
  role: {
    type: String,
    enum: ['standard', 'admin'],
    default: 'standard'
  },
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book details",
  }],
  readingProgress: [bookProgressSchema],
  readingHistory:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book details",
    }
  ]
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);
module.exports = User;
