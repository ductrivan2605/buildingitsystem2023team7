const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

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
  readingProgress: {
    type: Map,
    of: Number,
    default: {}, // Default to an empty object for storing progress
  },
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);
module.exports = User;
